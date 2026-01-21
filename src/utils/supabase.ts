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

// Helper function to get user display name
export const getUserDisplayName = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.user_metadata?.display_name) {
        return user.user_metadata.display_name
    }
    return user?.email || 'Guest'
}

// Helper function to get website name
export const getWebsiteName = () => {
    return 'Juliette Fitzgerald'
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
