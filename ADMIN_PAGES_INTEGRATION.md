# 🔗 Admin Pages Integration Guide

How to add the new admin pages (Inventory Alerts & Advanced Reports) to your Vite + React Router application.

---

## 📁 New Admin Pages

The following components have been added and are ready to use:

### Location: `src/features/admin/pages/`

- **InventoryAlertsPage** - Real-time inventory alert monitoring
- **AdvancedReportsPage** - Advanced analytics and reporting

---

## 🛣️ Adding Routes to Your Router

### Step 1: Import the Pages

In your main router file (likely `src/App.tsx` or `src/main.tsx`):

```tsx
import { InventoryAlertsPage, AdvancedReportsPage } from '@/features/admin/pages'
```

### Step 2: Add Routes

In your route configuration:

```tsx
// If using React Router v6
<Routes>
  {/* Other routes... */}

  {/* Admin routes */}
  <Route path="/admin/inventory-alerts" element={<InventoryAlertsPage />} />
  <Route path="/admin/advanced-reports" element={<AdvancedReportsPage />} />
</Routes>
```

### Step 3: Add Navigation Links

Add these links to your admin navigation menu:

```tsx
import { Link } from 'react-router-dom'

export function AdminNavigation() {
  return (
    <nav>
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/inventory-alerts">🚨 Inventory Alerts</Link>
      <Link to="/admin/advanced-reports">📊 Reports</Link>
      {/* Other admin links */}
    </nav>
  )
}
```

---

## 📊 Page Details

### Inventory Alerts Page

**URL:** `/admin/inventory-alerts`

**Features:**
- Real-time alert monitoring
- Severity filtering (critical, warning, info)
- Stock level metrics
- Resolve alerts functionality
- Color-coded status indicators

**Usage:**
```tsx
<Route path="/admin/inventory-alerts" element={<InventoryAlertsPage />} />
```

**What it shows:**
- Total items in inventory
- Number of critical alerts
- Low stock count
- Out of stock count
- Overstock items
- Stock value
- Alert list with filters

---

### Advanced Reports Page

**URL:** `/admin/advanced-reports`

**Features:**
- Multi-tab reporting dashboard
- Sales analytics
- Product performance
- Customer analytics & churn prediction
- CSV export functionality
- Customizable date ranges

**Usage:**
```tsx
<Route path="/admin/advanced-reports" element={<AdvancedReportsPage />} />
```

**What it shows:**
- Overview metrics (revenue, orders, customers)
- Product analytics (top sellers, ratings)
- Customer analytics (spending, churn risk)
- Sales reports (top products & customers)
- Customizable date filters

---

## 🔑 Key Dependencies

These pages require the following to be set up in your project:

### Supabase Tables Required:
- `inventory` - Product inventory levels
- `inventory_alerts` - Alert records
- `stock_movements` - Stock movement history
- `orders` - Order data
- `products` - Product information
- `order_items` - Items in orders
- `customers` - Customer data
- `reviews` - Product reviews
- `daily_metrics` - Daily analytics data

### Environment Variables:
```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

---

## 🎨 Styling

Both pages use inline CSS styles and require no external CSS files. They're self-contained and styled components.

**Colors used:**
- Primary: `#e91e63` (pink)
- Success: `#16a34a` (green)
- Warning: `#f59e0b` (amber)
- Error: `#dc2626` (red)
- Info: `#3b82f6` (blue)

---

## 🔄 Data Flow

### Inventory Alerts Page

```
InventoryAlertsPage
  ├── useEffect (mount) → loadAlerts()
  │   └── getActiveAlerts() or getAlertsBySeverity()
  │       └── Fetch from supabase
  ├── loadMetrics()
  │   └── getInventoryMetrics()
  │       └── Calculate metrics
  └── handleResolve()
      └── resolveAlert(alertId)
          └── Update supabase
```

### Advanced Reports Page

```
AdvancedReportsPage
  ├── useEffect (mount) → loadData()
  │   ├── getAnalyticsMetrics()
  │   ├── getProductAnalytics()
  │   ├── getCustomerAnalytics()
  │   └── getSalesReport()
  └── Tab rendering
      └── Show appropriate data
```

---

## 🛠️ Customization

### Change Tab Order

Edit the tab array in `AdvancedReportsPage.tsx`:

```tsx
{(['overview', 'products', 'customers', 'sales'] as const).map((tab) => (
  // Change order here
))}
```

### Change Colors

Update the color variables in the page files:

```tsx
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return '#dc2626'  // Change here
    // ... other cases
  }
}
```

### Change Metrics Display

Edit the metrics cards in the page components to show different data or calculations.

---

## 🧪 Testing the Pages

### Test Inventory Alerts Page

1. Navigate to `/admin/inventory-alerts`
2. Verify metrics load
3. Test filter buttons
4. Check resolve functionality

```bash
# Ensure you have test data in your database
npm run dev  # Start dev server
# Navigate to http://localhost:5173/admin/inventory-alerts
```

### Test Advanced Reports Page

1. Navigate to `/admin/advanced-reports`
2. Verify metrics load
3. Click through tabs
4. Test date range filters
5. Test CSV export

```bash
npm run dev
# Navigate to http://localhost:5173/admin/advanced-reports
```

---

## 🐛 Troubleshooting

### Pages Don't Load

**Error:** "Cannot find module '@/features/admin/pages'"

**Solution:**
- Ensure files are in `src/features/admin/pages/`
- Check that path alias `@/` is configured in `tsconfig.json`
- Restart dev server

### Data Not Loading

**Error:** Tables not found or no data

**Solution:**
- Verify Supabase tables exist
- Check database has sample data
- Verify Supabase credentials in env
- Check browser console for errors

### Styling Issues

**Issue:** Colors or layout look wrong

**Solution:**
- Check browser DevTools for CSS conflicts
- Verify no global CSS overriding inline styles
- Clear browser cache

---

## 📈 Performance Optimization

### For Large Datasets

If you have many alerts or orders:

1. **Add pagination:**
```tsx
const [page, setPage] = useState(0)
const itemsPerPage = 20
const paginatedData = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
```

2. **Add virtual scrolling:**
```tsx
import { FixedSizeList } from 'react-window'
```

3. **Add caching:**
```tsx
const cachedMetrics = useMemo(() => getInventoryMetrics(), [])
```

---

## 🔐 Access Control

These pages should be protected by admin authentication. Ensure you have:

1. Protected route component
2. Admin role checking
3. Authentication verification

```tsx
<Route
  path="/admin/inventory-alerts"
  element={<ProtectedAdminRoute element={<InventoryAlertsPage />} />}
/>
```

---

## 📚 API Reference

### Available Functions

#### Inventory Alerts
- `checkInventoryLevels()` - Check all inventory and generate alerts
- `getActiveAlerts()` - Get unresolved alerts
- `getAlertsBySeverity(severity)` - Filter by severity
- `getInventoryMetrics()` - Get overall metrics
- `resolveAlert(alertId)` - Mark as resolved
- `recordStockMovement(movement)` - Log stock change
- `getStockHistory(productId, days)` - Get movement history

#### Reporting
- `getSalesReport(startDate, endDate)` - Get sales data
- `getAnalyticsMetrics()` - Get overall metrics
- `getDailyMetrics(days)` - Get daily data
- `getProductAnalytics()` - Get product performance
- `getCustomerAnalytics()` - Get customer data
- `exportToCSV(data, filename)` - Export to CSV

---

## ✅ Integration Checklist

- [ ] Routes added to router
- [ ] Navigation links created
- [ ] Database tables created
- [ ] Supabase credentials configured
- [ ] Pages load without errors
- [ ] Data displays correctly
- [ ] Filters work
- [ ] Export works
- [ ] Mobile responsive
- [ ] Admin access protected

---

## 🚀 You're Ready!

Your admin pages are integrated and ready to use. Start monitoring your inventory and analyzing reports!

For any issues, see the troubleshooting section or check the code comments in the page files.
