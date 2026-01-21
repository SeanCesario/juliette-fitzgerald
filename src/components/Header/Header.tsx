import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.scss'

interface HeaderProps {
    artistName?: string
}

const Header: React.FC<HeaderProps> = ({ artistName = 'Juliette Fitzgerald' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo/Artist Name */}
                    <Link to="/" className="logo">
                        <h1>{artistName}</h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <Link
                            to="/"
                            className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        >
                            About
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header
