'use client'

import { AdminContentManager } from '@/features/dashboard/components/AdminContentManager'

export default function SubscribersAdminPage() {
  return (
    <AdminContentManager
      contentType="subscribers"
      title="Gestion des Abonnés"
      fields={[
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'active', label: 'Actif', type: 'checkbox' },
      ]}
    />
  )
}
