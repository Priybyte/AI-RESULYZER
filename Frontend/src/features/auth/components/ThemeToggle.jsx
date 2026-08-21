import { useEffect, useState } from "react"
import "./theme.toggle.scss"

export default function ThemeToggle() {
    const [ theme, setTheme ] = useState(() => localStorage.getItem("theme") || "dark")

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem("theme", theme)
    }, [ theme ])

    return <button type="button" className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme" data-tooltip={`Use ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? "SUN" : "MOON"}</button>
}
