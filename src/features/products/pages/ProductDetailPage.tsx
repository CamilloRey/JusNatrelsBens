import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { ProductImg } from '@/shared/ui/ProductImg';
import { Icon } from '@/shared/ui/Icon';
import { ProductCard } from '../components/ProductCard';
import { ROUTES } from '@/shared/constants/routes';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { products, reviews, ingredients } = useData();
  const navigate = useNavigate();

  const product = products.find((pr) => pr.id === id);

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

  const productIngredients =
    matchedIngredients.length > 0
      ? matchedIngredients
      : activeIngredients.slice(0, 3).map((ingredient) => ({ ...ingredient })) ;

  const fallbackIngredients =
    productIngredients.length > 0
      ? productIngredients
      : [
          {
            id: 'fallback',
            name: 'Fruits frais',
            image: '/images-bens/hero-banners/banniere-fruits-exotiques.png',
            benefits: ['100% naturel', 'Sans conservateurs', 'Sans sucre ajoute'],
            note: 'Selection artisanale',
            active: true,
          },
        ];

  const approvedReviews = reviews.filter((r) => r.approved).slice(0, 3);
  const otherProducts = products.filter((pr) => pr.id !== product.id && pr.available).slice(0, 3);

  return (
    <div>
      <section className="page-shell" style={{ paddingTop: 30 }}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.products)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            background: 'transparent',
            color: C.hibiscus,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Icon type="back" size={16} color={C.hibiscus} /> {t('productDetail.back')}
        </button>

        <div className="two-col" style={{ marginTop: 18, alignItems: 'start' }}>
          <div
            className="surface-card"
            style={{
              padding: 16,
              background: `linear-gradient(135deg, ${product.color}22, ${product.color}08)`,
            }}
          >
            <div
              style={{
                minHeight: 380,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.85)',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {product.tag && <span className="pill-label" style={{ position: 'absolute', top: 14, left: 14 }}>{product.tag}</span>}
              <ProductImg
                src={product.img}
                alt={product.name}
                size={290}
                borderRadius={22}
                style={{ width: 'min(85%, 310px)', height: 'auto' }}
              />
            </div>
          </div>

          <div className="surface-card" style={{ padding: 24 }}>
            <p className="mini-muted" style={{ marginTop: 0 }}>{product.category}</p>
            <h1 className="page-title" style={{ fontSize: 'clamp(28px,4vw,40px)', marginTop: 6 }}>{product.name}</h1>
            <p style={{ marginTop: 10, fontSize: 34, fontWeight: 900, color: C.hibiscus }}>{product.price.toFixed(2)}$</p>
            <p className="page-subtitle" style={{ marginTop: 4 }}>
              {t('productDetail.availableFormats')} {product.formats.join(' · ')}
            </p>
            <p style={{ marginTop: 14, color: 'var(--ink)', lineHeight: 1.8, fontSize: 15 }}>{product.desc}</p>

            <div className="chip-row">
              {[t('productDetail.badges.noPreservatives'), t('productDetail.badges.noSugar'), t('productDetail.badges.quebec')].map((badge) => (
                <span key={badge} className="chip-btn" style={{ cursor: 'default' }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="section-stack">
          <h2 className="section-title">{t('productDetail.ingredients')}</h2>
          <div className="three-col" style={{ marginTop: 16 }}>
            {fallbackIngredients.map((ingredient) => (
              <article key={ingredient.id} className="surface-card anim-card" style={{ overflow: 'hidden' }}>
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--ink-strong)' }}>
                    {ingredient.name}
                  </h3>
                  {ingredient.note && <p className="mini-muted" style={{ marginTop: 6 }}>{ingredient.note}</p>}
                  <div style={{ marginTop: 10, display: 'grid', gap: 7 }}>
                    {ingredient.benefits.map((benefit) => (
                      <p key={benefit} style={{ fontSize: 13, color: 'var(--ink)', margin: 0 }}>
                        - {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {approvedReviews.length > 0 && (
          <section className="section-stack">
            <h2 className="section-title">{t('home.reviews.title')}</h2>
            <div className="home-reviews-grid" style={{ marginTop: 16 }}>
              {approvedReviews.map((review) => (
                <article key={review.id} className="home-review-card anim-card">
                  <p className="stars">{'*'.repeat(review.rating)}{'-'.repeat(5 - review.rating)}</p>
                  <blockquote>"{review.text}"</blockquote>
                  <p className="author">{review.name}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {otherProducts.length > 0 && (
          <section className="section-stack" style={{ paddingBottom: 20 }}>
            <h2 className="section-title">{t('productDetail.youMightLike')}</h2>
            <div className="home-products-grid" style={{ marginTop: 16 }}>
              {otherProducts.map((other) => (
                <ProductCard key={other.id} product={other} size="sm" />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
