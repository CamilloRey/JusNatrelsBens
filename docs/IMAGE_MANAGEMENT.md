# 📸 Image Management System

Complete image management with Realtime synchronization for JusNatrelsBens.

## Features

✅ **Admin Photo Management**
- Upload product images
- Manage owner/gallery photos
- Set primary images
- Reorder images
- Soft & hard delete options

✅ **Realtime Synchronization**
- Live photo updates across all clients
- Instant gallery refresh
- Real-time product image sync

✅ **Drag & Drop Upload**
- Easy image upload with preview
- File validation
- Progress tracking

✅ **Image Organization**
- Gallery sections (products, process, events, general)
- Image ordering
- Featured/primary image marking
- Metadata support (title, description, location)

## Database Schema

### `images` Table
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY,
  bucket TEXT -- 'product-images' or 'owner-photos'
  path TEXT,
  url TEXT,
  product_id TEXT FOREIGN KEY,
  ingredient_id TEXT FOREIGN KEY,
  uploaded_by_admin BOOLEAN,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT,
  is_primary BOOLEAN,
  display_order INTEGER,
  active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `owner_photos` Table
```sql
CREATE TABLE owner_photos (
  id UUID PRIMARY KEY,
  image_id UUID FOREIGN KEY,
  title TEXT,
  description TEXT,
  location TEXT,
  featured BOOLEAN,
  display_order INTEGER,
  active BOOLEAN,
  gallery_section TEXT, -- 'products', 'process', 'events', 'general'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Storage Buckets

### `product-images` (Public)
- For product photos
- Max size: 5MB per file
- Path: `{productId}/{timestamp}-{filename}`

### `owner-photos` (Public)
- For owner/gallery photos
- Max size: 10MB per file
- Path: `owner-photos/{timestamp}-{filename}`

## Usage Guide

### 1. Setup Database

Run the migration:
```bash
supabase db push
```

### 2. Create Storage Buckets

In Supabase Dashboard:
1. Storage → Create Bucket
2. Name: `product-images`, Public: YES
3. Name: `owner-photos`, Public: YES

### 3. Admin Components

#### Upload Product Images
```tsx
import { ProductImageManager } from '@/features/dashboard/components/ProductImageManager'

<ProductImageManager productId="prod-123" productName="Orange Juice" />
```

#### Manage Owner Gallery
```tsx
import { OwnerPhotoGallery } from '@/features/dashboard/components/OwnerPhotoGallery'

<OwnerPhotoGallery onPhotoAdded={(photo) => console.log(photo)} />
```

#### Admin Dashboard
```tsx
import { ImagesPage } from '@/features/dashboard/pages/ImagesPage'

<ImagesPage products={products} />
```

### 4. Using Image Management Hook

```tsx
import { useImageManagement } from '@/features/dashboard/hooks/useImageManagement'

const MyComponent = () => {
  const {
    uploadProductImg,
    uploadGalleryPhoto,
    updateImageData,
    deleteImageData,
    fetchProductImages,
    fetchOwnerPhotos,
    loading,
    error,
    successMessage,
  } = useImageManagement()

  // Upload product image
  const result = await uploadProductImg(file, 'product-id', 'Alt text')

  // Upload gallery photo
  const result = await uploadGalleryPhoto(file, 'Title', 'Description', 'Location')

  // Update image
  await updateImageData(imageId, { is_primary: true })

  // Delete image
  await deleteImageData(imageId, true) // true = hard delete
}
```

### 5. Realtime Subscriptions

Listen for live image updates:

```tsx
import { useRealtimeProductImages, useRealtimeOwnerPhotos } from '@/hooks/useRealtimeImages'

// Subscribe to product images
const { unsubscribe } = useRealtimeProductImages(productId, (event) => {
  console.log('Image updated:', event)
})

// Subscribe to owner photos
const { unsubscribe } = useRealtimeOwnerPhotos((event) => {
  console.log('Photo updated:', event)
})
```

### 6. Get Images

Fetch images from database:

```tsx
import { getProductImages, getOwnerPhotoGallery } from '@/lib/images'

// Get product images
const images = await getProductImages('product-id')

// Get owner photo gallery
const photos = await getOwnerPhotoGallery('products') // or 'all', 'process', 'events', 'general'
```

## Admin Permissions

RLS Policies ensure only admins can manage images:

```sql
-- Admins can manage all images
CREATE POLICY "Admins can manage images" ON images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Public users can only read active images
CREATE POLICY "Anyone can read active images" ON images
  FOR SELECT USING (active = TRUE);
```

## Display Images on Public Pages

```tsx
import { getProductImages } from '@/lib/images'

export async function ProductCard({ productId }) {
  const images = await getProductImages(productId)
  const primaryImage = images.find((img) => img.is_primary) || images[0]

  return (
    <div>
      {primaryImage && (
        <img
          src={primaryImage.url}
          alt={primaryImage.alt_text || 'Product'}
          className="w-full h-auto"
        />
      )}
    </div>
  )
}
```

## Realtime in Public Components

Components automatically update when admin uploads photos:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRealtimeProductImages } from '@/hooks/useRealtimeImages'
import { getProductImages } from '@/lib/images'

export function ProductGallery({ productId }) {
  const [images, setImages] = useState([])

  // Initial load
  useEffect(() => {
    getProductImages(productId).then(setImages)
  }, [productId])

  // Subscribe to realtime updates
  useRealtimeProductImages(productId, (event) => {
    if (event.type === 'INSERT' || event.type === 'UPDATE') {
      // Reload images on change
      getProductImages(productId).then(setImages)
    }
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <img key={img.id} src={img.url} alt={img.alt_text} />
      ))}
    </div>
  )
}
```

## File Structure

```
src/
├── features/dashboard/
│   ├── components/
│   │   ├── ImageUploader.tsx        # Drag & drop upload component
│   │   ├── ProductImageManager.tsx  # Product image management
│   │   └── OwnerPhotoGallery.tsx    # Owner gallery management
│   ├── hooks/
│   │   └── useImageManagement.ts    # Image management hook
│   └── pages/
│       └── ImagesPage.tsx            # Admin images page
├── hooks/
│   └── useRealtimeImages.ts          # Realtime subscription hooks
├── lib/
│   └── images.ts                     # Image utilities & API calls
├── shared/
│   └── types/
│       └── images.ts                 # TypeScript types
└── supabase/migrations/
    └── 003_images_and_realtime.sql   # Database migration
```

## Troubleshooting

### Images not uploading?
- Check Storage bucket permissions (must be PUBLIC)
- Check file size limits (5MB for products, 10MB for gallery)
- Verify image file types (JPEG, PNG, WebP)

### Realtime not working?
- Check if Realtime is enabled in Supabase project
- Verify user has authentication
- Check browser console for errors

### Admin can't upload?
- Verify user role is 'admin' in user_roles table
- Check RLS policies are enabled
- Verify Supabase auth is configured

### Images not visible?
- Check if `active = true` in database
- Verify URL is public in Supabase Storage
- Check image bucket exists and is public

## Next Steps

1. ✅ Run database migration
2. ✅ Create storage buckets
3. ✅ Add ImagesPage to admin dashboard
4. ✅ Add product image upload to product editor
5. ✅ Add gallery section to website
6. ✅ Configure Realtime in Supabase
7. ✅ Add image previews to product pages
