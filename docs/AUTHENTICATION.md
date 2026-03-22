# 🔐 Authentication System

Complete Supabase authentication with login, signup, logout, and user management.

## Features

✅ **Authentication**
- Email/password signup
- Email/password login
- Logout with session cleanup
- Password reset
- Password update

✅ **User Management**
- User profiles with roles
- Admin detection
- Customer profiles
- User metadata

✅ **Security**
- Row-level security (RLS) policies
- Protected routes
- Session management
- Password validation
- HTTPS only

✅ **Components**
- Login form with validation
- Signup form with password requirements
- Auth button (profile + dropdown)
- Logout button with confirmation
- Protected routes

## Database Schema

### `auth.users` (Supabase Auth)
```sql
-- Managed by Supabase
- id: UUID
- email: string
- password_hash: string (encrypted)
- email_confirmed_at: timestamp
- user_metadata: jsonb
```

### `user_roles` Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  role TEXT CHECK (role IN ('customer', 'admin', 'moderator')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `customers` Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Usage Guide

### 1. Authentication Service

Complete auth operations with `supabase-auth.ts`:

```tsx
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  resetPassword,
  updatePassword,
  getUserProfile,
  isUserAdmin,
} from '@/lib/supabase-auth'

// Sign up
const result = await signUp({
  email: 'user@example.com',
  password: 'SecurePassword123',
  fullName: 'Jean Dupont',
  phone: '+33612345678'
})

// Sign in
const result = await signIn({
  email: 'user@example.com',
  password: 'SecurePassword123'
})

// Sign out
await signOut()

// Get current user
const user = await getCurrentUser()

// Get user profile
const profile = await getUserProfile(user.id)

// Check admin status
const isAdmin = await isUserAdmin(user.id)

// Reset password
await resetPassword('user@example.com')

// Update password
await updatePassword('NewPassword123')
```

### 2. Auth Provider

Wrap your app with the Supabase Auth Provider:

```tsx
// app/providers.tsx
import { SupabaseAuthProvider } from '@/features/auth/context/SupabaseAuthContext'

export function Providers({ children }) {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  )
}
```

### 3. Login Component

```tsx
import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoginForm redirectTo="/account" />
    </div>
  )
}
```

### 4. Signup Component

```tsx
import { SignupForm } from '@/features/auth/components/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignupForm redirectTo="/auth/verify-email" />
    </div>
  )
}
```

### 5. Auth Button (Profile + Logout)

```tsx
import { AuthButton } from '@/features/auth/components/AuthButton'

// In header/navbar
<AuthButton showProfile={true} />

// Without profile, just login/logout
<AuthButton showProfile={false} />
```

### 6. Logout Button

```tsx
import { LogoutButton } from '@/features/auth/components/LogoutButton'

// Simple logout
<LogoutButton />

// With confirmation
<LogoutButton showConfirm={true} />

// Custom label and redirect
<LogoutButton
  label="Sign Out"
  redirectTo="/goodbye"
  showConfirm={true}
/>
```

### 7. Protected Routes

Ensure only authenticated users can access pages:

```tsx
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

export default function ProfilePage() {
  return (
    <ProtectedRoute requireAdmin={false}>
      <div>This is your profile</div>
    </ProtectedRoute>
  )
}
```

Admin-only routes:

```tsx
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

### 8. Auth Hook

Complete auth management in components:

```tsx
'use client'

import { useAuthManagement } from '@/features/auth/hooks/useAuthManagement'

export function MyComponent() {
  const {
    user,
    profile,
    isAdmin,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  } = useAuthManagement()

  // Login
  const handleLogin = async () => {
    const success = await login('user@example.com', 'password')
    if (success) {
      // Redirected by component
    }
  }

  // Signup
  const handleSignup = async () => {
    const success = await signup('user@example.com', 'password', 'Jean Dupont')
    if (success) {
      // User created and logged in
    }
  }

  // Logout
  const handleLogout = async () => {
    const success = await logout()
  }

  // Update profile
  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      fullName: 'New Name',
      phone: '+33612345678',
    })
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {isLoading && <div>Loading...</div>}
      {user && <div>Welcome {user.email}</div>}
    </div>
  )
}
```

### 9. Supabase Auth Hook

Direct access to Supabase auth context:

```tsx
'use client'

import { useSupabaseAuth } from '@/features/auth/context/SupabaseAuthContext'

export function Component() {
  const { user, session, loading, isAdmin, login, logout } = useSupabaseAuth()

  return (
    <div>
      {user && <p>Logged in as {user.email}</p>}
      {isAdmin && <p>Admin access</p>}
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}
```

## RLS Policies

### User Roles
```sql
-- Users can read their own role
CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all roles
CREATE POLICY "Admins can read all roles"
  ON user_roles FOR SELECT
  USING (role = 'admin');
```

### Customers
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "Admins can read customers"
  ON customers FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

## Email Verification

After signup, users receive confirmation email:

```tsx
// Verify email with token
// This is handled automatically by Supabase
```

## Password Reset Flow

1. User requests password reset
2. Email sent with reset link
3. User clicks link
4. User enters new password
5. Password updated in database

```tsx
// Step 1: Request reset
await resetPassword('user@example.com')

// Step 2: User gets email with link

// Step 3: User lands on reset page with token

// Step 4: Update password
await updatePassword('NewPassword123')
```

## Session Management

Sessions are automatically managed by Supabase:

```tsx
// Get current session
const session = await getSession()

// Refresh session
await refreshSession()

// Listen to auth changes
const unsubscribe = onAuthStateChange((user, session) => {
  console.log('Auth state changed:', user, session)
})

// Cleanup
unsubscribe()
```

## Admin Operations

Create admin users:

```sql
-- Add admin role to user
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

Check admin status:

```tsx
const isAdmin = await isUserAdmin(user.id)

// In components
const { isAdmin } = useSupabaseAuth()
```

## Error Handling

All auth functions return proper error messages:

```tsx
const result = await signIn({ email, password })

if (!result.success) {
  const errorMsg = result.error instanceof Error
    ? result.error.message
    : String(result.error)
  console.error('Login failed:', errorMsg)
}
```

Common errors:
- "Invalid login credentials" - Wrong password
- "User not found" - Email not registered
- "Email not confirmed" - Verify email first
- "Password too short" - Use secure password

## File Structure

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx           # Login form
│   ├── SignupForm.tsx          # Signup form
│   ├── AuthButton.tsx          # Profile + dropdown
│   ├── LogoutButton.tsx        # Logout button
│   └── ProtectedRoute.tsx      # Protected route wrapper
├── context/
│   └── SupabaseAuthContext.tsx # Auth provider
├── hooks/
│   ├── useAuth.ts              # Re-export hook
│   └── useAuthManagement.ts    # Complete lifecycle
└── types/
    └── auth.types.ts           # TypeScript types

src/lib/
└── supabase-auth.ts            # Auth service

docs/
└── AUTHENTICATION.md           # This file
```

## Security Best Practices

✅ **Do:**
- Use HTTPS only
- Never expose secrets
- Validate on backend
- Use strong passwords
- Enable email verification
- Implement rate limiting
- Use session refresh
- Log security events

❌ **Don't:**
- Store passwords in localStorage
- Expose auth tokens
- Skip email verification
- Allow weak passwords
- Store credentials in code
- Log sensitive data

## Troubleshooting

### User can't login
```
Check:
1. Email is correct
2. Password is correct
3. Email is verified
4. User exists in auth.users
5. Check Supabase logs
```

### Session expires too quickly
```
Solution:
1. Increase session duration in Supabase
2. Implement refresh token rotation
3. Check browser settings
4. Verify JWT not expired
```

### Admin not detected
```
Solution:
1. Check user_roles table
2. Verify role = 'admin'
3. Check RLS policies
4. Ensure user_id matches auth.uid()
5. Clear browser cache
```

### Email verification issues
```
Solution:
1. Check email address is correct
2. Verify email provider settings
3. Check Supabase email configuration
4. Look for emails in spam folder
5. Resend verification email
```

## Next Steps

1. ✅ Configure Supabase auth
2. ✅ Set up auth provider
3. ✅ Create login/signup pages
4. ✅ Add auth button to navbar
5. ✅ Protect admin routes
6. ✅ Implement profile page
7. ✅ Add password reset
8. ✅ Setup email templates

## Migration from Legacy

If migrating from old auth:

```tsx
// Old way (deprecated)
const { login, logout } = useAuth()
login(password, adminPassword)

// New way (Supabase)
const { login, logout } = useSupabaseAuth()
await login(email, password)

// Or use the management hook
const { login, logout } = useAuthManagement()
const success = await login(email, password)
```
