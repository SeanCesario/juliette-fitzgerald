import React, { useEffect, useState } from 'react'
import type { Painting } from '../../types/database'
import './PaintingModal.scss'

interface PaintingModalProps {
    painting: Painting | null
    allPaintings: Painting[]
    isOpen: boolean
    onClose: () => void
}

const PaintingModal: React.FC<PaintingModalProps> = ({
    painting,
    allPaintings,
    isOpen,
    onClose
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (painting && allPaintings.length > 0) {
            const index = allPaintings.findIndex(p => p.id === painting.id)
            setCurrentIndex(index >= 0 ? index : 0)
        }
    }, [painting, allPaintings])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handlePrevious = () => {
        if (allPaintings.length === 0) return
        const newIndex = currentIndex === 0 ? allPaintings.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const handleNext = () => {
        if (allPaintings.length === 0) return
        const newIndex = (currentIndex + 1) % allPaintings.length
        setCurrentIndex(newIndex)
    }

    const currentPainting = allPaintings[currentIndex] || painting

    if (!isOpen || !currentPainting) {
        return null
    }

    return (
        <div className="painting-modal" onClick={onClose}>
            {/* Name and year in top left */}
            <div className="painting-modal__info">
                {currentPainting.title} ({currentPainting.year})
            </div>

            {/* Close button in top right */}
            <button
                className="painting-modal__close"
                onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
                aria-label="Close modal"
            >
                ×
            </button>

            {/* Navigation arrows fixed to sides */}
            {allPaintings.length > 1 && (
                <>
                    <button
                        className="painting-modal__nav painting-modal__nav--prev"
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePrevious()
                        }}
                        aria-label="Previous painting"
                    >
                        ←
                    </button>

                    <button
                        className="painting-modal__nav painting-modal__nav--next"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNext()
                        }}
                        aria-label="Next painting"
                    >
                        →
                    </button>
                </>
            )}

            {/* Full image */}
            <img
                src={currentPainting.image_url}
                alt={currentPainting.title}
                className="painting-modal__image"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    )
}

export default PaintingModal
