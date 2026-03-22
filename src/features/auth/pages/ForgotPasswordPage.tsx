/**
 * Forgot Password Page
 * User requests password reset
 */

'use client'

import React from 'react'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ForgotPasswordForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Les Jus Naturels Ben's © 2024</p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              Retour au site
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
