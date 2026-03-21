import { useState, useEffect } from 'react';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import type { SquarePayment } from '../types/payment.types';

export default function AdminSquarePaymentsPage() {
  const [payments, setPayments] = useState<SquarePayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'COMPLETED' | 'FAILED' | 'REFUNDED'>('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<SquarePayment | null>(null);

  // Load payments on mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      // In production, this would fetch from your backend
      const savedPayments = localStorage.getItem('squarePayments');
      if (savedPayments) {
        setPayments(JSON.parse(savedPayments));
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
    setLoading(false);
  };

  const filteredPayments = payments
    .filter((p) => filterStatus === 'all' || p.status === filterStatus)
    .filter((p) => !filterDate || p.createdAt.startsWith(filterDate))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalAmount = filteredPayments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = filteredPayments
    .filter((p) => p.status === 'REFUNDED')
    .reduce((sum, p) => sum + (p.refundedAmount || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#dcfce7', color: '#166534', label: '✓ Complété' };
      case 'FAILED':
        return { bg: '#fee2e2', color: '#dc2626', label: '✗ Échoué' };
      case 'REFUNDED':
        return { bg: '#fef3c7', color: '#92400e', label: '↺ Remboursé' };
      case 'PENDING':
        return { bg: '#f3f4f6', color: '#6b7280', label: '⏳ En attente' };
      default:
        return { bg: C.light, color: C.muted, label: status };
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CARD':
        return '💳';
      case 'DIGITAL_WALLET':
        return '📱';
      case 'CASH':
        return '💵';
      default:
        return '💰';
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>💳</span>
          <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Transactions Square
          </h1>
        </div>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Gérez tous vos paiements traités via Square
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            TOTAL PAIEMENTS
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: C.green, margin: 0 }}>
            ${(totalAmount / 100).toFixed(2)}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0' }}>
            {filteredPayments.filter((p) => p.status === 'COMPLETED').length} transactions
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            REMBOURSEMENTS
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#f97316', margin: 0 }}>
            ${(totalRefunded / 100).toFixed(2)}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0' }}>
            {filteredPayments.filter((p) => p.status === 'REFUNDED').length} remboursements
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>
            ÉCHECS
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#dc2626', margin: 0 }}>
            {filteredPayments.filter((p) => p.status === 'FAILED').length}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0' }}>
            Paiements échoués
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label style={labelSt}>Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              style={inputSt}
            >
              <option value="all">Tous les statuts</option>
              <option value="COMPLETED">Complété</option>
              <option value="FAILED">Échoué</option>
              <option value="REFUNDED">Remboursé</option>
            </select>
          </div>
          <div>
            <label style={labelSt}>Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={inputSt}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setFilterDate('');
                setFilterStatus('all');
              }}
              style={{
                width: '100%',
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: '#fff',
                color: C.dark,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENTS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <p>Chargement des transactions...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>📭</p>
          <p>Aucune transaction trouvée</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredPayments.map((payment) => {
            const statusInfo = getStatusColor(payment.status);
            const methodIcon = getMethodIcon(payment.method);
            return (
              <div
                key={payment.id}
                onClick={() => setSelectedPayment(payment)}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
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
                <div style={{ fontSize: 24 }}>{methodIcon}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>
                      {payment.description}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        fontWeight: 600,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                    {new Date(payment.createdAt).toLocaleString('fr-CA')} • {payment.method}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: C.green, margin: 0 }}>
                    ${(payment.amount / 100).toFixed(2)}
                  </p>
                  {payment.refundedAmount && (
                    <p style={{ fontSize: 11, color: '#f97316', margin: '2px 0 0' }}>
                      -${(payment.refundedAmount / 100).toFixed(2)} remboursé
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedPayment && (
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
          onClick={() => setSelectedPayment(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 24,
              maxWidth: 500,
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>
                Détails du paiement
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 16, background: C.light, borderRadius: 10 }}>
                <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                  MONTANT
                </p>
                <p style={{ fontSize: 24, fontWeight: 800, color: C.green, margin: 0 }}>
                  ${(selectedPayment.amount / 100).toFixed(2)}
                </p>
              </div>

              {[
                { label: 'Description', value: selectedPayment.description },
                { label: 'Méthode', value: selectedPayment.method },
                { label: 'Statut', value: getStatusColor(selectedPayment.status).label },
                { label: 'ID Square', value: selectedPayment.squarePaymentId },
                { label: 'Date', value: new Date(selectedPayment.createdAt).toLocaleString('fr-CA') },
                selectedPayment.customerId && { label: 'Client ID', value: selectedPayment.customerId },
                selectedPayment.notes && { label: 'Notes', value: selectedPayment.notes },
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 4 }}>
                      {item!.label}
                    </p>
                    <p style={{ fontSize: 14, color: C.dark, margin: 0, wordBreak: 'break-all' }}>
                      {item!.value}
                    </p>
                  </div>
                ))}

              {selectedPayment.status === 'COMPLETED' && !selectedPayment.refundedAmount && (
                <button
                  style={{
                    padding: '12px 20px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#fee2e2',
                    color: '#dc2626',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  💳 Rembourser ce paiement
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
