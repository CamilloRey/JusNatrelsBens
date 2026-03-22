/**
 * Admin - Product Image Manager
 * Manage images for a specific product
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useImageManagement } from '../hooks/useImageManagement'
import { ImageUploader } from './ImageUploader'
import type { Image } from '@/shared/types/images'

interface ProductImageManagerProps {
  productId: string
  productName?: string
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({ productId, productName }) => {
  const { uploadProductImg, updateImageData, deleteImageData, fetchProductImages, loading, error, successMessage } =
    useImageManagement()
  const [images, setImages] = useState<Image[]>([])
  const [loadingImages, setLoadingImages] = useState(true)

  useEffect(() => {
    loadImages()
  }, [productId])

  const loadImages = async () => {
    setLoadingImages(true)
    const imgs = await fetchProductImages(productId)
    setImages(imgs)
    setLoadingImages(false)
  }

  const handleUpload = async (file: File, metadata?: Record<string, string>) => {
    const result = await uploadProductImg(file, productId, metadata?.altText)
    if (result.success && result.image) {
      setImages((prev) => [...prev, result.image!])
    }
    return result
  }

  const handleSetPrimary = async (imageId: string) => {
    await updateImageData(imageId, { is_primary: true })
    // Clear primary flag from other images
    for (const img of images) {
      if (img.id !== imageId && img.is_primary) {
        await updateImageData(img.id, { is_primary: false })
      }
    }
    await loadImages()
  }

  const handleReorder = async (imageId: string, newOrder: number) => {
    await updateImageData(imageId, { display_order: newOrder })
    await loadImages()
  }

  const handleDelete = async (imageId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
      const success = await deleteImageData(imageId, true)
      if (success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId))
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gestion des Images - {productName}</h2>
        <p className="text-gray-600">Gérez les photos du produit {productName}</p>
      </div>

      {/* Messages */}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {successMessage && <div className="p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Ajouter une image</h3>
        <ImageUploader
          onUpload={handleUpload}
          loading={loading}
          maxSize={5 * 1024 * 1024} // 5MB for products
          metadata={[
            {
              field: 'altText',
              label: 'Texte alternatif',
              placeholder: 'Description de l\'image pour l\'accessibilité',
            },
          ]}
        />
      </div>

      {/* Images List */}
      {loadingImages ? (
        <div className="text-center py-8">Chargement des images...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 text-gray-600">Aucune image pour ce produit</div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Images du produit ({images.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images
              .sort((a, b) => a.display_order - b.display_order)
              .map((image, index) => (
                <div key={image.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={image.url} alt={image.alt_text} className="w-full h-full object-cover" />
                  </div>

                  {/* Image Info */}
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <strong>Taille:</strong> {image.file_size ? `${(image.file_size / 1024).toFixed(2)}KB` : 'N/A'}
                    </p>
                    {image.alt_text && <p className="text-gray-600 truncate" title={image.alt_text}>{image.alt_text}</p>}
                  </div>

                  {/* Primary Badge */}
                  {image.is_primary && <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">⭐ Image principale</div>}

                  {/* Order Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ordre ({index + 1})</label>
                    <input
                      type="number"
                      value={image.display_order}
                      onChange={(e) => handleReorder(image.id, parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {!image.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Principal
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
