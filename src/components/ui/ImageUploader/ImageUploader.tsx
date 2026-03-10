import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from '../Image/Image'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { FaImage, FaTrash } from 'react-icons/fa'
import './ImageUploader.scss'

export interface ImageUploaderProps {
    value: string
    onChange: (file: File | null, previewUrl: string) => void
    onRemove: () => void
    disabled?: boolean
    accept?: string[]
    maxSize?: number
    className?: string
    dropzoneText?: string
    hintText?: string
    alt?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    onRemove,
    disabled = false,
    accept = ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    maxSize = 5 * 1024 * 1024, // 5MB
    className = '',
    dropzoneText = 'Drag & drop an image here, or click to select',
    hintText = 'Supports: JPEG, PNG, GIF, WebP (max 5MB)',
    alt = 'Preview'
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return
            }

            // Validate file size
            if (file.size > maxSize) {
                return
            }

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                const previewUrl = e.target?.result as string
                onChange(file, previewUrl)
            }
            reader.readAsDataURL(file)
        }
    }, [onChange, maxSize])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': accept
        },
        multiple: false,
        disabled
    })

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowConfirmDialog(true)
    }

    const handleConfirmRemove = () => {
        onRemove()
        setShowConfirmDialog(false)
    }

    const handleCancelRemove = () => {
        setShowConfirmDialog(false)
    }

    return (
        <>
            <div
                {...getRootProps()}
                className={`image-uploader ${isDragActive ? 'image-uploader--active' : ''} ${className}`}
            >
                <input {...getInputProps()} />
                {value ? (
                    <div className="image-uploader__preview">
                        <Image src={value} alt={alt} />
                        <button
                            type="button"
                            className="image-uploader__remove-image"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            <FaTrash />
                            <span>Remove</span>
                        </button>
                    </div>
                ) : (
                    <div className="image-uploader__content">
                        <div className="image-uploader__icon">
                            <FaImage />
                        </div>
                        <p>
                            {isDragActive
                                ? 'Drop the image here...'
                                : dropzoneText}
                        </p>
                        <p className="image-uploader__hint">
                            {hintText}
                        </p>
                    </div>
                )}
            </div>

            {showConfirmDialog && (
                <ConfirmDialog
                    isOpen={showConfirmDialog}
                    title="Remove Image?"
                    message="Are you sure you want to remove this image? This action cannot be undone."
                    confirmText="Remove"
                    cancelText="Cancel"
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                    variant="danger"
                />
            )}
        </>
    )
}

export default ImageUploader
