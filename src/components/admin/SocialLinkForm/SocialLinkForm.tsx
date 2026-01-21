import React, { useState, useEffect } from 'react'
import { createSocialLink, updateSocialLink } from '../../../utils/database'
import type { SocialLink, SocialLinkInsert, SocialLinkUpdate } from '../../../types/database'
import { Button } from '../../ui'
import './SocialLinkForm.scss'

interface SocialLinkFormProps {
  link?: SocialLink | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const SocialLinkForm: React.FC<SocialLinkFormProps> = ({
  link,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    platform: 'website',
    url: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (link) {
      setFormData({
        platform: link.platform,
        url: link.url,
      })
    } else {
      setFormData({
        platform: 'website',
        url: '',
      })
    }
    setError(null)
  }, [link])

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'website', label: 'Website' },
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

  const validateUrl = (url: string): boolean => {
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)*$/
    return urlPattern.test(url)
  }

  const validateForm = (): boolean => {
    if (!formData.platform.trim()) {
      setError('Platform is required')
      return false
    }

    if (!formData.url.trim()) {
      setError('URL is required')
      return false
    }

    if (!validateUrl(formData.url)) {
      setError('Please enter a valid URL (must start with http:// or https://)')
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
          platform: formData.platform,
          url: formData.url.trim(),
          display_order: link.display_order,
        }
        const { error } = await updateSocialLink(link.id, updateData)
        if (error) throw error
      } else {
        const createData: SocialLinkInsert = {
          platform: formData.platform,
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

  if (!isOpen) return null

  return (
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

            <div className="social-link-form__field">
              <label htmlFor="url">URL *</label>
              <input
                id="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange('url')}
                disabled={isLoading}
                placeholder="https://example.com"
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
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (link ? 'Update Link' : 'Add Link')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SocialLinkForm
