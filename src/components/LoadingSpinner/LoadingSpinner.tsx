import React from 'react'
import './LoadingSpinner.scss'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = '',
    text
}) => {
    const baseClasses = 'loading-spinner'
    const sizeClasses = `loading-spinner--${size}`

    const classes = [baseClasses, sizeClasses, className].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            <div className="loading-spinner__spinner" />
            {text && (
                <p className="loading-spinner__text">{text}</p>
            )}
        </div>
    )
}

export default LoadingSpinner
