import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './ui'
import './ErrorBoundary.scss'

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)

        // You could also log to an error reporting service here
        // logErrorToService(error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <div className="error-boundary__icon">⚠️</div>
                        <h2 className="error-boundary__title">Something went wrong</h2>
                        <p className="error-boundary__message">
                            We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="error-boundary__details">
                                <summary>Error Details</summary>
                                <pre className="error-boundary__stack">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                        <div className="error-boundary__actions">
                            <Button onClick={this.handleRetry}>
                                Try Again
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
