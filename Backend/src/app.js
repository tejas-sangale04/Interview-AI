const express = require("express")
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use((req, res, next) => {
   // console.log("Request body:", req.body);
    next();
});
module.exports = app