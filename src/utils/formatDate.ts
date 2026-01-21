import { format, parseISO, isValid } from 'date-fns'

/**
 * Format a date string or Date object to a readable format
 */
export function formatDate(
    date: string | Date,
    formatString: string = 'MMMM d, yyyy'
): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date
        if (!isValid(dateObj)) {
            return 'Invalid date'
        }
        return format(dateObj, formatString)
    } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid date'
    }
}

/**
 * Format a date to a short format (e.g., "Jan 1, 2023")
 */
export function formatShortDate(date: string | Date): string {
    return formatDate(date, 'MMM d, yyyy')
}

/**
 * Format a date to a long format (e.g., "January 1, 2023")
 */
export function formatLongDate(date: string | Date): string {
    return formatDate(date, 'MMMM d, yyyy')
}

/**
 * Format a date to include time (e.g., "January 1, 2023 at 2:30 PM")
 */
export function formatDateTime(date: string | Date): string {
    return formatDate(date, 'MMMM d, yyyy \'at\' h:mm a')
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 */
export function formatISODate(date: string | Date): string {
    return formatDate(date, 'yyyy-MM-dd')
}

/**
 * Format a year from a date string or Date object
 */
export function formatYear(date: string | Date): string {
    return formatDate(date, 'yyyy')
}

/**
 * Format a date range (e.g., "January 1 - March 31, 2023")
 */
export function formatDateRange(
    startDate: string | Date,
    endDate: string | Date | null,
    formatString: string = 'MMMM d'
): string {
    try {
        const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
        const end = endDate ? (typeof endDate === 'string' ? parseISO(endDate) : endDate) : null

        if (!isValid(start)) {
            return 'Invalid date range'
        }

        const startFormatted = format(start, formatString)

        if (!end || !isValid(end)) {
            return `${startFormatted}, ${format(start, 'yyyy')}`
        }

        const endFormatted = format(end, formatString)
        const startYear = format(start, 'yyyy')
        const endYear = format(end, 'yyyy')

        if (startYear === endYear) {
            return `${startFormatted} - ${endFormatted}, ${startYear}`
        } else {
            return `${startFormatted}, ${startYear} - ${endFormatted}, ${endYear}`
        }
    } catch (error) {
        console.error('Error formatting date range:', error)
        return 'Invalid date range'
    }
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 months")
 */
export function getRelativeTime(date: string | Date): string {
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date
        const now = new Date()
        const diffInMs = dateObj.getTime() - now.getTime()
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInDays === 0) return 'Today'
        if (diffInDays === 1) return 'Tomorrow'
        if (diffInDays === -1) return 'Yesterday'
        if (diffInDays > 0 && diffInDays <= 7) return `In ${diffInDays} days`
        if (diffInDays < 0 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`

        return formatDate(date)
    } catch (error) {
        console.error('Error getting relative time:', error)
        return formatDate(date)
    }
}
