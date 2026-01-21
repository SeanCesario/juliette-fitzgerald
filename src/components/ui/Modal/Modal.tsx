import React, { useEffect } from 'react'
import './Modal.scss'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeOnBackdrop?: boolean
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    size = 'md',
    closeOnBackdrop = true
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isOpen) return null

    const baseClasses = 'modal'
    const sizeClasses = `modal--${size}`

    const classes = [baseClasses, sizeClasses].filter(Boolean).join(' ')

    return (
        <div className="modal" onClick={handleBackdropClick}>
            <div className="modal__backdrop" />
            <div className={classes}>
                <button className="modal__close" onClick={onClose} aria-label="Close modal">
                    <span>×</span>
                </button>
                <div className="modal__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
