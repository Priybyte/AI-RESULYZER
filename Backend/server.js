require("./src/config/env")
const env = require("./src/config/env")
const app = require("./src/app")
const connectToDB = require("./src/config/database")

if (!env.jwtSecret) {
    console.error("Missing JWT secret. Set JWT_SECRET (or JWT_KEY / JWT_SECRET_KEY) in Backend/.env")
}

connectToDB()


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})