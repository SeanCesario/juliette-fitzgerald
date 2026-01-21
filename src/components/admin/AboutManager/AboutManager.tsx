import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { getAbout, updateAbout } from '../../../utils/database'
import { supabase } from '../../../utils/supabase'
import type { About, AboutUpdate } from '../../../types/database'
import { useAuth } from '../../../context/AuthContext'
import { Button, Image } from '../../ui'
import './AboutManager.scss'

const AboutManager: React.FC = () => {
    const { user } = useAuth()
    const [about, setAbout] = useState<About | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        text: '',
        image_url: '',
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>('')

    useEffect(() => {
        fetchAbout()
    }, [])

    const fetchAbout = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data, error } = await getAbout()

            if (error) {
                setError(error.message)
            } else if (data) {
                setAbout(data)
                setFormData({
                    text: data.text || '',
                    image_url: data.image_url || '',
                })
                setPreviewUrl(data.image_url || '')
            }
        } catch (err) {
            setError('Failed to load about information')
        } finally {
            setLoading(false)
        }
    }

    const onDrop = (acceptedFiles: File[]) => {
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
    }

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
            [field]: e.target.value
        }))
        setError(null)
    }

    const validateForm = (): boolean => {
        if (!user) {
            setError('You must be logged in to make changes')
            return false
        }

        if (!formData.text.trim()) {
            setError('Bio text is required')
            return false
        }

        if (!about && !selectedFile) {
            setError('Please select an image')
            return false
        }

        return true
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `about-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `about/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('paintings') // Use paintings bucket for now
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

        setIsSaving(true)

        try {
            let imageUrl = formData.image_url

            // Upload new image if selected
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile)
            }

            const updateData: AboutUpdate = {
                text: formData.text.trim(),
                image_url: imageUrl!,
            }

            const { error } = await updateAbout(about?.id || '', updateData)

            if (error) {
                throw error
            }

            // Refresh data
            await fetchAbout()

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveImage = () => {
        setSelectedFile(null)
        setPreviewUrl(about?.image_url || '')
        setError(null)
    }

    if (loading) {
        return (
            <div className="about-manager">
                <div className="about-manager__loading">
                    <div className="spinner"></div>
                    <p>Loading about information...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="about-manager">
                <div className="about-manager__error">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <Button onClick={fetchAbout}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="about-manager">
            <div className="about-manager__header">
                <h2>About Page Management</h2>
                <p>Edit the artist bio and photo that appears on the about page</p>
            </div>

            <form className="about-manager__form" onSubmit={handleSubmit}>
                <div className="about-manager__fields">
                    <div className="about-manager__field">
                        <label htmlFor="bio">Bio Text *</label>
                        <textarea
                            id="bio"
                            value={formData.text}
                            onChange={handleInputChange('text')}
                            disabled={isSaving}
                            rows={12}
                            placeholder="Enter the artist bio here..."
                            required
                        />
                    </div>

                    <div className="about-manager__field">
                        <label>Artist Photo</label>
                        <div
                            {...getRootProps()}
                            className={`about-manager__dropzone ${isDragActive ? 'about-manager__dropzone--active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            {previewUrl ? (
                                <div className="about-manager__preview">
                                    <Image src={previewUrl} alt="Artist photo" aspectRatio="portrait" />
                                    <button
                                        type="button"
                                        className="about-manager__remove-image"
                                        onClick={handleRemoveImage}
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            ) : (
                                <div className="about-manager__dropzone-content">
                                    <div className="about-manager__dropzone-icon">📷</div>
                                    <p>
                                        {isDragActive
                                            ? 'Drop the image here...'
                                            : 'Drag & drop an image here, or click to select'}
                                    </p>
                                    <p className="about-manager__dropzone-hint">
                                        Supports: JPEG, PNG, GIF, WebP (max 5MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="about-manager__error">
                        {error}
                    </div>
                )}

                <div className="about-manager__actions">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSaving}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AboutManager
