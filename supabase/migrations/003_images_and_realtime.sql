-- ════════════════════════════════════════════════════════════════════════════
-- Migration: Images and Realtime Support
-- Description: Add image management with Realtime for fast photo availability
-- ════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- TABLE: images (centralized image management)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Image metadata
  bucket TEXT NOT NULL,  -- 'product-images', 'owner-photos', etc.
  path TEXT NOT NULL,    -- path in storage bucket
  url TEXT NOT NULL,     -- full Supabase storage URL

  -- Relations
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id TEXT REFERENCES ingredients(id) ON DELETE CASCADE,

  -- Owner upload tracking
  uploaded_by_admin BOOLEAN DEFAULT FALSE,  -- TRUE if owner uploaded

  -- Metadata
  alt_text TEXT DEFAULT '',
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'image/jpeg',

  -- Status & sorting
  is_primary BOOLEAN DEFAULT FALSE,  -- main image for product
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable Realtime on images table (for live photo updates)
ALTER PUBLICATION supabase_realtime ADD TABLE images;

-- Create RLS policies for images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Public: can read active images
CREATE POLICY "Anyone can read active images" ON images
  FOR SELECT USING (active = TRUE);

-- Admins: can manage all images
CREATE POLICY "Admins can manage images" ON images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- Add image tracking to products (if not exists)
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_image_id UUID REFERENCES images(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_count INTEGER DEFAULT 0;

-- ────────────────────────────────────────────────────────────────────────────
-- Add image tracking to ingredients (if not exists)
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES images(id);

-- ────────────────────────────────────────────────────────────────────────────
-- TABLE: owner_photos (dedicated gallery for owner-uploaded photos)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS owner_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Image reference
  image_id UUID NOT NULL UNIQUE REFERENCES images(id) ON DELETE CASCADE,

  -- Photo metadata
  title TEXT,
  description TEXT,
  location TEXT,  -- where the photo was taken

  -- Display settings
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,

  -- Gallery organization
  gallery_section TEXT DEFAULT 'general',  -- 'products', 'process', 'events', 'general'

  -- Timestamps
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable Realtime on owner_photos (for live gallery updates)
ALTER PUBLICATION supabase_realtime ADD TABLE owner_photos;

-- Create RLS policies for owner_photos
ALTER TABLE owner_photos ENABLE ROW LEVEL SECURITY;

-- Public: can read active photos
CREATE POLICY "Anyone can read active owner photos" ON owner_photos
  FOR SELECT USING (active = TRUE);

-- Admins: can manage all owner photos
CREATE POLICY "Admins can manage owner photos" ON owner_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_images_product_id ON images(product_id);
CREATE INDEX IF NOT EXISTS idx_images_ingredient_id ON images(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_images_bucket ON images(bucket);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(active);
CREATE INDEX IF NOT EXISTS idx_images_is_primary ON images(is_primary);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_owner_photos_featured ON owner_photos(featured);
CREATE INDEX IF NOT EXISTS idx_owner_photos_active ON owner_photos(active);
CREATE INDEX IF NOT EXISTS idx_owner_photos_gallery_section ON owner_photos(gallery_section);
CREATE INDEX IF NOT EXISTS idx_owner_photos_created_at ON owner_photos(created_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- TRIGGER: Update products image_count when images change
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_product_image_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE products SET image_count = image_count - 1 WHERE id = OLD.product_id;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE products SET image_count = image_count + 1 WHERE id = NEW.product_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_image_count
AFTER INSERT OR DELETE ON images
FOR EACH ROW
EXECUTE FUNCTION update_product_image_count();

-- ────────────────────────────────────────────────────────────────────────────
-- TRIGGER: Auto-update timestamps
-- ────────────────────────────────────────────────────────────────────────────
CREATE TRIGGER trigger_update_images_timestamp
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_owner_photos_timestamp
BEFORE UPDATE ON owner_photos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (to be created in Supabase Dashboard)
-- ────────────────────────────────────────────────────────────────────────────
-- 1. product-images (already exists)
--    - For product photos
--    - Public access
--    - Max size: 5MB per file
--
-- 2. owner-photos (create new)
--    - For owner/gallery photos
--    - Public access
--    - Max size: 10MB per file
--
-- See: Storage → Create Bucket in Supabase Dashboard
