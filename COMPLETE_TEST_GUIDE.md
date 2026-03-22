# 🧪 Complete Authentication & Password Reset Test Guide

Comprehensive testing guide for all authentication features.

## Test Environment Setup

### Prerequisites
- [ ] Supabase project created
- [ ] Database migrations run (`supabase db push`)
- [ ] Storage buckets created (product-images, owner-photos)
- [ ] Auth provider added to app
- [ ] Routes created
- [ ] Components integrated
- [ ] Email template configured
- [ ] SMTP/Email service configured

### Test Account Credentials
```
Email: test@example.com
Password: TestPassword123
Full Name: Test User
Phone: +33612345678
```

---

## Phase 1: Database & Migrations ✅

### 1.1 Verify Database Tables

```sql
-- Run in Supabase SQL Editor

-- Check all tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- - auth.users (system)
-- - customers
-- - user_roles
-- - images
-- - owner_photos
-- - email_logs
-- - error_logs
-- - auth_audit_log
```

### 1.2 Check RLS Policies

```sql
-- View RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('customers', 'user_roles', 'images', 'owner_photos', 'email_logs', 'error_logs', 'auth_audit_log')
ORDER BY tablename;
```

### 1.3 Verify Indexes

```sql
-- Check indexes exist
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename IN ('images', 'owner_photos', 'email_logs', 'error_logs', 'auth_audit_log')
ORDER BY tablename;
```

---

## Phase 2: Authentication Testing

### 2.1 Signup Test

**Test Case: Valid Signup**

```
1. Go to /auth/signup
2. Enter:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm: TestPassword123
3. Check "Accept terms"
4. Click "Créer un compte"
```

**Expected Results:**
- ✅ Account created
- ✅ Customer profile created in database
- ✅ User role set to 'customer'
- ✅ Redirected to /auth/verify-email
- ✅ Email verification email sent
- ✅ Entry in auth_audit_log with event_type='signup'

**Verification:**
```sql
-- Check user created
SELECT id, email FROM auth.users WHERE email = 'test@example.com';

-- Check customer profile
SELECT * FROM customers WHERE email = 'test@example.com';

-- Check user role
SELECT * FROM user_roles WHERE role = 'customer';

-- Check auth log
SELECT * FROM auth_audit_log WHERE email = 'test@example.com' AND event_type = 'signup';
```

**Test Case: Invalid Passwords**

| Input | Expected Error |
|-------|-----------------|
| `password` | "Doit contenir une lettre majuscule" |
| `Pass123` | "Doit contenir au moins 8 caractères" |
| `PASSWORD123` | "Doit contenir une lettre minuscule" |
| `Password` | "Doit contenir un chiffre" |
| Different in confirm | "Les mots de passe ne correspondent pas" |

**Test Case: Invalid Email**

| Input | Expected Error |
|-------|-----------------|
| `notanemail` | "Email invalide" |
| `test@` | "Email invalide" |
| `@example.com` | "Email invalide" |
| Empty | "Email requis" |

### 2.2 Login Test

**Test Case: Valid Login**

```
1. Go to /auth/login
2. Enter:
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Se connecter"
```

**Expected Results:**
- ✅ Logged in successfully
- ✅ Redirected to /account
- ✅ Auth button shows user email
- ✅ Auth button shows admin badge (if admin)
- ✅ Entry in auth_audit_log with event_type='login'

**Verification:**
```sql
SELECT * FROM auth_audit_log
WHERE email = 'test@example.com'
AND event_type = 'login'
AND success = TRUE
ORDER BY created_at DESC LIMIT 1;
```

**Test Case: Wrong Password**

```
1. Go to /auth/login
2. Enter email: test@example.com
3. Enter password: WrongPassword123
4. Click "Se connecter"
```

**Expected Results:**
- ❌ Error: "Invalid login credentials"
- ✅ Entry in auth_audit_log with success=false
- Stay on login page

**Verification:**
```sql
SELECT * FROM auth_audit_log
WHERE email = 'test@example.com'
AND event_type = 'login'
AND success = FALSE
ORDER BY created_at DESC LIMIT 1;
```

**Test Case: Non-existent Email**

```
1. Go to /auth/login
2. Enter email: nonexistent@example.com
3. Enter password: TestPassword123
4. Click "Se connecter"
```

**Expected Results:**
- ❌ Error: "User not found"

### 2.3 Logout Test

**Test Case: Logout**

```
1. Login with test@example.com
2. Click auth button
3. Click "Déconnexion"
```

**Expected Results:**
- ✅ Logged out
- ✅ Redirected to home
- ✅ Auth button shows "Se connecter"
- ✅ Entry in auth_audit_log with event_type='logout'

**Verification:**
```sql
SELECT * FROM auth_audit_log
WHERE email = 'test@example.com'
AND event_type = 'logout'
ORDER BY created_at DESC LIMIT 1;
```

---

## Phase 3: Password Reset Testing

### 3.1 Request Password Reset

**Test Case: Valid Email**

```
1. Go to /auth/forgot-password
2. Enter email: test@example.com
3. Click "Envoyer le lien"
```

**Expected Results:**
- ✅ Success message shown
- ✅ Instructions displayed
- ✅ Email sent (check inbox/spam)
- ✅ Entry in email_logs with email_type='reset_password'

**Verification:**
```sql
SELECT * FROM email_logs
WHERE email_address = 'test@example.com'
AND email_type = 'reset_password'
ORDER BY created_at DESC LIMIT 1;
```

**Test Case: Invalid Email**

```
1. Go to /auth/forgot-password
2. Enter email: notanemail
3. Click "Envoyer le lien"
```

**Expected Results:**
- ❌ Error: "Email invalide"

### 3.2 Reset Password with Link

**Test Case: Valid Reset**

```
1. Open email from password reset
2. Click reset link
3. Enter new password: NewPassword456
4. Confirm: NewPassword456
5. Click "Réinitialiser le mot de passe"
```

**Expected Results:**
- ✅ Success message
- ✅ Redirected to login
- ✅ Can login with new password
- ✅ Old password doesn't work
- ✅ Entry in auth_audit_log with event_type='password_reset'

**Verification:**
```sql
SELECT * FROM auth_audit_log
WHERE email = 'test@example.com'
AND event_type = 'password_reset'
ORDER BY created_at DESC LIMIT 1;
```

**Test Case: Expired Link**

```
1. Request password reset
2. Wait 25+ hours
3. Click reset link in email
```

**Expected Results:**
- ❌ Error: "Lien invalide ou expiré"
- User can request new reset

**Test Case: Weak Password**

```
1. Go to password reset page
2. Enter password: Weak1
3. Click reset
```

**Expected Results:**
- ❌ Error: "Doit contenir au moins 8 caractères"

---

## Phase 4: Protected Routes Testing

### 4.1 User Protected Routes

**Test Case: Authenticated User**

```
1. Login with test@example.com
2. Go to /account
```

**Expected Results:**
- ✅ Page loads
- ✅ User content visible
- ✅ Can logout

**Test Case: Unauthenticated User**

```
1. Don't login
2. Go to /account
```

**Expected Results:**
- ❌ Redirected to /auth/login
- Error: "Vous devez être connecté"

### 4.2 Admin Protected Routes

**Test Case: Admin User**

```
1. Login with admin account
2. Go to /admin
```

**Expected Results:**
- ✅ Page loads
- ✅ Admin content visible

**Test Case: Non-admin User**

```
1. Login with regular user
2. Go to /admin
```

**Expected Results:**
- ❌ Redirected
- Error: "Accès administrateur requis"

---

## Phase 5: Email Delivery Testing

### 5.1 Email Service Test

**In Supabase Dashboard:**

```
1. Go to Authentication → Email
2. Click "Test Email"
3. Enter test email address
4. Click "Send"
```

**Expected Results:**
- ✅ Email received within 5 minutes
- ✅ Subject correct
- ✅ Links working
- ✅ Formatting correct

### 5.2 Email Logging Test

**Test Case: Monitor Email Delivery**

```sql
-- Check email logs
SELECT * FROM email_logs
ORDER BY created_at DESC LIMIT 10;

-- Check failed emails
SELECT * FROM email_logs
WHERE status = 'error'
ORDER BY created_at DESC LIMIT 5;

-- Check delivery stats
SELECT event_type, COUNT(*)
FROM email_logs
GROUP BY event_type;
```

### 5.3 Email Template Test

**Verify all templates render correctly:**

- [ ] Confirm Email template
- [ ] Password Reset template
- [ ] Magic Link template (if enabled)

**Check:**
- [ ] Subject line correct
- [ ] Links work
- [ ] HTML formatting good
- [ ] Mobile responsive

---

## Phase 6: Error Tracking Testing

### 6.1 Log Errors

**Test Case: Trigger Error**

```tsx
import { logError } from '@/lib/error-tracking'

// Trigger error
await logError({
  type: 'test_error',
  message: 'This is a test error',
  severity: 'warning'
})
```

**Verification:**
```sql
SELECT * FROM error_logs
WHERE error_type = 'test_error'
ORDER BY created_at DESC LIMIT 1;
```

### 6.2 Check Error Dashboard

**In Supabase SQL:**

```sql
-- Recent errors
SELECT * FROM recent_errors LIMIT 20;

-- Error statistics
SELECT severity, COUNT(*)
FROM error_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY severity;

-- Unresolved errors
SELECT * FROM error_logs
WHERE resolved = FALSE
ORDER BY created_at DESC;
```

---

## Phase 7: Admin Features Testing

### 7.1 Setup Admin User

```sql
-- Get your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Add admin role (replace UUID)
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

### 7.2 Verify Admin Access

```
1. Logout
2. Login with admin email
3. Check auth button shows admin badge
4. Access /admin page
5. Can see all features
```

### 7.3 View Email Logs

```sql
-- Check email logs for user
SELECT * FROM email_logs
WHERE email_address = 'test@example.com'
ORDER BY created_at DESC;

-- Check failed emails
SELECT * FROM email_logs
WHERE status = 'error'
LIMIT 10;
```

---

## Testing Checklist

### ✅ Signup
- [ ] Valid signup succeeds
- [ ] Invalid passwords rejected
- [ ] Invalid emails rejected
- [ ] Customer profile created
- [ ] User role set
- [ ] Verification email sent
- [ ] Auth logs recorded

### ✅ Login
- [ ] Valid login succeeds
- [ ] Wrong password fails
- [ ] Non-existent user fails
- [ ] Session persists
- [ ] Auth button updates
- [ ] Auth logs recorded

### ✅ Logout
- [ ] Logout works
- [ ] Session cleared
- [ ] Redirected to home
- [ ] Auth button resets
- [ ] Auth logs recorded

### ✅ Password Reset
- [ ] Valid email sends email
- [ ] Invalid email rejected
- [ ] Email contains link
- [ ] Link is clickable
- [ ] Token validated
- [ ] New password accepted
- [ ] Old password fails
- [ ] Auth logs recorded
- [ ] Email logs recorded

### ✅ Protected Routes
- [ ] Authenticated can access
- [ ] Unauthenticated redirected
- [ ] Admin can access admin
- [ ] Non-admin cannot access admin

### ✅ Email Delivery
- [ ] Test email works
- [ ] Template renders correctly
- [ ] Links functional
- [ ] Mobile responsive
- [ ] No spam issues

### ✅ Error Tracking
- [ ] Errors logged
- [ ] Auth logs recorded
- [ ] Email logs recorded
- [ ] Error statistics available
- [ ] Can view failed emails

### ✅ Database
- [ ] All tables created
- [ ] RLS policies active
- [ ] Indexes present
- [ ] Views created
- [ ] Data persists

---

## Performance Testing

### Load Testing

```
1. Create 100 test accounts
2. All password reset requests
3. All login attempts
4. Monitor performance
5. Check error rates
```

**Expected Results:**
- [ ] <100ms response time
- [ ] <1% error rate
- [ ] Emails delivered within 5 min
- [ ] No database timeouts

### Stress Testing

```
1. Create 1000 test accounts
2. Simultaneous password resets
3. Concurrent logins
4. Monitor resource usage
```

**Expected Results:**
- [ ] System handles load
- [ ] No crashed queries
- [ ] Graceful degradation
- [ ] Clear error messages

---

## Security Testing

### Password Security

- [ ] Weak passwords rejected
- [ ] Passwords hashed (bcrypt)
- [ ] Old password doesn't work
- [ ] Reset token expires

### Session Security

- [ ] Token not exposed in URL
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Cannot reuse old token

### Email Security

- [ ] Reset links single-use
- [ ] Links expire after 24h
- [ ] Tokens cryptographically secure
- [ ] Email required for reset

### Database Security

- [ ] RLS policies enforced
- [ ] Admins only see admin data
- [ ] Users only see own data
- [ ] No SQL injection possible

---

## Monitoring Setup

### Email Monitoring

```sql
-- Daily email summary
SELECT
  DATE(created_at) as date,
  email_type,
  status,
  COUNT(*) as count
FROM email_logs
GROUP BY DATE(created_at), email_type, status
ORDER BY date DESC;
```

### Error Monitoring

```sql
-- Daily error summary
SELECT
  DATE(created_at) as date,
  severity,
  COUNT(*) as count
FROM error_logs
GROUP BY DATE(created_at), severity
ORDER BY date DESC;
```

### Auth Monitoring

```sql
-- Failed login attempts
SELECT
  email,
  COUNT(*) as attempt_count,
  MAX(created_at) as last_attempt
FROM auth_audit_log
WHERE event_type = 'login' AND success = FALSE
GROUP BY email
ORDER BY attempt_count DESC;
```

---

## Final Checklist

- [ ] All tests passed
- [ ] No critical errors
- [ ] Email delivery working
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Database clean
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Ready for production

---

## Troubleshooting Common Issues

### Email Not Arriving
- Check spam folder
- Verify email address
- Check Supabase email config
- Review email logs

### Login Failing
- Verify email verified
- Check password correct
- Look at auth logs
- Check network connection

### Password Reset Not Working
- Verify token valid
- Check link not expired
- Ensure email sent
- Check redirect URLs

### Admin Not Working
- Verify user_roles table
- Check role = 'admin'
- Clear browser cache
- Check RLS policies

---

## Support

For issues:
1. Check this guide
2. Review relevant documentation
3. Check logs (email_logs, error_logs, auth_audit_log)
4. Review Supabase dashboard
5. Check browser console

🎉 **All testing complete!**
