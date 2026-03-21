import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { useCart } from '@/features/shop/context/CartContext';
import { SEO } from '@/shared/components/SEO';
import { ProductImg } from '@/shared/ui/ProductImg';
import { ProductCard } from '../components/ProductCard';
import { ROUTES } from '@/shared/constants/routes';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { products, reviews, ingredients } = useData();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [addedToCart, setAddedToCart] = React.useState(false);

  const product = products.find((pr) => pr.id === id);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: `${product.id}-${quantity}`,
      productId: product.id,
      name: product.name,
      price: Math.round(product.price * 100), // convert to cents
      quantity,
      format: product.formats[0], // default format
      img: product.img,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <section className="page-shell" style={{ textAlign: 'center', paddingBottom: 20 }}>
        <p className="page-subtitle" style={{ marginTop: 0 }}>{t('productDetail.notFound')}</p>
        <button type="button" className="btn-light anim-btn" onClick={() => navigate(ROUTES.products)}>
          {t('productDetail.backLink')}
        </button>
      </section>
    );
  }

  const activeIngredients = ingredients.filter((ingredient) => ingredient.active);
  const matchedIngredients = activeIngredients.filter((ingredient) =>
    product.name.toLowerCase().includes(ingredient.name.toLowerCase())
  );

  const productIngredients = matchedIngredients.length > 0 ? matchedIngredients : activeIngredients.slice(0, 3);
  const fallbackIngredients = productIngredients.length > 0
    ? productIngredients
    : [{
        id: 'fallback',
        name: 'Fruits frais',
        image: '/images-bens/hero-banners/banniere-fruits-exotiques.png',
        benefits: ['100% naturel', 'Sans conservateurs', 'Sans sucre ajouté'],
        note: 'Sélection artisanale',
        active: true,
      }];

  const approvedReviews = reviews.filter((r) => r.approved).slice(0, 4);
  const otherProducts = products.filter((pr) => pr.id !== product.id && pr.available).slice(0, 4);
  const avgRating = approvedReviews.length > 0 ? Math.round(approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length) : 0;

  return (
    <div>
      <SEO
        title={product.name}
        description={product.desc}
        url={`https://lesjusnatuelsbens.com/produits/${id}`}
      />

      <section className="page-shell" style={{ paddingTop: 20 }}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.products)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--brand-primary)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'gap 0.24s ease',
            padding: '8px 0',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.gap = '12px';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.gap = '8px';
          }}
        >
          ← {t('productDetail.back')}
        </button>

        {/* Hero Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 40,
          alignItems: 'start',
          marginTop: 32,
        }}>
          {/* Product Image */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{
              padding: 24,
              background: `linear-gradient(135deg, ${product.color}15, ${product.color}08)`,
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{
                minHeight: 400,
                borderRadius: 'var(--radius-lg)',
                background: 'white',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {product.tag && (
                  <span style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: 'var(--accent-primary)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    zIndex: 10,
                  }}>
                    {product.tag}
                  </span>
                )}
                <ProductImg
                  src={product.img}
                  alt={product.name}
                  size={320}
                  borderRadius={16}
                  style={{ width: 'min(90%, 340px)', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div style={{ marginBottom: 32 }}>
              <span style={{
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: 'var(--accent-primary)',
                marginBottom: 12,
              }}>
                {product.category}
              </span>
              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 16px 0',
                lineHeight: 1.2,
              }}>
                {product.name}
              </h1>

              {approvedReviews.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}>
                  <div style={{
                    display: 'flex',
                    gap: 4,
                    fontSize: 16,
                  }}>
                    {'⭐'.repeat(avgRating)}{'☆'.repeat(5 - avgRating)}
                  </div>
                  <span style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}>
                    {avgRating}/5 ({approvedReviews.length} avis)
                  </span>
                </div>
              )}

              {/* Price */}
              <div style={{
                padding: '20px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 24,
              }}>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  margin: '0 0 6px 0',
                  fontWeight: 600,
                }}>
                  Prix
                </p>
                <p style={{
                  fontSize: 40,
                  fontWeight: 900,
                  color: 'var(--brand-primary)',
                  margin: 0,
                }}>
                  {product.price.toFixed(2)}$
                </p>
              </div>

              <p style={{
                fontSize: 16,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: 24,
              }}>
                {product.desc}
              </p>

              {/* Formats */}
              <div style={{ marginBottom: 24 }}>
                <p style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: 12,
                }}>
                  Formats disponibles
                </p>
                <div style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}>
                  {product.formats.map((format) => (
                    <button
                      key={format}
                      type="button"
                      style={{
                        padding: '10px 18px',
                        border: '2px solid var(--border-color)',
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.24s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.borderColor = 'var(--brand-primary)';
                        (e.target as HTMLElement).style.background = 'var(--brand-primary)';
                        (e.target as HTMLElement).style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
                        (e.target as HTMLElement).style.background = 'white';
                        (e.target as HTMLElement).style.color = 'var(--text-primary)';
                      }}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div style={{
                display: 'grid',
                gap: 10,
                marginBottom: 28,
              }}>
                {[
                  { icon: '✓', text: 'Sans conservateurs' },
                  { icon: '✓', text: 'Sans sucre ajouté' },
                  { icon: '✓', text: 'Produit du Québec' },
                  { icon: '✓', text: '100% Naturel' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 24,
                      height: 24,
                      background: 'var(--brand-primary)',
                      color: 'white',
                      borderRadius: '50%',
                      fontSize: 12,
                      fontWeight: 700,
                    }}>
                      {badge.icon}
                    </span>
                    {badge.text}
                  </div>
                ))}
              </div>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
                padding: '12px',
                background: 'var(--bg-light)',
                borderRadius: '8px',
              }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    border: '1px solid var(--border-color)',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 50,
                    textAlign: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 6,
                    padding: '6px 8px',
                    fontSize: 14,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    border: '1px solid var(--border-color)',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  +
                </button>
              </div>

              {/* CTA Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}>
                <button
                  type="button"
                  className="btn-solid anim-btn"
                  onClick={handleAddToCart}
                  style={{
                    padding: '16px 24px',
                    fontSize: 15,
                    fontWeight: 700,
                    background: addedToCart ? 'var(--brand-secondary)' : undefined,
                  }}
                  disabled={addedToCart}
                >
                  {addedToCart ? '✓ Ajouté au panier!' : '🛒 Ajouter au panier'}
                </button>
                <button
                  type="button"
                  className="btn-light anim-btn"
                  style={{
                    padding: '16px 24px',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  ❤️ Favori
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <section style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text-primary)',
            marginBottom: 32,
          }}>
            Ingrédients & Composition
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {fallbackIngredients.map((ingredient) => (
              <article key={ingredient.id} className="anim-card" style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const elem = e.currentTarget as HTMLElement;
                elem.style.transform = 'translateY(-8px)';
                elem.style.boxShadow = 'var(--shadow-card-hover)';
              }}
              onMouseLeave={(e) => {
                const elem = e.currentTarget as HTMLElement;
                elem.style.transform = 'translateY(0)';
                elem.style.boxShadow = 'var(--shadow-sm)';
              }}
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  style={{
                    width: '100%',
                    height: 160,
                    objectFit: 'cover',
                  }}
                />
                <div style={{ padding: 20 }}>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--text-primary)',
                    margin: '0 0 8px 0',
                  }}>
                    {ingredient.name}
                  </h3>
                  {ingredient.note && (
                    <p style={{
                      fontSize: 12,
                      color: 'var(--text-tertiary)',
                      margin: '0 0 12px 0',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}>
                      {ingredient.note}
                    </p>
                  )}
                  <ul style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                    display: 'grid',
                    gap: 6,
                  }}>
                    {ingredient.benefits.map((benefit) => (
                      <li key={benefit} style={{
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}>
                        <span style={{ color: 'var(--brand-primary)', fontWeight: 700, marginTop: 2 }}>→</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        {approvedReviews.length > 0 && (
          <section style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{
              fontSize: 32,
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              marginBottom: 32,
            }}>
              Ce que disent nos clients
            </h2>
            <div className="home-reviews-grid" style={{ marginTop: 0 }}>
              {approvedReviews.map((review) => (
                <article key={review.id} className="home-review-card anim-card">
                  <p className="stars">{'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                  <blockquote style={{ marginBottom: 12 }}>"{review.text}"</blockquote>
                  <p className="author">{review.name}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {otherProducts.length > 0 && (
          <section style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid var(--border-color)', paddingBottom: 40 }}>
            <h2 style={{
              fontSize: 32,
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              marginBottom: 32,
            }}>
              Complétez votre commande
            </h2>
            <div className="home-products-grid">
              {otherProducts.map((other) => (
                <ProductCard key={other.id} product={other} size="md" />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
