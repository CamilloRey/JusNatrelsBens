import { useState, useEffect } from 'react'
import {
  getSalesReport,
  getAnalyticsMetrics,
  getProductAnalytics,
  getCustomerAnalytics,
  exportToCSV,
} from '@/lib/analytics/reporting'

export default function AdvancedReportsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [salesReport, setSalesReport] = useState<any>(null)
  const [period, setPeriod] = useState('month')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'customers' | 'sales'>('overview')

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    setLoading(true)

    // Calculate date range
    const now = new Date()
    let startDate: string
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        break
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    const [metricsData, productsData, customersData, salesData] = await Promise.all([
      getAnalyticsMetrics(),
      getProductAnalytics(),
      getCustomerAnalytics(),
      getSalesReport(startDate, now.toISOString()),
    ])

    setMetrics(metricsData)
    setProducts(productsData)
    setCustomers(customersData)
    setSalesReport(salesData)
    setLoading(false)
  }

  const handleExport = (type: 'products' | 'customers' | 'sales') => {
    switch (type) {
      case 'products':
        exportToCSV(products, `produits-rapport-${new Date().toISOString().split('T')[0]}.csv`)
        break
      case 'customers':
        exportToCSV(customers, `clients-rapport-${new Date().toISOString().split('T')[0]}.csv`)
        break
      case 'sales':
        if (salesReport?.topProducts) {
          exportToCSV(
            salesReport.topProducts,
            `ventes-rapport-${new Date().toISOString().split('T')[0]}.csv`
          )
        }
        break
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, color: '#666' }}>Chargement des rapports...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>📊 Rapports Avancés</h1>
            <p style={{ color: '#666', margin: 0 }}>Analyse détaillée de votre activité</p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
            }}
          >
            <option value="week">Cette Semaine</option>
            <option value="month">Ce Mois</option>
            <option value="quarter">Ce Trimestre</option>
            <option value="year">Cette Année</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid #eee' }}>
        {(['overview', 'products', 'customers', 'sales'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#e91e63' : '#666',
              borderBottom: activeTab === tab ? '3px solid #e91e63' : 'none',
              marginBottom: -1,
            }}
          >
            {tab === 'overview' && '📈 Vue d\'ensemble'}
            {tab === 'products' && '🧃 Produits'}
            {tab === 'customers' && '👥 Clients'}
            {tab === 'sales' && '💰 Ventes'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
            }}
          >
            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Revenu Total</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                ${(metrics.totalRevenue / 100).toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: '#0ea5e9' }}>↑ 12% vs période précédente</div>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Total Commandes</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>{metrics.totalOrders}</div>
              <div style={{ fontSize: 12, color: '#0ea5e9' }}>↑ 8% vs période précédente</div>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Panier Moyen</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                ${(metrics.averageOrderValue / 100).toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: '#0ea5e9' }}>↑ 5% vs période précédente</div>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Clients</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                {metrics.customerCount}
              </div>
              <div style={{ fontSize: 12, color: '#0ea5e9' }}>↑ 15% vs période précédente</div>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Clients Récurrents</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                {metrics.repeatCustomerRate.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#0ea5e9' }}>Tendance stable</div>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Produits/Commande</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
                {metrics.avgProductsPerOrder.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: '#0ea5e9' }}>↑ 2% vs période précédente</div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Analyse Produits</h2>
            <button
              onClick={() => handleExport('products')}
              style={{
                padding: '8px 16px',
                background: '#e91e63',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📥 Exporter CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 12, fontWeight: 600 }}>Produit</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Quantité</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Revenu</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Note</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Avis</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.productId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12, fontSize: 14, fontWeight: 500 }}>{p.productName}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>{p.totalSold}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      ${(p.totalRevenue / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>
                      {'⭐'.repeat(Math.round(p.avgRating))}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>{p.reviewCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Analyse Clients</h2>
            <button
              onClick={() => handleExport('customers')}
              style={{
                padding: '8px 16px',
                background: '#e91e63',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📥 Exporter CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 12, fontWeight: 600 }}>Client</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 12, fontWeight: 600 }}>Email</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Commandes</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Total Dépensé</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>Panier Moyen</th>
                  <th style={{ padding: 12, textAlign: 'center', fontSize: 12, fontWeight: 600 }}>Risque</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 20).map((c) => (
                  <tr key={c.customerId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12, fontSize: 14, fontWeight: 500 }}>{c.customerName}</td>
                    <td style={{ padding: 12, fontSize: 12, color: '#666' }}>{c.email}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>{c.totalOrders}</td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
                      ${(c.totalSpent / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>
                      ${(c.avgOrderValue / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          background: c.likelyToChurn ? '#fee2e2' : '#dcfce7',
                          color: c.likelyToChurn ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {c.likelyToChurn ? '⚠️ Risque' : '✓ OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && salesReport && (
        <div>
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Rapport Ventes</h2>
            <button
              onClick={() => handleExport('sales')}
              style={{
                padding: '8px 16px',
                background: '#e91e63',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📥 Exporter CSV
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Total Ventes</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>${(salesReport.revenue / 100).toFixed(2)}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Commandes</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{salesReport.totalOrders}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Panier Moyen</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>
                ${(salesReport.averageOrderValue / 100).toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Top Produits</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {salesReport.topProducts.map((p: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{i + 1}. {p.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {p.quantity} vendus • ${(p.revenue / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Top Clients</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {salesReport.topCustomers.map((c: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: '#fff',
                      border: '1px solid #eee',
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{i + 1}. {c.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {c.orders} commandes • ${(c.spent / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
