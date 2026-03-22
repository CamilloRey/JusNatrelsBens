import type { User, Session } from '@supabase/supabase-js'

/**
 * Legacy Settings Type
 * @deprecated Use Supabase tables instead
 */
export interface Settings {
  businessName: string;
  email:        string;
  phone:        string;
  address:      string;
  description:  string;
  facebook:     string;
  instagram:    string;
  tiktok:       string;
  website:      string;
  password:     string;
  heroTitle:    string;
  heroSubtitle: string;
  currency:     string;
  taxRate:      number;
  deliveryNote: string;
  bannerHero?:     string;
  bannerAbout?:    string;
  bannerContact?:  string;
  bannerProducts?: string;
  bannerEvents?:   string;
}

/**
 * Legacy Auth State
 * @deprecated Use SupabaseAuthContext instead
 */
export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string, adminPassword: string) => boolean;
  logout: () => void;
}

/**
 * Supabase Auth Context Type
 */
export interface SupabaseAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ error?: any }>
  signup: (email: string, password: string, fullName: string) => Promise<{ error?: any }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: any }>
}

/**
 * User Role Type
 */
export type UserRole = 'customer' | 'admin' | 'moderator'

/**
 * User Profile Type
 */
export interface UserProfileType {
  id: string
  email: string
  fullName?: string
  phone?: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
