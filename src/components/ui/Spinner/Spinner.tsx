import React from 'react'
import './Spinner.scss'

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const baseClasses = 'spinner'
    const sizeClasses = `spinner--${size}`

    const classes = [baseClasses, sizeClasses, className].filter(Boolean).join(' ')

    return <div className={classes} />
}

export default Spinner
