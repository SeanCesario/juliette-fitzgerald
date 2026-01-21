import React, { useEffect, useState } from 'react'
import { Modal, Image, Button } from '../ui'
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
            setCurrentIndex(index)
        }
    }, [painting, allPaintings])

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
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <div className="painting-modal">
                {allPaintings.length > 1 && (
                    <div className="painting-modal__navigation">
                        <Button
                            variant="ghost"
                            onClick={handlePrevious}
                            className="painting-modal__nav painting-modal__nav--prev"
                            aria-label="Previous painting"
                        >
                            <span>‹</span>
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleNext}
                            className="painting-modal__nav painting-modal__nav--next"
                            aria-label="Next painting"
                        >
                            <span>›</span>
                        </Button>
                    </div>
                )}

                <div className="painting-modal__container">
                    <div className="painting-modal__image-section">
                        <Image
                            src={currentPainting.image_url}
                            alt={currentPainting.title}
                            aspectRatio="custom"
                            customAspectRatio={1.33}
                            className="painting-modal__image"
                        />
                    </div>

                    <div className="painting-modal__info">
                        <h2 className="painting-modal__title">{currentPainting.title}</h2>
                        <p className="painting-modal__year">{currentPainting.year}</p>

                        {currentPainting.description && (
                            <div className="painting-modal__description">
                                <p>{currentPainting.description}</p>
                            </div>
                        )}

                        {allPaintings.length > 1 && (
                            <div className="painting-modal__counter">
                                {currentIndex + 1} / {allPaintings.length}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default PaintingModal
