import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSupabaseAuth } from '@/features/auth/context/SupabaseAuthContext';
import { useSecurityValidation } from '@/features/auth/hooks/useSecurityValidation';
import { useRateLimit } from '@/features/auth/hooks/useRateLimit';
import { GuestEmailValidator } from '../components/GuestEmailValidator';
import { SEO } from '@/shared/components/SEO';
import type { ShippingAddress, DeliveryType, Order } from '../types/shop.types';

const CP = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  gold:                '#C9A84C',
  accent:              '#E07A20',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
};
const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1100;

const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '0.875rem',
  border: '1.5px solid rgba(27,77,56,0.15)',
  background: '#ffffff',
  fontFamily: FONT_BODY,
  fontSize: '0.95rem',
  color: CP.onSurface,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block',
  fontFamily: FONT_BODY,
  fontSize: '0.8rem',
  fontWeight: 600,
  color: CP.onSurfaceVariant,
  marginBottom: 8,
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useSupabaseAuth();
  const { validateCheckoutForm } = useSecurityValidation();
  const { remainingTime, checkCheckoutLimit } = useRateLimit();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isGuest] = useState(!user);
  const [emailVerified, setEmailVerified] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 2: Customer info
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Step 3: Shipping
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('local');
  const [address, setAddress] = useState<ShippingAddress>({
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
    street: '',
    city: 'Montréal',
    province: 'QC',
    postalCode: '',
    country: 'Canada',
  });

  // Step 4: Payment
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (cart.items.length === 0 && !orderConfirmed) {
    return (
      <div style={{ fontFamily: FONT_BODY, background: CP.surface, minHeight: '100vh', textAlign: 'center', padding: '120px 24px' }}>
        <SEO title="Paiement" description="Finalisez votre commande Les Jus Naturels Ben's" url="https://lesjusnaturelsbens.com/checkout" />
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: CP.surfaceContainerLow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, margin: '0 auto 24px',
        }}>
          🛒
        </div>
        <p style={{ color: CP.onSurfaceVariant, fontSize: '1rem' }}>Votre panier est vide</p>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div style={{ fontFamily: FONT_BODY, background: CP.surface, minHeight: '100vh' }}>
        <SEO title="Commande confirmée" description="Merci pour votre commande Les Jus Naturels Ben's" url="https://lesjusnaturelsbens.com/checkout" />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px' }}>
          {/* Success Icon */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 12px 40px rgba(5,150,105,0.2)',
            }}>
              <span style={{ fontSize: 48, color: '#059669' }}>✓</span>
            </div>
            <h1 style={{
              fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              fontWeight: 700, color: CP.primary, marginBottom: 12,
            }}>
              Commande confirmée!
            </h1>
            <p style={{
              display: 'inline-block',
              background: CP.surfaceContainerLow, color: CP.primary,
              fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700,
              padding: '8px 20px', borderRadius: 9999,
            }}>
              #{orderId}
            </p>
          </div>

          {/* Email Notification */}
          <div style={{
            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            border: '1.5px solid #BFDBFE',
            borderRadius: '1.25rem',
            padding: '20px 24px',
            marginBottom: 24,
            display: 'flex', alignItems: 'flex-start', gap: 16,
          }}>
            <span style={{ fontSize: '1.4rem' }}>📧</span>
            <div>
              <p style={{ fontSize: '0.9rem', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                Un email de confirmation a été envoyé à <strong>{customerEmail}</strong>
              </p>
              <p style={{ fontSize: '0.8rem', color: '#3B82F6', margin: '6px 0 0' }}>
                Vous y trouverez les détails et le suivi de votre commande.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: '#ffffff', borderRadius: '1.5rem',
            padding: 28, border: '1px solid rgba(27,77,56,0.08)',
            boxShadow: '0 4px 24px rgba(27,77,56,0.06)',
            marginBottom: 24,
          }}>
            <h2 style={{
              fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700,
              color: CP.primary, margin: '0 0 20px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: '1.2rem' }}>🧾</span>
              Détails de la commande
            </h2>

            <div style={{ marginBottom: 20 }}>
              {cart.items.map((item) => (
                <div key={item.productId} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid rgba(27,77,56,0.06)',
                }}>
                  <span style={{ fontSize: '0.9rem', color: CP.onSurface }}>
                    {item.name} <span style={{ color: CP.onSurfaceVariant }}>× {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: CP.primary }}>
                    {((item.price * item.quantity) / 100).toFixed(2)} $
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: CP.onSurfaceVariant }}>
                <span>Sous-total</span>
                <span>{(cart.subtotal / 100).toFixed(2)} $</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: CP.onSurfaceVariant }}>
                <span>Taxes</span>
                <span>{(cart.taxes / 100).toFixed(2)} $</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: CP.onSurfaceVariant }}>
                <span>Livraison</span>
                <span>{(cart.shippingCost / 100).toFixed(2)} $</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: 14, marginTop: 6,
                borderTop: '2px solid rgba(27,77,56,0.1)',
              }}>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700, color: CP.primary }}>
                  Total
                </span>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.3rem', fontWeight: 700, color: CP.primary }}>
                  {(cart.total / 100).toFixed(2)} $
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{
            background: '#ffffff', borderRadius: '1.25rem',
            padding: 24, border: '1px solid rgba(27,77,56,0.08)',
            marginBottom: 32,
          }}>
            <h2 style={{
              fontFamily: FONT_BODY, fontSize: '0.85rem', fontWeight: 700,
              color: CP.gold, margin: '0 0 12px',
              letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            }}>
              📍 Adresse de livraison
            </h2>
            <p style={{ fontSize: '0.95rem', color: CP.onSurface, margin: 0, lineHeight: 1.7 }}>
              {address.name}<br />
              {address.street}<br />
              {address.city}, {address.province} {address.postalCode}
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/nos-produits'}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: 9999,
              border: 'none',
              background: `linear-gradient(135deg, ${CP.primary}, ${CP.primaryContainer})`,
              color: '#fff',
              fontFamily: FONT_BODY,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(27,77,56,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,77,56,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,77,56,0.2)';
            }}
          >
            Continuer mes achats →
          </button>
        </div>
      </div>
    );
  }

  const handleNextStep = () => {
    setFormErrors({});

    if (step === 1) {
      // Step 1: Cart review - always allowed
      setStep(2);
    } else if (step === 2) {
      // Step 2: Customer info validation
      if (!customerEmail.trim()) {
        setFormErrors({ email: 'Email requis' });
        return;
      }

      if (!customerName.trim()) {
        setFormErrors({ name: 'Nom requis' });
        return;
      }

      // Check rate limiting for guest checkout
      if (!user && !checkCheckoutLimit(customerEmail)) {
        setFormErrors({
          general: `Trop de tentatives. Réessayez dans ${Math.floor(remainingTime / 60)} minutes`,
        });
        return;
      }

      if (!emailVerified && isGuest) {
        setFormErrors({ general: 'Veuillez vérifier votre email d\'abord' });
        return;
      }

      setAddress((a) => ({
        ...a,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      }));
      setStep(3);
    } else if (step === 3) {
      // Step 3: Address validation
      const { isValid, errors } = validateCheckoutForm({
        email: customerEmail,
        name: customerName,
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        phone: address.phone,
      });

      if (!isValid) {
        setFormErrors(errors);
        return;
      }

      setStep(4);
    }
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);
    try {
      // Simulate payment processing with Square
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        orderId: `ORD-${new Date().getFullYear()}-${Math.random().toString().substr(2, 5)}`,
        guestEmail: customerEmail,
        items: cart.items,
        subtotal: cart.subtotal,
        taxes: cart.taxes,
        shippingCost: cart.shippingCost,
        shippingAddress: address,
        deliveryType,
        total: cart.total,
        status: 'PAID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      };

      // Save order
      const orders = JSON.parse(localStorage.getItem('shop_orders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('shop_orders', JSON.stringify(orders));

      setOrderId(newOrder.orderId);
      clearCart();
      setOrderConfirmed(true);
    } catch (error) {
      alert('Erreur lors du paiement. Veuillez réessayer.');
    }
    setPaymentProcessing(false);
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: CP.surface, minHeight: '100vh' }}>
      <SEO title="Paiement" description="Finalisez votre commande Les Jus Naturels Ben's" url="https://lesjusnaturelsbens.com/checkout" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${CP.primary} 0%, ${CP.primaryContainer} 100%)`,
        padding: '48px 32px 40px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase' as const,
          color: CP.gold, marginBottom: 12,
        }}>
          ✦ Paiement Sécurisé
        </p>
        <h1 style={{
          fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 700, color: '#ffffff', margin: 0,
        }}>
          Finaliser votre commande
        </h1>
      </div>

      <div style={{ maxWidth: MAX_W, margin: '0 auto', padding: '40px 32px 80px' }}>
        {/* Progress Steps */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          marginBottom: 48, position: 'relative',
        }}>
          {[
            { step: 1, label: 'Panier', icon: '🛒' },
            { step: 2, label: 'Client', icon: '👤' },
            { step: 3, label: 'Livraison', icon: '📦' },
            { step: 4, label: 'Paiement', icon: '💳' },
          ].map((s, idx) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                minWidth: 80,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: step >= s.step
                    ? `linear-gradient(135deg, ${CP.primary}, ${CP.primaryContainer})`
                    : '#ffffff',
                  border: step >= s.step ? 'none' : '2px solid rgba(27,77,56,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: step >= s.step ? '1.3rem' : '1.1rem',
                  color: step >= s.step ? '#fff' : CP.onSurfaceVariant,
                  boxShadow: step >= s.step ? '0 4px 16px rgba(27,77,56,0.2)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {step > s.step ? '✓' : s.icon}
                </div>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600,
                  color: step >= s.step ? CP.primary : CP.onSurfaceVariant,
                }}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div style={{
                  width: 60, height: 3, borderRadius: 9999,
                  background: step > s.step ? CP.primary : 'rgba(27,77,56,0.12)',
                  margin: '0 8px 24px',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          <div>
            {/* STEP 1: CART REVIEW */}
            {step >= 1 && (
              <div style={{
                background: '#ffffff', borderRadius: '1.5rem',
                padding: 28, border: '1px solid rgba(27,77,56,0.08)',
                boxShadow: '0 2px 16px rgba(27,77,56,0.05)',
                marginBottom: 20,
              }}>
                <h2 style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700,
                  color: CP.primary, margin: '0 0 20px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: CP.surfaceContainerLow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem',
                  }}>1</span>
                  Résumé du panier
                </h2>
                {cart.items.map((item) => (
                  <div key={item.productId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0', borderBottom: '1px solid rgba(27,77,56,0.06)',
                  }}>
                    <span style={{ fontSize: '0.95rem', color: CP.onSurface }}>
                      {item.name}
                      {item.format && <span style={{ color: CP.onSurfaceVariant }}> ({item.format})</span>}
                      <span style={{ color: CP.onSurfaceVariant }}> × {item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: 600, color: CP.primary }}>
                      {((item.price * item.quantity) / 100).toFixed(2)} $
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2: CUSTOMER INFO */}
            {step >= 2 && (
              <div style={{
                background: '#ffffff', borderRadius: '1.5rem',
                padding: 28, border: '1px solid rgba(27,77,56,0.08)',
                boxShadow: '0 2px 16px rgba(27,77,56,0.05)',
                marginBottom: 20,
              }}>
                <h2 style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700,
                  color: CP.primary, margin: '0 0 24px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: CP.surfaceContainerLow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem',
                  }}>2</span>
                  Informations client
                </h2>

                {formErrors.general && (
                  <div style={{
                    background: '#FEE2E2', border: '1.5px solid #FECACA',
                    borderRadius: '1rem', padding: '14px 18px',
                    marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>⚠️</span>
                    <p style={{ fontSize: '0.9rem', color: '#DC2626', margin: 0 }}>{formErrors.general}</p>
                  </div>
                )}

                {isGuest && !user && (
                  <div style={{ marginBottom: 24 }}>
                    <GuestEmailValidator
                      onEmailVerified={(email) => {
                        setCustomerEmail(email);
                        setEmailVerified(true);
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Nom complet *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={step > 2}
                    style={{
                      ...inputStyle,
                      borderColor: formErrors.name ? '#DC2626' : 'rgba(27,77,56,0.15)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  {formErrors.name && (
                    <p style={{ fontSize: '0.8rem', color: '#DC2626', margin: '6px 0 0' }}>{formErrors.name}</p>
                  )}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled={step > 2 || (isGuest && emailVerified)}
                    style={{
                      ...inputStyle,
                      borderColor: formErrors.email ? '#DC2626' : 'rgba(27,77,56,0.15)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  {formErrors.email && (
                    <p style={{ fontSize: '0.8rem', color: '#DC2626', margin: '6px 0 0' }}>{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    disabled={step > 2}
                    placeholder="(514) 000-0000"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SHIPPING */}
            {step >= 3 && (
              <div style={{
                background: '#ffffff', borderRadius: '1.5rem',
                padding: 28, border: '1px solid rgba(27,77,56,0.08)',
                boxShadow: '0 2px 16px rgba(27,77,56,0.05)',
                marginBottom: 20,
              }}>
                <h2 style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700,
                  color: CP.primary, margin: '0 0 24px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: CP.surfaceContainerLow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem',
                  }}>3</span>
                  Adresse de livraison
                </h2>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Type de livraison</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { value: 'local', label: 'Montréal', sub: 'Gratuit si >100$', icon: '📍' },
                      { value: 'canada', label: 'Canada', sub: 'Livraison standard', icon: '🚚' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDeliveryType(opt.value as DeliveryType)}
                        disabled={step > 3}
                        style={{
                          flex: 1, padding: '16px 18px',
                          borderRadius: '1rem',
                          border: `2px solid ${deliveryType === opt.value ? CP.primary : 'rgba(27,77,56,0.12)'}`,
                          background: deliveryType === opt.value ? `${CP.primary}08` : '#fff',
                          cursor: step > 3 ? 'default' : 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                          <span style={{ fontWeight: 700, color: CP.primary }}>{opt.label}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: CP.onSurfaceVariant }}>{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Rue *</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    disabled={step > 3}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Ville *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    disabled={step > 3}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Province</label>
                    <input
                      type="text"
                      value={address.province}
                      onChange={(e) => setAddress({ ...address, province: e.target.value })}
                      disabled={step > 3}
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Code postal *</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      disabled={step > 3}
                      placeholder="H1A 0A1"
                      style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = CP.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${CP.primary}18`; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT */}
            {step >= 4 && (
              <div style={{
                background: '#ffffff', borderRadius: '1.5rem',
                padding: 28, border: '1px solid rgba(27,77,56,0.08)',
                boxShadow: '0 2px 16px rgba(27,77,56,0.05)',
                marginBottom: 20,
              }}>
                <h2 style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700,
                  color: CP.primary, margin: '0 0 24px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: CP.surfaceContainerLow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem',
                  }}>4</span>
                  Paiement sécurisé
                </h2>

                <div style={{
                  background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                  border: '1.5px solid #BFDBFE',
                  borderRadius: '1rem',
                  padding: '18px 20px',
                  marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💳</span>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E40AF', margin: '0 0 4px' }}>
                      Paiement sécurisé via Square
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#3B82F6', margin: 0 }}>
                      Vos informations sont protégées par cryptage SSL.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    borderRadius: 9999,
                    border: 'none',
                    background: paymentProcessing
                      ? 'rgba(27,77,56,0.5)'
                      : `linear-gradient(135deg, ${CP.primary}, ${CP.primaryContainer})`,
                    color: '#fff',
                    fontFamily: FONT_BODY,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 20px rgba(27,77,56,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  {paymentProcessing ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                      Traitement en cours...
                    </span>
                  ) : (
                    `Payer ${(cart.total / 100).toFixed(2)} $ CAD`
                  )}
                </button>
              </div>
            )}

            {/* NAVIGATION */}
            <div style={{ display: 'flex', gap: 16 }}>
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                  style={{
                    flex: 1, padding: '14px 24px',
                    borderRadius: 9999,
                    border: `2px solid rgba(27,77,56,0.15)`,
                    background: '#fff',
                    color: CP.primary,
                    fontFamily: FONT_BODY,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = CP.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(27,77,56,0.15)'; }}
                >
                  ← Retour
                </button>
              )}
              {step < 4 && (
                <button
                  onClick={handleNextStep}
                  style={{
                    flex: 1, padding: '14px 24px',
                    borderRadius: 9999,
                    border: 'none',
                    background: `linear-gradient(135deg, ${CP.primary}, ${CP.primaryContainer})`,
                    color: '#fff',
                    fontFamily: FONT_BODY,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(27,77,56,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(27,77,56,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,77,56,0.2)';
                  }}
                >
                  Continuer →
                </button>
              )}
            </div>
          </div>

        {/* SUMMARY SIDEBAR */}
          <div style={{
            background: '#ffffff', borderRadius: '1.5rem',
            padding: 28, border: '1px solid rgba(27,77,56,0.08)',
            boxShadow: '0 4px 24px rgba(27,77,56,0.08)',
            position: 'sticky', top: 100,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: `linear-gradient(135deg, ${CP.primary}, ${CP.primaryContainer})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1.1rem',
              }}>
                ✦
              </div>
              <div>
                <h2 style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700,
                  color: CP.primary, margin: 0,
                }}>
                  Votre commande
                </h2>
                <p style={{ fontSize: '0.8rem', color: CP.onSurfaceVariant, margin: '2px 0 0' }}>
                  {cart.items.length} article{cart.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: CP.onSurfaceVariant }}>
                <span>Sous-total</span>
                <span style={{ fontWeight: 600 }}>{(cart.subtotal / 100).toFixed(2)} $</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: CP.onSurfaceVariant }}>
                <span>Taxes</span>
                <span style={{ fontWeight: 600 }}>{(cart.taxes / 100).toFixed(2)} $</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem',
                paddingBottom: 14, borderBottom: '1px solid rgba(27,77,56,0.1)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: CP.onSurfaceVariant }}>
                  Livraison
                  {cart.shippingCost === 0 && (
                    <span style={{
                      background: '#D1FAE5', color: '#065F46',
                      fontSize: '0.65rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: 9999,
                    }}>
                      OFFERTE
                    </span>
                  )}
                </span>
                <span style={{ fontWeight: 600, color: cart.shippingCost === 0 ? '#065F46' : CP.onSurfaceVariant }}>
                  {(cart.shippingCost / 100).toFixed(2)} $
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700, color: CP.primary }}>
                  Total
                </span>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.5rem', fontWeight: 700, color: CP.primary }}>
                  {(cart.total / 100).toFixed(2)} $
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10, paddingTop: 24, borderTop: '1px solid rgba(27,77,56,0.08)',
              marginTop: 24,
            }}>
              {[
                { icon: '🔒', label: 'Paiement sécurisé' },
                { icon: '🚚', label: 'Livraison rapide' },
                { icon: '🌿', label: '100% Naturel' },
                { icon: '♻️', label: 'Éco-responsable' },
              ].map((b) => (
                <div key={b.label} style={{
                  background: CP.surfaceContainerLow,
                  borderRadius: '0.75rem',
                  padding: '10px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: CP.onSurfaceVariant }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
