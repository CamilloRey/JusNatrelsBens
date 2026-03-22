# 📊 Monitoring & Performance Optimization Guide

Complete guide to monitor your application and optimize performance.

---

## 🔍 Monitoring Overview

### What to Monitor
- ✅ Uptime & Availability
- ✅ Response Times
- ✅ Error Rates
- ✅ Database Performance
- ✅ Payment Processing
- ✅ Email Delivery
- ✅ User Activity
- ✅ Security Events

---

## 📈 Tools to Setup

### 1. Uptime Monitoring

**Option A: Pingdom (Recommended)**
```
1. Go to pingdom.com
2. Sign up for free account
3. Add check for your domain
4. Check every 5 minutes
5. Set up SMS/email alerts
```

**Option B: UptimeRobot (Free)**
```
1. Go to uptimerobot.com
2. Create account
3. Add HTTP(S) monitor
4. Set check interval to 5 min
5. Configure notifications
```

**Success Metrics:**
- Target Uptime: 99.9%
- Check Frequency: Every 5 minutes
- Alert Threshold: 1 failed check

---

### 2. Error Tracking

**Setup Sentry (Best for JavaScript)**

```bash
# Install Sentry
npm install @sentry/nextjs

# Create sentry.client.config.js
export const sentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
}
```

**Configure Sentry Dashboard:**
1. Create project at sentry.io
2. Select Next.js as platform
3. Copy DSN
4. Add to .env.production
5. Setup alerts for:
   - New errors
   - Error spike (>10% increase)
   - Critical errors

---

### 3. Performance Monitoring

**Setup Google Analytics**

```html
<!-- In head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID', {
    page_path: window.location.pathname,
  });
</script>
```

**Track Core Web Vitals**
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

**Key Metrics:**
- Largest Contentful Paint (LCP): < 2.5s ✅
- First Input Delay (FID): < 100ms ✅
- Cumulative Layout Shift (CLS): < 0.1 ✅

---

### 4. Database Monitoring

**Supabase Dashboard**

```
1. Go to Supabase Dashboard
2. Select your project
3. Go to Database → Monitoring
4. View:
   - Active connections
   - Query performance
   - Cache hit rate
   - Transaction logs
```

**Enable Query Logging:**
```sql
-- In Supabase SQL Editor
ALTER DATABASE postgres SET log_min_duration_statement = 1000;

-- View slow queries
SELECT
  query,
  calls,
  mean_time,
  stddev_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

### 5. Payment Monitoring

**Square Dashboard:**
1. Login to Square Dashboard
2. Go to Transactions
3. Monitor:
   - Success rate (Target: >99%)
   - Average transaction time
   - Failed transactions
   - Refunds

**Alert on Issues:**
- Success rate drops below 95%
- Spike in failed transactions
- Unusual transaction patterns

---

### 6. Email Delivery Monitoring

**Check Email Logs:**
```sql
SELECT
  email_type,
  status,
  COUNT(*) as count,
  DATE(created_at) as date
FROM email_logs
GROUP BY email_type, status, DATE(created_at)
ORDER BY date DESC;
```

**Targets:**
- Delivery Rate: >98%
- Bounce Rate: <0.5%
- Complaint Rate: <0.1%

---

## ⚡ Performance Optimization

### 1. Frontend Optimization

**Image Optimization**
```javascript
// Use Next.js Image component
import Image from 'next/image'

export default function ProductImage() {
  return (
    <Image
      src="/product.jpg"
      alt="Product"
      width={300}
      height={300}
      quality={75}
      priority
    />
  )
}
```

**Code Splitting**
```javascript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
})
```

**Remove Unused Code:**
- Analyze bundle size: `npm run analyze`
- Remove unused packages
- Tree-shake unused code

---

### 2. Backend Optimization

**Database Indexing:**
```sql
-- Add indexes for common queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_emails_user_id ON email_logs(user_id);

-- Check index usage
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';
```

**Query Optimization:**
```javascript
// Before: N+1 query problem
const orders = await supabase.from('orders').select()
for (const order of orders) {
  const items = await supabase
    .from('order_items')
    .select()
    .eq('order_id', order.id)
}

// After: Single optimized query
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    order_items(*)
  `)
```

**Caching Strategy:**
```javascript
// Cache at route level
import { unstable_cache } from 'next/cache'

const getCachedProducts = unstable_cache(
  async () => {
    return supabase.from('products').select()
  },
  ['products'],
  { revalidate: 3600 } // 1 hour
)
```

---

### 3. Database Optimization

**Analyze Query Performance:**
```sql
EXPLAIN ANALYZE
SELECT o.*, oi.*
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 'user-123';
```

**Archive Old Data:**
```sql
-- Move old data to archive table
INSERT INTO orders_archive
SELECT * FROM orders
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM orders
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

### 4. API Optimization

**Enable Compression:**
```javascript
// In next.config.js
module.exports = {
  compress: true,
}
```

**Optimize API Responses:**
```javascript
// Only return needed fields
const { data } = await supabase
  .from('orders')
  .select('id,created_at,total,status')  // Not *
```

---

## 📊 Daily Monitoring Checklist

### Every Morning
- [ ] Check uptime (should be 100% or close)
- [ ] Review error logs from night
- [ ] Check error spike alerts
- [ ] Review payment processing
- [ ] Check email delivery rate

### Every Week
- [ ] Review analytics trends
- [ ] Check database performance
- [ ] Review slow queries
- [ ] Check backup status
- [ ] Review security logs

### Every Month
- [ ] Generate performance report
- [ ] Identify optimization opportunities
- [ ] Plan improvements
- [ ] Review customer feedback
- [ ] Update documentation

---

## 🎯 Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Homepage Load | <2s | ____ | ⭕ |
| API Response | <200ms | ____ | ⭕ |
| Database Query | <100ms | ____ | ⭕ |
| Uptime | 99.9% | ____ | ⭕ |
| Error Rate | <0.1% | ____ | ⭕ |
| Payment Success | >99% | ____ | ⭕ |
| Email Delivery | >98% | ____ | ⭕ |
| Page Speed Score | >90 | ____ | ⭕ |

---

## 🚨 Alert Configuration

### Critical Alerts (Page immediately)
- Uptime drops below 99%
- Error rate > 5%
- Payment failure > 10%
- Database connection error
- Email delivery fails

### High Priority Alerts (Email + Slack)
- Response time > 1 second
- Error rate > 1%
- Payment failure > 5%
- Database slow query
- Memory usage > 80%

### Medium Priority Alerts (Email)
- Response time > 500ms
- Error rate > 0.5%
- Database replication lag
- Backup failed

---

## 📈 Reporting

### Weekly Report Template
```
WEEKLY PERFORMANCE REPORT
========================

Uptime: 99.95% ✅
Users: 1,234 (+5%)
Orders: 45 (+12%)
Revenue: $5,432 (+8%)

Top Issue:
- Slow checkout on mobile (investigating)

Performance Improvements:
- Optimized product images (10% faster)
- Added database index (5x faster queries)

Next Week:
- Implement caching for static pages
- Upgrade database plan
```

---

## 🔧 Troubleshooting

### High Error Rate
1. Check error logs in Sentry
2. Identify error pattern
3. Check recent deployments
4. Rollback if needed
5. Monitor error rate

### Slow Performance
1. Check server response time
2. Check database query time
3. Check network waterfall in DevTools
4. Identify bottleneck
5. Optimize

### Payment Failures
1. Check Square logs
2. Check network errors
3. Verify Square credentials
4. Check test payments
5. Contact Square support if needed

---

## ✅ Optimization Completed

When you've completed all optimizations:
- [ ] Images optimized
- [ ] Database indexed
- [ ] Caching implemented
- [ ] API optimized
- [ ] Monitoring active
- [ ] Alerts configured
- [ ] Benchmarks set

**You're ready for high traffic! 🚀**
