import { useState, useEffect } from 'react'
import { getActiveAlerts, getAlertsBySeverity, getInventoryMetrics, resolveAlert } from '@/lib/inventory/inventory-alerts'

export default function InventoryAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
    loadMetrics()
  }, [filter])

  const loadAlerts = async () => {
    setLoading(true)
    const data = filter === 'all' ? await getActiveAlerts() : await getAlertsBySeverity(filter as any)
    setAlerts(data)
    setLoading(false)
  }

  const loadMetrics = async () => {
    const data = await getInventoryMetrics()
    setMetrics(data)
  }

  const handleResolve = async (alertId: string) => {
    await resolveAlert(alertId)
    await loadAlerts()
    await loadMetrics()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626'
      case 'warning':
        return '#f59e0b'
      case 'info':
        return '#3b82f6'
      default:
        return '#6b7280'
    }
  }

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      LOW_STOCK: 'Stock Faible',
      OUT_OF_STOCK: 'Rupture de Stock',
      OVERSTOCK: 'Sur-stock',
      REORDER_URGENT: 'Réapprovisionnement Urgent',
    }
    return labels[type] || type
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>🚨 Alertes d'Inventaire</h1>
        <p style={{ color: '#666', margin: 0 }}>Gérez les alertes de stock en temps réel</p>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Total Items</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{metrics.totalItems}</div>
          </div>

          <div
            style={{
              background: '#fff',
              border: '2px solid #dc2626',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Alertes Critiques</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#dc2626' }}>{metrics.criticalAlerts}</div>
          </div>

          <div
            style={{
              background: '#fff',
              border: '2px solid #f59e0b',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Stock Faible</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b' }}>{metrics.lowStockCount}</div>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Ruptures de Stock</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#666' }}>{metrics.outOfStockCount}</div>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Sur-stocks</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#666' }}>{metrics.overstockCount}</div>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Valeur Stock</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#666' }}>
              ${(metrics.stockValue / 100).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: filter === f ? '2px solid #e91e63' : '1px solid #ddd',
              background: filter === f ? '#fff' : '#f5f5f5',
              cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>✓ Aucune alerte active</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                background: '#fff',
                border: `2px solid ${getSeverityColor(alert.severity)}`,
                borderRadius: 12,
                padding: 20,
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: getSeverityColor(alert.severity),
                    }}
                  ></span>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                    {alert.product_name}
                  </h3>
                  <span
                    style={{
                      background: getSeverityColor(alert.severity),
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {getAlertTypeLabel(alert.alert_type)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Stock Actuel</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{alert.current_stock}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Seuil</div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{alert.threshold}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Alerte le</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {new Date(alert.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleResolve(alert.id)}
                style={{
                  padding: '10px 20px',
                  background: getSeverityColor(alert.severity),
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                ✓ Résoudre
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
