import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, loginWithGoogle, register, logout } from "../services/auth.api";
import { requestGoogleAccessToken } from "../services/google.identity";



export const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context
    const [ submitting, setSubmitting ] = useState(false)

    const saveAuthToken = (data) => {
        if (data?.token) localStorage.setItem("token", data.token)
    }


    const handleLogin = async ({ email, password }) => {
        setSubmitting(true)
        try {
            const data = await login({ email, password })
            if (!data?.user) {
                throw new Error("Login failed")
            }
            saveAuthToken(data)
            setUser(data.user)
            return data
        } catch (err) {
            throw new Error(err.message || "Login failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setSubmitting(true)
        try {
            const data = await register({ username, email, password })
            if (!data?.user) {
                throw new Error(data?.message || "Registration failed")
            }
            saveAuthToken(data)
            setUser(data.user)
            return data
        } catch (err) {
            const message = err.message || "Registration failed"
            throw new Error(message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
        } catch (err) {
        } finally {
            // The API clears the httpOnly cookie. Clear any token left by a
            // previous client implementation as well.
            ;[ "token", "jwt", "authToken", "accessToken" ].forEach((key) => {
                localStorage.removeItem(key)
                sessionStorage.removeItem(key)
            })
            setUser(null)
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setSubmitting(true)
        try {
            const accessToken = await requestGoogleAccessToken()
            const data = await loginWithGoogle(accessToken)
            if (!data?.user) throw new Error(data?.message || "Google sign-in failed")
            saveAuthToken(data)
            setUser(data.user)
            return data
        } catch (err) {
            throw new Error(err.message || "Google sign-in failed")
        } finally {
            setSubmitting(false)
        }
    }

    return { user, loading, submitting, handleRegister, handleLogin, handleGoogleLogin, handleLogout }
}
