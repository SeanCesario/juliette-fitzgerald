import React from 'react'
import './Card.scss'

export interface CardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    hover?: boolean
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hover = false
}) => {
    const baseClasses = 'card'
    const hoverClasses = hover ? 'card--hover' : ''
    const clickableClasses = onClick ? 'card--clickable' : ''

    const classes = [
        baseClasses,
        hoverClasses,
        clickableClasses,
        className
    ].filter(Boolean).join(' ')

    const Component = onClick ? 'button' : 'div'

    return (
        <Component className={classes} onClick={onClick}>
            {children}
        </Component>
    )
}

export default Card
