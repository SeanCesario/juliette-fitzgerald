import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui'
import PaintingsManager from '../../components/admin/PaintingsManager/PaintingsManager'
import AboutManager from '../../components/admin/AboutManager/AboutManager'
import SocialLinksManager from '../../components/admin/SocialLinksManager/SocialLinksManager'
import './Admin.scss'

type AdminTab = 'paintings' | 'about' | 'social-links'

const Admin: React.FC = () => {
    const { user, signOut } = useAuth()
    const [activeTab, setActiveTab] = useState<AdminTab>('paintings')

    const handleSignOut = async () => {
        await signOut()
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'paintings':
                return <PaintingsManager />
            case 'about':
                return <AboutManager />
            case 'social-links':
                return <SocialLinksManager />
            default:
                return null
        }
    }

    return (
        <div className="admin">
            <div className="container">
                <header className="admin__header">
                    <div className="admin__header-left">
                        <h1>Admin Panel</h1>
                        <p>Welcome back, {user?.email}</p>
                    </div>
                    <Button variant="secondary" onClick={handleSignOut}>
                        Sign Out
                    </Button>
                </header>

                <nav className="admin__tabs">
                    <button
                        className={`admin__tab ${activeTab === 'paintings' ? 'admin__tab--active' : ''}`}
                        onClick={() => setActiveTab('paintings')}
                    >
                        Paintings
                    </button>
                    <button
                        className={`admin__tab ${activeTab === 'about' ? 'admin__tab--active' : ''}`}
                        onClick={() => setActiveTab('about')}
                    >
                        About Page
                    </button>
                    <button
                        className={`admin__tab ${activeTab === 'social-links' ? 'admin__tab--active' : ''}`}
                        onClick={() => setActiveTab('social-links')}
                    >
                        Social Links
                    </button>
                </nav>

                <main className="admin__content">
                    {renderTabContent()}
                </main>
            </div>
        </div>
    )
}

export default Admin
