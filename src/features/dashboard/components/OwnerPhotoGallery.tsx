/**
 * Admin - Owner Photo Gallery Manager
 * Manage the owner's photo gallery with live Realtime updates
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useImageManagement } from '../hooks/useImageManagement'
import { ImageUploader } from './ImageUploader'
import type { OwnerPhoto } from '@/shared/types/images'

type GallerySection = 'all' | 'products' | 'process' | 'events' | 'general'

interface OwnerPhotoGalleryProps {
  onPhotoAdded?: (photo: OwnerPhoto) => void
}

export const OwnerPhotoGallery: React.FC<OwnerPhotoGalleryProps> = ({ onPhotoAdded }) => {
  const { uploadGalleryPhoto, updateImageData, deleteImageData, fetchOwnerPhotos, loading, error, successMessage } =
    useImageManagement()
  const [photos, setPhotos] = useState<OwnerPhoto[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [selectedSection, setSelectedSection] = useState<GallerySection>('all')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    location: '',
  })

  const sections: GallerySection[] = ['all', 'products', 'process', 'events', 'general']

  useEffect(() => {
    loadPhotos()
  }, [selectedSection])

  const loadPhotos = async () => {
    setLoadingPhotos(true)
    const allPhotos = await fetchOwnerPhotos(selectedSection === 'all' ? undefined : selectedSection)
    setPhotos(allPhotos)
    setLoadingPhotos(false)
  }

  const handleUpload = async (file: File) => {
    const result = await uploadGalleryPhoto(file, uploadData.title, uploadData.description, uploadData.location)

    if (result.success && result.photo) {
      setPhotos((prev) => [result.photo!, ...prev])
      setShowUploadForm(false)
      setUploadData({ title: '', description: '', location: '' })
      onPhotoAdded?.(result.photo)
    }

    return {
      success: result.success,
      error: result.error,
    }
  }

  const handleToggleFeatured = async (photoId: string, currentFeatured: boolean) => {
    const imageId = photos.find((p) => p.id === photoId)?.image_id
    if (imageId) {
      await updateImageData(imageId, { is_primary: !currentFeatured })
      await loadPhotos()
    }
  }

  const handleDelete = async (photoId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo?')) {
      const photo = photos.find((p) => p.id === photoId)
      if (photo) {
        const success = await deleteImageData(photo.image_id, true)
        if (success) {
          setPhotos((prev) => prev.filter((p) => p.id !== photoId))
        }
      }
    }
  }

  const handleUpdatePhoto = async (photoId: string, updates: Partial<OwnerPhoto>) => {
    // Update via database if needed
    await loadPhotos()
  }

  const filteredPhotos = selectedSection === 'all' ? photos : photos.filter((p) => p.gallery_section === selectedSection)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Galerie Photos - Propriétaire</h2>
        <p className="text-gray-600">Gérez vos photos et images de galerie avec synchronisation en temps réel</p>
      </div>

      {/* Messages */}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {successMessage && <div className="p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}

      {/* Upload Toggle */}
      <button
        onClick={() => setShowUploadForm(!showUploadForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
      >
        {showUploadForm ? 'Masquer le formulaire' : '+ Ajouter une photo'}
      </button>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold">Ajouter une nouvelle photo</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre (optionnel)</label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la photo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (optionnel)</label>
              <input
                type="text"
                value={uploadData.location}
                onChange={(e) => setUploadData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Lieu de la photo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la photo"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ImageUploader onUpload={handleUpload} loading={loading} maxSize={10 * 1024 * 1024} placeholder="Cliquez ou déposez votre photo" />
        </div>
      )}

      {/* Section Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sections</h3>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSection === section ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section === 'all' ? 'Tous' : section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      {loadingPhotos ? (
        <div className="text-center py-8">Chargement des photos...</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-8 text-gray-600">Aucune photo dans cette section</div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Photos ({filteredPhotos.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image */}
                {photo.image && (
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img src={photo.image.url} alt={photo.title || 'Photo'} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {photo.title && <h4 className="font-semibold text-gray-900">{photo.title}</h4>}
                      {photo.location && <p className="text-xs text-gray-600">📍 {photo.location}</p>}
                    </div>
                    {photo.featured && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">Vedette</span>}
                  </div>

                  {/* Description */}
                  {photo.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{photo.description}</p>
                  )}

                  {/* Section Badge */}
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      {photo.gallery_section.charAt(0).toUpperCase() + photo.gallery_section.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleToggleFeatured(photo.id, photo.featured)}
                      className={`flex-1 px-3 py-1 text-sm rounded font-medium transition-colors ${
                        photo.featured
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {photo.featured ? '⭐ Vedette' : 'Vedette'}
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
