import { Link } from "react-router"

export default function AuthShell({ mode, children }) {

    return (
        <main className="auth-page">
            <nav className="auth-nav" aria-label="Authentication">
                <span aria-hidden="true" />
                <Link className="auth-nav__mode" to="/">Home</Link>
            </nav>
            <section className="auth-layout">
                <aside className="auth-showcase">
                    <span className="auth-showcase__eyebrow">AI-powered career prep</span>
                    <h1>AI Resume &amp; Interview Analyzer</h1>
                    <p>Turn your experience into a focused interview strategy, tailored questions, and an actionable roadmap.</p>
                    <div className="auth-showcase__stats"><span>Tailored plans</span><span>Smart practice</span><span>Career clarity</span></div>
                </aside>
                <div className="form-container">
                    <div className="auth-intro">
                        <span className="auth-intro__eyebrow">{mode === "login" ? "Welcome back" : "Start preparing"}</span>
                        <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
                        <p className="form-subtitle">{mode === "login" ? "Continue building sharper, more personalized interview plans." : "Create your account to get a tailored resume and interview strategy."}</p>
                    </div>
                    {children}
                </div>
            </section>
        </main>
    )
}
