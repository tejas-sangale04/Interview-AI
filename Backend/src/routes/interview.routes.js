const express = require("express")
const authMiddleware = require("../Middleware/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../Middleware/file.middleware")
const { checkGlobalApiLimit } = require("../Middleware/rateLimit.middleware")

const interviewRouter = express.Router()

// Apply global API rate limiting middleware before AI operations
// upload.single("resume") will not throw error if no file is provided
interviewRouter.post("/", 
    authMiddleware.authUser, 
    checkGlobalApiLimit,
    upload.single("resume"), // Makes resume optional - multer won't error if file is missing
    interviewController.generateInterViewReportController
)

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

// Apply global API rate limiting middleware for resume PDF generation
interviewRouter.post("/resume/pdf/:interviewReportId", 
    authMiddleware.authUser,
    checkGlobalApiLimit,
    interviewController.generateResumePdfController
)

// Get global API usage statistics (no auth required - can be public)
interviewRouter.get("/api-usage", interviewController.getApiUsageController)

module.exports = interviewRouter