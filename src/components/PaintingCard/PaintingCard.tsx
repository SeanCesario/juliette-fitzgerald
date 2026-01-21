import React from 'react'
import { Card, Image } from '../ui'
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
        <Card onClick={handleClick} hover className="painting-card">
            <div className="painting-card__image-container">
                <Image
                    src={painting.image_url}
                    alt={painting.title}
                    aspectRatio="portrait"
                    lazy
                    className="painting-card__image"
                />

                <div className="painting-card__overlay">
                    <div className="painting-card__content">
                        <h3 className="painting-card__title">{painting.title}</h3>
                        <p className="painting-card__year">{painting.year}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default PaintingCard
