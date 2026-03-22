# 🚀 Quick Start - Authentication Setup

Complete setup guide for Supabase authentication system.

## Step 1: Configure Supabase Auth ✅

### In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Check **Email** is enabled (default)
3. Go to **Email Templates**
4. Configure email templates for:
   - Confirm signup email
   - Reset password email
   - Change email address

### Email Configuration:
- Go to **Authentication** → **Email**
- Set "From" address (e.g., noreply@jusnaturelsbens.com)
- Set redirect URLs in **Authentication** → **URL Configuration**

Example redirect URLs:
```
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

## Step 2: Run Database Migration ✅

```bash
supabase db push
```

This creates:
- `user_roles` table
- `customers` table (customer profiles)
- RLS policies

## Step 3: Verify Supabase Connection ✅

Test that your app can connect to Supabase:

```tsx
// test-supabase.ts
import { supabase } from '@/lib/supabase'

export async function testConnection() {
  const { data, error } = await supabase.auth.getSession()
  console.log('Connection test:', data ? 'Success ✅' : 'Failed ❌')
  if (error) console.error(error)
}
```

## Step 4: Add Auth Provider to App ✅

### In your root layout:

```tsx
// app/layout.tsx (or app.tsx)
import { SupabaseAuthProvider } from '@/features/auth/context/SupabaseAuthContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
```

## Step 5: Create Auth Pages ✅

### Login Page:
```tsx
// app/auth/login/page.tsx
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoginForm redirectTo="/account" />
    </div>
  )
}
```

### Signup Page:
```tsx
// app/auth/signup/page.tsx
import { SignupForm } from '@/features/auth/components/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignupForm redirectTo="/auth/verify-email" />
    </div>
  )
}
```

## Step 6: Add Auth Button to Header ✅

```tsx
// components/Header.tsx
'use client'

import { AuthButton } from '@/features/auth/components/AuthButton'

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>Les Jus Naturels Ben's</h1>
      <AuthButton showProfile={true} />
    </header>
  )
}
```

## Step 7: Create Protected Pages ✅

### Account/Profile Page:
```tsx
// app/account/page.tsx
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Mon Compte</h1>
        {/* Profile content */}
      </div>
    </ProtectedRoute>
  )
}
```

### Admin Dashboard:
```tsx
// app/admin/page.tsx
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>Admin Dashboard</div>
    </ProtectedRoute>
  )
}
```

## Step 8: Setup Admin User ✅

After creating your admin account:

```sql
-- Run in Supabase SQL Editor
INSERT INTO user_roles (user_id, role)
VALUES ('<YOUR_USER_ID>', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

To find your user ID:
```sql
SELECT id, email FROM auth.users WHERE email = 'your@email.com';
```

## Step 9: Test Authentication ✅

### Test Signup:
1. Go to `/auth/signup`
2. Create a new account with:
   - Email: test@example.com
   - Password: TestPassword123
   - Full Name: Test User
3. Check Supabase Auth → Users
4. Verify email confirmation

### Test Login:
1. Go to `/auth/login`
2. Enter credentials
3. Should redirect to `/account`
4. Auth button should show your profile

### Test Admin:
1. Make user admin in database
2. Go to `/admin`
3. Should display admin page
4. Non-admin should see access denied

### Test Logout:
1. Click Auth button → Déconnexion
2. Should redirect to home
3. Auth button should show "Se connecter"

## Step 10: Configure Email Templates ✅

In Supabase Dashboard → Authentication → Email Templates:

### Confirm Email Template
- Subject: "Confirmer votre email"
- Include: {{ .ConfirmationURL }}

### Reset Password Template
- Subject: "Réinitialiser votre mot de passe"
- Include: {{ .RecoveryURL }}

### Magic Link Email
- Subject: "Votre lien de connexion sécurisé"
- Include: {{ .SignInLink }}

## Step 11: Setup Password Reset ✅

Create reset password page:

```tsx
// app/auth/reset-password/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { updatePassword } from '@/lib/supabase-auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await updatePassword(password)
      if (result.success) {
        router.push('/auth/login')
      } else {
        setError('Erreur lors de la réinitialisation')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          className="w-full px-4 py-2 border rounded"
        />
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Mise à jour...' : 'Réinitialiser'}
        </button>
      </form>
    </div>
  )
}
```

## Step 12: Configure Email Verification ✅

### Require Email Verification:
In Supabase Dashboard:
1. Go to Authentication → Policies
2. Set "Require email verification"
3. Set "Email confirmation validity" (e.g., 24 hours)

### Create Verify Email Page:
```tsx
// app/auth/verify-email/page.tsx
export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Vérifier votre email</h1>
      <p className="text-gray-600 mb-4">
        Un email de confirmation a été envoyé.
        Cliquez sur le lien pour confirmer votre email.
      </p>
      <a href="/auth/login" className="text-blue-600 hover:text-blue-700">
        Retour à la connexion
      </a>
    </div>
  )
}
```

## Summary

✅ Supabase Auth configured
✅ Database tables created
✅ Login/Signup pages ready
✅ Auth button in header
✅ Protected routes working
✅ Admin access configured
✅ Password reset ready
✅ Email verification setup

🎉 **Authentication System Ready!**

## Troubleshooting

### Email not sending?
- Check Supabase email config
- Verify SMTP settings
- Check email templates
- Look for errors in logs

### Users can't login?
- Verify email is confirmed
- Check credentials are correct
- Look at Supabase auth logs
- Ensure RLS policies are correct

### Admin not working?
- Check user_roles table
- Verify role = 'admin'
- Look for RLS policy errors
- Check user_id matches

For full documentation, see: [AUTHENTICATION.md](./docs/AUTHENTICATION.md)
