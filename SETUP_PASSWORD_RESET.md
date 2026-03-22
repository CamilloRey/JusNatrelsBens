# 🔑 Setup - Mot de Passe Oublié

Complete setup guide for password reset flow.

## Quick Start (5 Steps)

### 1️⃣ Create Routes

Create these Next.js pages:

```tsx
// app/auth/forgot-password/page.tsx
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
export default ForgotPasswordPage

// app/auth/reset-password/page.tsx
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
export default ResetPasswordPage
```

### 2️⃣ Add Link in Login Form

```tsx
// In LoginForm component
import Link from 'next/link'

<Link href="/auth/forgot-password" className="text-sm text-blue-600">
  Mot de passe oublié?
</Link>
```

### 3️⃣ Configure Email Template

In Supabase Dashboard → Authentication → Email Templates:

#### Template: Reset Password

**Subject:**
```
Réinitialiser votre mot de passe
```

**Body:**
```html
<h2>Réinitialiser votre mot de passe</h2>

<p>Vous avez demandé une réinitialisation de mot de passe.</p>

<p>Cliquez sur le lien ci-dessous pour réinitialiser:</p>

<p>
  <a href="{{ .RecoveryURL }}" style="background-color: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Réinitialiser mon mot de passe
  </a>
</p>

<p>Ou copiez ce lien:</p>
<p>{{ .RecoveryURL }}</p>

<p><strong>Important:</strong> Ce lien expire dans 24 heures.</p>

<p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>

<hr>

<p style="color: #666; font-size: 12px;">
  Les Jus Naturels Ben's<br>
  Ne répondez pas à cet email
</p>
```

### 4️⃣ Set Redirect URLs

In Supabase → Authentication → URL Configuration:

Add these URLs:

```
# Local development
http://localhost:3000/auth/reset-password

# Production
https://yourdomain.com/auth/reset-password
```

### 5️⃣ Test Flow

1. Go to `/auth/login`
2. Click "Mot de passe oublié?"
3. Enter your email
4. Check your email (spam folder too)
5. Click the reset link
6. Enter new password
7. Confirm it worked by logging in

---

## Component Usage

### Forgot Password Form

```tsx
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

<ForgotPasswordForm
  onSuccess={() => {
    console.log('Password reset email sent')
  }}
/>
```

### Reset Password Form

```tsx
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

<ResetPasswordForm
  onSuccess={() => {
    console.log('Password updated')
  }}
/>
```

---

## Full Integration Example

### Login Page with Password Reset

```tsx
// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-16">
        <LoginForm redirectTo="/account" />

        {/* Additional help links */}
        <div className="text-center mt-6 space-y-2 text-sm">
          <Link href="/auth/forgot-password" className="block text-blue-600 hover:text-blue-700">
            Mot de passe oublié?
          </Link>
          <Link href="/auth/signup" className="block text-gray-600 hover:text-gray-700">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### Forgot Password Page

```tsx
// app/auth/forgot-password/page.tsx
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'

export default function Page() {
  return <ForgotPasswordPage />
}
```

### Reset Password Page

```tsx
// app/auth/reset-password/page.tsx
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'

export default function Page() {
  return <ResetPasswordPage />
}
```

---

## Email Configuration (Optional)

For custom SMTP (instead of Supabase default):

### In Supabase Dashboard

1. Go to **Authentication** → **Email**
2. Choose **Custom SMTP**
3. Enter your settings:
   - **SMTP Host:** smtp.gmail.com (or your provider)
   - **SMTP Port:** 587
   - **SMTP User:** your-email@gmail.com
   - **SMTP Password:** your-app-password
   - **From Name:** Les Jus Naturels Ben's
   - **From Email:** noreply@yourdomain.com

### Test Email Configuration

1. In Supabase, go to **Authentication** → **Email**
2. Click **Test Email** button
3. Enter test email address
4. Check your inbox for test email

---

## Features

### Forgot Password Form
- ✅ Email input with validation
- ✅ Success/error messages
- ✅ Loading state
- ✅ Instructions for user
- ✅ Back to login link

### Reset Password Form
- ✅ Token validation
- ✅ Password strength validation
- ✅ Confirm password field
- ✅ Password visibility toggle
- ✅ Success confirmation
- ✅ Auto-redirect to login
- ✅ Error handling

### Security
- ✅ 24-hour token expiry
- ✅ Email verification required
- ✅ Password strength enforced
- ✅ Secure token generation
- ✅ Rate limiting ready

---

## Password Requirements

Users must enter a password with:
- ✅ Minimum 8 characters
- ✅ At least one UPPERCASE letter
- ✅ At least one lowercase letter
- ✅ At least one digit (0-9)

**Examples:**
- ✅ `SecurePassword123`
- ✅ `MyPassword2024!`
- ✅ `JuicePassword99`

**Invalid:**
- ❌ `password` (no uppercase, no digit)
- ❌ `Pass123` (only 7 chars)
- ❌ `PASSWORD123` (no lowercase)

---

## Testing Scenarios

### ✅ Happy Path
1. User at login page
2. Clicks "Mot de passe oublié?"
3. Enters email
4. Receives reset email
5. Clicks link in email
6. Enters new password
7. Clicks reset button
8. Redirected to login
9. Logs in with new password
10. Success! ✅

### ⚠️ Error Cases

**Invalid Email:**
- Enter "not-an-email"
- Shows: "Veuillez entrer un email valide"

**Non-existent Email:**
- Enter "nouser@example.com"
- Supabase returns error
- Shows: "User not found" (or generic error)

**Link Expired:**
- Click reset link after 24+ hours
- Shows: "Lien invalide ou expiré"
- User can request new reset

**Password Too Short:**
- Enter "Pass1"
- Shows: "Doit contenir au moins 8 caractères"

**Passwords Don't Match:**
- Enter different confirm password
- Shows: "Les mots de passe ne correspondent pas"

---

## Email Troubleshooting

### Email Not Arriving
**Causes:**
- Wrong email address
- Spam filter blocked it
- SMTP not configured
- Rate limited

**Solutions:**
1. Check email address is correct
2. Check spam folder
3. Configure SMTP in Supabase
4. Wait a few minutes and try again

### Link Not Working
**Causes:**
- Token expired (24 hours)
- Wrong Supabase key
- Redirect URL not configured
- Browser cache issue

**Solutions:**
1. Request new reset email
2. Clear browser cache
3. Verify redirect URLs in Supabase
4. Check Supabase keys are correct

### Email Not Sending
**Causes:**
- Supabase email disabled
- SMTP credentials wrong
- Rate limit exceeded
- Email validation failed

**Solutions:**
1. Check email is enabled in Supabase
2. Test SMTP with test email button
3. Check email wasn't marked spam
4. Wait before trying again

---

## File Structure

```
src/features/auth/
├── components/
│   ├── ForgotPasswordForm.tsx
│   └── ResetPasswordForm.tsx
└── pages/
    ├── ForgotPasswordPage.tsx
    └── ResetPasswordPage.tsx

app/auth/
├── forgot-password/
│   └── page.tsx
└── reset-password/
    └── page.tsx

docs/
└── PASSWORD_RESET.md
```

---

## Verification Checklist

- [ ] Routes created (`/auth/forgot-password`, `/auth/reset-password`)
- [ ] Link added to login form
- [ ] Email template configured in Supabase
- [ ] Redirect URLs added to Supabase
- [ ] Components imported correctly
- [ ] Test forgot password flow
- [ ] Email received successfully
- [ ] Reset password link works
- [ ] New password accepted
- [ ] Can login with new password
- [ ] Old password doesn't work
- [ ] Token validation working
- [ ] Error messages display correctly
- [ ] Mobile responsive tested

---

## Common Issues

### ❌ "User not found"
**Cause:** Email not registered
**Fix:** Sign up with that email first

### ❌ "Invalid or expired token"
**Cause:** Link is too old (24+ hours)
**Fix:** Request new password reset

### ❌ "Email not sent"
**Cause:** SMTP not configured
**Fix:** Configure email in Supabase

### ❌ "Password doesn't meet requirements"
**Cause:** Password missing uppercase/lowercase/digit
**Fix:** Use stronger password

---

## Next Steps

1. ✅ Create routes
2. ✅ Add link to login
3. ✅ Configure email template
4. ✅ Set redirect URLs
5. Test the complete flow
6. Monitor email logs
7. Setup error tracking

---

## Support

For help with:
- **Supabase Setup:** See [SETUP_AUTH.md](./SETUP_AUTH.md)
- **Complete Docs:** See [PASSWORD_RESET.md](./docs/PASSWORD_RESET.md)
- **Auth System:** See [AUTHENTICATION.md](./docs/AUTHENTICATION.md)

🎉 **Password reset ready!**
