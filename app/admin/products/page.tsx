'use client'

import { AdminContentManager } from '@/features/dashboard/components/AdminContentManager'

export default function ProductsAdminPage() {
  return (
    <AdminContentManager
      contentType="products"
      title="Gestion des Produits"
      fields={[
        { name: 'name', label: 'Nom du Produit', type: 'text', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', required: true,
          options: [
            { label: 'Jus', value: 'jus' },
            { label: 'Smoothie', value: 'smoothie' },
            { label: 'Détox', value: 'detox' },
            { label: 'Autre', value: 'autre' }
          ]
        },
        { name: 'price', label: 'Prix', type: 'number', required: true },
        { name: 'desc', label: 'Description', type: 'textarea' },
        { name: 'color', label: 'Couleur', type: 'text' },
        { name: 'tag', label: 'Tag', type: 'text' },
        { name: 'available', label: 'Disponible', type: 'checkbox' },
      ]}
    />
  )
}
