const mongoose = require("mongoose")
const env = require("./env")



async function connectToDB() {

    try {
        await mongoose.connect(env.mongoUri)

        console.log("Connected to Database")
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = connectToDB