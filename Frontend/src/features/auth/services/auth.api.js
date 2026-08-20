import axios from "axios"


const api = axios.create({
    baseURL: "https://pri-rezulyzer-10082004.onrender.com/api",
    withCredentials: true,
    timeout: 15000
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt")

    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
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
    const response = await api.post('/auth/register', {
        username, email, password
    })

    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/auth/login", {
        email, password
    })

    return response.data
}



export async function loginWithGoogle(accessToken) {
    const response = await api.post("/auth/google", { accessToken })
    return response.data
}

export async function logout() {
    const response = await api.get("/auth/logout")

    return response.data
}

export async function getMe() {
    const response = await api.get("/auth/get-me")

    return response.data
}
