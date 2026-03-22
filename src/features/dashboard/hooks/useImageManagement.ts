/**
 * Admin - Image Management Hook
 * Handles image uploads, updates, and deletions for admin users
 */

import { useState, useCallback } from 'react'
import {
  uploadProductImage,
  uploadOwnerPhoto,
  updateImage,
  deleteImage,
  getProductImages,
  getOwnerPhotoGallery,
} from '@/lib/images'
import type { Image, OwnerPhoto, ImageUploadResult, OwnerPhotoUploadResult } from '@/shared/types/images'

export const useImageManagement = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const uploadProductImg = useCallback(
    async (file: File, productId: string, altText?: string): Promise<ImageUploadResult> => {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      try {
        const result = await uploadProductImage(file, productId, altText)

        if (result.success) {
          setSuccessMessage(`Photo produit uploadée avec succès: ${file.name}`)
        } else {
          setError(result.error || 'Erreur lors de l\'upload')
        }

        return result
      } catch (err) {
        const errorMsg = String(err)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const uploadGalleryPhoto = useCallback(
    async (
      file: File,
      title?: string,
      description?: string,
      location?: string
    ): Promise<OwnerPhotoUploadResult> => {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      try {
        const result = await uploadOwnerPhoto(file, title, description, location)

        if (result.success) {
          setSuccessMessage(`Photo galerie ajoutée: ${title || file.name}`)
        } else {
          setError(result.error || 'Erreur lors de l\'upload')
        }

        return result
      } catch (err) {
        const errorMsg = String(err)
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateImageData = useCallback(
    async (id: string, updates: Partial<Image>): Promise<Image | null> => {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      try {
        const result = await updateImage(id, updates)

        if (result) {
          setSuccessMessage('Image mise à jour')
        } else {
          setError('Erreur lors de la mise à jour')
        }

        return result
      } catch (err) {
        const errorMsg = String(err)
        setError(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteImageData = useCallback(
    async (id: string, hardDelete = false): Promise<boolean> => {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      try {
        const result = await deleteImage(id, hardDelete)

        if (result) {
          setSuccessMessage(`Image supprimée ${hardDelete ? 'définitivement' : 'temporairement'}`)
        } else {
          setError('Erreur lors de la suppression')
        }

        return result
      } catch (err) {
        const errorMsg = String(err)
        setError(errorMsg)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchProductImages = useCallback(async (productId: string): Promise<Image[]> => {
    try {
      return await getProductImages(productId)
    } catch (err) {
      console.error('Error fetching product images:', err)
      return []
    }
  }, [])

  const fetchOwnerPhotos = useCallback(async (section?: string): Promise<OwnerPhoto[]> => {
    try {
      return await getOwnerPhotoGallery(section)
    } catch (err) {
      console.error('Error fetching owner photos:', err)
      return []
    }
  }, [])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMessage(null)
  }, [])

  return {
    // State
    loading,
    error,
    successMessage,

    // Functions
    uploadProductImg,
    uploadGalleryPhoto,
    updateImageData,
    deleteImageData,
    fetchProductImages,
    fetchOwnerPhotos,
    clearMessages,
  }
}
