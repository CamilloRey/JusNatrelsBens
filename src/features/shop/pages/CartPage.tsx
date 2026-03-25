import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';

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
const MAX_W         = 1200;

function WaveDivider({ topColor, bottomColor }: { topColor: string; bottomColor: string }) {
  return (
    <div style={{ display: 'block', lineHeight: 0, background: bottomColor }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
        <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z" fill={topColor} />
      </svg>
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate(ROUTES.products);
  };

  if (cart.items.length === 0) {
    return (
      <div style={{ fontFamily: FONT_BODY, background: CP.surface, minHeight: '100vh' }}>
        <SEO title="Panier" description="Votre panier Les Jus Naturels Ben's" url="https://lesjusnaturelsbens.com/panier" />
        
        {/* Hero */}
        <section style={{
          background: `linear-gradient(135deg, ${CP.primary} 0%, ${CP.primaryContainer} 100%)`,
          padding: '72px 32px 56px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% -20%, rgba(201,168,76,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase' as const,
              color: CP.gold, marginBottom: 16,
            }}>
              ✦ Votre Sélection
            </p>
            <h1 style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 700, color: '#ffffff',
              margin: 0, lineHeight: 1.15,
            }}>
              Votre Panier
            </h1>
          </div>
        </section>
        <WaveDivider topColor={CP.primaryContainer} bottomColor={CP.surface} />

        <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', padding: '48px 24px 96px' }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: `linear-gradient(135deg, ${CP.surfaceContainerLow}, ${CP.surfaceContainer})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, margin: '0 auto 28px',
            boxShadow: '0 8px 32px rgba(27,77,56,0.1)',
          }}>
            🛒
          </div>
          <h2 style={{
            fontFamily: FONT_HEADLINE, fontSize: '1.6rem', fontWeight: 700,
            color: CP.primary, marginBottom: 12,
          }}>
            Votre panier est vide
          </h2>
          <p style={{
            fontSize: '1rem', color: CP.onSurfaceVariant, lineHeight: 1.7,
            marginBottom: 32, maxWidth: 360, margin: '0 auto 32px',
          }}>
            Découvrez nos élixirs de bien-être et commencez votre voyage gustatif.
          </p>
          <button
            onClick={handleContinueShopping}
            style={{
              padding: '16px 40px',
              borderRadius: 9999,
              border: 'none',
              background: CP.primary,
              color: '#fff',
              fontFamily: FONT_BODY,
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,77,56,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Découvrir nos produits →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT_BODY, background: CP.surface, minHeight: '100vh' }}>
      <SEO title="Panier" description="Votre panier Les Jus Naturels Ben's" url="https://lesjusnaturelsbens.com/panier" />

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${CP.primary} 0%, ${CP.primaryContainer} 100%)`,
        padding: '72px 32px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% -20%, rgba(201,168,76,0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            color: CP.gold, marginBottom: 16,
          }}>
            ✦ Votre Sélection
          </p>
          <h1 style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 700, color: '#ffffff',
            margin: '0 0 8px', lineHeight: 1.15,
          }}>
            Votre Panier
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
            {cart.items.length} article{cart.items.length > 1 ? 's' : ''} sélectionné{cart.items.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>
      <WaveDivider topColor={CP.primaryContainer} bottomColor={CP.surface} />

      {/* Main Content */}
      <div style={{ maxWidth: MAX_W, margin: '0 auto', padding: '0 32px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, alignItems: 'start' }}>
          
          {/* Items */}
          <div>
            {cart.items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.format}`}
                style={{
                  display: 'flex',
                  gap: 24,
                  padding: 24,
                  background: '#ffffff',
                  borderRadius: '1.25rem',
                  marginBottom: 16,
                  border: '1px solid rgba(27,77,56,0.08)',
                  boxShadow: '0 2px 16px rgba(27,77,56,0.05)',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(27,77,56,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 16px rgba(27,77,56,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Numéro */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: CP.surfaceContainerLow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: CP.primary,
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </div>

                {/* Image */}
                <div style={{
                  width: 110, height: 110,
                  borderRadius: '1rem',
                  background: `linear-gradient(135deg, ${CP.surfaceContainerLow}, ${CP.surfaceContainer})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 44, flexShrink: 0, overflow: 'hidden',
                }}>
                  {item.img.startsWith('http') ? (
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    item.img
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{
                    fontFamily: FONT_HEADLINE, margin: '0 0 6px',
                    fontSize: '1.15rem', fontWeight: 700, color: CP.primary,
                  }}>
                    {item.name}
                  </h3>
                  {item.format && (
                    <span style={{
                      display: 'inline-block',
                      background: CP.surfaceContainerLow,
                      color: CP.onSurfaceVariant,
                      fontSize: '0.75rem', fontWeight: 600,
                      padding: '4px 12px', borderRadius: 9999,
                      marginBottom: 12, width: 'fit-content',
                    }}>
                      {item.format}
                    </span>
                  )}

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      style={{
                        width: 36, height: 36,
                        borderRadius: '0.75rem 0 0 0.75rem',
                        border: `1.5px solid rgba(27,77,56,0.15)`,
                        borderRight: 'none',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '1.1rem', fontWeight: 700, color: CP.primary,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = CP.surfaceContainerLow; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >
                      −
                    </button>
                    <span style={{
                      width: 48, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid rgba(27,77,56,0.15)`,
                      borderLeft: 'none', borderRight: 'none',
                      background: '#fff',
                      fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: '1rem', color: CP.primary,
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      style={{
                        width: 36, height: 36,
                        borderRadius: '0 0.75rem 0.75rem 0',
                        border: `1.5px solid rgba(27,77,56,0.15)`,
                        borderLeft: 'none',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '1.1rem', fontWeight: 700, color: CP.primary,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = CP.surfaceContainerLow; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price & Actions */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{
                      fontFamily: FONT_HEADLINE, fontSize: '1.4rem', fontWeight: 700,
                      color: CP.primary, margin: 0,
                    }}>
                      {((item.price * item.quantity) / 100).toFixed(2)} $
                    </p>
                    <p style={{ fontSize: '0.8rem', color: CP.onSurfaceVariant, margin: '4px 0 0' }}>
                      {(item.price / 100).toFixed(2)} $ × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    style={{
                      fontSize: '0.8rem', color: '#dc2626',
                      background: 'rgba(220,38,38,0.08)',
                      border: 'none', borderRadius: '0.5rem',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}

            {/* Continue shopping link */}
            <button
              onClick={handleContinueShopping}
              style={{
                background: 'none', border: 'none',
                color: CP.accent, fontFamily: FONT_BODY,
                fontSize: '0.9rem', fontWeight: 700,
                cursor: 'pointer', padding: 0, marginTop: 8,
              }}
            >
              ← Continuer mes achats
            </button>
          </div>

          {/* Summary */}
          <div style={{
            background: '#ffffff',
            borderRadius: '1.5rem',
            padding: 32,
            border: '1px solid rgba(27,77,56,0.08)',
            boxShadow: '0 4px 32px rgba(27,77,56,0.08)',
            position: 'sticky',
            top: 100,
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
                  fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700,
                  color: CP.primary, margin: 0,
                }}>
                  Récapitulatif
                </h2>
                <p style={{ fontSize: '0.8rem', color: CP.onSurfaceVariant, margin: '2px 0 0' }}>
                  {cart.items.length} article{cart.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: CP.onSurfaceVariant }}>
                <span>Sous-total</span>
                <span style={{ fontWeight: 600 }}>{(cart.subtotal / 100).toFixed(2)} $</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: CP.onSurfaceVariant }}>
                <span>Taxes (TPS+TVQ)</span>
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
                      fontSize: '0.7rem', fontWeight: 700,
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700, color: CP.primary }}>
                  Total
                </span>
                <span style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1.6rem', fontWeight: 700, color: CP.primary,
                }}>
                  {(cart.total / 100).toFixed(2)} $
                </span>
              </div>
            </div>

            {/* Free shipping nudge */}
            {cart.subtotal < 10000 && (
              <div style={{
                background: '#FEF9C3',
                border: '1.5px solid #FDE68A',
                borderRadius: '1rem',
                padding: '14px 18px',
                marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: '1.2rem' }}>🚚</span>
                <p style={{ fontSize: '0.85rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  Plus que <strong>{((10000 - cart.subtotal) / 100).toFixed(2)} $</strong> pour la livraison gratuite!
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleCheckout}
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
                marginBottom: 12,
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 16px rgba(27,77,56,0.2)',
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
              Procéder au paiement →
            </button>

            {/* Trust badges */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 20,
              paddingTop: 20, borderTop: '1px solid rgba(27,77,56,0.08)',
              marginTop: 16,
            }}>
              {[
                { icon: '🔒', text: 'Paiement sécurisé' },
                { icon: '🚚', text: 'Livraison rapide' },
                { icon: '✓', text: '100% Naturel' },
              ].map((b) => (
                <div key={b.text} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                  <span style={{ fontSize: '0.65rem', color: CP.onSurfaceVariant, fontWeight: 600, textAlign: 'center' }}>
                    {b.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'none',
                color: '#9ca3af',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                marginTop: 16,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
