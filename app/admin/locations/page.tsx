'use client'

import { AdminContentManager } from '@/features/dashboard/components/AdminContentManager'

export default function LocationsAdminPage() {
  return (
    <AdminContentManager
      contentType="locations"
      title="Gestion des Lieux"
      fields={[
        { name: 'name', label: 'Nom du Lieu', type: 'text', required: true },
        { name: 'address', label: 'Adresse', type: 'textarea', required: true },
        { name: 'type', label: 'Type', type: 'select', required: true,
          options: [
            { label: 'Magasin', value: 'store' },
            { label: 'Bureau', value: 'office' },
            { label: 'Atelier', value: 'workshop' },
            { label: 'Partenaire', value: 'partner' }
          ]
        },
        { name: 'active', label: 'Actif', type: 'checkbox' },
      ]}
    />
  )
}
