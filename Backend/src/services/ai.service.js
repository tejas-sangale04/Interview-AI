const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Add this helper function above generateInterviewReport

function tryParseJSON(str) {
    if (typeof str !== "string") return null
    const trimmed = str.trim()
    if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) return null
    try {
        return JSON.parse(trimmed)
    } catch {
        return null
    }
}

function unwrapItem(item) {
    if (typeof item !== "object" || item === null) return item

    let result = { ...item }

    for (const key of Object.keys(result)) {
        const value = result[key]

        if (typeof value === "string") {
            const parsed = tryParseJSON(value)
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                result = { ...result, ...parsed }
            }
        } else if (Array.isArray(value) && value.length === 1 && typeof value[0] === "string") {
            const parsed = tryParseJSON(value[0])
            if (parsed && typeof parsed === "object") {
                result = { ...result, ...parsed }
            }
        }
    }

    return result
}

function reconstructArrays(result) {

    function parseQuestionsArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return []

        // Case 1: Already correct format
        if (arr.every(item => typeof item === "object" && item !== null)) {
            return arr
        }

        // Case 2: Flat key-value pairs ["question", "...", "intention", "...", "answer", "..."]
        if (arr[0] === "question" || arr[0] === "actual question text") {
            const items = []
            for (let i = 0; i < arr.length; i += 6) {
                if (arr[i + 1] && arr[i + 3] && arr[i + 5]) {
                    items.push({
                        question: arr[i + 1],
                        intention: arr[i + 3],
                        answer: arr[i + 5]
                    })
                }
            }
            return items
        }

        // Case 3: Plain array of strings - wrap each string as the question
        return arr
            .filter(item => typeof item === "string" && item.trim() !== "")
            .map(str => ({
                question: str,
                intention: "To assess the candidate's depth of knowledge and practical experience on this topic.",
                answer: "Provide a clear, structured explanation with relevant examples from your own experience."
            }))
    }

    function parseSkillGapsArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return []

        if (arr.every(item => typeof item === "object" && item !== null)) {
            return arr
        }

        if (arr[0] === "skill" || arr[0] === "skill name") {
            const items = []
            for (let i = 0; i < arr.length; i += 4) {
                if (arr[i + 1] && arr[i + 3]) {
                    items.push({ skill: arr[i + 1], severity: arr[i + 3] })
                }
            }
            return items
        }

        return arr
            .filter(item => typeof item === "string" && item.trim() !== "")
            .map(str => ({ skill: str, severity: "medium" }))
    }

    function parsePreparationPlanArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return []

        if (arr.every(item => typeof item === "object" && item !== null)) {
            return arr
        }

        if (arr[0] === "day") {
            const items = []
            let i = 0
            while (i < arr.length) {
                if (arr[i] === "day" && typeof arr[i + 1] === "number") {
                    const day = arr[i + 1]
                    i += 2
                    let focus = ""
                    if (arr[i] === "focus" && typeof arr[i + 1] === "string") {
                        focus = arr[i + 1]
                        i += 2
                    }
                    const tasks = []
                    if (arr[i] === "tasks") {
                        i += 1
                        while (i < arr.length && !(arr[i] === "day" && typeof arr[i + 1] === "number")) {
                            if (typeof arr[i] === "string") tasks.push(arr[i])
                            i++
                        }
                    }
                    items.push({ day, focus, tasks })
                } else {
                    i++
                }
            }
            return items
        }

        return arr
            .filter(item => typeof item === "string" && item.trim() !== "")
            .map((str, index) => {
                const match = str.match(/^Day\s*(\d+)\s*:\s*(.*)$/i)
                if (match) {
                    return {
                        day: parseInt(match[1], 10),
                        focus: match[2].split(".")[0].replace(/^Focus on\s*/i, "").trim(),
                        tasks: [match[2].trim()]
                    }
                }
                return {
                    day: index + 1,
                    focus: str.split(".")[0].trim(),
                    tasks: [str]
                }
            })
    }
const rawTech = result.technicalQuestions || result.technical_questions || []
    const rawBeh = result.behavioralQuestions || result.behavioral_questions || []
    const rawSkills = result.skillGaps || result.skill_gaps || result.weaknesses_skill_gaps || []
    const rawPlan = result.preparationPlan || result.preparation_plan || []

    // 2. Parse them
    const technicalQuestions = parseQuestionsArray(rawTech)
        .map(unwrapItem)
        .map(item => ({
            question: item.question || "",
            intention: item.intention || "",
            answer: item.answer || ""
        }))
        .filter(item => item.question && item.intention && item.answer)

    const behavioralQuestions = parseQuestionsArray(rawBeh)
        .map(unwrapItem)
        .map(item => ({
            question: item.question || "",
            intention: item.intention || "",
            answer: item.answer || ""
        }))
        .filter(item => item.question && item.intention && item.answer)

    const skillGaps = parseSkillGapsArray(rawSkills)
        .map(unwrapItem)
        .map(item => ({
            skill: item.skill || "",
            severity: [ "low", "medium", "high" ].includes(item.severity) ? item.severity : "medium"
        }))
        .filter(item => item.skill)

    const preparationPlan = parsePreparationPlanArray(rawPlan)
        .map(unwrapItem)
        .map(item => ({
            day: typeof item.day === "number" ? item.day : parseInt(item.day) || 1,
            focus: item.focus || "",
            tasks: Array.isArray(item.tasks) ? item.tasks.filter(t => typeof t === "string") : []
        }))
        .filter(item => item.focus && item.tasks.length > 0)

    // 3. Return the sanitized object with fallback values
    return {
        title: result.title || result.job_title || "Job Interview Report",
        matchScore: result.matchScore || result.match_score || 80, // Default to 80 if missing
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan
    }
}
   

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

        Important Content Guidelines:
        1. Generate REAL, highly specific technical and behavioral questions based on the intersection of the job description and the candidate's resume.
        2. Do NOT use generic placeholder text. Every field must contain unique, generated insights.
        3. Identify actual, realistic skill gaps based on what the job requires versus what the resume shows.
        4. Create an actionable day-by-day preparation plan.
`

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    console.log("AI RAW RESPONSE:", response.text)

    //return JSON.parse(response.text)
     const parsed = JSON.parse(response.text)
    const result = Array.isArray(parsed) ? parsed[0] : parsed

    // ✅ Reconstruct proper objects from flat arrays
    const sanitized = reconstructArrays(result)

    console.log("SANITIZED:", JSON.stringify(sanitized, null, 2))

    return sanitized
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1 page long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }