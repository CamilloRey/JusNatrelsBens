// Advanced Inventory Alert System

import { supabase } from '@/lib/supabase'

export interface InventoryItem {
  id: string
  productId: string
  productName: string
  currentStock: number
  reorderPoint: number
  maxStock: number
  minStock: number
  lastRestocked: string
  supplier?: string
}

export interface InventoryAlert {
  id: string
  productId: string
  productName: string
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK' | 'REORDER_URGENT'
  currentStock: number
  threshold: number
  severity: 'info' | 'warning' | 'critical'
  createdAt: string
  resolvedAt?: string
  resolved: boolean
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'DAMAGED'
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  createdBy: string
  createdAt: string
}

export interface InventoryMetrics {
  totalItems: number
  lowStockCount: number
  outOfStockCount: number
  overstockCount: number
  criticalAlerts: number
  turnoverRate: number
  stockValue: number
  lastUpdated: string
}

// Check inventory and generate alerts
export async function checkInventoryLevels() {
  try {
    const { data: items, error } = await supabase
      .from('inventory')
      .select('*')

    if (error) throw error

    const alerts: InventoryAlert[] = []

    for (const item of items || []) {
      // Check for out of stock
      if (item.current_stock === 0) {
        alerts.push({
          id: `alert_${item.id}_${Date.now()}`,
          productId: item.product_id,
          productName: item.product_name,
          alertType: 'OUT_OF_STOCK',
          currentStock: item.current_stock,
          threshold: item.min_stock,
          severity: 'critical',
          createdAt: new Date().toISOString(),
          resolved: false,
        })
      }
      // Check for low stock
      else if (item.current_stock <= item.reorder_point) {
        alerts.push({
          id: `alert_${item.id}_${Date.now()}`,
          productId: item.product_id,
          productName: item.product_name,
          alertType: 'REORDER_URGENT',
          currentStock: item.current_stock,
          threshold: item.reorder_point,
          severity: 'critical',
          createdAt: new Date().toISOString(),
          resolved: false,
        })
      }
      // Check for low stock warning
      else if (item.current_stock <= item.min_stock + 5) {
        alerts.push({
          id: `alert_${item.id}_${Date.now()}`,
          productId: item.product_id,
          productName: item.product_name,
          alertType: 'LOW_STOCK',
          currentStock: item.current_stock,
          threshold: item.min_stock,
          severity: 'warning',
          createdAt: new Date().toISOString(),
          resolved: false,
        })
      }
      // Check for overstock
      else if (item.current_stock > item.max_stock) {
        alerts.push({
          id: `alert_${item.id}_${Date.now()}`,
          productId: item.product_id,
          productName: item.product_name,
          alertType: 'OVERSTOCK',
          currentStock: item.current_stock,
          threshold: item.max_stock,
          severity: 'info',
          createdAt: new Date().toISOString(),
          resolved: false,
        })
      }
    }

    // Save alerts to database
    if (alerts.length > 0) {
      const { error: insertError } = await supabase
        .from('inventory_alerts')
        .insert(alerts)

      if (insertError) console.error('Error saving alerts:', insertError)
    }

    return alerts
  } catch (error) {
    console.error('Error checking inventory levels:', error)
    return []
  }
}

// Get active alerts
export async function getActiveAlerts(): Promise<InventoryAlert[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_alerts')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return []
  }
}

// Get alerts by severity
export async function getAlertsBySeverity(
  severity: 'info' | 'warning' | 'critical'
): Promise<InventoryAlert[]> {
  try {
    const { data, error } = await supabase
      .from('inventory_alerts')
      .select('*')
      .eq('severity', severity)
      .eq('resolved', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return []
  }
}

// Record stock movement
export async function recordStockMovement(
  movement: Omit<StockMovement, 'id' | 'createdAt'>
): Promise<StockMovement | null> {
  try {
    const newMovement: StockMovement = {
      ...movement,
      id: `mov_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('stock_movements')
      .insert([newMovement])
      .select()
      .single()

    if (error) throw error
    return data || newMovement
  } catch (error) {
    console.error('Error recording stock movement:', error)
    return null
  }
}

// Resolve alert
export async function resolveAlert(alertId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('inventory_alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', alertId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error resolving alert:', error)
    return false
  }
}

// Get inventory metrics
export async function getInventoryMetrics(): Promise<InventoryMetrics | null> {
  try {
    const { data: items, error: itemsError } = await supabase
      .from('inventory')
      .select('*')

    if (itemsError) throw itemsError

    const { data: alerts, error: alertsError } = await supabase
      .from('inventory_alerts')
      .select('*')
      .eq('resolved', false)

    if (alertsError) throw alertsError

    const lowStockCount =
      alerts?.filter((a: any) => a.alert_type === 'LOW_STOCK').length || 0
    const outOfStockCount =
      alerts?.filter((a: any) => a.alert_type === 'OUT_OF_STOCK').length || 0
    const overstockCount =
      alerts?.filter((a: any) => a.alert_type === 'OVERSTOCK').length || 0
    const criticalCount =
      alerts?.filter((a: any) => a.severity === 'critical').length || 0

    const stockValue = (items || []).reduce(
      (sum: any, item: any) => sum + item.current_stock * (item.unit_price || 0),
      0
    )

    return {
      totalItems: items?.length || 0,
      lowStockCount,
      outOfStockCount,
      overstockCount,
      criticalAlerts: criticalCount,
      turnoverRate: 0, // Calculate based on sales data
      stockValue,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error getting inventory metrics:', error)
    return null
  }
}

// Auto-generate reorder suggestions
export async function generateReorderSuggestions() {
  try {
    const { data: items, error } = await supabase
      .from('inventory')
      .select('*')
      .lte('current_stock', 'reorder_point')

    if (error) throw error

    return items || []
  } catch (error) {
    console.error('Error generating reorder suggestions:', error)
    return []
  }
}

// Get stock history for a product
export async function getStockHistory(
  productId: string,
  days: number = 30
): Promise<StockMovement[]> {
  try {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .eq('product_id', productId)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return []
  }
}
