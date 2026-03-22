/**
 * Admin Content Manager
 * Generic component to manage any content (products, blogs, locations, etc.)
 */

'use client'

import React, { useState, useEffect } from 'react'
import { productsCRUD, blogsCRUD, locationsCRUD, subscribersCRUD, reviewsCRUD } from '@/lib/admin-crud'

type ContentType = 'products' | 'blogs' | 'locations' | 'subscribers' | 'reviews'

interface AdminContentManagerProps {
  contentType: ContentType
  title: string
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'checkbox' | 'select'
    options?: Array<{ label: string; value: string }>
    required?: boolean
  }>
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({
  contentType,
  title,
  fields,
}) => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [showForm, setShowForm] = useState(false)

  // Get CRUD operations for content type
  const getCRUD = () => {
    switch (contentType) {
      case 'products':
        return productsCRUD
      case 'blogs':
        return blogsCRUD
      case 'locations':
        return locationsCRUD
      case 'subscribers':
        return subscribersCRUD
      case 'reviews':
        return reviewsCRUD
      default:
        return productsCRUD
    }
  }

  const crud = getCRUD()

  // Load items
  useEffect(() => {
    loadItems()
  }, [contentType])

  const loadItems = async () => {
    setLoading(true)
    const result = await crud.getAll()
    if (result.success) {
      setItems(result.data || [])
    } else {
      setError(result.error || 'Error loading items')
    }
    setLoading(false)
  }

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  // Create new item
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Generate ID if needed
    const newItem = {
      id: formData.id || `${contentType}_${Date.now()}`,
      ...formData,
      created_at: new Date().toISOString(),
    }

    const result = await crud.create(newItem)
    if (result.success) {
      setItems([...items, result.data])
      setFormData({})
      setShowForm(false)
      setError(null)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  // Update item
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    setLoading(true)
    const result = await crud.update(editingId, formData)
    if (result.success) {
      setItems(items.map((item) => (item.id === editingId ? result.data : item)))
      setFormData({})
      setEditingId(null)
      setShowForm(false)
      setError(null)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  // Delete item
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return

    setLoading(true)
    const result = await crud.delete(id)
    if (result.success) {
      setItems(items.filter((item) => item.id !== id))
      setError(null)
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  // Start editing
  const handleEdit = (item: any) => {
    setFormData(item)
    setEditingId(item.id)
    setShowForm(true)
  }

  // Cancel editing
  const handleCancel = () => {
    setFormData({})
    setEditingId(null)
    setShowForm(false)
  }

  if (loading && items.length === 0) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Ajouter
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h2 className="text-xl font-semibold">{editingId ? 'Modifier' : 'Ajouter'} {title}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name] || false}
                    onChange={handleChange}
                    className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-600">Aucun élément</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {fields.slice(0, 3).map((field) => (
                    <th key={field.name} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      {field.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {fields.slice(0, 3).map((field) => (
                      <td key={field.name} className="px-4 py-3 text-sm text-gray-900">
                        {item[field.name]?.toString().substring(0, 50) || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Item Count */}
      <div className="text-sm text-gray-600">Total: {items.length} éléments</div>
    </div>
  )
}
