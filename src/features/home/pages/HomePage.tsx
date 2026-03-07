import { useState, useEffect, useRef } from 'react';
import { useNavigate }                  from 'react-router-dom';
import { useData }                      from '@/app/providers/DataContext';
import { C }                            from '@/shared/constants/colors';
import { ROUTES }                       from '@/shared/constants/routes';
import { Reveal }                       from '@/shared/ui/Reveal';
import { ProductImg }                   from '@/shared/ui/ProductImg';
import { useInView }                    from '@/shared/hooks/useInView';

export default function HomePage() {
  const { products, reviews, subscribers, updateSubscribers } = useData();
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

  return (
    <div>
      {/* SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'LocalBusiness', 'name': "Les Jus Naturels Ben's",
        'description': 'Jus naturels artisanaux inspirés des traditions africaines, fabriqués à Montréal.',
        'url': 'https://lesjusnaturelsbens.com', 'email': 'info@lesjusnaturelsbens.com',
        'address': { '@type': 'PostalAddress', 'addressLocality': 'Montréal', 'addressRegion': 'QC', 'addressCountry': 'CA' },
        'priceRange': '$$', 'servesCuisine': 'Jus naturels',
        'sameAs': ['https://facebook.com/lesjusnaturelsbens', 'https://instagram.com/lesjusnaturelsbens'],
      }) }} />

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${C.hibiscus} 0%, ${C.red} 40%, ${C.gold} 100%)`, backgroundSize: '200% 200%', animation: 'gradient 8s ease infinite', padding: '90px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.015) 30px, rgba(255,255,255,0.015) 60px)' }} />
        {['🍹','🌺','🍋','🍍','🫚','🍓'].map((e, i) => (
          <span key={i} style={{ position: 'absolute', fontSize: 28, opacity: 0.12, animation: `float ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.4}s`, top: `${10 + (i * 14) % 70}%`, left: `${5 + (i * 17) % 85}%` }}>{e}</span>
        ))}
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 16, animation: 'fadeIn 0.8s ease' }}>Offrez-vous un voyage gustatif unique</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: '#fff', lineHeight: 1.12, margin: '0 0 20px', animation: 'fadeUp 0.9s ease' }}>
            Savourez le plaisir<br />des jus naturels
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 36px', animation: 'fadeUp 1s ease 0.2s both' }}>
            Bienvenue dans l'univers des boissons naturelles inspirées des traditions Africaines. Des produits uniques préparés selon les méthodes artisanales.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeUp 1.1s ease 0.4s both' }}>
            <button onClick={() => navigate(ROUTES.products)} className="anim-btn"
              style={{ padding: '16px 40px', background: '#fff', color: C.hibiscus, border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}>
              Découvrir nos produits
            </button>
            <button onClick={() => navigate(ROUTES.about)} className="anim-btn"
              style={{ padding: '16px 32px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 50, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
              Notre histoire →
            </button>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <Reveal anim="fadeUp">
        <section style={{ background: '#fff', padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: '🍁', text: 'Fait à Montréal' }, { icon: '🚫', text: 'Sans sucre ajouté' },
              { icon: '🌿', text: 'Zéro conservateur' }, { icon: '♻️', text: 'Écoresponsable' }, { icon: '🏅', text: 'Primé' },
            ].map((b, i) => (
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
                { val: count.bottles + '+', label: 'Bouteilles vendues', icon: '🍹' },
                { val: count.families + '+', label: 'Familles satisfaites', icon: '👨‍👩‍👧‍👦' },
                { val: count.flavors,        label: 'Saveurs uniques',    icon: '🎨' },
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
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.red, marginBottom: 8 }}>Notre sélection</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>Nos jus populaires</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.filter(p => p.available).slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} anim="scaleIn">
              <div onClick={() => navigate(ROUTES.product(p.id))} className="anim-card"
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}>
                <div style={{ height: 160, background: `linear-gradient(135deg, ${C.red}22, ${C.red}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <ProductImg src={p.img} size={100} borderRadius={0} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px 18px' }}>
                  {p.tag && <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: C.red, background: `${C.red}15`, padding: '2px 8px', borderRadius: 4 }}>{p.tag}</span>}
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, margin: '8px 0 4px', color: C.dark }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: C.hibiscus }}>{p.price.toFixed(2)}$</span>
                    <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>Voir →</span>
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
              Voir tous nos produits
            </button>
          </div>
        </Reveal>
      </section>

      {/* VALUES */}
      <section style={{ background: C.light, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { icon: '🌿', title: 'Ingrédients naturels', desc: 'Fruits cultivés localement, sans sucre ajouté ni conservateurs.' },
            { icon: '♻️', title: 'Écoresponsable', desc: 'Résidus réutilisés comme épices et pour produits de beauté.' },
            { icon: '🤝', title: 'Producteurs locaux', desc: 'Soutien à l\'économie locale et aux agriculteurs québécois.' },
            { icon: '✨', title: 'Saveurs uniques', desc: 'Recettes artisanales inspirées des traditions Africaines.' },
          ].map((v, i) => (
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
        <section style={{ padding: '64px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal anim="fadeUp">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: C.red, marginBottom: 8 }}>Témoignages</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: C.dark, margin: 0 }}>Ce que nos clients disent</h2>
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
        </section>
      )}

      {/* NEWSLETTER */}
      <Reveal anim="scaleIn">
        <section style={{ background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red})`, backgroundSize: '200% 200%', animation: 'gradient 6s ease infinite', padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Rejoignez la communauté</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginBottom: 24 }}>Profitez de nos offres spéciales et nouveautés.</p>
          <div style={{ display: 'flex', gap: 8, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input type="email" placeholder="Votre courriel" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSub()}
              style={{ flex: 1, minWidth: 200, padding: '14px 18px', borderRadius: 50, border: 'none', fontSize: 15, outline: 'none' }} />
            <button onClick={handleSub} className="anim-btn"
              style={{ padding: '14px 28px', borderRadius: 50, border: 'none', background: C.dark, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
              S'abonner
            </button>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
