const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const env = require("./config/env")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        "https://ai-resulyzer.vercel.app", 
        "http://localhost:5173", 
        "http://localhost:3000",
        env.frontendUrl
    ].filter(Boolean),
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app
