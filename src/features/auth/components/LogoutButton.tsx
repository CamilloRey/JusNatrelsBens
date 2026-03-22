/**
 * Logout Button Component
 * Simple button to sign out user
 */


import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../context/SupabaseAuthContext'

interface LogoutButtonProps {
  className?: string
  label?: string
  redirectTo?: string
  showConfirm?: boolean
  onLogout?: () => void
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors',
  label = 'Déconnexion',
  redirectTo = '/',
  showConfirm = false,
  onLogout,
}) => {
  const navigate = useNavigate()
  const { logout, loading } = useSupabaseAuth()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      onLogout?.()

      setTimeout(() => {
        navigate(redirectTo)
      }, 500)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (showConfirm && isConfirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut || loading}
          className={`${className} disabled:opacity-50`}
        >
          {isLoggingOut || loading ? 'Déconnexion...' : 'Oui, déconnecter'}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isLoggingOut || loading}
          className={className.replace('red', 'gray').replace('hover:bg-red', 'hover:bg-gray')}
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        if (showConfirm) {
          setIsConfirming(true)
        } else {
          handleLogout()
        }
      }}
      disabled={isLoggingOut || loading}
      className={`${className} disabled:opacity-50`}
    >
      {isLoggingOut || loading ? 'Déconnexion...' : label}
    </button>
  )
}
