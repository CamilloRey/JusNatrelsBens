'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  const adminPages = [
    {
      title: 'Produits',
      description: 'Gérer tous les produits (jus, smoothies, etc.)',
      href: '/admin/products',
      icon: '🧃',
    },
    {
      title: 'Articles',
      description: 'Créer et modifier les articles de blog',
      href: '/admin/blogs',
      icon: '📝',
    },
    {
      title: 'Lieux',
      description: 'Gérer les magasins et partenaires',
      href: '/admin/locations',
      icon: '📍',
    },
    {
      title: 'Abonnés',
      description: 'Gérer les abonnés à la newsletter',
      href: '/admin/subscribers',
      icon: '👥',
    },
    {
      title: 'Images',
      description: 'Gérer les photos des produits',
      href: '/admin/images',
      icon: '🖼️',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Tableau de Bord Admin</h1>
        <p className="text-lg text-gray-600 mb-12">Gérez facilement tous vos contenus</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{page.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{page.title}</h2>
              <p className="text-gray-600">{page.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Système de Gestion Complet</h2>
          <p className="text-gray-600 mb-4">
            Tous vos contenus sont stockés dans Supabase et facilement modifiables via cette interface admin.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Ajouter, modifier, supprimer du contenu sans accès base de données</li>
            <li>✓ Interface intuitive pour tous les types de contenu</li>
            <li>✓ Gestion des images avec synchronisation en temps réel</li>
            <li>✓ Journalisation de toutes les actions administrateur</li>
            <li>✓ Contrôle d'accès sécurisé basé sur les rôles</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
