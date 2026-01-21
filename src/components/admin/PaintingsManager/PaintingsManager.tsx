import React, { useState, useEffect } from 'react'
import { getPaintings, deletePainting } from '../../../utils/database'
import type { Painting } from '../../../types/database'
import { Button, Grid, Image, Spinner } from '../../ui'
import PaintingForm from '../PaintingForm/PaintingForm'
import './PaintingsManager.scss'

const PaintingsManager: React.FC = () => {
    const [paintings, setPaintings] = useState<Painting[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPainting, setEditingPainting] = useState<Painting | null>(null)

    useEffect(() => {
        fetchPaintings()
    }, [])

    const fetchPaintings = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data, error } = await getPaintings({
                orderBy: 'year',
                orderDirection: 'desc'
            })

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

    const handleAddPainting = () => {
        setEditingPainting(null)
        setIsFormOpen(true)
    }

    const handleEditPainting = (painting: Painting) => {
        setEditingPainting(painting)
        setIsFormOpen(true)
    }

    const handleDeletePainting = async (painting: Painting) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${painting.title}"? This action cannot be undone.`
        )

        if (!confirmed) return

        try {
            // Optimistic update
            setPaintings(prev => prev.filter(p => p.id !== painting.id))

            const { error } = await deletePainting(painting.id)

            if (error) {
                // Rollback on error
                setPaintings(prev => [...prev, painting])
                setError(error.message)
            }
        } catch (err) {
            // Rollback on error
            setPaintings(prev => [...prev, painting])
            setError('Failed to delete painting')
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingPainting(null)
    }

    const handleFormSuccess = () => {
        fetchPaintings()
        handleFormClose()
    }

    if (loading) {
        return (
            <div className="paintings-manager">
                <div className="paintings-manager__loading">
                    <Spinner size="lg" />
                    <p>Loading paintings...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="paintings-manager">
                <div className="paintings-manager__error">
                    <h3>Error</h3>
                    <p>{error}</p>
                    <Button onClick={fetchPaintings}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="paintings-manager">
            <div className="paintings-manager__header">
                <h2>Paintings Management</h2>
                <Button variant="primary" onClick={handleAddPainting}>
                    Add New Painting
                </Button>
            </div>

            {paintings.length === 0 ? (
                <div className="paintings-manager__empty">
                    <h3>No Paintings Yet</h3>
                    <p>Start by adding your first painting to the gallery.</p>
                    <Button variant="primary" onClick={handleAddPainting}>
                        Add New Painting
                    </Button>
                </div>
            ) : (
                <Grid columns={3} gap="md" className="paintings-manager__grid">
                    {paintings.map((painting) => (
                        <div key={painting.id} className="paintings-manager__card">
                            <div className="paintings-manager__image">
                                <Image
                                    src={painting.image_url}
                                    alt={painting.title}
                                    aspectRatio="portrait"
                                    className="paintings-manager__thumbnail"
                                />
                            </div>

                            <div className="paintings-manager__info">
                                <h3 className="paintings-manager__title">{painting.title}</h3>
                                <p className="paintings-manager__year">{painting.year}</p>
                            </div>

                            <div className="paintings-manager__actions">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleEditPainting(painting)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleDeletePainting(painting)}
                                    className="paintings-manager__delete"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </Grid>
            )}

            {isFormOpen && (
                <PaintingForm
                    painting={editingPainting}
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    )
}

export default PaintingsManager
