export default function AuthShell({ mode, children }) {
    const isLogin = mode === "login"

    return (
        <main className="auth-page">
            <nav className="auth-nav" aria-label="Authentication">
                <span className="auth-brand">AI-Resulyzer</span>
                <span className="auth-nav__mode">{isLogin ? "Sign in" : "Create account"}</span>
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
