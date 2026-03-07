import { useState, useEffect }  from 'react';
import { useNavigate }           from 'react-router-dom';
import { useTranslation }        from 'react-i18next';
import { useData }               from '@/app/providers/DataContext';
import { C }                     from '@/shared/constants/colors';
import { ROUTES }                from '@/shared/constants/routes';
import { Reveal }                from '@/shared/ui/Reveal';
import { ProductImg }            from '@/shared/ui/ProductImg';
import { useInView }             from '@/shared/hooks/useInView';

export default function HomePage() {
  const { t }    = useTranslation();
  const { products, reviews, subscribers, updateSubscribers, events } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [count, setCount] = useState({ bottles: 0, families: 0, flavors: 0 });
  const [countRef, countVisible] = useInView();

  const handleSub = () => {
    if (email && email.includes('@')) {
      updateSubscribers([...subscribers, { id: 's' + Date.now(), email, date: new Date().toISOString().split('T')[0], active: true }]);
      setEmail('');
    }
  };

  useEffect(() => {
    if (!countVisible) return;
    const targets = { bottles: 2000, families: 500, flavors: 11 };
    const dur = 2000;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount({ bottles: Math.round(targets.bottles * ease), families: Math.round(targets.families * ease), flavors: Math.round(targets.flavors * ease) });
      if (p < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [countVisible]);

  const approvedReviews = reviews.filter(r => r.approved);

  const badges = [
    { icon: '🍁', text: t('home.badges.montreal')        },
    { icon: '🚫', text: t('home.badges.noSugar')         },
    { icon: '🌿', text: t('home.badges.noPreservatives') },
    { icon: '♻️', text: t('home.badges.eco')             },
    { icon: '🏅', text: t('home.badges.awarded')         },
  ];

  const values = [
    { icon: '🌿', title: t('home.values.natural.title'), desc: t('home.values.natural.desc') },
    { icon: '♻️', title: t('home.values.eco.title'),     desc: t('home.values.eco.desc')     },
    { icon: '🤝', title: t('home.values.local.title'),   desc: t('home.values.local.desc')   },
    { icon: '✨', title: t('home.values.unique.title'),  desc: t('home.values.unique.desc')  },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundImage: `url('/images-bens/hero-banners/banniere-accueil-hero.png')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '90px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.hibiscus}cc 0%, ${C.red}aa 40%, ${C.gold}88 100%)` }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 16, animation: 'fadeIn 0.8s ease' }}>
            {t('home.hero.eyebrow')}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, margin: '0 0 20px', animation: 'fadeUp 0.9s ease', whiteSpace: 'pre-line' }}>
            {t('home.hero.title')}
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 36px', animation: 'fadeUp 1s ease 0.2s both' }}>
            {t('home.hero.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 1.1s ease 0.4s both' }}>
            <button onClick={() => navigate(ROUTES.products)} className="anim-btn"
              style={{ padding: '16px 40px', background: '#fff', color: C.hibiscus, border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}>
              {t('home.hero.cta1')}
            </button>
            <button onClick={() => navigate(ROUTES.about)} className="anim-btn"
              style={{ padding: '16px 32px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
              {t('home.hero.cta2')}
            </button>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <Reveal anim="fadeUp">
        <section style={{ background: '#fff', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {badges.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, animation: `fadeIn 0.5s ease ${0.1 * i}s both` }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{b.text}</span>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* COUNTERS */}
      <div ref={countRef as React.RefObject<HTMLDivElement>}>
        <Reveal anim="fadeUp">
          <section style={{ padding: '40px 24px', background: C.light }}>
            <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, textAlign: 'center' }}>
              {[
                { val: count.bottles + '+', label: t('home.counters.bottles'),  icon: '🍹' },
                { val: count.families + '+', label: t('home.counters.families'), icon: '👨‍👩‍👧‍👦' },
                { val: count.flavors,         label: t('home.counters.flavors'),  icon: '🎨' },
              ].map((s, i) => (
                <div key={i}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: C.hibiscus, margin: '4px 0 2px' }}>{s.val}</p>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '64px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal anim="fadeUp">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.red, marginBottom: 8 }}>{t('home.featured.eyebrow')}</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>{t('home.featured.title')}</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.filter(p => p.available).slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} anim="scaleIn">
              <div onClick={() => navigate(ROUTES.product(p.id))} className="anim-card"
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}>
                <div style={{ height: 160, background: `linear-gradient(135deg, ${C.red}22, ${C.red}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <ProductImg src={p.img} size={100} borderRadius={0} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px 18px' }}>
                  {p.tag && <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: C.red, background: `${C.red}15`, padding: '2px 8px', borderRadius: 4 }}>{p.tag}</span>}
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, margin: '8px 0 4px', color: C.dark }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: C.hibiscus }}>{p.price.toFixed(2)}$</span>
                    <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{t('home.featured.view')}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal anim="fadeUp" delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => navigate(ROUTES.products)} className="anim-btn"
              style={{ padding: '14px 36px', background: C.hibiscus, color: '#fff', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              {t('home.featured.cta')}
            </button>
          </div>
        </Reveal>
      </section>

      {/* VALUES */}
      <section style={{ background: C.light, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {values.map((v, i) => (
            <Reveal key={i} delay={i * 0.12} anim="fadeUp">
              <div className="anim-card" style={{ background: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, transition: 'transform 0.3s, box-shadow 0.3s' }}>
                <span style={{ fontSize: 40, display: 'block', marginBottom: 14, animation: `wave ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>{v.icon}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: C.dark }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      {approvedReviews.length > 0 && (
        <section style={{ position: 'relative', padding: '64px 24px', backgroundImage: "url('/images-bens/hero-banners/banniere-temoignages.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)' }} />
          <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal anim="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.red, marginBottom: 8 }}>{t('home.reviews.eyebrow')}</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>{t('home.reviews.title')}</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {approvedReviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.15} anim="slideLeft">
                <div className="anim-card" style={{ background: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, transition: 'transform 0.3s, box-shadow 0.3s' }}>
                  <div style={{ color: '#f59e0b', fontSize: 16, marginBottom: 12 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, margin: '0 0 16px', fontStyle: 'italic' }}>"{r.text}"</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: 0 }}>{r.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* PROCHAINS ÉVÉNEMENTS */}
      {events.filter(e => e.active && e.date >= new Date().toISOString().split('T')[0]).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3).length > 0 && (
        <section style={{ padding: '56px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.red, marginBottom: 6 }}>{t('events.upcoming')}</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.dark, margin: 0 }}>{t('events.title')}</h2>
            </div>
            <button onClick={() => navigate(ROUTES.events)} className="anim-btn"
              style={{ padding: '10px 24px', borderRadius: 50, border: `2px solid ${C.hibiscus}`, background: 'transparent', color: C.hibiscus, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {t('events.seeAll')} →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {events.filter(e => e.active && e.date >= new Date().toISOString().split('T')[0]).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3).map(ev => {
              const d = new Date(ev.date);
              return (
                <Reveal key={ev.id} anim="fadeUp">
                  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer' }} onClick={() => navigate(ROUTES.events)}>
                    <div style={{ height: 5, background: C.hibiscus }} />
                    <div style={{ padding: '20px 22px', display: 'flex', gap: 16 }}>
                      <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 12, background: `${C.hibiscus}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: C.hibiscus, lineHeight: 1 }}>{d.getUTCDate()}</span>
                        <span style={{ fontSize: 10, color: C.hibiscus, textTransform: 'uppercase', fontWeight: 600 }}>{d.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: `${C.red}12`, color: C.red, fontWeight: 700, display: 'inline-block', marginBottom: 6 }}>{ev.type}</span>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 4px' }}>{ev.title}</h3>
                        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>📍 {ev.location}</p>
                        {ev.time && <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>🕐 {ev.time}</p>}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <Reveal anim="scaleIn">
        <section style={{ background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red})`, backgroundSize: '200% 200%', animation: 'gradient 6s ease infinite', padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>{t('home.newsletter.title')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 24 }}>{t('home.newsletter.subtitle')}</p>
          <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="email" placeholder={t('home.newsletter.placeholder')} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSub()}
              style={{ flex: 1, minWidth: 200, padding: '14px 18px', borderRadius: 50, border: 'none', fontSize: 15, outline: 'none' }} />
            <button onClick={handleSub} className="anim-btn"
              style={{ padding: '14px 28px', borderRadius: 50, border: 'none', background: C.dark, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
              {t('home.newsletter.cta')}
            </button>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
