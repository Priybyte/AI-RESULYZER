const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client"
const API_URL = "https://pri-rezulyzer-10082004.onrender.com"

let googleScriptPromise

async function getGoogleClientId() {
    const viteClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
    if (viteClientId) return viteClientId

    // A public OAuth client ID is safe to expose. This fallback lets the app
    // use the backend configuration even when Vite was started before .env
    // was created or when the frontend has no local .env file.
    const response = await fetch(`${API_URL}/api/auth/google/config`)
    if (!response.ok) return ""

    const { clientId } = await response.json()
    return clientId?.trim() || ""
}

function loadGoogleIdentity() {
    if (window.google?.accounts?.oauth2) return Promise.resolve(window.google)

    if (!googleScriptPromise) {
        googleScriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = GOOGLE_IDENTITY_SCRIPT
            script.async = true
            script.defer = true
            script.onload = () => resolve(window.google)
            script.onerror = () => reject(new Error("Google sign-in could not be loaded. Please try again."))
            document.head.appendChild(script)
        })
    }

    return googleScriptPromise
}

export async function requestGoogleAccessToken() {
    const clientId = await getGoogleClientId()
    if (!clientId) {
        throw new Error("Google sign-in needs a Google OAuth Web client ID. Set GOOGLE_CLIENT_ID in Backend/.env or VITE_GOOGLE_CLIENT_ID in Frontend/.env, then restart the server.")
    }

    const google = await loadGoogleIdentity()
    return new Promise((resolve, reject) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: "openid email profile",
            callback: (response) => {
                if (response.error || !response.access_token) {
                    reject(new Error(response.error_description || "Google sign-in was cancelled."))
                    return
                }
                resolve(response.access_token)
            }
        })
        tokenClient.requestAccessToken({ prompt: "select_account" })
    })
}
