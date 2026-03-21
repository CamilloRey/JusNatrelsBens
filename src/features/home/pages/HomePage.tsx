import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { StructuredData, organizationSchema } from '@/shared/components/StructuredData';
import { Reveal } from '@/shared/ui/Reveal';
import { ProductImg } from '@/shared/ui/ProductImg';
import { useInView } from '@/shared/hooks/useInView';
import { ProductCard } from '@/features/products/components/ProductCard';

export default function HomePage() {
  useTranslation();
  const { products, reviews, blogs, events, subscribers, updateSubscribers, settings } = useData();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [count, setCount] = useState({ bottles: 0, families: 0, flavors: 0 });
  const [countRef, countVisible] = useInView();

  const handleSub = () => {
    if (!email || !email.includes('@')) return;
    updateSubscribers([...subscribers, {
      id: 's' + Date.now(),
      email,
      date: new Date().toISOString().split('T')[0],
      active: true,
    }]);
    setEmail('');
  };

  useEffect(() => {
    if (!countVisible) return;
    const targets = { bottles: 2000, families: 500, flavors: 11 };
    const durationMs = 2000;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount({
        bottles: Math.round(targets.bottles * eased),
        families: Math.round(targets.families * eased),
        flavors: Math.round(targets.flavors * eased),
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [countVisible]);

  // Data
  const availableProducts = useMemo(() => products.filter((p) => p.available), [products]);
  const featuredProducts = useMemo(() => {
    const sorted = availableProducts.sort((a, b) => {
      const aVal = a.tag === 'Populaire' ? 0 : a.tag === 'Nouveau' ? 1 : 2;
      const bVal = b.tag === 'Populaire' ? 0 : b.tag === 'Nouveau' ? 1 : 2;
      return aVal - bVal;
    });
    return sorted.slice(0, 6);
  }, [availableProducts]);

  const approvedReviews = useMemo(() => reviews.filter((r) => r.approved).slice(0, 6), [reviews]);

  const publishedBlogs = useMemo(() => blogs.filter((b) => b.published).slice(0, 3), [blogs]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter((e) => e.active && e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  }, [events]);

  const values = [
    { icon: '🌱', title: 'Naturel 100%', desc: 'Zéro sucre ajouté, zéro conservateurs' },
    { icon: '♻️', title: 'Écologique', desc: 'Emballages respectueux de l\'environnement' },
    { icon: '🇨🇦', title: 'Local', desc: 'Fabriqué à Montréal avec fierté' },
    { icon: '🌍', title: 'Traditionnel', desc: 'Inspiré des traditions africaines authentiques' },
  ];

  return (
    <div className="home-page">
      <SEO
        title="Accueil"
        description="Découvrez les jus naturels artisanaux Ben's. Des jus sans sucre ajouté inspirés des traditions africaines, fabriqués à Montréal."
        url="https://lesjusnatuelsbens.com/"
      />
      <StructuredData type="Organization" data={organizationSchema} />

      {/* HERO */}
      <section className="home-hero" style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 248, 240, 0.94), rgba(251, 244, 233, 0.88)), url('${settings.bannerHero || '/images-bens/hero-banners/banniere-accueil-hero.png'}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="eyebrow">🍹 Jus Naturels Artisanaux</p>
            <h1>Découvrez la Saveur de l'Authenticité</h1>
            <p>Des jus purs, sans sucre ajouté, inspirés des traditions africaines et fabriqués à Montréal avec amour.</p>

            <div className="home-hero-cta">
              <button type="button" onClick={() => navigate(ROUTES.products)} className="btn-solid anim-btn">
                🛍️ Découvrir nos produits
              </button>
              <button type="button" onClick={() => navigate(ROUTES.about)} className="btn-light anim-btn">
                📖 Notre histoire
              </button>
            </div>

            <div className="home-badge-row">
              {['✓ Sans sucre ajouté', '✓ 100% Naturel', '✓ Montréal', '✓ Écologique'].map((badge) => (
                <span key={badge} className="home-badge-pill">{badge}</span>
              ))}
            </div>
          </div>

          <div className="home-hero-media">
            <div className="hero-media-feature">
              <ProductImg src={featuredProducts[0]?.img || '/images-bens/photos/photo-jus.png'} alt="Jus Ben's" size={360} borderRadius={24} style={{ width: 'min(86%, 340px)', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats-block" ref={countRef}>
        <Reveal anim="fadeUp">
          <div className="home-stats-grid">
            <div className="stat-card">
              <p className="value">{count.bottles}+</p>
              <p className="label">Bouteilles vendues</p>
            </div>
            <div className="stat-card">
              <p className="value">{count.families}+</p>
              <p className="label">Familles satisfaites</p>
            </div>
            <div className="stat-card">
              <p className="value">{count.flavors}</p>
              <p className="label">Saveurs uniques</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* VALEURS */}
      <section className="home-values-wrap">
        <div className="home-section">
          <div className="section-head">
            <h2>Nos Valeurs</h2>
          </div>
          <div className="home-values-grid">
            {values.map((val) => (
              <div key={val.title} className="home-value-card">
                <div className="icon" style={{ fontSize: 32 }}>{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUITS */}
      {featuredProducts.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2>Nos Produits</h2>
            <button className="btn-light" onClick={() => navigate(ROUTES.products)}>Voir tous →</button>
          </div>
          <div className="home-products-grid">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* RECETTES */}
      <section className="home-section" style={{ background: 'var(--bg-tertiary)', padding: '60px 24px', marginTop: 0 }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <div className="section-head">
            <h2>Recettes Inspirantes</h2>
            <button className="btn-solid" onClick={() => navigate(ROUTES.recipes)}>Voir plus →</button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {[
              { name: 'Smoothie Tropical', emoji: '🥤', time: '5 min' },
              { name: 'Detox Vert', emoji: '🍎', time: '3 min' },
              { name: 'Cocktail d\'Été', emoji: '🍹', time: '10 min' },
            ].map((recipe) => (
              <div key={recipe.name} className="anim-card" style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
              }}
              >
                <div style={{
                  height: 150,
                  background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 60,
                }}>
                  {recipe.emoji}
                </div>
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px 0' }}>{recipe.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>⏱️ {recipe.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      {publishedBlogs.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2>Dernier du Blogue</h2>
            <button className="btn-light" onClick={() => navigate(ROUTES.blog)}>Tous les articles →</button>
          </div>
          <div className="blog-grid">
            {publishedBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <div className="blog-card-image">
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                  }}>
                    📝
                  </div>
                </div>
                <div className="blog-card-content">
                  <span className="blog-card-category">{blog.category}</span>
                  <h3 className="blog-card-title">{blog.title}</h3>
                  <p className="blog-card-excerpt">{blog.content.substring(0, 120)}...</p>
                  <a href="#" className="blog-card-link">Lire plus →</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ÉVÉNEMENTS */}
      {upcomingEvents.length > 0 && (
        <section className="home-section" style={{ background: 'var(--bg-tertiary)', padding: '60px 24px', marginTop: 0 }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            <div className="section-head">
              <h2>Prochains Événements</h2>
              <button className="btn-solid" onClick={() => navigate(ROUTES.events)}>Voir l'agenda →</button>
            </div>
            <div className="home-events-grid">
              {upcomingEvents.map((event) => {
                const date = new Date(event.date);
                return (
                  <div key={event.id} className="home-event-card anim-card">
                    <div className="home-event-row">
                      <div className="home-event-date">
                        <span className="day">{date.getUTCDate()}</span>
                        <span className="month">{date.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}</span>
                      </div>
                      <div className="home-event-body">
                        <span className="type">{event.type}</span>
                        <h3>{event.title}</h3>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TÉMOIGNAGES */}
      {approvedReviews.length > 0 && (
        <section className="home-section">
          <div className="section-head">
            <h2>Ce que disent nos clients</h2>
          </div>
          <div className="home-reviews-grid">
            {approvedReviews.map((review) => (
              <div key={review.id} className="home-review-card anim-card">
                <p className="stars">{'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                <blockquote>"{review.text}"</blockquote>
                <p className="author">— {review.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="home-news-wrap">
        <div className="home-news-card">
          <h2>Restez Inspiré</h2>
          <p>Recevez nos recettes, conseils et actualisations directement dans votre boîte mail.</p>
          <div className="home-news-form">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSub()}
            />
            <button onClick={handleSub}>S'abonner</button>
          </div>
        </div>
      </section>
    </div>
  );
}
