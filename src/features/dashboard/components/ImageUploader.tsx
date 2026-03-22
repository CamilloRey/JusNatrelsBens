/**
 * Admin - Image Uploader Component
 * Handles image uploads with drag-and-drop support
 */

'use client'

import React, { useState, useRef } from 'react'
import type { ImageUploadResult } from '@/shared/types/images'

interface ImageUploaderProps {
  onUpload: (file: File, metadata?: Record<string, string>) => Promise<ImageUploadResult>
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  loading?: boolean
  placeholder?: string
  metadata?: {
    field: string
    label: string
    placeholder?: string
  }[]
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  loading = false,
  placeholder = 'Déposez une image ou cliquez',
  metadata = [],
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [metadataValues, setMetadataValues] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Type non accepté. Acceptés: ${acceptedTypes.join(', ')}`
    }
    if (file.size > maxSize) {
      return `Fichier trop volumineux (max ${maxSize / 1024 / 1024}MB)`
    }
    return null
  }

  const handleFile = async (file: File) => {
    const validation = validateFile(file)
    if (validation) {
      alert(validation)
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploading(true)
    try {
      const result = await onUpload(file, metadataValues)
      if (result.success) {
        // Reset form
        setPreview('')
        setMetadataValues({})
        if (inputRef.current) inputRef.current.value = ''
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          disabled={uploading}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded" />
            <p className="text-sm text-gray-600">Image sélectionnée</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="text-gray-700 font-medium">{placeholder}</p>
            <p className="text-sm text-gray-500">ou déposez-la ici</p>
          </div>
        )}
      </div>

      {/* Metadata Fields */}
      {metadata.length > 0 && (
        <div className="mt-6 space-y-4">
          {metadata.map((field) => (
            <div key={field.field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                value={metadataValues[field.field] || ''}
                onChange={(e) =>
                  setMetadataValues((prev) => ({
                    ...prev,
                    [field.field]: e.target.value,
                  }))
                }
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {preview && (
        <button
          onClick={() => {
            const file = inputRef.current?.files?.[0]
            if (file) handleFile(file)
          }}
          disabled={uploading || loading}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {uploading || loading ? 'Upload en cours...' : 'Uploader'}
        </button>
      )}
    </div>
  )
}
