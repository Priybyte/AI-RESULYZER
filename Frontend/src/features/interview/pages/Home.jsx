import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import ProfileLogoutButton from '../../auth/components/ProfileLogoutButton.jsx'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Home = () => {

    const { loading, generateReport, reports, deleteReport } = useInterview()
    const { user } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const [ roadmapDuration, setRoadmapDuration ] = useState(1)
    const [ roadmapUnit, setRoadmapUnit ] = useState("months")
    const [ technicalQuestionCount, setTechnicalQuestionCount ] = useState(10)
    const [ behavioralQuestionCount, setBehavioralQuestionCount ] = useState(10)
    const [ error, setError ] = useState("")
    const [ deletingReportId, setDeletingReportId ] = useState(null)
    const [ activeSidebarItem, setActiveSidebarItem ] = useState("Recent Interview Plans")
    const resumeInputRef = useRef()

    const navigate = useNavigate()
    const displayName = (user?.username || "there").replace(/([a-z])([A-Z])/g, "$1 $2")

    const handleResumeChange = (e) => {
        const file = e.target.files?.[0] || null
        setResumeFile(file)
    }

    const handleGenerateReport = async () => {
        setError("")
        const selectedFile = resumeFile || resumeInputRef.current?.files?.[0] || null
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile: selectedFile, roadmapDuration, roadmapUnit, technicalQuestionCount, behavioralQuestionCount })
            if (data?._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const handleDeleteReport = async (event, interviewReportId) => {
        event.stopPropagation()
        setError("")
        setDeletingReportId(interviewReportId)

        try {
            await deleteReport(interviewReportId)
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.message || "Unable to delete the interview plan.")
        } finally {
            setDeletingReportId(null)
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'><div className='skeleton-card' /><div className='skeleton-card' /><div className='skeleton-card' /></main>
        )
    }

    return (
        <div className='home-page'>
            <ProfileLogoutButton />

            {false && <aside className='dashboard-sidebar'>
                <strong>AI-Resulyzer</strong>
                <div className='sidebar-menu'>
                    {["Recent Interview Plans", "Resume Versions", "Insights"].map((item, index) => <button key={item} onClick={() => setActiveSidebarItem(item)} className={activeSidebarItem === item ? 'active' : ''}><span>{index + 1}</span>{item}</button>)}
                </div>
                {["Dashboard", "Resumes", "Insights", "Versions", "History", "Settings"].map((item, index) => <button key={item} className={index === 0 ? 'active' : ''}><span>{["▦", "▤", "⌁", "◫", "↶", "⚙"][index]}</span>{item}</button>)}
            </aside>}
            <div className='dashboard-main'>

            {/* Page Header */}
            <header className='page-header'>
                <div>
                    <span className='dashboard-eyebrow'>AI Resume &amp; Interview Analyzer</span>
                    <h1>Hello, {displayName}.</h1>
                    <p className='dashboard-subheading'>Create Your Custom <span className='highlight'>Interview Plan</span></p>
                    <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
                </div>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>0 / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className={`dropzone ${resumeFile ? 'dropzone--selected' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className='dropzone__title'>{resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}</p>
                                <p className='dropzone__subtitle'>{resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB selected` : 'PDF or DOCX (Max 5MB)'}</p>
                                <input
                                    ref={resumeInputRef}
                                    className='dropzone__input'
                                    onChange={handleResumeChange}
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        <div className='generation-preferences'>
                            <p className='section-label'>Interview Plan Preferences</p>
                            <div className='generation-preferences__grid'>
                                <label>Roadmap duration
                                    <span className='generation-preferences__inline'>
                                        <input type='number' min='1' max={roadmapUnit === 'years' ? '4' : '48'} value={roadmapDuration} onChange={(event) => setRoadmapDuration(event.target.value)} />
                                        <select value={roadmapUnit} onChange={(event) => setRoadmapUnit(event.target.value)}><option value='months'>Months</option><option value='years'>Years</option></select>
                                    </span>
                                </label>
                                <label>Technical questions
                                    <input type='number' min='1' max='50' value={technicalQuestionCount} onChange={(event) => setTechnicalQuestionCount(event.target.value)} />
                                </label>
                                <label>Behavioral questions
                                    <input type='number' min='1' max='50' value={behavioralQuestionCount} onChange={(event) => setBehavioralQuestionCount(event.target.value)} />
                                </label>
                            </div>
                            <p className='generation-preferences__hint'>Up to 4 years of roadmap and 50 questions per category.</p>
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {error && <p className='home-error' role='alert'>{error}</p>}

            {/* Recent Reports List */}
            {activeSidebarItem === "Recent Interview Plans" && reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <button
                                    type='button'
                                    className='delete-report-button'
                                    aria-label={`Delete ${report.title || 'interview plan'}`}
                                    title='Delete interview plan'
                                    disabled={deletingReportId === report._id}
                                    onClick={(event) => handleDeleteReport(event, report._id)}>
                                    <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M3 6h18' /><path d='M8 6V4h8v2' /><path d='M19 6l-1 14H6L5 6' /><path d='M10 11v5' /><path d='M14 11v5' /></svg>
                                </button>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {activeSidebarItem === "Resume Versions" && (
                <section className='dashboard-view'><h2>Resume Versions</h2><p>Track the evolution of your tailored resumes.</p><div className='dashboard-metrics'><article><small>V1</small><strong>68</strong><span>Initial match</span></article><article><small>V2</small><strong>78</strong><span>Keyword improvements</span></article><article><small>V3</small><strong>86</strong><span>Interview ready</span></article></div></section>
            )}

            {activeSidebarItem === "Insights" && (
                <section className='dashboard-view'><h2>Insights</h2><p>Trends from your saved interview plans.</p><div className='dashboard-metrics'><article><small>Average match</small><strong>{reports.length ? Math.round(reports.reduce((sum, report) => sum + report.matchScore, 0) / reports.length) : 0}%</strong><span>Across recent plans</span></article><article><small>Plans generated</small><strong>{reports.length}</strong><span>Preparation history</span></article><article><small>Trend</small><strong>+12%</strong><span>Preparation momentum</span></article></div></section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
            </div>
        </div>
    )
}

export default Home
