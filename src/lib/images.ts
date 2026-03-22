/**
 * Image Management Utilities
 * Handles image uploads, Realtime subscriptions, and photo gallery management
 */

import { supabase } from '@/lib/supabase'
import type { Image, OwnerPhoto, ImageUploadResult, OwnerPhotoUploadResult } from '@/shared/types/images'

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string, path: string): Promise<{ url: string; path: string } | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Storage upload error:', error)
      return null
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path)

    return {
      url: publicData.publicUrl,
      path: data.path,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

/**
 * Add image record to database with Realtime sync
 */
export async function addImageRecord(imageData: Partial<Image>): Promise<ImageUploadResult> {
  try {
    const { data, error } = await supabase
      .from('images')
      .insert([imageData])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      image: data,
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Upload product image (with database record)
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  altText?: string
): Promise<ImageUploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '_')
    const filename = `${productId}/${timestamp}-${sanitizedName}`

    // Upload to storage
    const uploadResult = await uploadImage(file, 'product-images', filename)
    if (!uploadResult) {
      return { success: false, error: 'Failed to upload to storage' }
    }

    // Create database record
    const imageRecord = await addImageRecord({
      bucket: 'product-images',
      path: uploadResult.path,
      url: uploadResult.url,
      product_id: productId,
      alt_text: altText || file.name,
      mime_type: file.type,
      file_size: file.size,
      uploaded_by_admin: true,
    })

    return imageRecord
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Upload owner/gallery photo
 */
export async function uploadOwnerPhoto(
  file: File,
  title?: string,
  description?: string,
  location?: string
): Promise<OwnerPhotoUploadResult> {
  try {
    // Upload image to storage
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '_')
    const filename = `owner-photos/${timestamp}-${sanitizedName}`

    const uploadResult = await uploadImage(file, 'owner-photos', filename)
    if (!uploadResult) {
      return { success: false, error: 'Failed to upload photo' }
    }

    // Create image record
    const imageData: Partial<Image> = {
      bucket: 'owner-photos',
      path: uploadResult.path,
      url: uploadResult.url,
      alt_text: title || file.name,
      mime_type: file.type,
      file_size: file.size,
      uploaded_by_admin: true,
      active: true,
    }

    const { data: imageRecord, error: imageError } = await supabase
      .from('images')
      .insert([imageData])
      .select()
      .single()

    if (imageError) {
      return { success: false, error: imageError.message }
    }

    // Create owner_photos record
    const { data: photoData, error: photoError } = await supabase
      .from('owner_photos')
      .insert([
        {
          image_id: imageRecord.id,
          title,
          description,
          location,
          gallery_section: 'general',
          active: true,
        },
      ])
      .select()
      .single()

    if (photoError) {
      return { success: false, error: photoError.message }
    }

    // Fetch full photo data with image
    const { data: fullPhoto } = await supabase
      .from('owner_photos')
      .select('*, image:image_id(*)')
      .eq('id', photoData.id)
      .single()

    return {
      success: true,
      photo: fullPhoto as OwnerPhoto,
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

/**
 * Subscribe to realtime image updates
 */
export function subscribeToImageUpdates(
  productId?: string,
  callback?: (event: any) => void
) {
  if (!supabase) return null

  const filter = productId ? `product_id=eq.${productId}` : undefined
  const channel = supabase
    .channel('images-changes')
    .on(
      'postgres_changes' as any,
      { event: '*', schema: 'public', table: 'images', ...(filter ? { filter } : {}) },
      (payload: any) => {
        console.log('Image update:', payload)
        callback?.(payload)
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to realtime owner photo updates
 */
export function subscribeToOwnerPhotoUpdates(callback?: (event: any) => void) {
  if (!supabase) return null

  const channel = supabase
    .channel('owner-photos-changes')
    .on(
      'postgres_changes' as any,
      { event: '*', schema: 'public', table: 'owner_photos' },
      (payload: any) => {
        console.log('Owner photo update:', payload)
        callback?.(payload)
      }
    )
    .subscribe()

  return channel
}

/**
 * Get product images
 */
export async function getProductImages(productId: string): Promise<Image[]> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('product_id', productId)
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching product images:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

/**
 * Get owner photo gallery
 */
export async function getOwnerPhotoGallery(section?: string): Promise<OwnerPhoto[]> {
  try {
    let query = supabase
      .from('owner_photos')
      .select('*, image:image_id(*)')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (section && section !== 'all') {
      query = query.eq('gallery_section', section)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching owner photos:', error)
      return []
    }

    return (data || []) as OwnerPhoto[]
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

/**
 * Update image metadata
 */
export async function updateImage(id: string, updates: Partial<Image>) {
  try {
    const { data, error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating image:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

/**
 * Delete image (soft delete - sets active to false)
 */
export async function deleteImage(id: string, hardDelete = false) {
  try {
    if (hardDelete) {
      // Get image info first
      const { data: image } = await supabase
        .from('images')
        .select('bucket, path')
        .eq('id', id)
        .single()

      if (image) {
        // Delete from storage
        await supabase.storage.from(image.bucket).remove([image.path])
      }

      // Delete record
      const { error } = await supabase.from('images').delete().eq('id', id)
      return !error
    } else {
      // Soft delete
      const { error } = await supabase
        .from('images')
        .update({ active: false })
        .eq('id', id)

      return !error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}
