import React, { useEffect, useState, useRef } from 'react'
import type { Painting } from '../../types/database'
import { useBodyScroll } from '../../hooks/useBodyScroll'
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
    useBodyScroll(isOpen)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // Minimum swipe distance
    const minSwipeDistance = 50

    useEffect(() => {
        if (painting && allPaintings.length > 0) {
            const index = allPaintings.findIndex(p => p.id === painting.id)
            setCurrentIndex(index >= 0 ? index : 0)
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

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            handleNext()
        }
        if (isRightSwipe) {
            handlePrevious()
        }
    }

    const currentPainting = allPaintings[currentIndex] || painting

    if (!isOpen || !currentPainting) {
        return null
    }

    return (
        <div className="painting-modal" onClick={onClose}>
            {/* Header container with title and close button */}
            <div className="painting-modal__header">
                <div className="painting-modal__info">
                    {currentPainting.title} ({currentPainting.year})
                </div>

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
            </div>

            {/* Container for image and navigation */}
            <div
                className="painting-modal__content"
                ref={contentRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Full image */}
                <img
                    ref={imageRef}
                    src={currentPainting.image_url}
                    alt={currentPainting.title}
                    className="painting-modal__image"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Navigation arrows positioned relative to image */}
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
            </div>
        </div>
    )
}

export default PaintingModal
