import React from 'react'
import './Grid.scss'

export interface GridProps {
    children: React.ReactNode
    columns?: 1 | 2 | 3 | 4 | 5 | 6
    gap?: 'sm' | 'md' | 'lg'
    className?: string
}

const Grid: React.FC<GridProps> = ({
    children,
    columns = 3,
    gap = 'md',
    className = ''
}) => {
    const baseClasses = 'grid'
    const columnsClasses = `grid--${columns}`
    const gapClasses = `grid--gap-${gap}`

    const classes = [baseClasses, columnsClasses, gapClasses, className].filter(Boolean).join(' ')

    return <div className={classes}>{children}</div>
}

export default Grid
