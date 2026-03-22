/**
 * Admin CRUD Operations
 * Universal create, read, update, delete operations for admin content
 */

import { supabase } from '@/lib/supabase'

/**
 * Generic CRUD interface
 */
export interface CRUDResponse {
  success: boolean
  error?: string
  data?: any
}

/**
 * Products CRUD
 */
export const productsCRUD = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async create(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  },
}

/**
 * Blogs CRUD
 */
export const blogsCRUD = {
  async getAll() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async create(blog: any) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  },

  async publish(id: string, published: boolean) {
    const { data, error } = await supabase
      .from('blogs')
      .update({ published })
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },
}

/**
 * Locations CRUD
 */
export const locationsCRUD = {
  async getAll() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async create(location: any) {
    const { data, error } = await supabase
      .from('locations')
      .insert([location])
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  },

  async toggleActive(id: string, active: boolean) {
    const { data, error } = await supabase
      .from('locations')
      .update({ active })
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },
}

/**
 * Reviews CRUD (Moderation)
 */
export const reviewsCRUD = {
  async getAll() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('date', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async getPending() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', false)
      .order('date', { ascending: true })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async approve(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async reject(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  },
}

/**
 * Subscribers CRUD
 */
export const subscribersCRUD = {
  async getAll() {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('date', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async getActive() {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('active', true)
      .order('date', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async unsubscribe(id: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .update({ active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  },
}

/**
 * Activity Log
 */
export const activityCRUD = {
  async getAll(limit = 100) {
    const { data, error } = await supabase
      .from('activity')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit)

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  },

  async logActivity(action: string, detail: string, type = 'info') {
    const { data, error } = await supabase
      .from('activity')
      .insert([
        {
          id: `act_${Date.now()}`,
          action,
          detail,
          date: new Date().toISOString(),
          type,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Activity log error:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  },
}

/**
 * Generic CRUD wrapper for any table
 */
export async function getFromTable(table: string, filters?: any) {
  let query = supabase.from(table).select('*')

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value)
    }
  }

  const { data, error } = await query

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function insertIntoTable(table: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .insert([data])
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: result }
}

export async function updateTable(table: string, id: string, updates: any) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function deleteFromTable(table: string, id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
