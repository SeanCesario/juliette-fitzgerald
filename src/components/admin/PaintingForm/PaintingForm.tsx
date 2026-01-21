import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createPainting, updatePainting } from '../../../utils/database'
import { supabase } from '../../../utils/supabase'
import type { Painting, PaintingInsert, PaintingUpdate } from '../../../types/database'
import { Button, Image } from '../../ui'
import './PaintingForm.scss'

interface PaintingFormProps {
    painting?: Painting | null
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const PaintingForm: React.FC<PaintingFormProps> = ({
    painting,
    isOpen,
    onClose,
    onSuccess
}) => {
    const [formData, setFormData] = useState({
        title: painting?.title || '',
        description: painting?.description || '',
        year: painting?.year || new Date().getFullYear(),
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(painting?.image_url || '')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file')
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image file must be less than 5MB')
                return
            }

            setSelectedFile(file)
            setError(null)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: false,
    })

    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'year' ? parseInt(e.target.value) || 0 : e.target.value
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

        if (!formData.year || formData.year < 1000 || formData.year > 9999) {
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
                    year: formData.year,
                    image_url: imageUrl!,
                }
                const { error } = await updatePainting(painting.id, updateData)
                if (error) throw error
            } else {
                // Create new painting
                const createData: PaintingInsert = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    year: formData.year,
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

    if (!isOpen) return null

    return (
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
                            <div
                                {...getRootProps()}
                                className={`painting-form__dropzone ${isDragActive ? 'painting-form__dropzone--active' : ''}`}
                            >
                                <input {...getInputProps()} />
                                {previewUrl ? (
                                    <div className="painting-form__preview">
                                        <Image src={previewUrl} alt="Preview" aspectRatio="portrait" />
                                        <button
                                            type="button"
                                            className="painting-form__remove-image"
                                            onClick={() => {
                                                setSelectedFile(null)
                                                setPreviewUrl(painting?.image_url || '')
                                            }}
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="painting-form__dropzone-content">
                                        <div className="painting-form__dropzone-icon">📁</div>
                                        <p>
                                            {isDragActive
                                                ? 'Drop the image here...'
                                                : 'Drag & drop an image here, or click to select'}
                                        </p>
                                        <p className="painting-form__dropzone-hint">
                                            Supports: JPEG, PNG, GIF, WebP (max 5MB)
                                        </p>
                                    </div>
                                )}
                            </div>
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
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : (painting ? 'Update Painting' : 'Add Painting')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PaintingForm
