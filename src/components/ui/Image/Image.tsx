import React, { useState } from 'react'
import Spinner from '../Spinner/Spinner'
import './Image.scss'

export interface ImageProps {
    src: string
    alt: string
    aspectRatio?: 'square' | 'portrait' | 'landscape' | 'custom'
    customAspectRatio?: number
    className?: string
    lazy?: boolean
    objectFit?: 'cover' | 'contain'
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    aspectRatio = 'portrait',
    customAspectRatio,
    className = '',
    lazy = true,
    objectFit = 'cover'
}) => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    const handleLoad = () => {
        setLoaded(true)
    }

    const handleError = () => {
        setError(true)
    }

    const getAspectRatioClass = () => {
        if (aspectRatio === 'custom' && customAspectRatio) {
            return `image--aspect-${customAspectRatio.toString().replace('.', '-')}`
        }
        return `image--aspect-${aspectRatio}`
    }

    const baseClasses = 'image'
    const aspectClasses = getAspectRatioClass()
    const objectFitClasses = `image--fit-${objectFit}`

    const classes = [
        baseClasses,
        aspectClasses,
        objectFitClasses,
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={classes}>
            {!loaded && !error && (
                <div className="image__placeholder">
                    <Spinner />
                </div>
            )}

            {error ? (
                <div className="image__error">
                    <span>Image not available</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`image__img ${loaded ? 'image__img--loaded' : ''}`}
                    loading={lazy ? 'lazy' : 'eager'}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    )
}

export default Image
