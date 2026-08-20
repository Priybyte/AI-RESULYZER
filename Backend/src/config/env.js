const path = require("path")

require("dotenv").config({
    path: path.join(__dirname, "../../.env")
})

function readEnv(...keys) {
    for (const key of keys) {
        const value = process.env[key]
        if (typeof value === "string" && value.trim() !== "") {
            return value.trim()
        }
    }
    return undefined
}

const env = {
    mongoUri: readEnv("MONGO_URI", "MONGODB_URI", "MONGO_URL"),
    jwtSecret: readEnv("JWT_SECRET", "JWT_KEY", "JWT_SECRET_KEY"),
    googleGenaiApiKey: readEnv("GOOGLE_GENAI_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY"),
    // Prefer the server-specific name, but support the Vite-prefixed value
    // already used by this project so both sides can share one client ID.
    googleClientId: readEnv("GOOGLE_CLIENT_ID", "VITE_GOOGLE_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_ID"),
    frontendUrl: readEnv("FRONTEND_URL", "CLIENT_URL"),
}

module.exports = env
