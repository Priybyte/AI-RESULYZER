import { useEffect, useState } from "react"
import { Link } from "react-router"
import "../landing.scss"

const scores = [{ label: "ATS readiness", target: 86 }, { label: "Interview match", target: 92 }, { label: "Keyword coverage", target: 78 }]

function ScoreCard({ label, target }) {
    const [ value, setValue ] = useState(0)
    const [ isWiggling, setIsWiggling ] = useState(false)
    useEffect(() => {
        let current = 0
        const timer = setInterval(() => { current += 2; setValue(Math.min(current, target)); if (current >= target) clearInterval(timer) }, 24)
        return () => clearInterval(timer)
    }, [ target ])
    const handleClick = () => {
        setValue(target)
        setIsWiggling(false)
        requestAnimationFrame(() => setIsWiggling(true))
    }
    return <button className={`landing-score${isWiggling ? " landing-score--wiggle" : ""}`} type="button" onClick={handleClick} onAnimationEnd={() => setIsWiggling(false)}><span>{label}</span><strong>{value}<small>/100</small></strong><i style={{ width: `${value}%` }} /></button>
}

export default function Landing() {
    return <main className="landing-page">
        <nav className="landing-nav"><span aria-hidden="true" /><Link className="landing-signin" to="/login">Sign in</Link></nav>
        <section className="landing-hero"><div><span className="landing-kicker">AI-powered career preparation</span><h1>Build the confidence to <em>land your next role.</em></h1><p>Transform your experience and a job description into a focused interview plan, tailored questions, and an actionable resume strategy.</p></div><div className="landing-scores">{scores.map(score => <ScoreCard key={score.label} {...score} />)}</div></section>
    </main>
}
