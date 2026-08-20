const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const env = require("../config/env")

function signAuthToken(user) {
    if (!env.jwtSecret) {
        throw new Error("JWT secret is not configured. Set JWT_SECRET in Backend/.env")
    }

    return jwt.sign(
        { id: user._id, username: user.username },
        env.jwtSecret,
        { expiresIn: "1d" }
    )
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { username }, { email } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = signAuthToken(user)

        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: err.message || "Registration failed"
        })
    }

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = user.password && await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = signAuthToken(user)

        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
        return res.status(200).json({
            message: "User logged in successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Login failed. Please try again." })
    }
}

async function googleLoginController(req, res) {
    try {
        const { accessToken } = req.body

        if (!accessToken) return res.status(400).json({ message: "Google access token is required" })
        if (!env.googleClientId) return res.status(500).json({ message: "Google sign-in is not configured on the server" })

        const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`)
        if (!tokenInfoResponse.ok) return res.status(401).json({ message: "Google sign-in token is invalid or expired" })

        const tokenInfo = await tokenInfoResponse.json()
        if (tokenInfo.aud !== env.googleClientId) {
            return res.status(401).json({ message: "Google sign-in token is for a different application" })
        }

        const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (!profileResponse.ok) return res.status(401).json({ message: "Unable to retrieve your Google profile" })

        const profile = await profileResponse.json()
        if (!profile.sub || !profile.email || !profile.email_verified) {
            return res.status(400).json({ message: "A verified Google email address is required" })
        }

        let user = await userModel.findOne({ $or: [{ googleId: profile.sub }, { email: profile.email }] })
        if (!user) {
            const baseUsername = (profile.name || profile.email.split("@")[0]).replace(/[^a-zA-Z0-9_]/g, "").slice(0, 24) || "googleuser"
            let username = baseUsername
            let suffix = 1
            while (await userModel.exists({ username })) username = `${baseUsername.slice(0, 20)}${suffix++}`

            user = await userModel.create({ username, email: profile.email, googleId: profile.sub })
        } else if (!user.googleId) {
            user.googleId = profile.sub
            await user.save()
        }

        const token = signAuthToken(user)
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
        return res.status(200).json({
            message: "Signed in with Google",
            user: { id: user._id, username: user.username, email: user.email }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Google sign-in failed" })
    }
}

function getGoogleConfigController(req, res) {
    res.status(200).json({ clientId: env.googleClientId || "" })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)



    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}



module.exports = {
    registerUserController,
    loginUserController,
    googleLoginController,
    getGoogleConfigController,
    logoutUserController,
    getMeController
}
