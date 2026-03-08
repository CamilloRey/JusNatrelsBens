import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { StructuredData, organizationSchema } from '@/shared/components/StructuredData';
import { Reveal } from '@/shared/ui/Reveal';
import { ProductImg } from '@/shared/ui/ProductImg';
import { Icon } from '@/shared/ui/Icon';
import { useInView } from '@/shared/hooks/useInView';

export default function HomePage() {
  const { t } = useTranslation();
  const { products, reviews, subscribers, updateSubscribers, events } = useData();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [count, setCount] = useState({ bottles: 0, families: 0, flavors: 0 });
  const [countRef, countVisible] = useInView();

  const handleSub = () => {
    if (!email || !email.includes('@')) return;
    updateSubscribers([
      ...subscribers,
      {
        id: 's' + Date.now(),
        email,
        date: new Date().toISOString().split('T')[0],
        active: true,
      },
    ]);
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

  const approvedReviews = useMemo(() => reviews.filter((r) => r.approved), [reviews]);

  const featuredProducts = useMemo(() => {
    const available = products.filter((p) => p.available);
    // Sort: Populaire first, then Nouveau, then others
    const sorted = available.sort((a, b) => {
      const aTagValue = a.tag === 'Populaire' ? 0 : a.tag === 'Nouveau' ? 1 : 2;
      const bTagValue = b.tag === 'Populaire' ? 0 : b.tag === 'Nouveau' ? 1 : 2;
      return aTagValue - bTagValue;
    });
    return sorted.slice(0, 8);
  }, [products]);

  const heroProducts = featuredProducts.slice(0, 2);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter((e) => e.active && e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [events]);

  const badges = [
    { icon: 'map', text: t('home.badges.montreal') },
    { icon: 'shield', text: t('home.badges.noSugar') },
    { icon: 'check', text: t('home.badges.noPreservatives') },
    { icon: 'refresh', text: t('home.badges.eco') },
    { icon: 'star', text: t('home.badges.awarded') },
  ] as const;

  const values = [
    { icon: 'shield', title: t('home.values.natural.title'), desc: t('home.values.natural.desc') },
    { icon: 'refresh', title: t('home.values.eco.title'), desc: t('home.values.eco.desc') },
    { icon: 'map', title: t('home.values.local.title'), desc: t('home.values.local.desc') },
    { icon: 'star', title: t('home.values.unique.title'), desc: t('home.values.unique.desc') },
  ] as const;

  return (
    <div className="home-page">
      <SEO 
        title="Accueil"
        description="Découvrez les jus naturels artisanaux Ben's. Des jus sans sucre ajouté inspirés des traditions africaines, fabriqués à Montréal."
        url="https://lesjusnatuelsbens.com/"
      />
      <StructuredData type="Organization" data={organizationSchema} />
      
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="eyebrow">{t('home.hero.eyebrow')}</p>
            <h1>{t('home.hero.title')}</h1>
            <p>{t('home.hero.subtitle')}</p>

            <div className="home-hero-cta">
              <button
                type="button"
                onClick={() => navigate(ROUTES.products)}
                className="btn-solid anim-btn"
              >
                {t('home.hero.cta1')}
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.about)}
                className="btn-light anim-btn"
              >
                {t('home.hero.cta2')}
              </button>
            </div>

            <div className="home-badge-row">
              {badges.map((badge) => (
                <span key={badge.text} className="home-badge-pill">
                  <Icon type={badge.icon} size={13} />
                  {badge.text}
                </span>
              ))}
            </div>
          </div>

          <div className="home-hero-media">
            <div className="hero-media-feature">
              <ProductImg
                src={heroProducts[0]?.img || '/images-bens/photos/photo-jus.png'}
                alt={heroProducts[0]?.name || "Ben's natural juice"}
                size={360}
                borderRadius={24}
                style={{ width: 'min(86%, 340px)', height: 'auto' }}
              />
            </div>

            <div className="hero-mini-grid">
              {heroProducts.map((product) => (
                <div key={product.id} className="hero-mini-card">
                  <ProductImg src={product.img} alt={product.name} size={44} borderRadius={12} />
                  <span>{product.name}</span>
                </div>
              ))}
              {heroProducts.length < 2 && (
                <div className="hero-mini-card">
                  <ProductImg src="/images-bens/photos/photo-jus-2.png" alt="Fresh juice" size={44} borderRadius={12} />
                  <span>Artisanal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="home-stats-block" ref={countRef}>
        <Reveal anim="fadeUp">
          <div className="home-stats-grid">
            <div className="stat-card">
              <span className="icon">
                <Icon type="shop" size={22} color="currentColor" />
              </span>
              <p className="value">{count.bottles}+</p>
              <p className="label">{t('home.counters.bottles')}</p>
            </div>
            <div className="stat-card">
              <span className="icon">
                <Icon type="users" size={22} color="currentColor" />
              </span>
              <p className="value">{count.families}+</p>
              <p className="label">{t('home.counters.families')}</p>
            </div>
            <div className="stat-card">
              <span className="icon">
                <Icon type="grid" size={22} color="currentColor" />
              </span>
              <p className="value">{count.flavors}</p>
              <p className="label">{t('home.counters.flavors')}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <section className="home-section">
        <Reveal anim="fadeUp">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t('home.featured.eyebrow')}</p>
              <h2>{t('home.featured.title')}</h2>
            </div>
          </div>
        </Reveal>

        <div className="home-products-grid">
          {featuredProducts.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.06} anim="scaleIn">
              <article
                className="home-product-card anim-card"
                onClick={() => navigate(ROUTES.product(product.id))}
              >
                <div className="cover">
                  <ProductImg
                    src={product.img}
                    alt={product.name}
                    size={220}
                    borderRadius={18}
                    style={{ width: 'min(92%, 220px)', height: 'min(92%, 220px)' }}
                  />
                </div>
                <div className="body">
                  {product.tag && <span className="tag">{product.tag}</span>}
                  <h3>{product.name}</h3>
                  <p>{product.desc}</p>
                  <div className="meta">
                    <span className="price">{product.price.toFixed(2)}$</span>
                    <span className="view">{t('home.featured.view')}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal anim="fadeUp" delay={0.2}>
          <div style={{ marginTop: 26, textAlign: 'center' }}>
            <button
              type="button"
              className="btn-solid anim-btn"
              onClick={() => navigate(ROUTES.products)}
            >
              {t('home.featured.cta')}
            </button>
          </div>
        </Reveal>
      </section>

      <section className="home-values-wrap">
        <div className="home-values-grid">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.08} anim="fadeUp">
              <article className="home-value-card anim-card">
                <span className="icon">
                  <Icon type={value.icon} size={22} color="currentColor" />
                </span>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {approvedReviews.length > 0 && (
        <section className="home-section">
          <Reveal anim="fadeUp">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t('home.reviews.eyebrow')}</p>
                <h2>{t('home.reviews.title')}</h2>
              </div>
            </div>
          </Reveal>

          <div className="home-reviews-grid">
            {approvedReviews.map((review, i) => (
              <Reveal key={review.id} delay={i * 0.08} anim="fadeUp">
                <article className="home-review-card anim-card">
                  <p className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                  <blockquote>"{review.text}"</blockquote>
                  <p className="author">{review.name}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="home-section">
          <Reveal anim="fadeUp">
            <div className="section-head">
              <div>
                <p className="eyebrow">{t('events.upcoming')}</p>
                <h2>{t('events.title')}</h2>
              </div>
              <button
                type="button"
                className="btn-light anim-btn"
                onClick={() => navigate(ROUTES.events)}
              >
                {t('events.seeAll')}
              </button>
            </div>
          </Reveal>

          <div className="home-events-grid">
            {upcomingEvents.map((event, i) => {
              const date = new Date(event.date);
              return (
                <Reveal key={event.id} delay={i * 0.08} anim="fadeUp">
                  <article className="home-event-card anim-card" onClick={() => navigate(ROUTES.events)}>
                    <div className="home-event-row">
                      <div className="home-event-date">
                        <span className="day">{date.getUTCDate()}</span>
                        <span className="month">
                          {date.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}
                        </span>
                      </div>
                      <div className="home-event-body">
                        <span className="type">{event.type}</span>
                        <h3>{event.title}</h3>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon type="map" size={14} color="currentColor" />
                          {event.location}
                        </p>
                        {event.time && (
                          <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon type="clock" size={14} color="currentColor" />
                            {event.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <div className="home-news-wrap">
        <Reveal anim="scaleIn">
          <section className="home-news-card">
            <h2>{t('home.newsletter.title')}</h2>
            <p>{t('home.newsletter.subtitle')}</p>

            <div className="home-news-form">
              <input
                type="email"
                placeholder={t('home.newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSub()}
              />
              <button type="button" className="anim-btn" onClick={handleSub}>
                {t('home.newsletter.cta')}
              </button>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
