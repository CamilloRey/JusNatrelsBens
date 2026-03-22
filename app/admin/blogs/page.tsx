'use client'

import { AdminContentManager } from '@/features/dashboard/components/AdminContentManager'

export default function BlogsAdminPage() {
  return (
    <AdminContentManager
      contentType="blogs"
      title="Gestion des Articles"
      fields={[
        { name: 'title', label: 'Titre', type: 'text', required: true },
        { name: 'category', label: 'Catégorie', type: 'select', required: true,
          options: [
            { label: 'Santé', value: 'sante' },
            { label: 'Recettes', value: 'recettes' },
            { label: 'Conseils', value: 'conseils' },
            { label: 'Actualités', value: 'actualites' }
          ]
        },
        { name: 'content', label: 'Contenu', type: 'textarea', required: true },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'published', label: 'Publié', type: 'checkbox' },
      ]}
    />
  )
}
