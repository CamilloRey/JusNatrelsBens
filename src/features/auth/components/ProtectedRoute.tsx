/**
 * Protected Route Component
 * Ensures only authenticated users can access protected pages
 */

'use client'

import React from 'react'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  fallback,
}) => {
  const { user, isAdmin, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Accès refusé</h1>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )
    )
  }

  if (requireAdmin && !isAdmin) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Accès administrateur requis</h1>
            <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
