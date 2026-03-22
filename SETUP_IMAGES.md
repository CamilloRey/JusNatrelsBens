# 🚀 Quick Start - Image Management Setup

Complete setup guide for image management with Realtime sync.

## Step 1: Run Database Migration ✅

```bash
# Navigate to project
cd JusNatrelsBens

# Push migration to Supabase
supabase db push
```

This creates:
- `images` table (with Realtime enabled)
- `owner_photos` table (with Realtime enabled)
- RLS policies for admin access
- Triggers and indexes

## Step 2: Create Storage Buckets in Supabase ✅

### Via Supabase Dashboard:

1. Go to **Storage** in your Supabase project
2. Click **"Create a new bucket"**

#### Bucket 1: `product-images`
- **Name:** `product-images`
- **Public:** YES (toggle on)
- **Create**

#### Bucket 2: `owner-photos`
- **Name:** `owner-photos`
- **Public:** YES (toggle on)
- **Create**

## Step 3: Verify Admin Role ✅

Ensure your admin user has the correct role in database:

```sql
-- Check user roles in Supabase SQL Editor
SELECT * FROM user_roles WHERE role = 'admin';

-- If not present, add admin role:
INSERT INTO user_roles (user_id, role)
VALUES ('<your-user-id>', 'admin');
```

## Step 4: Add Image Management to Admin Dashboard ✅

### Option A: Quick Integration

Create a new admin page (e.g., `/admin/images`):

```tsx
// app/admin/images/page.tsx
import { ImagesPage } from '@/features/dashboard/pages/ImagesPage'
import { getProducts } from '@/lib/api/products'

export default async function AdminImagesPage() {
  const products = await getProducts()
  return <ImagesPage products={products} />
}
```

### Option B: Custom Integration

Use individual components:

```tsx
'use client'

import { ProductImageManager } from '@/features/dashboard/components/ProductImageManager'
import { OwnerPhotoGallery } from '@/features/dashboard/components/OwnerPhotoGallery'

export default function ImagesPage() {
  return (
    <div className="space-y-8">
      {/* Owner Gallery */}
      <section>
        <OwnerPhotoGallery />
      </section>

      {/* Product Images */}
      <section>
        <ProductImageManager productId="prod-123" productName="Product Name" />
      </section>
    </div>
  )
}
```

## Step 5: Add Images to Product Pages ✅

Display product images on public pages:

```tsx
// components/ProductCard.tsx
import { getProductImages } from '@/lib/images'

export async function ProductCard({ productId, productName }) {
  const images = await getProductImages(productId)
  const mainImage = images.find(img => img.is_primary) || images[0]

  return (
    <div>
      {mainImage && (
        <img
          src={mainImage.url}
          alt={mainImage.alt_text || productName}
          className="w-full h-auto object-cover"
        />
      )}
      <h2>{productName}</h2>
    </div>
  )
}
```

## Step 6: Add Live Photo Gallery ✅

Show owner's photo gallery with real-time updates:

```tsx
// components/PhotoGallery.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRealtimeOwnerPhotos } from '@/hooks/useRealtimeImages'
import { getOwnerPhotoGallery } from '@/lib/images'

export function PhotoGallery({ section = 'all' }) {
  const [photos, setPhotos] = useState([])

  // Initial load
  useEffect(() => {
    getOwnerPhotoGallery(section === 'all' ? undefined : section)
      .then(setPhotos)
  }, [section])

  // Subscribe to real-time updates
  useRealtimeOwnerPhotos((event) => {
    // Reload photos when gallery changes
    getOwnerPhotoGallery(section === 'all' ? undefined : section)
      .then(setPhotos)
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map(photo => (
        <div key={photo.id} className="rounded-lg overflow-hidden">
          {photo.image && (
            <img
              src={photo.image.url}
              alt={photo.title || 'Photo'}
              className="w-full h-64 object-cover"
            />
          )}
          {photo.title && (
            <div className="p-4">
              <h3 className="font-semibold">{photo.title}</h3>
              {photo.description && (
                <p className="text-gray-600 text-sm">{photo.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

## Step 7: Test Everything ✅

### Test Admin Upload:
1. Go to `/admin/images`
2. Click "Add Photo" or select a product
3. Upload an image
4. Verify it appears in the list
5. Test reordering, marking as primary, deleting

### Test Real-time Updates:
1. Open two browser windows
2. In one window, upload a photo
3. Verify it appears instantly in the other window (no page refresh)

### Test Public Display:
1. Go to product page
2. Verify uploaded image displays
3. Upload new image from admin
4. Verify it appears instantly

## Troubleshooting

### ❌ "Permission denied" error
```
Solution: Check user has admin role
1. Go to Supabase SQL Editor
2. Run: SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID'
3. If no row: INSERT INTO user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'admin')
```

### ❌ Files won't upload
```
Solution: Check storage bucket permissions
1. Go to Storage in Supabase
2. Click bucket name
3. Check "Make it public" is enabled
4. Verify bucket names: product-images, owner-photos
```

### ❌ Images not visible publicly
```
Solution: Check image is active in database
1. Go to Supabase SQL Editor
2. Run: SELECT id, active, url FROM images LIMIT 10
3. Ensure active = TRUE
4. Verify URL is accessible (paste in browser)
```

### ❌ Real-time not working
```
Solution: Enable Realtime in Supabase
1. Go to Database → Replication
2. Check "images" table has Realtime enabled
3. Check "owner_photos" table has Realtime enabled
4. Check browser console for errors
```

### ❌ Admin can't see products
```
Solution: Fetch products list
1. Pass products array to ImagesPage: <ImagesPage products={products} />
2. Or use example: import { EXAMPLE_PRODUCTS } from '@/features/dashboard/pages/AdminImagesExample'
```

## File Paths Reference

```
Admin Components:
├── /admin/images → ImagesPage component
├── /admin/images/product/[id] → ProductImageManager
└── /admin/images/gallery → OwnerPhotoGallery

Public Display:
├── /products/[id] → ProductCard with images
└── /gallery → PhotoGallery with real-time updates

Code Location:
├── src/lib/images.ts → Image utilities
├── src/features/dashboard/hooks/useImageManagement.ts → Admin hook
├── src/features/dashboard/components/ → All UI components
└── src/hooks/useRealtimeImages.ts → Real-time subscriptions
```

## Admin Workflow

### 1. Upload Product Images
1. Go to `/admin/images` → "Photos Produits"
2. Select a product
3. Click "Add Photo" (or drag & drop)
4. Set as primary image (star icon)
5. Reorder as needed
6. Delete when done

### 2. Manage Owner Gallery
1. Go to `/admin/images` → "Galerie Propriétaire"
2. Click "+ Add Photo"
3. Fill in title, description, location
4. Drag & drop image
5. Click "Upload"
6. Organize photos by section
7. Mark as featured (⭐)

### 3. View Updates Live
- Photos appear instantly on product pages
- Gallery refreshes without page reload
- All clients see updates in real-time

## Summary

✅ Database migrated
✅ Storage buckets created
✅ Admin role verified
✅ Components integrated
✅ Real-time subscriptions working
✅ Product images displaying
✅ Owner gallery visible

🎉 **Image Management Ready!**

For detailed documentation, see: [IMAGE_MANAGEMENT.md](./docs/IMAGE_MANAGEMENT.md)
