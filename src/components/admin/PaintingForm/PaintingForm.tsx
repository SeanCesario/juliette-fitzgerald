import React, { useState } from 'react'
import { createPainting, updatePainting } from '../../../utils/database'
import { supabase } from '../../../utils/supabase'
import type { Painting, PaintingInsert, PaintingUpdate } from '../../../types/database'
import { Button, ImageUploader, ConfirmDialog } from '../../ui'
import { useBodyScroll } from '../../../hooks/useBodyScroll'
import './PaintingForm.scss'

interface PaintingFormProps {
    painting?: Painting | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    onDelete?: () => void
}

const PaintingForm: React.FC<PaintingFormProps> = ({
    painting,
    isOpen,
    onClose,
    onSuccess,
    onDelete
}) => {
    useBodyScroll(isOpen)

    const [formData, setFormData] = useState({
        title: painting?.title || '',
        description: painting?.description || '',
        year: painting?.year || '',
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(painting?.image_url || '')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleImageChange = (file: File | null, url: string) => {
        setSelectedFile(file)
        setPreviewUrl(url)
        setError(null)
    }

    const handleImageRemove = () => {
        setSelectedFile(null)
        setPreviewUrl('')
        setError(null)
    }


    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'year' ? (e.target.value === '' ? '' : parseInt(e.target.value) || 0) : e.target.value
        }))
        setError(null)
    }

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            setError('Title is required')
            return false
        }

        if (!formData.description.trim()) {
            setError('Description is required')
            return false
        }

        if (!formData.year || formData.year === '' || parseInt(formData.year.toString()) < 1000 || parseInt(formData.year.toString()) > 9999) {
            setError('Please enter a valid year (1000-9999)')
            return false
        }

        if (!painting && !selectedFile) {
            setError('Please select an image')
            return false
        }

        return true
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `paintings/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('paintings')
            .upload(filePath, file)

        if (uploadError) {
            throw new Error('Failed to upload image')
        }

        const { data: { publicUrl } } = supabase.storage
            .from('paintings')
            .getPublicUrl(filePath)

        return publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            let imageUrl = painting?.image_url

            // Upload new image if selected
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile)
            }

            if (painting) {
                // Update existing painting
                const updateData: PaintingUpdate = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    year: parseInt(formData.year.toString()),
                    image_url: imageUrl!,
                }
                const { error } = await updatePainting(painting.id, updateData)
                if (error) throw error
            } else {
                // Create new painting
                const createData: PaintingInsert = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    year: parseInt(formData.year.toString()),
                    image_url: imageUrl!,
                }
                const { error } = await createPainting(createData)
                if (error) throw error
            }

            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        if (!isLoading) {
            onClose()
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete()
        }
        setShowDeleteConfirm(false)
    }

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false)
    }

    if (!isOpen) return null

    return (
        <>
            <div className="painting-form-overlay" onClick={handleClose}>
                <div className="painting-form" onClick={(e) => e.stopPropagation()}>
                    <div className="painting-form__header">
                        <h2>{painting ? 'Edit Painting' : 'Add New Painting'}</h2>
                        <button className="painting-form__close" onClick={handleClose}>
                            ×
                        </button>
                    </div>

                    <form className="painting-form__form" onSubmit={handleSubmit}>
                        <div className="painting-form__fields">
                            <div className="painting-form__field">
                                <label htmlFor="title">Title *</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleInputChange('title')}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="painting-form__field">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange('description')}
                                    disabled={isLoading}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="painting-form__field">
                                <label htmlFor="year">Year *</label>
                                <input
                                    id="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleInputChange('year')}
                                    disabled={isLoading}
                                    min="1000"
                                    max="9999"
                                    required
                                />
                            </div>

                            <div className="painting-form__field">
                                <label>Image {painting ? '(optional)' : '*'}</label>
                                <ImageUploader
                                    value={previewUrl}
                                    onChange={handleImageChange}
                                    onRemove={handleImageRemove}
                                    disabled={isLoading}
                                    alt="Painting preview"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="painting-form__error">
                                {error}
                            </div>
                        )}

                        <div className="painting-form__actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            {painting && onDelete && (
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={handleDeleteClick}
                                    disabled={isLoading}
                                    className="painting-form__delete"
                                >
                                    Delete
                                </Button>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : (painting ? 'Update' : 'Add Painting')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete Painting?"
                message={`Are you sure you want to delete "${formData.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />
        </>
    )
}

export default PaintingForm
