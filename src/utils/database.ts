import { fromPaintings, fromAbout, fromSocialLinks } from './supabase'
import type {
    PaintingInsert,
    PaintingUpdate,
    AboutUpdate,
    SocialLinkInsert,
    SocialLinkUpdate,
    PaintingFilters
} from '../types/database'

// Paintings operations
export const getPaintings = async (filters?: PaintingFilters) => {
    let query = fromPaintings().select('*')

    if (filters?.year) {
        query = query.eq('year', filters.year)
    }

    if (filters?.title) {
        query = query.ilike('title', `%${filters.title}%`)
    }

    if (filters?.orderBy) {
        query = query.order(filters.orderBy, { ascending: filters.orderDirection === 'asc' })
    }

    if (filters?.limit) {
        query = query.limit(filters.limit)
    }

    if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query
    return { data: data || [], error }
}

export const getPaintingById = async (id: string) => {
    const { data, error } = await fromPaintings()
        .select('*')
        .eq('id', id)
        .single()

    return { data, error }
}

export const createPainting = async (painting: PaintingInsert) => {
    const { data, error } = await fromPaintings()
        .insert(painting)
        .select()
        .single()

    return { data, error }
}

export const updatePainting = async (id: string, updates: PaintingUpdate) => {
    const { data, error } = await fromPaintings()
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    return { data, error }
}

export const deletePainting = async (id: string) => {
    const { error } = await fromPaintings()
        .delete()
        .eq('id', id)

    return { error }
}

// About operations
export const getAbout = async () => {
    const { data, error } = await fromAbout()
        .select('*')
        .single()

    return { data, error }
}

export const updateAbout = async (id: string, updates: AboutUpdate) => {
    const { data, error } = await fromAbout()
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    return { data, error }
}

// Social links operations
export const getSocialLinks = async () => {
    const { data, error } = await fromSocialLinks()
        .select('*')
        .order('display_order', { ascending: true })

    return { data: data || [], error }
}

export const createSocialLink = async (link: SocialLinkInsert) => {
    const { data, error } = await fromSocialLinks()
        .insert(link)
        .select()
        .single()

    return { data, error }
}

export const updateSocialLink = async (id: string, updates: SocialLinkUpdate) => {
    const { data, error } = await fromSocialLinks()
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    return { data, error }
}

export const deleteSocialLink = async (id: string) => {
    const { error } = await fromSocialLinks()
        .delete()
        .eq('id', id)

    return { error }
}

// Utility functions
export const handleDatabaseError = (error: any) => {
    console.error('Database error:', error)
    return {
        message: error?.message || 'An unexpected error occurred',
        details: error?.details,
        code: error?.code
    }
}
