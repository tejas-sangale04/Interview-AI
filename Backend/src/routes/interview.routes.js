const express = require("express")
const authMiddleware = require("../Middleware/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../Middleware/file.middleware")

const interviewRouter = express.Router()
interviewRouter.post("/", authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

module.exports = interviewRouter