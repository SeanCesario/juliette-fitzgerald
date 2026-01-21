import { useState, useEffect } from 'react'
import { getSocialLinks } from '../../utils/database'
import type { SocialLink } from '../../types/database'
import './Footer.scss'

interface FooterProps {
    websiteName?: string
}

const Footer: React.FC<FooterProps> = ({ websiteName = 'Juliette Fitzgerald' }) => {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                setLoading(true)
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

        fetchSocialLinks()
    }, [])

    const getSocialIcon = (platform: string) => {
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

    const getSocialUrl = (platform: string, url: string) => {
        if (platform === 'email') {
            return `mailto:${url}`
        }
        return url
    }

    if (loading) {
        return (
            <footer className="footer">
                <div className="container">
                    <div className="loading">Loading social links...</div>
                </div>
            </footer>
        )
    }

    if (error) {
        return (
            <footer className="footer">
                <div className="container">
                    <div className="error">Error loading social links</div>
                </div>
            </footer>
        )
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="social-links">
                    {socialLinks
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((link) => (
                            <a
                                key={link.id}
                                href={getSocialUrl(link.platform, link.url)}
                                className="social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${link.platform} profile`}
                            >
                                <span className="social-icon">
                                    {getSocialIcon(link.platform)}
                                </span>
                                <span className="social-platform">{link.platform}</span>
                            </a>
                        ))}
                </div>
                <div className="copyright">
                    <p>&copy; 2024 {websiteName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
