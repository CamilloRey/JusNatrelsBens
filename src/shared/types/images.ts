/**
 * Image Management Types
 * Types for product images, owner photos, and Realtime synchronization
 */

export interface Image {
  id: string;
  bucket: 'product-images' | 'owner-photos' | string;
  path: string;
  url: string;

  // Relations
  product_id?: string | null;
  ingredient_id?: string | null;

  // Metadata
  alt_text?: string;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type: string;

  // Status & Display
  is_primary: boolean;
  display_order: number;
  active: boolean;
  uploaded_by_admin: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface OwnerPhoto {
  id: string;
  image_id: string;
  image?: Image;

  // Photo metadata
  title?: string;
  description?: string;
  location?: string;

  // Display settings
  featured: boolean;
  display_order: number;
  active: boolean;
  gallery_section: 'products' | 'process' | 'events' | 'general';

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface ImageUploadOptions {
  bucket: string;
  path: string;
  file: File;
  altText?: string;
  productId?: string;
  ingredientId?: string;
}

export interface ImageUploadResult {
  success: boolean;
  image?: Image;
  error?: string;
  details?: {
    url: string;
    path: string;
    size: number;
  };
}

export interface OwnerPhotoUploadResult {
  success: boolean;
  photo?: OwnerPhoto;
  error?: string;
}

/**
 * Realtime subscription types for live image updates
 */
export interface ImageRealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: Image;
  old?: Image;
  eventType: string;
  schema: string;
  table: string;
}

export interface OwnerPhotoRealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  new?: OwnerPhoto;
  old?: OwnerPhoto;
  eventType: string;
  schema: string;
  table: string;
}
