// Application constants
export const APP_NAME = 'Juliette Fitzgerald - Artist Portfolio'
export const APP_DESCRIPTION = 'Artist portfolio featuring paintings and artwork by Juliette Fitzgerald'

// API endpoints
export const API_ENDPOINTS = {
    PAINTINGS: '/paintings',
    ABOUT: '/about',
    CONTACT: '/contact',
    SOCIAL_LINKS: '/social-links',
} as const

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 50

// Image sizes and formats
export const IMAGE_SIZES = {
    THUMBNAIL: { width: 300, height: 300 },
    MEDIUM: { width: 800, height: 600 },
    LARGE: { width: 1200, height: 900 },
} as const

export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp'] as const

// Form validation
export const VALIDATION_RULES = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 254,
    SUBJECT_MIN_LENGTH: 3,
    SUBJECT_MAX_LENGTH: 200,
    MESSAGE_MIN_LENGTH: 10,
    MESSAGE_MAX_LENGTH: 2000,
} as const

// Social media platforms
export const SOCIAL_PLATFORMS = {
    INSTAGRAM: 'instagram',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    LINKEDIN: 'linkedin',
    WEBSITE: 'website',
    EMAIL: 'email',
    OTHER: 'other',
} as const

// Painting statuses
export const PAINTING_STATUSES = {
    AVAILABLE: 'available',
    SOLD: 'sold',
    NOT_FOR_SALE: 'not_for_sale',
} as const

// Painting categories
export const PAINTING_CATEGORIES = [
    'oil',
    'acrylic',
    'watercolor',
    'mixed-media',
    'drawing',
    'print',
    'sculpture',
    'photography',
] as const

// Mediums
export const MEDIUMS = [
    'Oil on Canvas',
    'Acrylic on Canvas',
    'Watercolor on Paper',
    'Mixed Media',
    'Charcoal on Paper',
    'Ink on Paper',
    'Oil on Board',
    'Digital Art',
] as const

// Units for dimensions
export const DIMENSION_UNITS = {
    CM: 'cm',
    IN: 'in',
} as const

// Sort options
export const SORT_OPTIONS = {
    TITLE_ASC: 'title_asc',
    TITLE_DESC: 'title_desc',
    YEAR_ASC: 'year_asc',
    YEAR_DESC: 'year_desc',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    CREATED_ASC: 'created_asc',
    CREATED_DESC: 'created_desc',
    ORDER_ASC: 'order_asc',
    ORDER_DESC: 'order_desc',
} as const

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    UPLOAD_ERROR: 'Failed to upload image. Please try again.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid image file.',
    FILE_TOO_LARGE: 'File size too large. Please upload a smaller file.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
    CONTACT_FORM_SENT: 'Your message has been sent successfully. We will get back to you soon.',
    PAINTING_UPDATED: 'Painting updated successfully.',
    PAINTING_CREATED: 'Painting created successfully.',
    PAINTING_DELETED: 'Painting deleted successfully.',
    IMAGE_UPLOADED: 'Image uploaded successfully.',
} as const
