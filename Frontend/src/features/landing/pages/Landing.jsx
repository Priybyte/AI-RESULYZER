import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../landing.scss"

const scores = [{ label: "ATS readiness", target: 86 }, { label: "Interview match", target: 92 }, { label: "Keyword coverage", target: 78 }]

function ScoreCard({ label, target }) {
    const [ value, setValue ] = useState(0)
    useEffect(() => {
        let current = 0
        const timer = setInterval(() => { current += 2; setValue(Math.min(current, target)); if (current >= target) clearInterval(timer) }, 24)
        return () => clearInterval(timer)
    }, [ target ])
    return <button className="landing-score" type="button" onClick={() => setValue(target)}><span>{label}</span><strong>{value}<small>/100</small></strong><i style={{ width: `${value}%` }} /></button>
}

export default function Landing() {
    const { user } = useAuth()
    return <main className="landing-page">
        <nav className="landing-nav"><Link className="landing-brand" to="/">AI-Resulyzer</Link><div>{["Home", "About", "Services", "Contact"].map(item => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</div><Link className="landing-signin" to={user ? "/dashboard" : "/login"}>{user ? "Home" : "Sign in"}</Link></nav>
        <section id="home" className="landing-hero"><div><span className="landing-kicker">AI-powered career preparation</span><h1>Build the confidence to <em>land your next role.</em></h1><p>Transform your experience and a job description into a focused interview plan, tailored questions, and an actionable resume strategy.</p><div className="landing-actions"><Link to="/register">Get started</Link><a href="#services">Explore features</a></div></div><div className="landing-scores">{scores.map(score => <ScoreCard key={score.label} {...score} />)}</div></section>
        <section id="about" className="landing-section"><h2>Preparation that feels personal</h2><p>AI-Resulyzer surfaces the preparation that matters most for the role you want.</p></section>
        <section id="services" className="landing-section landing-services"><article><b>01</b><h3>Interview plans</h3><p>Role-specific technical and behavioral practice.</p></article><article><b>02</b><h3>Smart roadmaps</h3><p>Clear milestones for your preparation timeline.</p></article><article><b>03</b><h3>Tailored resumes</h3><p>Professional PDFs aligned to each role.</p></article></section>
        <section id="contact" className="landing-section landing-contact"><h2>Ready to prepare with intention?</h2><Link to="/register">Create your free account</Link></section>
    </main>
}
