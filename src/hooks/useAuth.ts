import { useAuth as useAuthContext } from '../context/AuthContext'
import type { AuthContextType } from '../context/AuthContext'

// Re-export the useAuth hook from context for easier access
export const useAuth = (): AuthContextType => {
    return useAuthContext()
}
