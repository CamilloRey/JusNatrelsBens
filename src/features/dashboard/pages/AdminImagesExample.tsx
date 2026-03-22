/**
 * Example: How to integrate image management in your admin dashboard
 */

'use client'

import React from 'react'
import { ImagesPage } from './ImagesPage'

// Example products data - replace with actual API call
const EXAMPLE_PRODUCTS = [
  { id: 'prod-orange', name: 'Jus d\'Orange' },
  { id: 'prod-carrot', name: 'Jus de Carotte' },
  { id: 'prod-apple', name: 'Jus de Pomme' },
  { id: 'prod-mix', name: 'Jus Multivitamines' },
]

/**
 * Integration Example
 *
 * 1. In your dashboard router/layout, add this page:
 *
 *    import { AdminImagesExample } from '@/features/dashboard/pages/AdminImagesExample'
 *
 *    // In your route handler:
 *    export default function ImagesAdminPage() {
 *      return <AdminImagesExample />
 *    }
 *
 * 2. The ImagesPage component handles:
 *    - Product image upload and management
 *    - Owner photo gallery management
 *    - Realtime image sync
 *    - Admin authentication (via RLS)
 *
 * 3. Replace EXAMPLE_PRODUCTS with actual data from your API:
 *
 *    async function getProducts() {
 *      const { data } = await supabase
 *        .from('products')
 *        .select('id, name')
 *      return data || []
 *    }
 *
 *    export default async function ImagesAdminPage() {
 *      const products = await getProducts()
 *      return <AdminImagesExample products={products} />
 *    }
 */

export const AdminImagesExample: React.FC<{ products?: typeof EXAMPLE_PRODUCTS }> = ({
  products = EXAMPLE_PRODUCTS,
}) => {
  return <ImagesPage products={products} />
}

export default AdminImagesExample
