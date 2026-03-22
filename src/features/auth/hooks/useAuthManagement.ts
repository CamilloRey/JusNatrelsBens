/**
 * Auth Management Hook
 * Complete authentication lifecycle management
 */

import { useState, useCallback, useEffect } from 'react'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import { signUp, signIn, signOut, updateUserProfile, getUserProfile } from '@/lib/supabase-auth'
import type { UserProfile } from '@/lib/supabase-auth'

export interface UseAuthManagementState {
  user: any
  profile: UserProfile | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
}

export interface UseAuthManagementActions {
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, fullName: string, phone?: string) => Promise<boolean>
  logout: () => Promise<boolean>
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>
  clearError: () => void
}

export function useAuthManagement(): UseAuthManagementState & UseAuthManagementActions {
  const { user, isAdmin, logout: contextLogout } = useSupabaseAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user profile on user change
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const userData = await getUserProfile(user.id)
          setProfile(userData)
        } catch (err) {
          console.error('Error loading profile:', err)
        }
      } else {
        setProfile(null)
      }
    }

    loadProfile()
  }, [user])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await signIn({ email, password })

        if (!result.success) {
          const errorMessage = result.error instanceof Error ? result.error.message : String(result.error)
          setError(errorMessage)
          return false
        }

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed'
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const signup = useCallback(
    async (email: string, password: string, fullName: string, phone?: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await signUp({ email, password, fullName, phone })

        if (!result.success) {
          const errorMessage = result.error instanceof Error ? result.error.message : String(result.error)
          setError(errorMessage)
          return false
        }

        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Signup failed'
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signOut()

      if (!result.success) {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Logout failed'
        setError(errorMessage)
        return false
      }

      await contextLogout()
      setProfile(null)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [contextLogout])

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<boolean> => {
      if (!user) {
        setError('No user logged in')
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await updateUserProfile(user.id, updates)

        if (!result.success) {
          const errorMessage = result.error instanceof Error ? result.error.message : 'Update failed'
          setError(errorMessage)
          return false
        }

        // Update local profile
        setProfile((prev) => (prev ? { ...prev, ...updates } : null))
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Update failed'
        setError(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [user]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    user,
    profile,
    isAdmin,
    isLoading,
    error,

    // Actions
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  }
}
