import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { useCart } from '@/features/shop/context/CartContext';
import { useToast } from '@/features/shop/context/ToastContext';
import { SEO } from '@/shared/components/SEO';
import { ProductImg } from '@/shared/ui/ProductImg';
import { ROUTES } from '@/shared/constants/routes';

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
  gold:                '#C9A84C',
  accent:              '#E07A20',
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

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Pressé à froid':    { bg: '#FEF9C3', text: '#92400E' },
  '100% Naturel':      { bg: '#D1FAE5', text: '#065F46' },
  'Bio':               { bg: '#D1FAE5', text: '#065F46' },
  'Boost Immunité':    { bg: '#FED7AA', text: '#7C2D12' },
  'Sans sucre ajouté': { bg: '#FCE7F3', text: '#831843' },
};

export default function ProductDetailPage() {
const { id }           = useParams<{ id: string }>();
const { products, reviews, ingredients } = useData();
const navigate         = useNavigate();
const { addItem }      = useCart();
const { addToast }     = useToast();
const [quantity, setQuantity]         = React.useState(1);
const [addedToCart, setAddedToCart]   = React.useState(false);
const [selectedFormat, setSelectedFormat] = React.useState(0);
const [reviewIdx, setReviewIdx]       = React.useState(0);

  const product = products.find((pr) => pr.id === id);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id:        `${product.id}-${quantity}`,
      productId: product.id,
      name:      product.name,
      price:     Math.round(product.price * 100),
      quantity,
      format:    product.formats[selectedFormat],
      img:       product.img,
    });
    addToast(`${product.name} ajouté au panier`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 32px', fontFamily: FONT_BODY }}>
        <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.5rem', color: C.primary, marginBottom: 16 }}>Produit introuvable</p>
        <button type="button" onClick={() => navigate(ROUTES.products)} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 9999, padding: '12px 32px', cursor: 'pointer', fontWeight: 700 }}>
          ← Retour aux produits
        </button>
      </div>
    );
  }

  const approvedReviews = reviews.filter((r) => r.approved);
  const otherProducts   = products.filter((pr) => pr.id !== product.id && pr.available).slice(0, 4);
  const avgRating       = approvedReviews.length > 0
    ? Math.round(approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length)
    : 5;

  // Ingrédients: ceux liés au produit, sinon fallback sur les premiers actifs
  const activeIngredients = ingredients.filter((i) => i.active);
  const linkedIngredientIds = product.ingredients ?? [];
  const productIngredients = linkedIngredientIds.length > 0
    ? activeIngredients.filter((i) => linkedIngredientIds.includes(i.id))
    : activeIngredients.slice(0, 5);
  // Fallback si aucun ingrédient
  const displayIngredients = productIngredients.length > 0
    ? productIngredients
    : [{ id: 'f1', name: 'Fruits frais', benefits: ['100% naturel', 'Sans conservateurs'], note: '', active: true, image: '' }];

  const badge = TAG_COLORS[product.tag] ?? { bg: C.surfaceContainerLow, text: C.onSurfaceVariant };

  // Reviews visible window
  const visibleCount    = 3;
  const reviewsLooped   = [...approvedReviews, ...approvedReviews];
  const reviewCardAccents = ['#D1FAE5','#FEF9C3','#FCE7F3','#FED7AA','#E0F2FE','#EDE9FE'];
  const reviewBorders     = ['#059669','#D97706','#BE185D','#EA580C','#0284C7','#7C3AED'];

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, color: C.onSurface }}>
      <SEO
        title={product.name}
        description={product.desc}
        url={`https://lesjusnaturelsbens.com/produits/${id}`}
      />

      {/* ═══════ HERO BAR ═══════ */}
      <section style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryContainer} 100%)`,
        padding:    '28px 32px',
        position:   'relative',
        overflow:   'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.1) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: MAX_W, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.products)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontFamily: FONT_BODY, fontSize: '0.85rem', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Nos Produits
            </button>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{product.category}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>/</span>
            <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>{product.name}</span>
          </div>
          {product.tag && (
            <span style={{ background: badge.bg, color: badge.text, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '5px 14px', borderRadius: 9999 }}>
              {product.tag}
            </span>
          )}
        </div>
      </section>

      <WaveDivider topColor={C.primaryContainer} bottomColor={C.surface} />

      {/* ═══════ MAIN PRODUCT SECTION ═══════ */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{
          maxWidth:            MAX_W,
          margin:              '0 auto',
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 72,
          alignItems:          'start',
        }}>
          {/* Left — image sticky */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              background:   `linear-gradient(135deg, ${product.color}18, ${product.color}08)`,
              borderRadius: '2rem',
              padding:      32,
              border:       `1px solid ${product.color}22`,
              position:     'relative',
            }}>
              {/* Glow */}
              <div style={{
                position:     'absolute',
                inset:        0,
                borderRadius: '2rem',
                background:   `radial-gradient(circle at 50% 50%, ${product.color}12 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                background:   '#ffffff',
                borderRadius: '1.5rem',
                minHeight:    440,
                display:      'grid',
                placeItems:   'center',
                overflow:     'hidden',
                position:     'relative',
              }}>
                <ProductImg
                  src={product.img}
                  alt={product.name}
                  size={360}
                  borderRadius={0}
                  style={{ width: 'min(85%, 340px)', height: 'auto' }}
                />
              </div>
            </div>

            {/* Quality badges row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              {[
                { icon: '🌿', text: 'Sans conservateurs' },
                { icon: '🍃', text: 'Sans sucre ajouté' },
                { icon: '🇨🇦', text: 'Produit du Québec' },
                { icon: '✓',  text: '100% Naturel' },
              ].map((b) => (
                <div key={b.text} style={{
                  background: '#ffffff', borderRadius: '0.875rem', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  border: `1px solid rgba(27,77,56,0.08)`,
                  fontSize: '0.8rem', color: C.primary, fontWeight: 600,
                }}>
                  <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — info */}
          <div style={{ paddingTop: 8 }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase' as const,
              color: C.accent, margin: '0 0 12px',
            }}>
              {product.category}
            </p>
            <h1 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(2rem, 4vw, 3rem)',
              fontWeight:   700,
              color:        C.primary,
              margin:       '0 0 16px',
              lineHeight:   1.15,
            }}>
              {product.name}
            </h1>

            {/* Stars */}
            {approvedReviews.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ color: s <= avgRating ? C.gold : '#d1cdc3', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <span style={{ color: C.onSurfaceVariant, fontSize: '0.85rem', fontWeight: 600 }}>
                  {avgRating}/5 · {approvedReviews.length} avis
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{
              background: C.surfaceContainerLow, borderRadius: '1.25rem',
              padding: '20px 24px', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: C.onSurfaceVariant, margin: '0 0 4px' }}>Prix</p>
                <p style={{ fontFamily: FONT_HEADLINE, fontSize: '2.6rem', fontWeight: 700, color: C.primary, margin: 0, lineHeight: 1 }}>
                  {product.price.toFixed(2).replace('.', ',')} <span style={{ fontSize: '1.5rem' }}>$</span>
                </p>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `${product.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>
                {product.category === 'Jus' ? '🍹' : product.category === 'Tisanes' ? '🌿' : product.category === 'Sirops' ? '🍯' : '✨'}
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '1rem', lineHeight: 1.85,
              color: C.onSurfaceVariant, marginBottom: 28,
            }}>
              {product.desc}
            </p>

            {/* Ingrédients pills */}
            <div style={{ marginBottom: 28 }}>
              <p style={{
                fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                color: C.gold, margin: '0 0 10px',
              }}>
                Ingrédients clés
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {productIngredients.map((ing) => (
                  <button
                    key={ing.id}
                    type="button"
                    onClick={() => navigate(ROUTES.products)}
                    style={{
                      background:   C.surfaceContainerLow,
                      color:        C.primary,
                      border:       `1px solid rgba(27,77,56,0.15)`,
                      borderRadius: 9999,
                      padding:      '7px 16px',
                      fontFamily:   FONT_BODY,
                      fontSize:     '0.82rem',
                      fontWeight:   600,
                      cursor:       'pointer',
                      transition:   'background 0.18s, border-color 0.18s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background    = C.primary;
                      e.currentTarget.style.color         = '#ffffff';
                      e.currentTarget.style.borderColor   = C.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background    = C.surfaceContainerLow;
                      e.currentTarget.style.color         = C.primary;
                      e.currentTarget.style.borderColor   = 'rgba(27,77,56,0.15)';
                    }}
                  >
                    🌿 {ing.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Formats */}
            {product.formats.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                  color: C.gold, margin: '0 0 10px',
                }}>
                  Format
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.formats.map((fmt, i) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(i)}
                      style={{
                        padding:      '10px 22px',
                        borderRadius: '0.875rem',
                        border:       `2px solid ${i === selectedFormat ? C.primary : 'rgba(27,77,56,0.18)'}`,
                        background:   i === selectedFormat ? C.primary : '#ffffff',
                        color:        i === selectedFormat ? '#ffffff' : C.primary,
                        fontFamily:   FONT_BODY,
                        fontWeight:   700,
                        fontSize:     '0.9rem',
                        cursor:       'pointer',
                        transition:   'all 0.18s',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Cart */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              {/* Qty */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: C.surfaceContainerLow, borderRadius: '0.875rem',
                border: `1px solid rgba(27,77,56,0.12)`, overflow: 'hidden',
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 42, height: 48, background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '1.2rem', color: C.primary,
                    fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span style={{
                  width: 40, textAlign: 'center', fontFamily: FONT_HEADLINE,
                  fontWeight: 700, fontSize: '1rem', color: C.primary,
                }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 42, height: 48, background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '1.2rem', color: C.primary,
                    fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addedToCart}
                style={{
                  flex:         1,
                  background:   addedToCart 
                    ? 'linear-gradient(135deg, #059669, #047857)' 
                    : `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                  color:        '#ffffff',
                  border:       'none',
                  borderRadius: 9999,
                  padding:      '16px 28px',
                  fontFamily:   FONT_BODY,
                  fontWeight:   700,
                  fontSize:     '1rem',
                  cursor:       addedToCart ? 'default' : 'pointer',
                  transition:   'all 0.3s',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  gap:          10,
                  boxShadow:    addedToCart 
                    ? '0 4px 20px rgba(5,150,105,0.3)' 
                    : '0 4px 20px rgba(27,77,56,0.25)',
                }}
                onMouseEnter={(e) => { 
                  if (!addedToCart) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,77,56,0.35)';
                  }
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = addedToCart 
                    ? '0 4px 20px rgba(5,150,105,0.3)' 
                    : '0 4px 20px rgba(27,77,56,0.25)';
                }}
              >
                {addedToCart ? (
                  <>✓ Ajouté au panier</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>

            {/* Trust & Urgency Badges */}
            <div style={{
              background: C.surfaceContainerLow,
              borderRadius: '1rem',
              padding: '18px 20px',
              marginTop: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {[
                  { icon: '🚚', text: 'Livraison gratuite dès 100$' },
                  { icon: '🔒', text: 'Paiement sécurisé' },
                  { icon: '🌿', text: 'Produit frais' },
                ].map((b) => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: C.onSurfaceVariant }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Limited Stock Urgency (simulated) */}
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              border: '1.5px solid #FCD34D',
              borderRadius: '1rem',
              padding: '14px 18px',
              marginTop: 16,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E', margin: '0 0 2px' }}>
                  Stock limité
                </p>
                <p style={{ fontSize: '0.75rem', color: '#A16207', margin: 0 }}>
                  Commandez maintenant pour une livraison rapide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.surface} bottomColor={C.surfaceContainerLow} />

      {/* ═══════ INGRÉDIENTS ═══════ */}
      <style>{`
        .ing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        @media (max-width: 600px) {
          .ing-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .ing-section { padding: 56px 20px 64px !important; }
        }
      `}</style>
      <section className="ing-section" style={{ background: C.surfaceContainerLow, padding: '80px 32px 88px' }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', marginBottom: 48, gap: 12 }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: C.gold, margin: 0,
            }}>
              Composition naturelle
            </p>
            <h2 style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 700, color: C.primary, margin: 0, lineHeight: 1.15,
            }}>
              Ingrédients &amp; Bienfaits
            </h2>
            <div style={{ width: 48, height: 2, background: C.gold }} />
            <p style={{
              color: C.onSurfaceVariant, fontSize: '0.95rem',
              lineHeight: 1.75, maxWidth: 520, margin: 0,
            }}>
              Chaque ingrédient est sélectionné pour ses vertus naturelles et son origine authentique.
            </p>
          </div>

          {/* Cards */}
          <div className="ing-grid">
            {displayIngredients.map((ing) => (
              <div
                key={ing.id}
                style={{
                  background:   '#ffffff',
                  borderRadius: '1.25rem',
                  overflow:     'hidden',
                  border:       `1px solid rgba(27,77,56,0.07)`,
                  boxShadow:    '0 4px 20px rgba(27,77,56,0.06)',
                  display:      'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Image band */}
                <div style={{
                  height: 130,
                  background: C.surfaceContainer,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative' as const,
                  overflow: 'hidden',
                }}>
                  {ing.image ? (
                    <img
                      src={ing.image}
                      alt={ing.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '2.8rem' }}>🌿</span>
                  )}
                  {/* Gold overlay gradient bottom */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
                    background: 'linear-gradient(to top, rgba(255,255,255,0.6), transparent)',
                  }} />
                </div>

                {/* Body */}
                <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Name */}
                  <h3 style={{
                    fontFamily: FONT_HEADLINE, fontSize: '1rem', fontWeight: 700,
                    color: C.primary, margin: 0, lineHeight: 1.25,
                  }}>
                    {ing.name}
                  </h3>

                  {/* Note — italic, 1 ligne, tronquée */}
                  {ing.note && (
                    <p style={{
                      fontStyle: 'italic', fontSize: '0.75rem',
                      color: C.gold, margin: 0, lineHeight: 1.4,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {ing.note}
                    </p>
                  )}

                  {/* Separator */}
                  <div style={{ width: 32, height: 1, background: `rgba(27,77,56,0.12)` }} />

                  {/* Benefits */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {ing.benefits.slice(0, 3).map((b) => (
                      <li key={b} style={{
                        fontSize: '0.78rem', color: C.onSurfaceVariant,
                        display: 'flex', gap: 7, alignItems: 'flex-start', lineHeight: 1.5,
                      }}>
                        <span style={{ color: C.primary, fontWeight: 700, flexShrink: 0, marginTop: 2, fontSize: '0.6rem' }}>✦</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REVIEWS ═══════ */}
      {approvedReviews.length > 0 && (
        <>
          <WaveDivider topColor={C.surfaceContainerLow} bottomColor="#ffffff" />
          <section style={{ background: '#ffffff', padding: '80px 32px' }}>
            <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 12px' }}>
                  Témoignages
                </p>
                <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 700, color: C.primary, margin: 0 }}>
                  La famille Ben's
                </h2>
              </div>

              {/* Carousel */}
              <div style={{ position: 'relative' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    display:   'flex',
                    gap:       24,
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transform: `translateX(calc(-${reviewIdx} * (33.333% + 8px)))`,
                  }}>
                    {reviewsLooped.map((review, idx) => {
                      const ai = idx % reviewCardAccents.length;
                      return (
                        <div key={`${review.id}-${idx}`} style={{
                          flex:         '0 0 calc(33.333% - 16px)',
                          minWidth:     0,
                          background:   reviewCardAccents[ai],
                          borderRadius: '1.5rem',
                          padding:      '32px',
                          border:       `1.5px solid ${reviewBorders[ai]}28`,
                          borderTop:    `4px solid ${reviewBorders[ai]}`,
                        }}>
                          <div style={{ marginBottom: 14, letterSpacing: 3 }}>
                            {[1,2,3,4,5].map((s) => (
                              <span key={s} style={{ color: s <= review.rating ? C.gold : '#d1cdc3', fontSize: '1rem' }}>★</span>
                            ))}
                          </div>
                          <p style={{ fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.8, color: C.onSurface, marginBottom: 24 }}>
                            "{review.text}"
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: '50%',
                              background: reviewBorders[ai], color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                            }}>
                              {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={{ fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: '0.9rem', color: C.primary, margin: 0 }}>{review.name}</p>
                              <p style={{ fontSize: '0.78rem', color: C.onSurfaceVariant, margin: '2px 0 0' }}>Montréal, QC</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nav arrows */}
                {[
                  { dir: -1, pos: { left: -20 } },
                  { dir:  1, pos: { right: -20 } },
                ].map(({ dir, pos }) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setReviewIdx((prev) =>
                      dir === -1
                        ? (prev - 1 + approvedReviews.length) % approvedReviews.length
                        : (prev + 1) % approvedReviews.length
                    )}
                    style={{
                      position: 'absolute', ...pos, top: '50%', transform: 'translateY(-50%)',
                      width: 44, height: 44, borderRadius: '50%', background: '#ffffff',
                      border: `1.5px solid rgba(27,77,56,0.15)`,
                      boxShadow: '0 4px 14px rgba(27,77,56,0.1)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', color: C.primary, zIndex: 2,
                    }}
                  >
                    {dir === -1 ? '‹' : '›'}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════ PRODUITS SIMILAIRES ═══════ */}
      {otherProducts.length > 0 && (
        <>
          <WaveDivider topColor={approvedReviews.length > 0 ? '#ffffff' : C.surfaceContainerLow} bottomColor={C.surfaceContainer} />
          <section style={{ background: C.surfaceContainer, padding: '80px 32px' }}>
            <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 12px' }}>
                  Vous aimerez aussi
                </p>
                <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', fontWeight: 700, color: C.primary, margin: 0 }}>
                  Complétez votre commande
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {otherProducts.map((other) => {
                  const ob = TAG_COLORS[other.tag] ?? { bg: C.surfaceContainerLow, text: C.onSurfaceVariant };
                  return (
                    <article
                      key={other.id}
                      onClick={() => navigate(ROUTES.product(other.id))}
                      style={{
                        background: '#ffffff', borderRadius: '1.25rem', overflow: 'hidden',
                        cursor: 'pointer', border: `1px solid rgba(27,77,56,0.07)`,
                        transition: 'transform 0.25s, box-shadow 0.25s',
                        boxShadow: '0 2px 12px rgba(27,77,56,0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(27,77,56,0.13)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,77,56,0.06)';
                      }}
                    >
                      <div style={{ aspectRatio: '1/1', background: C.surfaceContainerLow, overflow: 'hidden', position: 'relative' }}>
                        <ProductImg src={other.img} alt={other.name} size={300} borderRadius={0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {other.tag && (
                          <span style={{ position: 'absolute', top: 10, left: 10, background: ob.bg, color: ob.text, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '4px 10px', borderRadius: 9999 }}>
                            {other.tag}
                          </span>
                        )}
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: C.accent, margin: '0 0 4px' }}>{other.category}</p>
                        <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '0.9rem', fontWeight: 700, color: C.primary, margin: '0 0 10px', lineHeight: 1.3 }}>{other.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1rem', fontWeight: 700, color: C.gold }}>{other.price.toFixed(2).replace('.', ',')} $</span>
                          <span style={{ fontSize: '0.75rem', color: C.onSurfaceVariant, fontWeight: 600 }}>Voir →</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      <WaveDivider topColor={otherProducts.length > 0 ? C.surfaceContainer : (approvedReviews.length > 0 ? '#ffffff' : C.surfaceContainerLow)} bottomColor={C.primary} />

      {/* ═══════ CTA ═══════ */}
      <section style={{ background: C.primary, padding: '72px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ color: C.gold, fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            ✦ La collection complète
          </p>
          <h2 style={{ fontFamily: FONT_HEADLINE, color: '#ffffff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 14 }}>
            Découvrez toute notre gamme
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32 }}>
            Jus pressés à froid, tisanes, sirops et poudres — 20+ produits artisanaux pour votre bien-être.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.products)}
            style={{
              background: C.gold, color: C.primary, fontFamily: FONT_BODY, fontWeight: 700,
              fontSize: '1rem', padding: '16px 44px', borderRadius: 9999, border: 'none', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 10px 32px rgba(201,168,76,0.4)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Explorer la collection
          </button>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor="#032416" />
    </div>
  );
}
