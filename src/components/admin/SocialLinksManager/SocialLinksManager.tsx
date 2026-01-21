import React, { useState, useEffect } from 'react'
import { getSocialLinks, deleteSocialLink } from '../../../utils/database'
import type { SocialLink } from '../../../types/database'
import { useAuth } from '../../../context/AuthContext'
import { Button } from '../../ui'
import SocialLinkForm from '../SocialLinkForm/SocialLinkForm'
import './SocialLinksManager.scss'

const SocialLinksManager: React.FC = () => {
    const { user } = useAuth()
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingLink, setEditingLink] = useState<SocialLink | null>(null)

    useEffect(() => {
        fetchSocialLinks()
    }, [])

    const fetchSocialLinks = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data, error } = await getSocialLinks()

            if (error) {
                setError(error.message)
            } else if (data) {
                setSocialLinks(data)
            }
        } catch (err) {
            setError('Failed to load social links')
        } finally {
            setLoading(false)
        }
    }

    const handleAddLink = () => {
        setEditingLink(null)
        setIsFormOpen(true)
    }

    const handleEditLink = (link: SocialLink) => {
        setEditingLink(link)
        setIsFormOpen(true)
    }

    const handleDeleteLink = async (link: SocialLink) => {
        if (!user) {
            setError('You must be logged in to delete links')
            return
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete the ${link.platform} link?`
        )

        if (!confirmed) return

        try {
            // Optimistic update
            setSocialLinks(prev => prev.filter(l => l.id !== link.id))

            const { error } = await deleteSocialLink(link.id)

            if (error) {
                // Rollback on error
                setSocialLinks(prev => [...prev, link])
                setError(error.message)
            }
        } catch (err) {
            // Rollback on error
            setSocialLinks(prev => [...prev, link])
            setError('Failed to delete social link')
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingLink(null)
    }

    const handleFormSuccess = () => {
        fetchSocialLinks()
        handleFormClose()
    }

    const getPlatformIcon = (platform: string) => {
        const iconMap: Record<string, string> = {
            instagram: '📷',
            twitter: '🐦',
            facebook: '📘',
            linkedin: '💼',
            website: '🌐',
            email: '✉️',
            other: '🔗'
        }
        return iconMap[platform] || '🔗'
    }

    const getPlatformDisplay = (platform: string) => {
        return platform.charAt(0).toUpperCase() + platform.slice(1)
    }

    const truncateUrl = (url: string, maxLength: number = 40) => {
        if (url.length <= maxLength) return url
        return url.substring(0, maxLength - 3) + '...'
    }

    if (loading) {
        return (
            <div className="social-links-manager">
                <div className="social-links-manager__loading">
                    <div className="spinner"></div>
                    <p>Loading social links...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="social-links-manager">
                <div className="social-links-manager__error">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <Button onClick={fetchSocialLinks}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="social-links-manager">
            <div className="social-links-manager__header">
                <h2>Social Links Management</h2>
                <Button variant="primary" onClick={handleAddLink}>
                    Add New Link
                </Button>
            </div>

            {socialLinks.length === 0 ? (
                <div className="social-links-manager__empty">
                    <h3>No Social Links Yet</h3>
                    <p>Add social media links to help visitors connect with you.</p>
                    <Button variant="primary" onClick={handleAddLink}>
                        Add New Link
                    </Button>
                </div>
            ) : (
                <div className="social-links-manager__list">
                    {socialLinks
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((link) => (
                            <div key={link.id} className="social-links-manager__item">
                                <div className="social-links-manager__icon">
                                    {getPlatformIcon(link.platform)}
                                </div>

                                <div className="social-links-manager__info">
                                    <div className="social-links-manager__platform">
                                        {getPlatformDisplay(link.platform)}
                                    </div>
                                    <div className="social-links-manager__url" title={link.url}>
                                        {truncateUrl(link.url)}
                                    </div>
                                </div>

                                <div className="social-links-manager__actions">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEditLink(link)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleDeleteLink(link)}
                                        className="social-links-manager__delete"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {isFormOpen && (
                <SocialLinkForm
                    link={editingLink}
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    )
}

export default SocialLinksManager
