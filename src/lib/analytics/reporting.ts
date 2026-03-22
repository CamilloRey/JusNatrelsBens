// Advanced Reporting & Analytics System

import { supabase } from '@/lib/supabase'

export interface SalesReport {
  period: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  revenue: number
  topProducts: Array<{ name: string; quantity: number; revenue: number }>
  topCustomers: Array<{ name: string; orders: number; spent: number }>
}

export interface AnalyticsMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  customerCount: number
  conversionRate: number
  repeatCustomerRate: number
  avgProductsPerOrder: number
  returnRate: number
}

export interface DailyMetrics {
  date: string
  orders: number
  revenue: number
  customers: number
  avgOrderValue: number
}

export interface ProductAnalytics {
  productId: string
  productName: string
  totalSold: number
  totalRevenue: number
  avgRating: number
  reviewCount: number
  trendsLastMonth: number[] // percentage change
}

export interface CustomerAnalytics {
  customerId: string
  customerName: string
  email: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  avgOrderValue: number
  preferredCategory: string
  likelyToChurn: boolean
}

// Get sales report for period
export async function getSalesReport(
  startDate: string,
  endDate: string
): Promise<SalesReport | null> {
  try {
    // Get orders in period
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (ordersError) throw ordersError

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')

    if (itemsError) throw itemsError

    const totalSales = orders?.length || 0
    const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0)
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

    // Get top products
    const productSales: Record<string, any> = {}
    ;(items || []).forEach((item) => {
      if (!productSales[item.product_name]) {
        productSales[item.product_name] = { quantity: 0, revenue: 0 }
      }
      productSales[item.product_name].quantity += item.quantity
      productSales[item.product_name].revenue += item.total || 0
    })

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Get top customers
    const customerSpending: Record<string, any> = {}
    ;(orders || []).forEach((order) => {
      if (!customerSpending[order.customer_name]) {
        customerSpending[order.customer_name] = { orders: 0, spent: 0 }
      }
      customerSpending[order.customer_name].orders += 1
      customerSpending[order.customer_name].spent += order.total || 0
    })

    const topCustomers = Object.entries(customerSpending)
      .map(([name, data]) => ({
        name,
        orders: data.orders,
        spent: data.spent,
      }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 10)

    return {
      period: `${startDate} to ${endDate}`,
      totalSales,
      totalOrders: totalSales,
      averageOrderValue: avgOrderValue,
      revenue: totalRevenue,
      topProducts,
      topCustomers,
    }
  } catch (error) {
    console.error('Error generating sales report:', error)
    return null
  }
}

// Get analytics metrics
export async function getAnalyticsMetrics(): Promise<AnalyticsMetrics | null> {
  try {
    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')

    if (ordersError) throw ordersError

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')

    if (customersError) throw customersError

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')

    if (itemsError) throw itemsError

    const totalOrders = orders?.length || 0
    const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0)
    const customerCount = customers?.length || 0
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const totalItems = (items || []).reduce((sum, i) => sum + i.quantity, 0)
    const avgProductsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0

    // Calculate repeat customer rate
    const customerOrderCounts: Record<string, number> = {}
    ;(orders || []).forEach((order) => {
      customerOrderCounts[order.customer_id] =
        (customerOrderCounts[order.customer_id] || 0) + 1
    })
    const repeatCustomers = Object.values(customerOrderCounts).filter((count) => count > 1)
      .length
    const repeatCustomerRate =
      customerCount > 0 ? (repeatCustomers / customerCount) * 100 : 0

    // Estimate conversion rate and return rate
    const conversionRate = 2.5 // Placeholder
    const returnRate = 0.5 // Placeholder

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: avgOrderValue,
      customerCount,
      conversionRate,
      repeatCustomerRate,
      avgProductsPerOrder,
      returnRate,
    }
  } catch (error) {
    console.error('Error getting analytics metrics:', error)
    return null
  }
}

// Get daily metrics
export async function getDailyMetrics(days: number = 30): Promise<DailyMetrics[]> {
  try {
    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error getting daily metrics:', error)
    return []
  }
}

// Get product analytics
export async function getProductAnalytics(): Promise<ProductAnalytics[]> {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')

    if (productsError) throw productsError

    const { data: sales, error: salesError } = await supabase
      .from('order_items')
      .select('*')

    if (salesError) throw salesError

    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')

    if (reviewsError) throw reviewsError

    const analytics: ProductAnalytics[] = (products || []).map((product) => {
      const productSales = (sales || []).filter((s) => s.product_id === product.id)
      const productReviews = (reviews || []).filter(
        (r) => r.product_id === product.id
      )

      const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0)
      const totalRevenue = productSales.reduce((sum, s) => sum + (s.total || 0), 0)
      const avgRating =
        productReviews.length > 0
          ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
            productReviews.length
          : 0

      return {
        productId: product.id,
        productName: product.name,
        totalSold,
        totalRevenue,
        avgRating,
        reviewCount: productReviews.length,
        trendsLastMonth: [1.2, 1.5, 2.1, 1.8, 2.3, 2.5, 2.8], // Placeholder
      }
    })

    return analytics.sort((a, b) => b.totalRevenue - a.totalRevenue)
  } catch (error) {
    console.error('Error getting product analytics:', error)
    return []
  }
}

// Get customer analytics
export async function getCustomerAnalytics(): Promise<CustomerAnalytics[]> {
  try {
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')

    if (customersError) throw customersError

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')

    if (ordersError) throw ordersError

    const analytics: CustomerAnalytics[] = (customers || []).map((customer) => {
      const customerOrders = (orders || []).filter(
        (o) => o.customer_id === customer.id
      )

      const totalOrders = customerOrders.length
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0
      const lastOrderDate =
        customerOrders.length > 0
          ? customerOrders[customerOrders.length - 1].created_at
          : ''

      // Simple churn prediction: no order in 90 days
      const lastOrderTime = lastOrderDate
        ? new Date(lastOrderDate).getTime()
        : 0
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
      const likelyToChurn = lastOrderTime < ninetyDaysAgo && totalOrders > 0

      return {
        customerId: customer.id,
        customerName: customer.name,
        email: customer.email,
        totalOrders,
        totalSpent,
        lastOrderDate,
        avgOrderValue,
        preferredCategory: 'Détox', // Placeholder
        likelyToChurn,
      }
    })

    return analytics
  } catch (error) {
    console.error('Error getting customer analytics:', error)
    return []
  }
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {})
  const csv =
    headers.join(',') +
    '\n' +
    data.map((row) => headers.map((h) => JSON.stringify(row[h])).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// Generate PDF report
export async function generatePDFReport(
  type: 'sales' | 'inventory' | 'customers',
  data: any
) {
  // Placeholder for PDF generation
  console.log(`Generating ${type} PDF report...`, data)
}
