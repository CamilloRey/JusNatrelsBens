/**
 * Reset Password Form Component
 * User enters new password after clicking reset link
 */


import React, { useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { updatePassword } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'

interface ResetPasswordFormProps {
  onSuccess?: () => void
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  const [validatingToken, setValidatingToken] = useState(true)

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setIsValidToken(false)
          setError('Lien de réinitialisation invalide ou expiré. Veuillez demander un nouveau lien.')
        } else {
          setIsValidToken(true)
        }
      } catch (err) {
        setIsValidToken(false)
        setError('Erreur lors de la validation du lien. Veuillez réessayer.')
      } finally {
        setValidatingToken(false)
      }
    }

    validateToken()
  }, [])

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères'
    if (!/[A-Z]/.test(pwd)) return 'Le mot de passe doit contenir une lettre majuscule'
    if (!/[a-z]/.test(pwd)) return 'Le mot de passe doit contenir une lettre minuscule'
    if (!/[0-9]/.test(pwd)) return 'Le mot de passe doit contenir un chiffre'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validation
      if (!password || !confirmPassword) {
        setError('Tous les champs sont requis')
        setLoading(false)
        return
      }

      const passwordError = validatePassword(password)
      if (passwordError) {
        setError(passwordError)
        setLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        setLoading(false)
        return
      }

      const result = await updatePassword(password)

      if (!result.success) {
        const errorMessage = result.error instanceof Error ? result.error.message : String(result.error)
        setError(errorMessage || 'Erreur lors de la réinitialisation')
        setLoading(false)
        return
      }

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')
      onSuccess?.()

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/auth/login')
      }, 2000)
    } catch (err) {
      setError('Erreur inattendue. Veuillez réessayer.')
      console.error('Reset password error:', err)
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validation du lien...</p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lien invalide</h1>
            <p className="text-gray-600">
              Le lien de réinitialisation est invalide ou a expiré
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/auth/forgot-password"
              className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Demander un nouveau lien
            </Link>
            <Link
              to="/auth/login"
              className="block text-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Retour à la connexion
            </Link>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            ⏰ Les liens de réinitialisation expirent après 24 heures
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe réinitialisé!</h1>
            <p className="text-gray-600">Votre mot de passe a été mis à jour avec succès</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-green-900 font-semibold">✓ Vous pouvez maintenant:</p>
            <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
              <li>Vous connecter avec votre nouveau mot de passe</li>
              <li>Accéder à votre compte</li>
              <li>Gérer vos paramètres</li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-600">
            Redirection vers la connexion dans 2 secondes...
          </p>

          <Link
            to="/auth/login"
            className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Aller à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-600">Définissez un nouveau mot de passe sécurisé</p>
        </div>

        {/* Error Message */}
        {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Au moins 8 caractères, une majuscule, une minuscule et un chiffre
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
