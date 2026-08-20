const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const env = require("./config/env")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any vercel preview/production domain or localhost
        if (origin.includes("vercel.app") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
            return callback(null, true);
        }
        
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app
