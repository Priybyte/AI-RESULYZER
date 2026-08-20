const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const env = require("../config/env")



async function authUser(req, res, next) {

    const authorization = req.headers.authorization
    const bearerToken = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null
    const token = bearerToken || req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret)

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


module.exports = { authUser }
