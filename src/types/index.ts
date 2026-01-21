// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Painting interface for artwork
export interface Painting extends BaseEntity {
  title: string;
  description: string | null;
  year: number;
  medium: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  price: number | null;
  status: 'available' | 'sold' | 'not_for_sale';
  images: PaintingImage[];
  categories: string[];
  featured: boolean;
  order: number;
}

// Painting image interface
export interface PaintingImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

// About section interface
export interface About extends BaseEntity {
  bio: string;
  artist_statement: string | null;
  cv_url: string | null;
  profile_image_url: string | null;
  contact_email: string;
  phone: string | null;
  location: string;
  years_active: number;
  education: Education[];
  exhibitions: Exhibition[];
  awards: Award[];
}

// Education interface
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year: number | null;
  current: boolean;
}

// Exhibition interface
export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_date: string;
  end_date: string | null;
  solo_show: boolean;
}

// Award interface
export interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  description: string | null;
}

// Social link interface
export interface SocialLink extends BaseEntity {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'website' | 'email' | 'other';
  url: string;
  display_name: string;
  icon: string | null;
  order: number;
  active: boolean;
}

// Navigation menu interface
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  external: boolean;
  order: number;
  active: boolean;
}

// Gallery settings interface
export interface GallerySettings {
  id: string;
  site_title: string;
  site_description: string;
  meta_keywords: string[];
  theme_colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout_options: {
    gallery_columns: number;
    image_aspect_ratio: string;
    show_prices: boolean;
    show_dimensions: boolean;
    enable_lightbox: boolean;
  };
  contact_settings: {
    email: string;
    phone: string | null;
    address: string | null;
    social_links: SocialLink[];
  };
  seo_settings: {
    og_image: string | null;
    favicon: string | null;
    google_analytics_id: string | null;
  };
}

// Form interfaces
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// API response interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Filter and sort interfaces
export interface PaintingFilters {
  category?: string;
  year?: number;
  medium?: string;
  status?: Painting['status'];
  price_range?: {
    min: number;
    max: number;
  };
  featured?: boolean;
}

export interface PaintingSort {
  field: 'title' | 'year' | 'price' | 'created_at' | 'order';
  direction: 'asc' | 'desc';
}

// Lightbox interface
export interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

// Error interfaces
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Component props interfaces
export interface GalleryProps {
  paintings: Painting[];
  loading?: boolean;
  error?: string | null;
  onPaintingClick?: (painting: Painting) => void;
  filters?: PaintingFilters;
  sort?: PaintingSort;
}

export interface PaintingCardProps {
  painting: Painting;
  onClick?: (painting: Painting) => void;
  showPrice?: boolean;
  showDimensions?: boolean;
  lazy?: boolean;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<ContactFormResponse>;
  loading?: boolean;
  className?: string;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
