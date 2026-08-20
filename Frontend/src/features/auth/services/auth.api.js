import axios from "axios"


const api = axios.create({
    baseURL: "https://ai-resume-backend-a6io.onrender.com",
    withCredentials: true,
    timeout: 15000
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
            return Promise.reject(new Error("The server took too long to respond. Please try again."))
        }

        if (!error.response) {
            return Promise.reject(new Error("Unable to reach the server. Make sure the backend is running on port 3000."))
        }

        return Promise.reject(new Error(error.response.data?.message || "Authentication request failed"))
    }
)

export async function register({ username, email, password }) {
    const response = await api.post('/api/auth/register', {
        username, email, password
    })

    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email, password
    })

    return response.data
}

export async function loginWithGoogle(accessToken) {
    const response = await api.post("/api/auth/google", { accessToken })
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")

    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")

    return response.data
}
