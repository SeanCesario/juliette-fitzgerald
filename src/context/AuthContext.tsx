import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../utils/supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setUser(session?.user ?? null)
            } catch (error) {
                console.error('Error getting initial session:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                return { error: error.message }
            }

            return { error: null }
        } catch (error) {
            return { error: 'An unexpected error occurred during sign in' }
        } finally {
            setLoading(false)
        }
    }

    const signOut = async (): Promise<void> => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error signing out:', error)
            }
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            setLoading(false)
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
