# 🚀 Production Deployment Guide

Complete checklist for deploying to production.

---

## 📋 Pre-Deployment Checklist (1-2 weeks before)

### Database & Migrations
- [ ] All migrations tested locally
- [ ] Backup strategy configured
- [ ] Database indexes optimized
- [ ] Row-level security (RLS) policies in place
- [ ] Test data removed from production

### Security
- [ ] SSL certificate obtained & installed
- [ ] Environment variables configured
- [ ] Secrets not in git
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Password requirements enforced

### Code Quality
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Code review completed
- [ ] Dependencies updated
- [ ] Security audit run

### Performance
- [ ] Images optimized
- [ ] Code minified
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] CDN configured

### Configuration
- [ ] Production environment variables set
- [ ] Email configured for production
- [ ] Payment gateway live credentials
- [ ] Domain DNS configured
- [ ] SMTP configured

---

## 🔧 Deployment Steps

### Step 1: Prepare Infrastructure

```bash
# Create production database
supabase db push --db-url=<PRODUCTION_DB_URL>

# Create storage buckets
# - products (public)
# - images (public)
# - documents (private)

# Configure CDN
# - Setup Cloudflare or similar
# - Configure image optimization
```

### Step 2: Environment Setup

```bash
# Create .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Payment processing
SQUARE_APPLICATION_ID=your-app-id
SQUARE_ACCESS_TOKEN=your-access-token

# Analytics
ANALYTICS_ID=your-analytics-id
```

### Step 3: Build & Test

```bash
# Build production bundle
npm run build

# Run production build locally
npm run start

# Test critical flows:
# - Signup/Login
# - Product purchase
# - Admin access
# - Email sending
```

### Step 4: Deploy

**Option A: Vercel (Recommended for Next.js)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
# Configure domain
```

**Option B: Docker + Manual Server**
```bash
# Build Docker image
docker build -t app:latest .

# Push to registry
docker push your-registry/app:latest

# Pull on server
docker pull your-registry/app:latest

# Run container
docker run -d --name app -p 80:3000 your-registry/app:latest
```

**Option C: Traditional Node Server**
```bash
# SSH to server
ssh user@server.com

# Clone repository
git clone https://github.com/your-repo.git
cd your-repo

# Install dependencies
npm install

# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start "npm run start" --name "app"

# Setup auto-restart
pm2 startup
pm2 save
```

### Step 5: Post-Deployment Verification

```bash
# Check website is accessible
curl https://yourapp.com

# Verify HTTPS
# - Check SSL certificate
# - No mixed content warnings

# Test critical flows
# - Sign up
# - Login
# - Add to cart
# - Complete payment
# - View admin
# - Check email

# Monitor errors
# - Check error logs
# - Monitor error rate

# Check database
# - Verify data consistency
# - Check backup

# Test performance
# - Run load test
# - Check response times
```

---

## 📊 Monitoring Setup

### Error Tracking
```javascript
// Setup error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring
```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Uptime Monitoring
- [ ] Setup Pingdom/StatusPage
- [ ] Configure alerts
- [ ] Set check frequency
- [ ] Test alert notifications

### Database Monitoring
- [ ] Enable Supabase monitoring
- [ ] Set up slow query logging
- [ ] Configure backups (daily)
- [ ] Test backup restoration

---

## 🚨 Rollback Plan

### If something goes wrong:

```bash
# Check current deployment
vercel ls

# Rollback to previous version
vercel rollback

# Or manual rollback
git revert <commit-hash>
git push
vercel --prod
```

### Disaster Recovery
```bash
# Restore from backup
supabase db push --db-url=<BACKUP_URL>

# Restore from git
git revert <bad-commit>
```

---

## 📧 Communication

### Notify Users
- [ ] Send email about launch
- [ ] Update status page
- [ ] Post on social media
- [ ] Update landing page

### Team Communication
- [ ] Notify team of go-live
- [ ] Share deployment notes
- [ ] Provide monitoring access
- [ ] Schedule launch call

---

## ✅ Launch Day Checklist

### 2 Hours Before
- [ ] Final backup taken
- [ ] Team assembled
- [ ] Rollback plan reviewed
- [ ] Monitoring ready
- [ ] Alerts configured

### During Deployment
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor database
- [ ] Check payment processing
- [ ] Verify emails sending

### 1 Hour After
- [ ] Check error logs
- [ ] Verify all features work
- [ ] Test user signup
- [ ] Test payment flow
- [ ] Check admin access

### 24 Hours After
- [ ] Review all metrics
- [ ] Check error patterns
- [ ] Gather user feedback
- [ ] Monitor performance
- [ ] Update documentation

---

## 📈 Success Metrics

Monitor these metrics:

| Metric | Target | Current |
|--------|--------|---------|
| Uptime | 99.9% | _____ |
| Page Load | <2s | _____ |
| Error Rate | <0.1% | _____ |
| Response Time | <200ms | _____ |
| Payment Success | >99% | _____ |
| Email Delivery | >98% | _____ |

---

## 🔄 Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Check payment processing
- [ ] Review user feedback

### Weekly
- [ ] Review analytics
- [ ] Check performance
- [ ] Review security logs
- [ ] Update monitoring

### Monthly
- [ ] Review metrics
- [ ] Plan improvements
- [ ] Security audit
- [ ] Backup verification

---

## 📞 Support & Escalation

### Critical Issues (99% Downtime)
- [ ] Alert team immediately
- [ ] Initiate rollback
- [ ] Contact hosting provider
- [ ] Update status page

### High Priority (5% Error Rate)
- [ ] Alert relevant team
- [ ] Investigate root cause
- [ ] Deploy fix
- [ ] Monitor closely

### Medium Priority (Slow Performance)
- [ ] Schedule investigation
- [ ] Implement optimization
- [ ] Monitor improvement

### Low Priority (Minor Issues)
- [ ] Document issue
- [ ] Schedule fix
- [ ] Deploy in next release

---

## 🎉 Deployment Complete!

Your application is now live in production!

**Next Steps:**
1. Monitor for 24-48 hours
2. Gather user feedback
3. Plan improvements
4. Schedule optimization
