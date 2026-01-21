import React, { useState, useEffect } from 'react'
import { getAbout } from '../../utils/database'
import type { About } from '../../types/database'
import { Image, Spinner } from '../../components/ui'
import './About.scss'

const AboutPage: React.FC = () => {
    const [about, setAbout] = useState<About | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                setLoading(true)
                setError(null)

                const { data, error } = await getAbout()

                if (error) {
                    setError(error.message)
                } else if (data) {
                    setAbout(data)
                }
            } catch (err) {
                setError('Failed to load about information')
            } finally {
                setLoading(false)
            }
        }

        fetchAbout()
    }, [])

    if (loading) {
        return (
            <div className="about">
                <div className="container">
                    <div className="about__loading">
                        <Spinner size="lg" />
                        <p>Loading about information...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="about">
                <div className="container">
                    <div className="about__error">
                        <h2>Oops!</h2>
                        <p>{error}</p>
                        <button
                            className="about__retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!about) {
        return (
            <div className="about">
                <div className="container">
                    <div className="about__empty">
                        <h2>About</h2>
                        <p>No information available yet. Check back soon to learn more about the artist.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="about">
            <div className="container">
                <header className="about__header">
                    <h1>About</h1>
                </header>

                <div className="about__content">
                    <div className="about__photo-section">
                        <Image
                            src={about.image_url}
                            alt="Artist portrait"
                            aspectRatio="portrait"
                            className="about__photo"
                        />
                    </div>

                    <div className="about__bio-section">
                        <div className="about__bio">
                            {about.text.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
