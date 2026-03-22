# ✅ Admin Image Management - Setup Checklist

## Pre-Setup Verification

- [ ] Supabase project is created
- [ ] Supabase auth is configured
- [ ] You have admin access to Supabase
- [ ] Your user account exists in Supabase Auth

---

## Database Setup

### 1. Run Migration
- [ ] Execute: `supabase db push`
- [ ] Verify tables created in Supabase:
  - [ ] `images` table exists
  - [ ] `owner_photos` table exists
  - [ ] `user_roles` table updated
- [ ] Verify RLS policies created:
  - [ ] Admins can manage images
  - [ ] Public can read active images

### 2. Check Tables
```sql
-- Run in Supabase SQL Editor:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('images', 'owner_photos');
```
Expected: 2 tables

### 3. Verify RLS
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('images', 'owner_photos');
```
Expected: `rowsecurity = true` for both

---

## Storage Setup

### 4. Create Storage Buckets

#### Bucket 1: product-images
- [ ] Name: `product-images`
- [ ] Public: YES ✅
- [ ] In Supabase: Storage → New Bucket

#### Bucket 2: owner-photos
- [ ] Name: `owner-photos`
- [ ] Public: YES ✅
- [ ] In Supabase: Storage → New Bucket

### 5. Verify Buckets
```sql
-- List buckets in Supabase
SELECT name, public FROM storage.buckets;
```
Expected:
- `product-images` (public = true)
- `owner-photos` (public = true)

---

## Admin User Setup

### 6. Set Admin Role

Find your user ID:
```sql
SELECT id, email FROM auth.users LIMIT 10;
```

Add admin role (replace UUID):
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('<YOUR_USER_ID>', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET role = 'admin';
```

### 7. Verify Admin Role
```sql
SELECT user_id, role
FROM user_roles
WHERE role = 'admin';
```
Expected: Your user ID with `admin` role

---

## Code Integration

### 8. Components in Dashboard
- [ ] Import ImagesPage in your admin route
- [ ] Add `/admin/images` route
- [ ] Test component loads without errors

### 9. Test File Upload
```tsx
// Test component
import { ImageUploader } from '@/features/dashboard/components/ImageUploader'

<ImageUploader
  onUpload={async (file) => {
    console.log('Upload:', file)
    return { success: true }
  }}
/>
```

### 10. Test Product Images
- [ ] Navigate to `/admin/images`
- [ ] Select a product
- [ ] Upload test image
- [ ] Verify image appears in list
- [ ] Delete test image

### 11. Test Owner Gallery
- [ ] Navigate to `/admin/images`
- [ ] Click "Galerie Propriétaire"
- [ ] Upload test photo
- [ ] Add title and description
- [ ] Verify photo appears

---

## Real-Time Setup

### 12. Enable Realtime
In Supabase Dashboard:
- [ ] Database → Replication
- [ ] Find `images` table
- [ ] Toggle Realtime ON
- [ ] Find `owner_photos` table
- [ ] Toggle Realtime ON

### 13. Test Real-Time
- [ ] Open 2 browser windows to `/admin/images`
- [ ] In window 1: Upload a photo
- [ ] In window 2: Photo appears WITHOUT page reload
- [ ] Real-time working ✅

---

## Public Display

### 14. Product Images
- [ ] Add `getProductImages()` call to product page
- [ ] Display image URL in template
- [ ] Test on product page

### 15. Owner Gallery
- [ ] Add `getOwnerPhotoGallery()` call to gallery page
- [ ] Implement `useRealtimeOwnerPhotos()` subscription
- [ ] Test on gallery page
- [ ] Upload new photo from admin
- [ ] Verify instant update on gallery page

---

## Security Verification

### 16. RLS Policies
- [ ] Only admins can INSERT images
- [ ] Only admins can UPDATE images
- [ ] Only admins can DELETE images
- [ ] Public users can SELECT active images only

Verify:
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('images', 'owner_photos')
ORDER BY tablename;
```

### 17. Auth Check
- [ ] Non-admin user cannot upload images
- [ ] Public user can see active images only
- [ ] Admin can manage all images

---

## Performance Verification

### 18. Indexes
Verify indexes exist:
```sql
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename IN ('images', 'owner_photos')
ORDER BY tablename;
```

Expected indexes:
- `idx_images_product_id`
- `idx_images_bucket`
- `idx_images_active`
- `idx_images_is_primary`
- `idx_images_created_at`
- `idx_owner_photos_featured`
- `idx_owner_photos_active`
- `idx_owner_photos_gallery_section`

### 19. Performance Test
- [ ] Upload 10+ images (should be fast)
- [ ] Load product with 5+ images (check query time)
- [ ] Filter gallery by section (responsive)

---

## Final Verification

### 20. Complete Workflow Test

1. **Admin Workflow**
   - [ ] Login as admin
   - [ ] Navigate to `/admin/images`
   - [ ] Upload product image
   - [ ] Upload owner photo with metadata
   - [ ] Set primary image
   - [ ] Reorder images
   - [ ] Mark as featured
   - [ ] Delete image

2. **Public Workflow**
   - [ ] View product (images display)
   - [ ] View gallery (owner photos display)
   - [ ] Open in 2 windows
   - [ ] Upload from admin
   - [ ] Verify instant update (no page reload)

3. **Error Handling**
   - [ ] Try uploading invalid file type
   - [ ] Try file too large
   - [ ] Verify error message displays
   - [ ] Can retry after fixing

---

## Deployment Checklist

Before going to production:

- [ ] All tables migrated
- [ ] All storage buckets created and public
- [ ] All RLS policies active
- [ ] Realtime enabled on tables
- [ ] Admin user has correct role
- [ ] Components integrated in admin dashboard
- [ ] Product pages display images
- [ ] Gallery page implemented
- [ ] Real-time subscriptions working
- [ ] Error handling implemented
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] SEO attributes set (alt text)

---

## Troubleshooting Checklist

If something doesn't work:

### Upload fails?
- [ ] Check bucket is PUBLIC
- [ ] Check bucket name matches code: `product-images`, `owner-photos`
- [ ] Check file size < limits (5MB products, 10MB gallery)
- [ ] Check file type (JPEG, PNG, WebP)
- [ ] Check admin role in user_roles

### Images not visible?
- [ ] Check image.active = TRUE
- [ ] Check image.url is valid
- [ ] Check bucket is PUBLIC
- [ ] Check RLS policies
- [ ] Clear browser cache

### Real-time not working?
- [ ] Check Realtime enabled in Supabase
- [ ] Check browser has active connection
- [ ] Check console for errors
- [ ] Verify user authenticated
- [ ] Refresh browser

### Admin can't access?
- [ ] Check user has admin role
- [ ] Check auth.uid() matches user_roles.user_id
- [ ] Check RLS policies
- [ ] Check user is logged in
- [ ] Check Supabase connection

---

## Support Resources

- 📚 Full Docs: [IMAGE_MANAGEMENT.md](./docs/IMAGE_MANAGEMENT.md)
- 🚀 Quick Start: [SETUP_IMAGES.md](./SETUP_IMAGES.md)
- 💻 Code: [src/lib/images.ts](./src/lib/images.ts)
- 🎨 Components: [src/features/dashboard/components/](./src/features/dashboard/components/)

---

## Completion Status

**Overall Setup Progress:**
- [ ] Database: ____/10
- [ ] Storage: ____/5
- [ ] Admin: ____/7
- [ ] Integration: ____/10
- [ ] Real-time: ____/3
- [ ] Verification: ____/20

**Total:** ____/55 steps complete

✅ **When all boxes are checked, your image management system is production-ready!**
