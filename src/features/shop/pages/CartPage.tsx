import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { C } from '@/shared/constants/colors';
import { CSS } from '@/shared/constants/styles';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  if (cart.items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
        <p style={{ fontSize: 48, margin: '0 0 16px' }}>🛒</p>
        <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Votre panier est vide
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
          Découvrez nos délicieux produits et commencez vos achats!
        </p>
        <button
          onClick={handleContinueShopping}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: 'none',
            background: C.hibiscus,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Continuer les achats
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      {/* HEADER */}
      <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        Votre panier
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24 }}>
        {/* ITEMS */}
        <div>
          {cart.items.map((item) => (
            <div
              key={`${item.productId}-${item.format}`}
              style={{
                display: 'flex',
                gap: 16,
                padding: 16,
                background: '#fff',
                borderRadius: 12,
                marginBottom: 12,
                border: `1px solid ${C.border}`,
              }}
            >
              {/* IMAGE */}
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  background: C.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  flexShrink: 0,
                }}
              >
                {item.img.startsWith('http') ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                  />
                ) : (
                  item.img
                )}
              </div>

              {/* INFO */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, color: C.dark }}>
                  {item.name}
                </h3>
                {item.format && (
                  <p style={{ margin: '0 0 8px', fontSize: 12, color: C.muted }}>
                    Format: {item.format}
                  </p>
                )}

                {/* QUANTITY */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 16,
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                    style={{
                      width: 50,
                      textAlign: 'center',
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      padding: '6px 8px',
                      fontSize: 14,
                    }}
                  />
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      border: `1px solid ${C.border}`,
                      background: '#fff',
                      cursor: 'pointer',
                      fontSize: 16,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRICE & ACTIONS */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: C.green, margin: 0 }}>
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </p>
                <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 12px' }}>
                  ${(item.price / 100).toFixed(2)} × {item.quantity}
                </p>
                <button
                  onClick={() => removeItem(item.productId)}
                  style={{
                    fontSize: 12,
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
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
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
            Résumé
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>Sous-total</span>
              <span>${(cart.subtotal / 100).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>Taxes (TPS+TVQ)</span>
              <span>${(cart.taxes / 100).toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                paddingBottom: 12,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span>
                Livraison {cart.shippingCost === 0 && <span style={{ color: C.green, fontWeight: 600 }}>GRATUITE</span>}
              </span>
              <span>${(cart.shippingCost / 100).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: C.green }}>${(cart.total / 100).toFixed(2)}</span>
            </div>
          </div>

          {cart.subtotal < 10000 && (
            <div
              style={{
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                fontSize: 12,
                color: '#92400e',
              }}
            >
              💡 Ajoutez ${((10000 - cart.subtotal) / 100).toFixed(2)} pour la<strong> livraison gratuite!</strong>
            </div>
          )}

          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: 'none',
              background: C.hibiscus,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 8,
            }}
          >
            Procéder au paiement
          </button>

          <button
            onClick={handleContinueShopping}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: '#fff',
              color: C.dark,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Continuer les achats
          </button>

          <button
            onClick={clearCart}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: 10,
              border: 'none',
              background: 'none',
              color: '#dc2626',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8,
              textDecoration: 'underline',
            }}
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}
