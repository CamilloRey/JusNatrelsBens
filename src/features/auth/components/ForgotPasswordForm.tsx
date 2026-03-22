/**
 * Forgot Password Form Component
 * Request password reset email
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/lib/supabase-auth'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email) {
        setError('Veuillez entrer votre email')
        setLoading(false)
        return
      }

      if (!email.includes('@')) {
        setError('Veuillez entrer un email valide')
        setLoading(false)
        return
      }

      const result = await resetPassword(email)

      if (!result.success) {
        const errorMessage = result.error instanceof Error ? result.error.message : String(result.error)
        setError(errorMessage || 'Erreur lors de l\'envoi du lien')
        setLoading(false)
        return
      }

      setSuccess(true)
      setEmail('')
      onSuccess?.()
    } catch (err) {
      setError('Erreur inattendue. Veuillez réessayer.')
      console.error('Password reset error:', err)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé!</h1>
            <p className="text-gray-600">Vérifiez votre boîte mail pour le lien de réinitialisation</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-blue-900 font-semibold">ℹ️ Instructions:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Vérifiez votre email (vérifier aussi le dossier spam)</li>
              <li>Cliquez sur le lien de réinitialisation</li>
              <li>Entrez votre nouveau mot de passe</li>
              <li>Reconnectez-vous avec votre nouveau mot de passe</li>
            </ul>
          </div>

          <div className="space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Vous avez reçu l'email?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Retour à la connexion
              </Link>
            </p>
            <p className="text-gray-600">
              Email incorrect?{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Réessayer
              </button>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            ⏰ Le lien expire dans 24 heures
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié?</h1>
          <p className="text-gray-600">Nous allons vous envoyer un lien pour le réinitialiser</p>
        </div>

        {/* Error Message */}
        {error && <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@exemple.com"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-600 mt-2">
              Entrez l'email associé à votre compte
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Vous vous souvenez de votre mot de passe?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Retour à la connexion
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-2">💡 Comment ça fonctionne:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Entrez votre email</li>
            <li>Recevez un lien de réinitialisation</li>
            <li>Cliquez sur le lien</li>
            <li>Définissez un nouveau mot de passe</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
