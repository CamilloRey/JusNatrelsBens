/**
 * Admin - Images Management Page
 * Unified image management interface for admin
 */

'use client'

import React, { useState } from 'react'
import { ProductImageManager } from '../components/ProductImageManager'
import { OwnerPhotoGallery } from '../components/OwnerPhotoGallery'

type TabType = 'gallery' | 'products'

interface ImagesPageProps {
  products?: Array<{ id: string; name: string }>
}

export const ImagesPage: React.FC<ImagesPageProps> = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState<TabType>('gallery')
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const selectedProduct = products.find((p) => p.id === selectedProductId)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestion des Images</h1>
          <p className="text-lg text-gray-600">
            Gérez les photos des produits et la galerie du propriétaire en temps réel
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'gallery'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            📸 Galerie Propriétaire
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            🛍️ Photos Produits
          </button>
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <OwnerPhotoGallery />
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Product Selector */}
            {products.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Sélectionnez un produit</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`p-4 rounded-lg border-2 transition-colors text-left ${
                        selectedProductId === product.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">ID: {product.id}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Image Manager */}
            {selectedProductId && selectedProduct && (
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <ProductImageManager productId={selectedProductId} productName={selectedProduct.name} />
              </div>
            )}

            {products.length === 0 && (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-600">
                Aucun produit disponible. Créez d'abord des produits dans la gestion des produits.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
