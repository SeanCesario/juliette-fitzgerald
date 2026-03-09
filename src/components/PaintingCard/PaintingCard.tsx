import React from 'react'
import type { Painting } from '../../types/database'
import './PaintingCard.scss'

interface PaintingCardProps {
    painting: Painting
    onClick: (painting: Painting) => void
}

const PaintingCard: React.FC<PaintingCardProps> = ({ painting, onClick }) => {
    const handleClick = () => {
        onClick(painting)
    }

    return (
        <div onClick={handleClick} className="painting-card">
            <img
                src={painting.image_url}
                alt={`${painting.title} (${painting.year})`}
                loading="lazy"
                className="painting-card__image"
            />

            <div className="painting-card__overlay">
                <div className="painting-card__content">
                    <h3 className="painting-card__title">{painting.title}</h3>
                    <p className="painting-card__year">{painting.year}</p>
                </div>
            </div>
        </div>
    )
}

export default PaintingCard
