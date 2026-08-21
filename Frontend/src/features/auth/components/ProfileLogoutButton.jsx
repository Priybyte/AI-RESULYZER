import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import "./profile.logout.scss"

export default function ProfileLogoutButton() {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const [ imageFailed, setImageFailed ] = useState(false)
    const [ loggingOut, setLoggingOut ] = useState(false)
    const avatarUrl = user?.avatarUrl || user?.picture
    const initials = (user?.username || user?.email || "U").trim().slice(0, 1).toUpperCase()

    const logout = async () => {
        if (loggingOut) return
        setLoggingOut(true)
        await handleLogout()
        navigate("/login", { replace: true })
    }

    return (
        <button type="button" className="profile-logout" onClick={logout} disabled={loggingOut} aria-label="Logout" data-tooltip="Logout">
            {avatarUrl && !imageFailed ? (
                <img src={avatarUrl} alt="" onError={() => setImageFailed(true)} />
            ) : (
                <span aria-hidden="true">{initials}</span>
            )}
        </button>
    )
}
