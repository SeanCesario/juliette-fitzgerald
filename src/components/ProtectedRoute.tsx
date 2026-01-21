import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './ui'
import './ProtectedRoute.scss'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!loading && !user) {
            // Redirect to login page with return URL
            navigate('/admin/login', {
                state: { from: location.pathname }
            })
        }
    }, [user, loading, navigate, location])

    if (loading) {
        return (
            <div className="protected-route">
                <div className="protected-route__loading">
                    <Spinner size="lg" />
                    <p>Checking authentication...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect
    }

    return <>{children}</>
}

export default ProtectedRoute
