import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home/Home'
import AboutPage from './pages/About/About'
import Login from './pages/Login'
import Admin from './pages/Admin/Admin'
import './App.scss'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Layout><Admin /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
