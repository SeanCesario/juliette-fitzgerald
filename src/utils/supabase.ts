import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client without database types for now
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
})

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
}

// Helper function to get current user
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Helper function to sign out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error('Error signing out:', error.message)
        throw error
    }
}

// Table references for type safety
export const TABLES = {
    PAINTINGS: 'paintings' as const,
    ABOUT: 'about' as const,
    SOCIAL_LINKS: 'social_links' as const,
} as const

// Type-safe query builders
export const fromPaintings = () => supabase.from(TABLES.PAINTINGS)
export const fromAbout = () => supabase.from(TABLES.ABOUT)
export const fromSocialLinks = () => supabase.from(TABLES.SOCIAL_LINKS)
