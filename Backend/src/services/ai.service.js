const OpenAI = require("openai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
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
    // 1. Define helper parsing functions inside
    function parseQuestionsArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return [];
        if (arr.every(item => typeof item === "object" && item !== null)) return arr;
        return arr
            .filter(item => typeof item === "string" && item.trim() !== "")
            .map(str => ({
                question: str,
                intention: "To assess depth of knowledge.",
                answer: "Provide a structured explanation."
            }));
    }

    function parseSkillGapsArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return [];
        if (arr.every(item => typeof item === "object" && item !== null)) return arr;
        return arr
            .filter(item => typeof item === "string" && item.trim() !== "")
            .map(str => ({ skill: str, severity: "medium" }));
    }

    function parsePreparationPlanArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return [];
        if (arr.every(item => typeof item === "object" && item !== null)) return arr;
        return arr
            .filter(item => typeof item === "string" && item.trim() !== "")
            .map((str, index) => ({
                day: index + 1,
                focus: str.split(".")[0].trim(),
                tasks: [str]
            }));
    }

    // 2. Safely extract data using fallback keys
    const rawTech = result.technicalQuestions || result.technical_questions || [];
    const rawBeh = result.behavioralQuestions || result.behavioral_questions || [];
    const rawSkills = result.skillGaps || result.skill_gaps || result.weaknesses_skill_gaps || [];
    const rawPlan = result.preparationPlan || result.preparation_plan || [];

    // 3. Reconstruct and sanitize
    return {
        title: result.title || result.job_title || "Job Interview Report",
        matchScore: typeof result.matchScore === 'number' ? result.matchScore : (result.match_score || 0),
        technicalQuestions: parseQuestionsArray(rawTech).map(unwrapItem),
        behavioralQuestions: parseQuestionsArray(rawBeh).map(unwrapItem),
        skillGaps: parseSkillGapsArray(rawSkills).map(unwrapItem),
        preparationPlan: parsePreparationPlanArray(rawPlan).map(unwrapItem)
    };
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

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an expert career counselor and interview preparation specialist. Generate detailed, specific interview reports based on candidate information and job descriptions. Always return valid JSON matching the provided schema."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "interview_report",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title of the job for which the interview report is generated"
                        },
                        matchScore: {
                            type: "number",
                            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
                        },
                        technicalQuestions: {
                            type: "array",
                            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
                            items: {
                                type: "object",
                                properties: {
                                    question: {
                                        type: "string",
                                        description: "The technical question can be asked in the interview"
                                    },
                                    intention: {
                                        type: "string",
                                        description: "The intention of interviewer behind asking this question"
                                    },
                                    answer: {
                                        type: "string",
                                        description: "How to answer this question, what points to cover, what approach to take etc."
                                    }
                                },
                                required: ["question", "intention", "answer"],
                                additionalProperties: false
                            }
                        },
                        behavioralQuestions: {
                            type: "array",
                            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
                            items: {
                                type: "object",
                                properties: {
                                    question: {
                                        type: "string",
                                        description: "The behavioral question can be asked in the interview"
                                    },
                                    intention: {
                                        type: "string",
                                        description: "The intention of interviewer behind asking this question"
                                    },
                                    answer: {
                                        type: "string",
                                        description: "How to answer this question, what points to cover, what approach to take etc."
                                    }
                                },
                                required: ["question", "intention", "answer"],
                                additionalProperties: false
                            }
                        },
                        skillGaps: {
                            type: "array",
                            description: "List of skill gaps in the candidate's profile along with their severity",
                            items: {
                                type: "object",
                                properties: {
                                    skill: {
                                        type: "string",
                                        description: "The skill which the candidate is lacking"
                                    },
                                    severity: {
                                        type: "string",
                                        enum: ["low", "medium", "high"],
                                        description: "The severity of this skill gap"
                                    }
                                },
                                required: ["skill", "severity"],
                                additionalProperties: false
                            }
                        },
                        preparationPlan: {
                            type: "array",
                            description: "A day-wise preparation plan for the candidate to follow",
                            items: {
                                type: "object",
                                properties: {
                                    day: {
                                        type: "number",
                                        description: "The day number in the preparation plan, starting from 1"
                                    },
                                    focus: {
                                        type: "string",
                                        description: "The main focus of this day in the preparation plan"
                                    },
                                    tasks: {
                                        type: "array",
                                        description: "List of tasks to be done on this day",
                                        items: {
                                            type: "string"
                                        }
                                    }
                                },
                                required: ["day", "focus", "tasks"],
                                additionalProperties: false
                            }
                        }
                    },
                    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
                    additionalProperties: false
                }
            }
        },
        temperature: 0.7
    })

    const responseText = response.choices[0].message.content
    console.log("AI RAW RESPONSE:", responseText)

    const parsed = JSON.parse(responseText)
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

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an expert resume writer. Generate professional, ATS-friendly HTML resumes tailored to specific job descriptions. Always return valid JSON with properly formatted HTML."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "resume_html",
                strict: true,
                schema: {
                    type: "object",
                    properties: {
                        html: {
                            type: "string",
                            description: "The HTML content of the resume"
                        }
                    },
                    required: ["html"],
                    additionalProperties: false
                }
            }
        },
        temperature: 0.7
    })

    const jsonContent = JSON.parse(response.choices[0].message.content)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }