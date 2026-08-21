import { useState } from "react"

const NAV_CONTENT = {
    Home: "AI Resume & Interview Analyzer helps you prepare with tailored questions, skill-gap insights, and a focused roadmap.",
    About: "Built to turn your experience and a job description into practical interview preparation in minutes.",
    Services: "Generate interview plans, technical and behavioral questions, preparation roadmaps, and tailored resumes.",
    Contact: "Need help? Sign in or create an account to begin building your personalized interview strategy."
}

export default function AuthShell({ mode, children }) {
    const [ activeInfo, setActiveInfo ] = useState("")
    const isLogin = mode === "login"

    return (
        <main className="auth-page">
            <nav className="auth-nav" aria-label="Platform navigation">
                <button className="auth-brand" type="button" onClick={() => setActiveInfo("Home")}>AI-Resulyzer</button>
                <div className="auth-nav__links">
                    {Object.keys(NAV_CONTENT).map((label) => (
                        <button type="button" key={label} onClick={() => setActiveInfo(label)}>{label}</button>
                    ))}
                </div>
            </nav>

            {activeInfo && (
                <div className="auth-info" role="dialog" aria-label={activeInfo}>
                    <p><strong>{activeInfo}</strong>{NAV_CONTENT[activeInfo]}</p>
                    <button type="button" aria-label="Close" onClick={() => setActiveInfo("")}>×</button>
                </div>
            )}

            <section className="auth-layout">
                <aside className="auth-showcase">
                    <span className="auth-showcase__eyebrow">AI-powered career prep</span>
                    <h1>AI Resume &amp; Interview Analyzer</h1>
                    <p>Turn your experience into a focused interview strategy, tailored questions, and an actionable roadmap.</p>
                    <div className="auth-showcase__stats">
                        <span>Tailored plans</span><span>Smart practice</span><span>Career clarity</span>
                    </div>
                </aside>
                <div className="form-container">
                    <div className="auth-intro">
                        <span className="auth-intro__eyebrow">{isLogin ? "Welcome back" : "Start preparing"}</span>
                        <h2>{isLogin ? "Sign in" : "Create account"}</h2>
                        <p className="form-subtitle">{isLogin ? "Continue building sharper, more personalized interview plans." : "Create your account to get a tailored resume and interview strategy."}</p>
                    </div>
                    {children}
                </div>
            </section>
        </main>
    )
}
