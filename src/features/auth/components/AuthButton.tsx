/**
 * Auth Button Component
 * Shows user profile or login button depending on auth state
 */

'use client'

import React, { useState } from 'react'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import Link from 'next/link'

export const AuthButton: React.FC<{
  className?: string
  showProfile?: boolean
}> = ({ className = '', showProfile = true }) => {
  const { user, isAdmin, logout, loading } = useSupabaseAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return <div className={`h-10 w-20 bg-gray-200 rounded animate-pulse ${className}`} />
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors ${className}`}
      >
        Se connecter
      </Link>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:flex flex-col items-start text-sm">
          <span className="font-semibold text-gray-900">{user.email?.split('@')[0]}</span>
          {isAdmin && <span className="text-xs text-blue-600 font-medium">Admin</span>}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {showProfile && (
            <>
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-600">{user.user_metadata?.full_name || 'Utilisateur'}</p>
              </div>

              <Link
                href="/account/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                👤 Profil
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  ⚙️ Admin
                </Link>
              )}
            </>
          )}

          <button
            onClick={async () => {
              await logout()
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200 font-medium"
          >
            🚪 Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}
