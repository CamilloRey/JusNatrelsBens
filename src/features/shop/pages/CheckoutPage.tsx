import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSupabaseAuth } from '@/features/auth/context/SupabaseAuthContext';
import { useSecurityValidation } from '@/features/auth/hooks/useSecurityValidation';
import { useRateLimit } from '@/features/auth/hooks/useRateLimit';
import { GuestEmailValidator } from '../components/GuestEmailValidator';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import type { ShippingAddress, DeliveryType, Order } from '../types/shop.types';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useSupabaseAuth();
  const { validateCheckoutForm, sanitizeCheckoutData } = useSecurityValidation();
  const { isRateLimited, remainingTime, checkCheckoutLimit } = useRateLimit();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isGuest, setIsGuest] = useState(!user);
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
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: 48, margin: '0 0 16px' }}>🛒</p>
        <p style={{ color: C.muted }}>Votre panier est vide</p>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 64, margin: '0 0 16px' }}>✓</p>
          <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Commande confirmée!
          </h1>
          <p style={{ fontSize: 16, color: C.green, fontWeight: 700, marginBottom: 24 }}>
            Commande #{orderId}
          </p>
        </div>

        <div
          style={{
            background: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 14, color: '#1e40af', margin: 0, lineHeight: 1.6 }}>
            📧 Un email de confirmation a été envoyé à <strong>{customerEmail}</strong>
            <br />
            Vous y trouverez les détails de votre commande et informations de suivi.
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
            Détails de la commande
          </h2>

          <div style={{ marginBottom: 16 }}>
            {cart.items.map((item) => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                <span>{item.name} × {item.quantity}</span>
                <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sous-total</span>
              <span>${(cart.subtotal / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Taxes</span>
              <span>${(cart.taxes / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Livraison</span>
              <span>${(cart.shippingCost / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, borderTop: `1px solid ${C.border}`, paddingTop: 8, marginTop: 8 }}>
              <span>Total</span>
              <span style={{ color: C.green }}>${(cart.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, margin: '0 0 12px' }}>
            Adresse de livraison
          </h2>
          <p style={{ fontSize: 13, color: C.dark, margin: 0, lineHeight: 1.6 }}>
            {address.name}
            <br />
            {address.street}
            <br />
            {address.city}, {address.province} {address.postalCode}
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/shop'}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: 10,
            border: 'none',
            background: C.hibiscus,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 24,
          }}
        >
          Continuer les achats
        </button>
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
      const requiredFields = {
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
      };

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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      {/* PROGRESS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
        {[
          { step: 1, label: 'Panier' },
          { step: 2, label: 'Client' },
          { step: 3, label: 'Livraison' },
          { step: 4, label: 'Paiement' },
        ].map((s) => (
          <div key={s.step} style={{ flex: 1, marginRight: 16 }}>
            <div
              style={{
                height: 40,
                borderRadius: 50,
                background: step >= s.step ? C.hibiscus : C.light,
                color: step >= s.step ? '#fff' : C.muted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {s.step}
            </div>
            <div style={{ fontSize: 12, textAlign: 'center', color: C.muted }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        <div>
          {/* STEP 1: CART REVIEW */}
          {step >= 1 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
                Résumé du panier
              </h2>
              {cart.items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <span>
                    {item.name} {item.format && `(${item.format})`} × {item.quantity}
                  </span>
                  <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: CUSTOMER INFO */}
          {step >= 2 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
                Informations client
              </h2>

              {/* Error Messages */}
              {formErrors.general && (
                <div
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 16,
                    fontSize: 13,
                    color: '#dc2626',
                  }}
                >
                  {formErrors.general}
                </div>
              )}

              {/* Guest Email Verification */}
              {isGuest && !user && (
                <div style={{ marginBottom: 20 }}>
                  <GuestEmailValidator
                    onEmailVerified={(email) => {
                      setCustomerEmail(email);
                      setEmailVerified(true);
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Nom complet *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  disabled={step > 2}
                  style={{
                    ...inputSt,
                    borderColor: formErrors.name ? '#dc2626' : undefined,
                  }}
                />
                {formErrors.name && (
                  <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  disabled={step > 2 || (isGuest && emailVerified)}
                  style={{
                    ...inputSt,
                    borderColor: formErrors.email ? '#dc2626' : undefined,
                  }}
                />
                {formErrors.email && (
                  <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0' }}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label style={labelSt}>Téléphone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  disabled={step > 2}
                  style={{
                    ...inputSt,
                    borderColor: formErrors.phone ? '#dc2626' : undefined,
                  }}
                />
                {formErrors.phone && (
                  <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0' }}>
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SHIPPING */}
          {step >= 3 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
                Adresse de livraison
              </h2>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Type de livraison</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { value: 'local', label: '📍 Montréal (gratuit si >$100)' },
                    { value: 'canada', label: '🚚 Canada' },
                  ].map((opt) => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        checked={deliveryType === opt.value}
                        onChange={() => setDeliveryType(opt.value as DeliveryType)}
                        disabled={step > 3}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Rue *</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  disabled={step > 3}
                  style={inputSt}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelSt}>Ville *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  disabled={step > 3}
                  style={inputSt}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelSt}>Province</label>
                  <input
                    type="text"
                    value={address.province}
                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                    disabled={step > 3}
                    style={inputSt}
                  />
                </div>
                <div>
                  <label style={labelSt}>Code postal *</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    disabled={step > 3}
                    placeholder="H1A 0A1"
                    style={inputSt}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT */}
          {step >= 4 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
                Paiement
              </h2>

              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bfdbfe',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}>
                <p style={{ fontSize: 13, color: '#1e40af', margin: 0 }}>
                  💳 Paiement sécurisé via Square
                  <br />
                  Vos informations de paiement sont traitées de manière sécurisée.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentProcessing}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: C.hibiscus,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                  opacity: paymentProcessing ? 0.7 : 1,
                }}
              >
                {paymentProcessing ? 'Traitement...' : `Payer ${(cart.total / 100).toFixed(2)} CAD`}
              </button>
            </div>
          )}

          {/* NAVIGATION */}
          <div style={{ display: 'flex', gap: 12 }}>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as any)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: '#fff',
                  color: C.dark,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retour
              </button>
            )}
            {step < 4 && (
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: C.hibiscus,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Suivant
              </button>
            )}
          </div>
        </div>

        {/* SUMMARY SIDEBAR */}
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 20,
            border: `1px solid ${C.border}`,
            height: 'fit-content',
            position: 'sticky',
            top: 20,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
            Résumé
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Sous-total</span>
              <span>${(cart.subtotal / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Taxes</span>
              <span>${(cart.taxes / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
              <span>Livraison</span>
              <span>${(cart.shippingCost / 100).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: C.green }}>${(cart.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
