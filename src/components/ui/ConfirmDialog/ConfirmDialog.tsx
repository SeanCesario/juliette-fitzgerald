import React from 'react'
import './ConfirmDialog.scss'

export interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
    onCancel: () => void
    variant?: 'danger' | 'warning' | 'info'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    variant = 'danger'
}) => {
    if (!isOpen) return null

    return (
        <div className="confirm-dialog" onClick={onCancel}>
            <div className="confirm-dialog__content" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-dialog__title">{title}</h3>
                <p className="confirm-dialog__message">{message}</p>
                <div className="confirm-dialog__actions">
                    <button
                        type="button"
                        className="confirm-dialog__cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`confirm-dialog__confirm confirm-dialog__confirm--${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog
