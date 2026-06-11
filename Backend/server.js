require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/database")
//const invokeGeminiAI = require("./src/services/ai.service")


    connectDB()
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
