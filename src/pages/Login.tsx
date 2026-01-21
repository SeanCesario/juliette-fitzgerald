import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'
import './Login.scss'

interface LocationState {
    from?: string
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { signIn, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Get redirect path from location state
    const from = (location.state as LocationState)?.from || '/admin'

    // Redirect if already authenticated
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true })
        }
    }, [user, navigate, from])

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setError('Email is required')
            return false
        }

        if (!password.trim()) {
            setError('Password is required')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const { error } = await signIn(email, password)

            if (error) {
                setError(error)
            } else {
                // Navigation will be handled by useEffect
                navigate(from, { replace: true })
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        if (field === 'email') {
            setEmail(e.target.value)
        } else {
            setPassword(e.target.value)
        }
    }

    return (
        <div className="login">
            <div className="container">
                <div className="login__card">
                    <header className="login__header">
                        <h1>Admin Login</h1>
                        <p>Sign in to access the admin panel</p>
                    </header>

                    <form className="login__form" onSubmit={handleSubmit}>
                        <div className="login__field">
                            <label htmlFor="email" className="login__label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleInputChange('email')}
                                className="login__input"
                                placeholder="admin@example.com"
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="login__field">
                            <label htmlFor="password" className="login__label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={handleInputChange('password')}
                                className="login__input"
                                placeholder="••••••••"
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="login__error">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isLoading}
                            className="login__button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
