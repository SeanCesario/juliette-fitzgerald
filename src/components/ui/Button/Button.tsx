import React from 'react'
import './Button.scss'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    icon?: React.ReactNode
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}) => {
    const baseClasses = 'button'
    const variantClasses = `button--${variant}`
    const sizeClasses = `button--${size}`
    const loadingClasses = loading ? 'button--loading' : ''
    const disabledClasses = disabled ? 'button--disabled' : ''

    const classes = [
        baseClasses,
        variantClasses,
        sizeClasses,
        loadingClasses,
        disabledClasses,
        className
    ].filter(Boolean).join(' ')

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="button__spinner" />}
            {icon && <span className="button__icon">{icon}</span>}
            <span className="button__text">{children}</span>
        </button>
    )
}

export default Button
