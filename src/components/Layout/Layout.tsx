import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { getWebsiteName } from '../../utils/supabase'
import './Layout.scss'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const websiteName = getWebsiteName()

    return (
        <div className="layout">
            <Header artistName={websiteName} />
            <main className="main-content">
                {children}
            </main>
            <Footer websiteName={websiteName} />
        </div>
    )
}

export default Layout
