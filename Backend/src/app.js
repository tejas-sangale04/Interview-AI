const express = require("express")
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const testRoutes = require("./routes/test.routes");
const jobRoutes = require("./routes/job.routes");
const interviewRouter = require("./routes/interview.routes")

const app = express()

// Middleware
app.use(cors({
    //origin: ["https://interview-ai-five-gamma.vercel.app"],
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/jobs", jobRoutes)

app.use((req, res, next) => {
   // console.log("Request body:", req.body);
    next();
});

module.exports = app