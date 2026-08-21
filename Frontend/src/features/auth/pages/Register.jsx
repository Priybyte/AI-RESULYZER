import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import AuthShell from '../components/AuthShell'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const { loading, submitting, handleRegister, handleGoogleLogin } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setError(err.message || "Registration failed")
        }
    }

    const handleGoogleSignIn = async () => {
        setError("")
        try {
            await handleGoogleLogin()
            navigate('/', { replace: true })
        } catch (err) {
            setError(err.message || "Google sign-in failed")
        }
    }

    if (loading) {
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <AuthShell mode="register">

                <form onSubmit={handleSubmit}>
                    {error && <p className="form-error" role="alert">{error}</p>}

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>

                    <button type="submit" disabled={submitting} className='button primary-button'>
                        {submitting ? 'Creating account...' : 'Register'}
                    </button>

                </form>

                <div className="auth-divider"><span>or</span></div>
                <button type="button" disabled={submitting} className="google-button" onClick={handleGoogleSignIn} aria-label="Continue with Google">
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.15c1.84-1.69 2.9-4.18 2.9-7.29Z" /><path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.23l-3.15-2.52c-.87.59-1.99.94-3.3.94-2.54 0-4.7-1.72-5.47-4.02H3.28v2.6A9.75 9.75 0 0 0 12 21.75Z" /><path fill="#FBBC05" d="M6.53 13.92a5.86 5.86 0 0 1 0-3.84v-2.6H3.28a9.76 9.76 0 0 0 0 9.04l3.25-2.6Z" /><path fill="#EA4335" d="M12 6.06c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.15 14.62 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.23l3.25 2.6C7.3 7.78 9.46 6.06 12 6.06Z" /></svg>
                    {submitting ? 'Connecting to Google...' : 'Continue with Google'}
                </button>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
        </AuthShell>
    )
}

export default Register
