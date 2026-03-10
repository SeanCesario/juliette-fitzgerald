import { Link, useLocation } from 'react-router-dom'
import './Header.scss'

interface HeaderProps {
    artistName?: string
}

const Header: React.FC<HeaderProps> = ({ artistName = 'Juliette Fitzgerald' }) => {
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    const getNonCurrentPageLinks = () => {
        const links = [
            { to: '/', label: 'Gallery' },
            { to: '/about', label: 'About' }
        ]
        return links.filter(link => !isActive(link.to))
    }

    const nonCurrentPageLinks = getNonCurrentPageLinks()

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
                            Gallery
                        </Link>
                        <Link
                            to="/about"
                            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        >
                            About
                        </Link>
                    </nav>

                    {/* Mobile Navigation - Show only non-current page links */}
                    <nav className="mobile-nav">
                        {nonCurrentPageLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="nav-link"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
