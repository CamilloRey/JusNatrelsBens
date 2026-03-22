/**
 * Supabase Authentication Service
 * Complete auth management: login, signup, logout, session, etc.
 */

import { supabase } from '@/lib/supabase'
import type { AuthError, User, Session } from '@supabase/supabase-js'

export interface AuthResponse {
  success: boolean
  error?: AuthError | Error | string
  data?: any
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  phone?: string
  avatarUrl?: string
  role: 'customer' | 'admin' | 'moderator'
  createdAt: string
  updatedAt: string
}

/**
 * Sign up new user
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const { email, password, fullName, phone } = data

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    })

    if (authError) {
      return { success: false, error: authError }
    }

    if (!authData.user) {
      return { success: false, error: 'No user returned from signup' }
    }

    // Create customer profile
    const { error: profileError } = await supabase.from('customers').insert({
      user_id: authData.user.id,
      email: authData.user.email,
      full_name: fullName,
      phone,
    })

    if (profileError) {
      console.error('Error creating customer profile:', profileError)
      // Don't fail signup if profile creation fails
    }

    // Create user role (default: customer)
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'customer',
    })

    if (roleError) {
      console.error('Error creating user role:', roleError)
    }

    return {
      success: true,
      data: authData.user,
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Sign in user
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    const { email, password } = data

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error }
    }

    return {
      success: true,
      data: authData,
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Get current session
 */
export async function getSession(): Promise<Session | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Refresh session
 */
export async function refreshSession(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      return { success: false, error }
    }

    return {
      success: true,
      data: data.session,
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
    })

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Update password with token
 */
export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { success: false, error }
    }

    return {
      success: true,
      data: data.user,
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Update user metadata
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<AuthResponse> {
  try {
    // Update auth user metadata
    if (updates.fullName || updates.phone) {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          phone: updates.phone,
        },
      })

      if (authError) {
        return { success: false, error: authError }
      }
    }

    // Update customer profile
    const { error: profileError } = await supabase
      .from('customers')
      .update({
        full_name: updates.fullName,
        phone: updates.phone,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (profileError) {
      return { success: false, error: profileError }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (customerError) {
      console.error('Error fetching customer:', customerError)
      return null
    }

    const { data: role, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (roleError) {
      console.error('Error fetching role:', roleError)
    }

    return {
      id: customer.user_id,
      email: customer.email,
      fullName: customer.full_name,
      phone: customer.phone,
      avatarUrl: customer.avatar_url,
      role: role?.role || 'customer',
      createdAt: customer.created_at,
      updatedAt: customer.updated_at,
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return false
    }

    return data.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    const user = session?.user || null
    callback(user, session)
  })

  return () => subscription?.unsubscribe()
}

/**
 * Verify token
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    return !!user
  } catch (error) {
    return false
  }
}
