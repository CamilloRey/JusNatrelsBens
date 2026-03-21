import { useState, useEffect } from 'react';
import { C } from '@/shared/constants/colors';
import { CSS, labelSt } from '@/shared/constants/styles';
import type { Order } from '../types/shop.types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('shop_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    // Save to localStorage
    const updated = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );
    localStorage.setItem('shop_orders', JSON.stringify(updated));
  };

  const filteredOrders = orders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fef3c7', color: '#92400e', label: '⏳ En attente' };
      case 'PAID':
        return { bg: '#dcfce7', color: '#166534', label: '✓ Payé' };
      case 'PROCESSING':
        return { bg: '#dbeafe', color: '#1e40af', label: '📦 En préparation' };
      case 'SHIPPED':
        return { bg: '#c7d2fe', color: '#3730a3', label: '🚚 Expédié' };
      case 'DELIVERED':
        return { bg: '#d1fae5', color: '#065f46', label: '✓ Livré' };
      case 'CANCELLED':
        return { bg: '#fee2e2', color: '#dc2626', label: '✗ Annulé' };
      default:
        return { bg: C.light, color: C.muted, label: status };
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>📦</span>
          <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Commandes
          </h1>
        </div>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Gérez toutes les commandes de vos clients
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            TOTAL COMMANDES
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: C.dark, margin: 0 }}>
            {orders.length}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            REVENUS TOTAUX
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: C.green, margin: 0 }}>
            ${(totalRevenue / 100).toFixed(2)}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            EN ATTENTE
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#f97316', margin: 0 }}>
            {orders.filter((o) => o.status === 'PENDING').length}
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            LIVRÉES
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: C.green, margin: 0 }}>
            {orders.filter((o) => o.status === 'DELIVERED').length}
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${C.border}` }}>
        <label style={labelSt}>Filtrer par statut</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            fontSize: 13,
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="PAID">Payé</option>
          <option value="PROCESSING">En préparation</option>
          <option value="SHIPPED">Expédié</option>
          <option value="DELIVERED">Livré</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <p>Chargement des commandes...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>📭</p>
          <p>Aucune commande trouvée</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((order) => {
              const statusInfo = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 16,
                    border: `1px solid ${C.border}`,
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 150px 150px 100px',
                    gap: 16,
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as any).style.background = C.light;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.background = '#fff';
                  }}
                >
                  {/* ORDER ID */}
                  <div>
                    <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                      COMMANDE
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, margin: 0 }}>
                      {order.orderId}
                    </p>
                  </div>

                  {/* CLIENT */}
                  <div>
                    <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                      CLIENT
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: 0 }}>
                      {order.shippingAddress.name}
                    </p>
                    <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>
                      {order.shippingAddress.email}
                    </p>
                  </div>

                  {/* DATE */}
                  <div>
                    <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                      DATE
                    </p>
                    <p style={{ fontSize: 13, color: C.dark, margin: 0 }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-CA')}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                      STATUT
                    </p>
                    <span
                      style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        fontWeight: 600,
                        display: 'inline-block',
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: C.green, margin: 0 }}>
                      ${(order.total / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 28,
              maxWidth: 600,
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>
                {selectedOrder.orderId}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 20,
                  color: C.muted,
                }}
              >
                ✕
              </button>
            </div>

            {/* STATUS SELECT */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelSt}>Statut</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                <option value="PENDING">En attente</option>
                <option value="PAID">Payé</option>
                <option value="PROCESSING">En préparation</option>
                <option value="SHIPPED">Expédié</option>
                <option value="DELIVERED">Livré</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>

            {/* ITEMS */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, margin: '0 0 12px' }}>
                Articles
              </h3>
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}
                >
                  <span>
                    {item.name} {item.format && `(${item.format})`} × {item.quantity}
                  </span>
                  <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div
              style={{
                background: C.light,
                borderRadius: 10,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span>Sous-total</span>
                <span>${(selectedOrder.subtotal / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span>Taxes</span>
                <span>${(selectedOrder.taxes / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                <span>Livraison</span>
                <span>${(selectedOrder.shippingCost / 100).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: C.green }}>${(selectedOrder.total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, margin: '0 0 8px' }}>
                Adresse de livraison
              </h3>
              <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.6 }}>
                <p style={{ margin: 0 }}>{selectedOrder.shippingAddress.name}</p>
                <p style={{ margin: '4px 0 0' }}>{selectedOrder.shippingAddress.street}</p>
                <p style={{ margin: '4px 0 0' }}>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p style={{ margin: '4px 0 0' }}>
                  <strong>Tél:</strong> {selectedOrder.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* DELIVERY INFO */}
            <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12 }}>
              <p style={{ fontSize: 12, color: '#1e40af', margin: 0 }}>
                <strong>Type de livraison:</strong> {selectedOrder.deliveryType === 'local' ? 'Montréal' : 'Canada'}
              </p>
              {selectedOrder.trackingNumber && (
                <p style={{ fontSize: 12, color: '#1e40af', margin: '4px 0 0' }}>
                  <strong>Suivi:</strong> {selectedOrder.trackingNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
