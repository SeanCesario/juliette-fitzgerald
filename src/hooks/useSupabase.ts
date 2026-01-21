import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import type { ApiResponse, LoadingState } from '../types'

/**
 * Generic hook for Supabase operations
 */
export function useSupabase() {
    const [state, setState] = useState<LoadingState>({
        isLoading: false,
        error: null,
    })

    const setLoading = (loading: boolean) => {
        setState((prev: LoadingState) => ({ ...prev, isLoading: loading }))
    }

    const setError = (error: string | null) => {
        setState((prev: LoadingState) => ({ ...prev, error }))
    }

    const execute = async <R>(
        operation: () => Promise<ApiResponse<R>>
    ): Promise<ApiResponse<R> | null> => {
        setLoading(true)
        setError(null)

        try {
            const result = await operation()

            if (!result.success && result.errors) {
                setError(result.errors.join(', '))
                return null
            }

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
            setError(errorMessage)
            return null
        } finally {
            setLoading(false)
        }
    }

    return {
        ...state,
        execute,
        setLoading,
        setError,
    }
}

/**
 * Hook for fetching data from Supabase
 */
export function useSupabaseQuery<T>(
    query: () => Promise<T>,
    dependencies: any[] = []
) {
    const [data, setData] = useState<T | null>(null)
    const [state, setState] = useState<LoadingState>({
        isLoading: true,
        error: null,
    })

    const fetchData = async () => {
        setState({ isLoading: true, error: null })

        try {
            const result = await query()
            setData(result)
            setState({ isLoading: false, error: null })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
            setState({ isLoading: false, error: errorMessage })
        }
    }

    useEffect(() => {
        fetchData()
    }, dependencies)

    const refetch = () => {
        fetchData()
    }

    return {
        data,
        ...state,
        refetch,
    }
}

/**
 * Hook for real-time subscriptions
 */
export function useSupabaseSubscription<T>(
    table: string,
    filter?: string,
    callback?: (payload: T) => void
) {
    const [data, setData] = useState<T[]>([])

    useEffect(() => {
        const subscription = supabase
            .channel(`${table}-changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table,
                    filter,
                },
                (payload) => {
                    if (callback) {
                        callback(payload.new as T)
                    }
                    // Update local data with the change
                    if (payload.eventType === 'INSERT') {
                        setData(prev => [...prev, payload.new as T])
                    } else if (payload.eventType === 'UPDATE') {
                        setData(prev => prev.map(item =>
                            (item as any).id === payload.new.id ? payload.new as T : item
                        ))
                    } else if (payload.eventType === 'DELETE') {
                        setData(prev => prev.filter(item => (item as any).id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [table, filter, callback])

    return { data }
}

/**
 * Hook for file uploads
 */
export function useSupabaseUpload() {
    const [state, setState] = useState<LoadingState>({
        isLoading: false,
        error: null,
    })

    const uploadFile = async (
        bucket: string,
        path: string,
        file: File,
        options?: {
            cacheControl?: string
            upsert?: boolean
        }
    ): Promise<{ data: { path: string } | null; error: string | null }> => {
        setState({ isLoading: true, error: null })

        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, file, options)

            if (error) {
                setState({ isLoading: false, error: error.message })
                return { data: null, error: error.message }
            }

            setState({ isLoading: false, error: null })
            return { data, error: null }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed'
            setState({ isLoading: false, error: errorMessage })
            return { data: null, error: errorMessage }
        }
    }

    const deleteFile = async (
        bucket: string,
        paths: string[]
    ): Promise<{ error: string | null }> => {
        setState({ isLoading: true, error: null })

        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove(paths)

            if (error) {
                setState({ isLoading: false, error: error.message })
                return { error: error.message }
            }

            setState({ isLoading: false, error: null })
            return { error: null }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Delete failed'
            setState({ isLoading: false, error: errorMessage })
            return { error: errorMessage }
        }
    }

    const getPublicUrl = (bucket: string, path: string): string => {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return data.publicUrl
    }

    return {
        ...state,
        uploadFile,
        deleteFile,
        getPublicUrl,
    }
}
