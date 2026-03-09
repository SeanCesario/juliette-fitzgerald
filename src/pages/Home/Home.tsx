import React, { useState, useEffect } from 'react'
import { getPaintings } from '../../utils/database'
import type { Painting, PaintingFilters } from '../../types/database'
import { Button, Grid, Spinner } from '../../components/ui'
import PaintingCard from '../../components/PaintingCard/PaintingCard'
import PaintingModal from '../../components/PaintingModal/PaintingModal'
import './Home.scss'

const Home: React.FC = () => {
    const [paintings, setPaintings] = useState<Painting[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Group paintings by year
    const paintingsByYear = paintings.reduce((acc, painting) => {
        const year = painting.year || 'Unknown'
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(painting)
        return acc
    }, {} as Record<string, Painting[]>)

    // Sort years in descending order
    const sortedYears = Object.keys(paintingsByYear).sort((a, b) => {
        if (a === 'Unknown') return 1
        if (b === 'Unknown') return -1
        return parseInt(b) - parseInt(a)
    })

    useEffect(() => {
        const fetchPaintings = async () => {
            try {
                setLoading(true)
                setError(null)

                const filters: PaintingFilters = {
                    orderBy: 'year',
                    orderDirection: 'desc'
                }

                const { data, error } = await getPaintings(filters)

                if (error) {
                    setError(error.message)
                } else if (data) {
                    setPaintings(data)
                }
            } catch (err) {
                setError('Failed to load paintings')
            } finally {
                setLoading(false)
            }
        }

        fetchPaintings()
    }, [])

    const handlePaintingClick = (painting: Painting) => {
        setSelectedPainting(painting)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPainting(null)
    }

    if (loading) {
        return (
            <div className="home">
                <div className="container">
                    <div className="home__loading">
                        <Spinner size="lg" />
                        <p>Loading gallery...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="home">
                <div className="container">
                    <div className="home__error">
                        <h2>Oops!</h2>
                        <p>{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (paintings.length === 0) {
        return (
            <div className="home">
                <div className="container">
                    <div className="home__empty">
                        <h2>No Paintings Yet</h2>
                        <p>Check back soon to see the artist's work.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="home">
                {sortedYears.map((year) => (
                    <section key={year} className="home__year-section">
                        <div className="home__year-header">
                            <h2 className="home__year-title">{year}</h2>
                        </div>
                        <div className="home__gallery-wrapper">
                            <Grid columns={3} gap="md" className="home__gallery">
                                {paintingsByYear[year].map((painting) => (
                                    <PaintingCard
                                        key={painting.id}
                                        painting={painting}
                                        onClick={handlePaintingClick}
                                    />
                                ))}
                            </Grid>
                        </div>
                    </section>
                ))}
            </div>

            <PaintingModal
                painting={selectedPainting}
                allPaintings={paintings}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    )
}

export default Home
