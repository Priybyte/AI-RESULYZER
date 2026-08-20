const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const env = require("./config/env")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    env.frontendUrl,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean)

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
        return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app
