# 📊 Admin Content Management System

Complete guide to managing all content through the admin dashboard.

## 🎯 Overview

The admin system allows non-technical users to manage all application content without database access:

- **Products** - Jus, smoothies, détox
- **Articles** - Blog posts
- **Locations** - Magasins, bureaux, partenaires
- **Abonnés** - Newsletter subscribers
- **Images** - Photos de produits

All changes are **instant** and **safely stored** in Supabase.

---

## 🚀 Access Admin Dashboard

### URL
```
https://yourapp.com/admin/dashboard
```

### Requirements
- Admin account created
- Admin role assigned in database

---

## 📝 Content Management Pages

### 1. Produits (`/admin/products`)

Manage all juice, smoothie, and detox products.

**Available Fields:**
- **Nom** - Product name (required)
- **Catégorie** - Jus, Smoothie, Détox, Autre (required)
- **Prix** - Price in currency (required)
- **Description** - Long description of product
- **Couleur** - Color tag/category
- **Tag** - Additional tag
- **Disponible** - Is product available? (checkbox)

**Actions:**
- ➕ Ajouter - Create new product
- ✏️ Modifier - Edit existing product
- 🗑️ Supprimer - Delete product (with confirmation)

**Example Use Case:**
```
1. Click "+ Ajouter"
2. Enter: "Jus Détox Citron" as name
3. Select: "Détox" as category
4. Enter: "14.99" as price
5. Write description: "Jus détoxifiant à base de citron..."
6. Check: "Disponible"
7. Click: "Ajouter"
8. Product appears immediately in list and on website
```

---

### 2. Articles (`/admin/blogs`)

Create and manage blog posts.

**Available Fields:**
- **Titre** - Article title (required)
- **Catégorie** - Santé, Recettes, Conseils, Actualités (required)
- **Contenu** - Full article text (required)
- **Date** - Publication date (required)
- **Publié** - Is article published? (checkbox)

**Actions:**
- ➕ Ajouter - Create new article
- ✏️ Modifier - Edit existing article
- 🗑️ Supprimer - Delete article

**Example Use Case:**
```
1. Click "+ Ajouter"
2. Enter title: "5 Bienfaits du Jus Frais"
3. Select category: "Conseils"
4. Write content: "Les jus frais offrent..."
5. Set date: Today
6. Check: "Publié"
7. Click: "Ajouter"
8. Article available on blog immediately
```

---

### 3. Lieux (`/admin/locations`)

Manage store locations and partner information.

**Available Fields:**
- **Nom** - Location name (required)
- **Adresse** - Full address (required)
- **Type** - Magasin, Bureau, Atelier, Partenaire (required)
- **Actif** - Is location active? (checkbox)

**Actions:**
- ➕ Ajouter - Add new location
- ✏️ Modifier - Edit location details
- 🗑️ Supprimer - Remove location

**Example Use Case:**
```
1. Click "+ Ajouter"
2. Enter: "Ben's Juice Bar"
3. Address: "123 Rue de la Santé, Paris"
4. Type: "Magasin"
5. Check: "Actif"
6. Location shows on map/store finder
```

---

### 4. Abonnés (`/admin/subscribers`)

View and manage newsletter subscribers.

**Available Fields:**
- **Email** - Subscriber email (required)
- **Actif** - Is subscription active? (checkbox)

**Actions:**
- ✏️ Modifier - Update email or status
- 🗑️ Supprimer - Delete subscriber

**Example Use Case:**
```
1. View all subscribers in table
2. Click "Modifier" to change status
3. Uncheck "Actif" to deactivate
4. Use email list for newsletters
```

---

### 5. Images (`/admin/images`)

Manage product photos with real-time sync.

See [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) for complete guide.

---

## 🎨 How It Works

### Architecture

```
User Input
    ↓
AdminContentManager Component
    ↓
Form Validation
    ↓
CRUD Service (admin-crud.ts)
    ↓
Supabase API
    ↓
Database
```

### Flow Example: Adding a Product

1. **User clicks "+ Ajouter"**
   - Form appears with all product fields

2. **User fills form**
   - Name, category, price, etc.

3. **User clicks "Ajouter"**
   - Component validates required fields
   - Sends to CRUD service

4. **CRUD Service processes**
   - Adds created_at timestamp
   - Sends to Supabase

5. **Database receives**
   - Inserts record with RLS security

6. **UI updates**
   - New product appears in table
   - Form clears
   - Success message shown

---

## 🔧 Technical Details

### Component: AdminContentManager

Located in `src/features/dashboard/components/AdminContentManager.tsx`

**Props:**
```typescript
interface AdminContentManagerProps {
  contentType: 'products' | 'blogs' | 'locations' | 'subscribers'
  title: string
  fields: Array<{
    name: string              // Database column name
    label: string             // Display label
    type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'checkbox' | 'select'
    options?: Array<{ label: string; value: string }>  // For select fields
    required?: boolean
  }>
}
```

### Service: CRUD Operations

Located in `src/lib/admin-crud.ts`

Each content type has:
- `getAll()` - Fetch all items
- `getOne(id)` - Fetch single item
- `create(data)` - Create new item
- `update(id, data)` - Update existing item
- `delete(id)` - Delete item

**Example:**
```typescript
const result = await productsCRUD.create({
  name: 'Jus Détox',
  category: 'detox',
  price: 14.99,
  // ... other fields
})

if (result.success) {
  // Display success
} else {
  // Show result.error
}
```

---

## 📋 Field Types Reference

### Text Field
```typescript
{ name: 'product_name', label: 'Product Name', type: 'text', required: true }
```
Single line input. Use for names, tags, etc.

### Textarea Field
```typescript
{ name: 'description', label: 'Description', type: 'textarea' }
```
Multi-line input. Use for longer text content.

### Number Field
```typescript
{ name: 'price', label: 'Price', type: 'number', required: true }
```
Numeric input. Use for prices, quantities.

### Date Field
```typescript
{ name: 'publish_date', label: 'Date', type: 'date', required: true }
```
Date picker. Use for dates and timestamps.

### Email Field
```typescript
{ name: 'email', label: 'Email', type: 'email', required: true }
```
Email validation. Use for email addresses.

### Checkbox Field
```typescript
{ name: 'is_active', label: 'Active', type: 'checkbox' }
```
Boolean toggle. Use for yes/no fields.

### Select Field
```typescript
{
  name: 'category',
  label: 'Category',
  type: 'select',
  required: true,
  options: [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' }
  ]
}
```
Dropdown selection. Use for predefined choices.

---

## 🆕 Adding New Content Types

### Step 1: Add CRUD Operations

Edit `src/lib/admin-crud.ts`:

```typescript
export const myNewCRUD = {
  async getAll() {
    const { data, error } = await supabase
      .from('my_table')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async create(item: any) {
    const { data, error } = await supabase
      .from('my_table')
      .insert([item])
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('my_table')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('my_table')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  },
}
```

### Step 2: Export CRUD

Add to imports/exports in `admin-crud.ts`:

```typescript
export { ..., myNewCRUD }
```

### Step 3: Update Component Types

Edit `AdminContentManager.tsx`:

```typescript
type ContentType = 'products' | 'blogs' | 'locations' | 'subscribers' | 'my_new_type'
```

Add to getCRUD():
```typescript
case 'my_new_type':
  return myNewCRUD
```

### Step 4: Create Admin Page

Create `app/admin/my-type/page.tsx`:

```typescript
'use client'

import { AdminContentManager } from '@/features/dashboard/components/AdminContentManager'

export default function MyTypeAdminPage() {
  return (
    <AdminContentManager
      contentType="my_new_type"
      title="Manage My Type"
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        // ... more fields
      ]}
    />
  )
}
```

### Step 5: Add to Dashboard

Edit `app/admin/dashboard/page.tsx`:

```typescript
{
  title: 'My Type',
  description: 'Manage my content type',
  href: '/admin/my-type',
  icon: '🎯',
}
```

Done! Your new content type is now manageable.

---

## 🔒 Security

### Row-Level Security (RLS)
- Only admins can access admin pages
- Each user can only modify own data (if applicable)
- All queries filtered by auth context

### Validation
- Required fields enforced
- Data types validated client-side
- Server-side validation on Supabase

### Audit Trail
- All changes logged to `activity` table
- Who made change and when recorded
- Can review change history

---

## ⚡ Performance Tips

### 1. Limit Table Display
```typescript
// Show only first 10 items by default
const displayItems = items.slice(0, 10)
```

### 2. Add Pagination
```typescript
const [page, setPage] = useState(1)
const itemsPerPage = 20
const offset = (page - 1) * itemsPerPage
```

### 3. Cache Data
```typescript
const [cache, setCache] = useState({})
if (cache[contentType]) {
  setItems(cache[contentType])
} else {
  // Load from server
}
```

### 4. Debounce Searches
```typescript
const [search, setSearch] = useState('')
const debouncedSearch = useCallback(
  debounce((value) => filterItems(value), 300),
  []
)
```

---

## 🐛 Troubleshooting

### Form Won't Submit
1. Check all required fields filled
2. Check browser console for errors
3. Verify admin role assigned
4. Check Supabase table exists

### Data Not Saving
1. Check Supabase connection
2. Verify RLS policies allow writes
3. Check email for error notifications
4. Review error logs in database

### Images Not Showing
1. Check storage buckets public
2. Verify file permissions
3. Check image URLs in database
4. See IMAGE_MANAGEMENT.md

### Fields Not Appearing
1. Check field name matches database column
2. Verify field type is correct
3. Check select options configured
4. Reload page to clear cache

---

## 📚 Related Documentation

- [AUTHENTICATION.md](./AUTHENTICATION.md) - User access management
- [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md) - Photo management
- [PASSWORD_RESET.md](./PASSWORD_RESET.md) - Password procedures
- [SMTP_CONFIGURATION.md](./SMTP_CONFIGURATION.md) - Email setup

---

## ✅ Summary

The admin system provides:

✅ Easy-to-use interface for all content types
✅ No database access required
✅ Instant updates and real-time sync
✅ Full CRUD operations
✅ Secure admin-only access
✅ Easily extensible for new types
✅ Audit trail of all changes
✅ Error handling and validation

**You now have complete control over all your content!**
