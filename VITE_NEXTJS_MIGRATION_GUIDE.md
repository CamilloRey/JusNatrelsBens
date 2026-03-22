# 🔄 Vite ← → Next.js Migration Guide

Your project is **Vite + React** but your existing code has **Next.js imports**. This guide helps you migrate.

---

## ⚠️ Issue

Your `package.json` and `vite.config.ts` indicate a **Vite project**, but existing code imports from:
- ❌ `next/link`
- ❌ `next/image`
- ❌ `next/navigation`
- ❌ `next/router`

These don't exist in Vite. You need to replace them with React Router equivalents.

---

## ✅ Quick Fixes

### 1. Replace `next/link` with React Router

**Before (Next.js):**
```tsx
import Link from 'next/link'

<Link href="/products">View Products</Link>
```

**After (Vite + React Router):**
```tsx
import { Link } from 'react-router-dom'

<Link to="/products">View Products</Link>
```

---

### 2. Replace `next/navigation` with React Router

**Before (Next.js):**
```tsx
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/products')
```

**After (Vite + React Router):**
```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/products')
```

---

### 3. Replace `next/image` with HTML or React

**Before (Next.js):**
```tsx
import Image from 'next/image'

<Image src="/photo.jpg" alt="Photo" width={300} height={300} />
```

**After (Vite + React):**
```tsx
// Simple HTML img
<img src="/photo.jpg" alt="Photo" width={300} height={300} />

// Or with CSS for better control
<img src="/photo.jpg" alt="Photo" style={{ width: 300, height: 300 }} />
```

---

### 4. Replace `useRouter()` (navigation)

**Before (Next.js):**
```tsx
import { useRouter } from 'next/router'

const router = useRouter()
const { id } = router.query
```

**After (Vite + React Router):**
```tsx
import { useParams } from 'react-router-dom'

const { id } = useParams()
```

---

## 🔍 Files to Update

Based on the build error, you need to update these files:

| File | Issue | Fix |
|------|-------|-----|
| `src/features/auth/components/AuthButton.tsx` | `next/link` | Replace with `react-router-dom` |
| `src/features/auth/components/LoginForm.tsx` | `next/link`, `next/navigation` | Replace with `react-router-dom` |
| `src/features/auth/components/LogoutButton.tsx` | `next/navigation` | Replace with `useNavigate` |
| `src/features/auth/components/ProtectedRoute.tsx` | `next/link` | Replace with `react-router-dom` |
| `src/features/auth/components/SignupForm.tsx` | `next/link`, `next/navigation` | Replace with `react-router-dom` |
| `src/features/auth/components/ResetPasswordForm.tsx` | `next/link`, `next/navigation` | Replace with `react-router-dom` |
| `src/features/auth/components/ForgotPasswordForm.tsx` | `next/link` | Replace with `react-router-dom` |

---

## 🛠️ Migration Pattern

### Pattern 1: Navigation Links

```tsx
// ❌ Before (Next.js)
import Link from 'next/link'
<Link href="/dashboard">Dashboard</Link>

// ✅ After (Vite)
import { Link } from 'react-router-dom'
<Link to="/dashboard">Dashboard</Link>
```

### Pattern 2: Programmatic Navigation

```tsx
// ❌ Before (Next.js)
import { useRouter } from 'next/navigation'
const router = useRouter()
const handleClick = () => router.push('/dashboard')

// ✅ After (Vite)
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
const handleClick = () => navigate('/dashboard')
```

### Pattern 3: Getting Route Parameters

```tsx
// ❌ Before (Next.js)
import { useRouter } from 'next/router'
const router = useRouter()
const { id } = router.query

// ✅ After (Vite)
import { useParams } from 'react-router-dom'
const { id } = useParams()
```

### Pattern 4: Images

```tsx
// ❌ Before (Next.js)
import Image from 'next/image'
<Image src="/img.jpg" alt="test" width={100} height={100} />

// ✅ After (Vite)
<img src="/img.jpg" alt="test" style={{ width: 100, height: 100 }} />
```

---

## 📝 Step-by-Step Migration

### Step 1: Update `src/features/auth/components/LoginForm.tsx`

```tsx
// Remove these imports:
- import Link from 'next/link'
- import { useRouter } from 'next/navigation'

// Add these imports:
+ import { Link, useNavigate } from 'react-router-dom'

// Replace:
const router = useRouter()
router.push('/dashboard')

// With:
const navigate = useNavigate()
navigate('/dashboard')

// Replace:
<Link href="/reset">Forgot Password?</Link>

// With:
<Link to="/reset">Forgot Password?</Link>
```

### Step 2: Update `src/features/auth/components/ProtectedRoute.tsx`

```tsx
// Replace next/link imports with react-router-dom
import { Link } from 'react-router-dom'

// Update all <Link href="/..."> to <Link to="/...">
```

### Step 3: Update Navigation Components

For all navigation buttons and links:
- Replace `useRouter()` → `useNavigate()`
- Replace `router.push()` → `navigate()`
- Replace `<Link href="">` → `<Link to="">`

---

## 🧪 Testing After Migration

After updating imports:

```bash
# Run TypeScript check
npm run build

# Should compile without 'next' module errors
```

---

## ⚡ Quick Migration Script

If you want to do a find-and-replace across all auth files:

```bash
# Replace next/link imports
find src/features/auth -name "*.tsx" -type f | xargs sed -i "s/import Link from 'next\/link'/import { Link } from 'react-router-dom'/g"

# Replace next/navigation imports
find src/features/auth -name "*.tsx" -type f | xargs sed -i "s/import { useRouter } from 'next\/navigation'/import { useNavigate } from 'react-router-dom'/g"

# Replace router.push with navigate
find src/features/auth -name "*.tsx" -type f | xargs sed -i "s/router\.push/navigate/g"

# Replace href with to
find src/features/auth -name "*.tsx" -type f | xargs sed -i "s/href=\"/to=\"/g"
```

---

## 🎯 Priority Order

1. **Critical** - Auth files (blocking build)
   - `LoginForm.tsx`
   - `SignupForm.tsx`
   - `LogoutButton.tsx`
   - `ProtectedRoute.tsx`
   - Other auth components

2. **High** - Navigation files
   - `AuthButton.tsx`
   - Any routing components

3. **Medium** - Features
   - `src/features/**/*.tsx` files with next imports

4. **Low** - Other modules

---

## 📚 React Router Documentation

For more details on React Router, see:
- [React Router Docs](https://reactrouter.com/)
- [`<Link>` component](https://reactrouter.com/en/main/components/link)
- [`useNavigate` hook](https://reactrouter.com/en/main/hooks/use-navigate)
- [`useParams` hook](https://reactrouter.com/en/main/hooks/use-params)
- [`useLocation` hook](https://reactrouter.com/en/main/hooks/use-location)

---

## ✅ Verification Checklist

After migration:

- [ ] No imports from `next/link`
- [ ] No imports from `next/navigation`
- [ ] No imports from `next/router`
- [ ] No imports from `next/image` (unless using `<img>`)
- [ ] All `<Link href="">` → `<Link to="">`
- [ ] All `useRouter()` → `useNavigate()`
- [ ] Build passes: `npm run build`
- [ ] App runs: `npm run dev`
- [ ] Navigation works in browser
- [ ] No console errors

---

## 🆘 Common Issues

### Issue: "Cannot find module 'next/link'"
**Solution:** Replace with React Router Link
```tsx
import { Link } from 'react-router-dom'
```

### Issue: "useRouter is not exported from 'next/navigation'"
**Solution:** Use useNavigate from React Router
```tsx
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
```

### Issue: "Property 'push' does not exist"
**Solution:** Use navigate() instead of push()
```tsx
navigate('/path')  // instead of router.push('/path')
```

---

## 📞 Need Help?

If you get stuck:

1. Check the React Router docs above
2. Look at existing working components
3. Compare the before/after patterns above
4. Ask for specific help with a file

---

## 🎉 Next Steps

After migration:

1. Run `npm run build` to verify
2. Run `npm run dev` to test
3. Test all navigation flows
4. Push to git with message: "Migrate from Next.js to React Router"

You're almost there! Just need to fix the existing imports. 🚀
