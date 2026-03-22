# 🔑 Password Reset Flow

Complete "Forgot Password" and "Reset Password" implementation with email integration.

## Features

✅ **Request Password Reset**
- User enters email
- Email validation
- Reset email sent
- Confirmation message

✅ **Reset Password**
- Click link from email
- Token validation
- New password form
- Password strength validation
- Confirmation message

✅ **Security**
- Token expires after 24 hours
- Password requirements enforced
- Email confirmation required
- Secure password hashing

✅ **User Experience**
- Clear error messages
- Loading states
- Success feedback
- Email instructions
- Back buttons

## Flow Diagram

```
User → Forgot Password Page
         ↓
    Enter Email
         ↓
    Send Reset Email
         ↓
    Email Received
         ↓
    Click Link in Email
         ↓
    Reset Password Page
         ↓
    Enter New Password
         ↓
    Update Password
         ↓
    Success → Redirect to Login
```

## Components

### ForgotPasswordForm
Request password reset email

```tsx
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

<ForgotPasswordForm onSuccess={() => console.log('Email sent')} />
```

**Features:**
- Email input with validation
- Success state with instructions
- Back to login link
- Information box

### ResetPasswordForm
Reset password with token validation

```tsx
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

<ResetPasswordForm onSuccess={() => console.log('Password updated')} />
```

**Features:**
- Token validation on mount
- New password input
- Confirm password input
- Password strength validation
- Success state with redirect
- Error handling

## Pages

### Forgot Password Page
```tsx
// app/auth/forgot-password/page.tsx
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'

export default function Page() {
  return <ForgotPasswordPage />
}
```

Route: `/auth/forgot-password`

### Reset Password Page
```tsx
// app/auth/reset-password/page.tsx
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'

export default function Page() {
  return <ResetPasswordPage />
}
```

Route: `/auth/reset-password`
Token is handled automatically by Supabase

## Implementation Steps

### 1. Add Routes

Create Next.js pages:

```tsx
// app/auth/forgot-password/page.tsx
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
export default ForgotPasswordPage

// app/auth/reset-password/page.tsx
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
export default ResetPasswordPage
```

### 2. Add Link to Login Form

```tsx
// In LoginForm component
<Link href="/auth/forgot-password" className="text-sm text-blue-600">
  Mot de passe oublié?
</Link>
```

### 3. Configure Email Template

In Supabase Dashboard → Authentication → Email Templates:

#### Reset Password Email Template

```html
<h2>Réinitialiser votre mot de passe</h2>

<p>Vous avez demandé une réinitialisation de mot de passe.</p>

<p>
  <a href="{{ .RecoveryURL }}">
    Cliquez ici pour réinitialiser votre mot de passe
  </a>
</p>

<p>Ce lien expire dans 24 heures.</p>

<p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
```

### 4. Set Redirect URLs

In Supabase → Authentication → URL Configuration:

```
http://localhost:3000/auth/reset-password
https://yourdomain.com/auth/reset-password
```

## Usage Flow

### Step 1: Request Reset
User clicks "Mot de passe oublié?" on login page

```
/auth/forgot-password
↓
Enter email
↓
Click "Envoyer le lien de réinitialisation"
↓
Email sent confirmation
```

### Step 2: Email Received
User receives email with reset link

```
Subject: "Réinitialiser votre mot de passe"
Body: "Cliquez ici pour réinitialiser votre mot de passe"
Link: https://yourdomain.com/auth/reset-password?...
```

### Step 3: Reset Password
User clicks link and enters new password

```
/auth/reset-password (from email link)
↓
Token validated
↓
Enter new password
↓
Confirm password
↓
Click "Réinitialiser le mot de passe"
↓
Success → Redirect to /auth/login
```

### Step 4: Login
User logs in with new password

```
/auth/login
↓
Enter email
↓
Enter new password
↓
Click "Se connecter"
↓
✅ Logged in
```

## Password Requirements

- **Minimum 8 characters**
- **At least one uppercase letter** (A-Z)
- **At least one lowercase letter** (a-z)
- **At least one digit** (0-9)

Example: `SecurePassword123`

## Error Handling

### Invalid Email
```
Error: "Veuillez entrer un email valide"
Solution: Check email format (user@example.com)
```

### Link Expired
```
Error: "Lien de réinitialisation invalide ou expiré"
Solution: Request a new password reset (24-hour expiry)
```

### Password Too Short
```
Error: "Le mot de passe doit contenir au moins 8 caractères"
Solution: Use longer password
```

### Passwords Don't Match
```
Error: "Les mots de passe ne correspondent pas"
Solution: Ensure confirm password matches
```

## Security Features

### Token Validation
- Token verified on reset page load
- Invalid/expired tokens show error
- User must be authenticated to reset

### Password Hashing
- Passwords hashed with bcrypt
- Never stored in plain text
- Secure comparison

### Rate Limiting
- Limit password reset requests
- Prevent brute force
- Email throttling

### Email Verification
- Reset token sent via email only
- Token tied to email address
- Expires after 24 hours

## Email Configuration

### Supabase SMTP Settings
1. Go to Authentication → Email
2. Configure SMTP:
   - **Host:** your-smtp-server.com
   - **Port:** 587 (TLS) or 465 (SSL)
   - **Username:** your-email@domain.com
   - **Password:** your-smtp-password
   - **From Address:** noreply@yourdomain.com

### Email Template Variables
- `{{ .RecoveryURL }}` - Reset link
- `{{ .Email }}` - User email
- `{{ .Token }}` - Reset token

### Send Test Email
In Supabase Dashboard:
1. Go to Authentication
2. Click on email template
3. Click "Test Email"
4. Enter recipient email

## File Structure

```
src/features/auth/
├── components/
│   ├── ForgotPasswordForm.tsx     # Request reset
│   └── ResetPasswordForm.tsx      # Reset password
└── pages/
    ├── ForgotPasswordPage.tsx     # Forgot password page
    └── ResetPasswordPage.tsx      # Reset password page

src/lib/
└── supabase-auth.ts              # resetPassword() function

docs/
└── PASSWORD_RESET.md             # This file
```

## Troubleshooting

### Email Not Received
1. Check email address is correct
2. Check SMTP configuration in Supabase
3. Look in spam folder
4. Request new reset email

### Link Not Working
1. Ensure Supabase is configured
2. Check redirect URL is correct
3. Verify link not expired (24 hours)
4. Try requesting new reset

### Password Not Updating
1. Check password meets requirements
2. Verify passwords match
3. Check network connection
4. Look at browser console errors

### Token Invalid
1. Token expired (24-hour limit)
2. Request new password reset
3. Check Supabase auth logs
4. Verify email address

## Testing

### Test Password Reset Flow
1. Go to `/auth/login`
2. Click "Mot de passe oublié?"
3. Enter email
4. Check email (or Supabase logs)
5. Click reset link
6. Enter new password
7. Confirm password
8. Click reset button
9. Should redirect to login
10. Login with new password

### Test Error Cases
- Enter invalid email format
- Try without entering email
- Passwords don't match
- Password too short
- Click expired link
- Access reset page without link

## Integration Example

```tsx
// Login form with forgot password link
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return <LoginForm redirectTo="/account" />
}

// In LoginForm, shows link to forgot password
// <Link href="/auth/forgot-password">
//   Mot de passe oublié?
// </Link>
```

## Best Practices

✅ **Do:**
- Send reset emails immediately
- Use secure reset tokens
- Expire tokens after 24 hours
- Validate token on reset page
- Require strong new password
- Show clear error messages
- Confirm successful reset
- Log reset attempts

❌ **Don't:**
- Send password in email
- Use predictable tokens
- Keep tokens forever
- Skip token validation
- Allow weak passwords
- Log sensitive data
- Send multiple emails
- Reset without confirmation

## Next Steps

1. ✅ Create forgot password form component
2. ✅ Create reset password form component
3. ✅ Create forgot password page
4. ✅ Create reset password page
5. Configure Supabase email template
6. Test password reset flow
7. Setup email logging
8. Monitor for issues

## References

- [Supabase Password Reset](https://supabase.com/docs/guides/auth/passwords)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Security Best Practices](https://supabase.com/docs/guides/security)
