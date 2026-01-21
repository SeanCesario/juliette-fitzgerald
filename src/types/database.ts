// Simplified database types for Supabase compatibility
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// Base entity with timestamps
export interface BaseEntity {
    id: string
    created_at: string
    updated_at: string
}

// Painting table types
export interface Painting extends BaseEntity {
    title: string
    description: string | null
    year: number
    image_url: string
    display_order: number | null
}

export interface PaintingInsert {
    id?: string
    title: string
    description?: string | null
    year: number
    image_url: string
    display_order?: number | null
    created_at?: string
    updated_at?: string
}

export interface PaintingUpdate {
    title?: string
    description?: string | null
    year?: number
    image_url?: string
    display_order?: number | null
    updated_at?: string
}

// About table types
export interface About extends BaseEntity {
    text: string
    image_url: string
}

export interface AboutInsert {
    id?: string
    text: string
    image_url: string
    created_at?: string
    updated_at?: string
}

export interface AboutUpdate {
    text?: string
    image_url?: string
    updated_at?: string
}

// Social links table types
export interface SocialLink extends BaseEntity {
    platform: string
    url: string
    display_order: number
}

export interface SocialLinkInsert {
    id?: string
    platform: string
    url: string
    display_order?: number
    created_at?: string
    updated_at?: string
}

export interface SocialLinkUpdate {
    platform?: string
    url?: string
    display_order?: number
    updated_at?: string
}

// Helper types for common operations
export type PaintingOrderBy = 'created_at' | 'updated_at' | 'title' | 'year' | 'display_order'
export type PaintingOrderDirection = 'asc' | 'desc'

export type SocialPlatform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'website' | 'email' | 'other'

// Supabase query helpers
export type PaintingWithRelations = Painting
export type AboutWithRelations = About
export type SocialLinkWithRelations = SocialLink

// Database error types
export interface DatabaseError {
    message: string
    details?: string
    hint?: string
    code?: string
}

// Utility types for filtering
export interface PaintingFilters {
    year?: number
    title?: string
    limit?: number
    offset?: number
    orderBy?: PaintingOrderBy
    orderDirection?: PaintingOrderDirection
}

// Database interface for Supabase client (simplified)
export interface Database {
    public: {
        paintings: {
            Row: Painting
            Insert: PaintingInsert
            Update: PaintingUpdate
        }
        about: {
            Row: About
            Insert: AboutInsert
            Update: AboutUpdate
        }
        social_links: {
            Row: SocialLink
            Insert: SocialLinkInsert
            Update: SocialLinkUpdate
        }
    }
}
