import React, { useState, useEffect } from 'react'
import { createSocialLink, updateSocialLink } from '../../../utils/database'
import type { SocialLink, SocialLinkInsert, SocialLinkUpdate } from '../../../types/database'
import { Button, ConfirmDialog } from '../../ui'
import { useBodyScroll } from '../../../hooks/useBodyScroll'
import './SocialLinkForm.scss'

interface SocialLinkFormProps {
  link?: SocialLink | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onDelete?: () => void
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({
  link,
  isOpen,
  onClose,
  onSuccess,
  onDelete
}) => {
  useBodyScroll(isOpen)

  const [formData, setFormData] = useState({
    platform: 'instagram',
    url: '',
    customPlatform: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (link) {
      setFormData({
        platform: link.platform,
        url: link.url,
        customPlatform: '',
      })
    } else {
      setFormData({
        platform: 'instagram',
        url: '',
        customPlatform: '',
      })
    }
    setError(null)
  }, [link])

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'email', label: 'Email' },
    { value: 'other', label: 'Other' },
  ]

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    setError(null)
  }

  const validateUrl = (url: string, platform: string): boolean => {
    if (platform === 'email') {
      // For email platform, accept almost any text (very permissive)
      const trimmedUrl = url.trim()
      return trimmedUrl.length > 0 // Just check if there's some text
    } else {
      // For other platforms, validate as URL
      const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)*$/
      return urlPattern.test(url)
    }
  }

  const validateForm = (): boolean => {
    if (!formData.platform.trim()) {
      setError('Platform is required')
      return false
    }

    if (formData.platform === 'other' && !formData.customPlatform.trim()) {
      setError('Platform name is required when "Other" is selected')
      return false
    }

    if (!formData.url.trim()) {
      setError('Email is required')
      return false
    }

    if (!validateUrl(formData.url, formData.platform)) {
      setError('Please enter a valid email address or URL')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (link) {
        const updateData: SocialLinkUpdate = {
          platform: formData.platform === 'other' ? formData.customPlatform : formData.platform,
          url: formData.url.trim(),
          display_order: link.display_order,
        }
        const { error } = await updateSocialLink(link.id, updateData)
        if (error) throw error
      } else {
        const createData: SocialLinkInsert = {
          platform: formData.platform === 'other' ? formData.customPlatform : formData.platform,
          url: formData.url.trim(),
          display_order: 0,
        }
        const { error } = await createSocialLink(createData)
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
      <div className="social-link-form-overlay" onClick={handleClose}>
        <div className="social-link-form" onClick={(e) => e.stopPropagation()}>
          <div className="social-link-form__header">
            <h2>{link ? 'Edit Social Link' : 'Add Social Link'}</h2>
            <button className="social-link-form__close" onClick={handleClose}>
              ×
            </button>
          </div>

          <form className="social-link-form__form" onSubmit={handleSubmit}>
            <div className="social-link-form__fields">
              <div className="social-link-form__field">
                <label htmlFor="platform">Platform *</label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={handleInputChange('platform')}
                  disabled={isLoading}
                  required
                >
                  {platforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.platform === 'other' && (
                <div className="social-link-form__field">
                  <label htmlFor="customPlatform">Platform Name *</label>
                  <input
                    id="customPlatform"
                    type="text"
                    value={formData.customPlatform}
                    onChange={handleInputChange('customPlatform')}
                    disabled={isLoading}
                    placeholder="Enter platform name"
                    required
                  />
                </div>
              )}

              <div className="social-link-form__field">
                <label htmlFor="url">Email *</label>
                <input
                  id="url"
                  type="email"
                  value={formData.url}
                  onChange={handleInputChange('url')}
                  disabled={isLoading}
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="social-link-form__error">
                {error}
              </div>
            )}

            <div className="social-link-form__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {link && onDelete && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDeleteClick}
                  disabled={isLoading}
                  className="social-link-form__delete"
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
                {isLoading ? 'Saving...' : (link ? 'Update' : 'Add Link')}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Social Link?"
        message={`Are you sure you want to delete the ${link?.platform || 'social'} link? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </>
  )
}

export default SocialLinkForm
