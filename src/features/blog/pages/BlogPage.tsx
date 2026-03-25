import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  gold:                '#C9A84C',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
};
const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1280;
const POSTS_PER_PAGE = 9;

function WaveDivider({ topColor, bottomColor }: { topColor: string; bottomColor: string }) {
  return (
    <div style={{ display: 'block', lineHeight: 0, background: bottomColor }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ width: '100%', height: 80, display: 'block' }}>
        <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z" fill={topColor} />
      </svg>
    </div>
  );
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'Nos Recettes':         { bg: '#FEF9C3', text: '#92400E' },
  'Bienfaits et Astuces': { bg: '#D1FAE5', text: '#065F46' },
  'Notre Histoire':       { bg: '#FCE7F3', text: '#831843' },
};
function getCatColor(cat: string) {
  return CAT_COLORS[cat] ?? { bg: C.surfaceContainer, text: C.onSurfaceVariant };
}

export default function BlogPage() {
  const { blogs }   = useData();
  const navigate    = useNavigate();

  const [page,           setPage]          = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [email,          setEmail]          = useState('');
  const [subscribed,     setSubscribed]     = useState(false);

  const publishedPosts = useMemo(() => blogs.filter(b => b.published), [blogs]);

  const filtered = useMemo(
    () => activeCategory ? publishedPosts.filter(b => b.category === activeCategory) : publishedPosts,
    [publishedPosts, activeCategory],
  );

  const totalPages  = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pagePosts   = useMemo(
    () => filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    [filtered, currentPage],
  );
  const featuredPost = publishedPosts[0] ?? null;

  function goToPost(id: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/blog/' + id);
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  }

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, minHeight: '100vh' }}>
      <SEO
        title="Notre Journal"
        description="Plantes médicinales, recettes vivantes, sagesses africaines — une lecture qui nourrit autant que nos élixirs."
        url="https://lesjusnaturelsbens.com/blogue"
      />

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', height: 'min(320px, 45vh)', overflow: 'hidden' }}>
        {/* Background image — top of bottles only */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images-bens/hero-banners/banniere-blogue-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 5%',
          zIndex: 0,
        }} />
        {/* Dark gradient bottom — hides label area */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '55%',
          background: 'linear-gradient(to top, rgba(27,77,56,0.95) 0%, transparent 100%)',
          zIndex: 1,
        }} />
        {/* Left overlay for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,77,56,0.55) 30%, transparent 75%)',
          zIndex: 1,
        }} />
        {/* Content — bottom aligned */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 2, maxWidth: MAX_W, margin: '0 auto', padding: '0 2rem 36px',
        }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase' as const,
            color: C.gold, margin: '0 0 10px',
          }}>
            ✦ Notre Journal
          </p>
          <h1 style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, color: '#ffffff',
            lineHeight: 1.1, margin: 0,
          }}>
            Recettes · Bienfaits · Histoire
          </h1>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor={C.surface} />

      {/* ═══ FEATURED ═══ */}
      {featuredPost && (
        <section style={{ maxWidth: MAX_W, margin: '0 auto', padding: '8px 32px 64px' }}>
          <article
            onClick={() => goToPost(featuredPost.id)}
            style={{
              position: 'relative', overflow: 'hidden', borderRadius: '2rem',
              cursor: 'pointer', height: 480, background: C.surfaceContainer,
            }}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector('img') as HTMLImageElement | null;
              if (img) img.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector('img') as HTMLImageElement | null;
              if (img) img.style.transform = 'scale(1)';
            }}
          >
            {featuredPost.img ? (
              <img
                src={featuredPost.img}
                alt={featuredPost.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.primaryContainer}, ${C.primary})` }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,77,56,0.92) 0%, rgba(27,77,56,0.25) 55%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 48px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' as const }}>
                <span style={{
                  background: C.gold, color: C.primary,
                  padding: '5px 14px', borderRadius: 9999,
                  fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY,
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                }}>
                  ✦ Article vedette
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontFamily: FONT_BODY }}>
                  {featuredPost.date}
                </span>
              </div>
              <h2 style={{
                fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 700, color: '#ffffff', margin: '0 0 12px',
                lineHeight: 1.2, maxWidth: 640,
              }}>
                {featuredPost.title}
              </h2>
              <p style={{
                fontFamily: FONT_BODY, fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.65)', lineHeight: 1.65,
                maxWidth: 480, margin: '0 0 22px',
              }}>
                {featuredPost.content.slice(0, 120)}…
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff', fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.85rem',
                padding: '10px 24px', borderRadius: 9999,
              }}>
                Lire l'article →
              </span>
            </div>
          </article>
        </section>
      )}

      {/* ═══ 3 RUBRIQUES CARDS ═══ */}
      <section style={{ maxWidth: MAX_W, margin: '0 auto', padding: '0 32px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {([
            { name: 'Nos Recettes',         icon: '🍹', desc: 'Inspirations culinaires et boissons maison avec nos produits',    cc: CAT_COLORS['Nos Recettes'] },
            { name: 'Bienfaits et Astuces', icon: '🌿', desc: 'Science, nutrition et conseils pour une alimentation naturelle',  cc: CAT_COLORS['Bienfaits et Astuces'] },
            { name: 'Notre Histoire',        icon: '🌍', desc: 'Les racines africaines et québécoises qui nous ont inspirés',     cc: CAT_COLORS['Notre Histoire'] },
          ] as const).map((rubrique) => {
            const count = publishedPosts.filter(p => p.category === rubrique.name).length;
            const active = activeCategory === rubrique.name;
            return (
              <button
                key={rubrique.name}
                type="button"
                onClick={() => { setActiveCategory(active ? null : rubrique.name); setPage(1); }}
                style={{
                  background:   active ? rubrique.cc.bg : '#ffffff',
                  border:       active ? `2px solid ${rubrique.cc.text}50` : `1.5px solid rgba(27,77,56,0.08)`,
                  borderRadius: '1.25rem',
                  padding:      '22px 24px',
                  textAlign:    'left',
                  cursor:       'pointer',
                  transition:   'transform 0.2s, box-shadow 0.2s',
                  boxShadow:    active ? `0 8px 28px ${rubrique.cc.text}18` : '0 2px 10px rgba(27,77,56,0.05)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(27,77,56,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = active ? `0 8px 28px ${rubrique.cc.text}18` : '0 2px 10px rgba(27,77,56,0.05)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span style={{ fontSize: '1.6rem' }}>{rubrique.icon}</span>
                  <span style={{
                    background: rubrique.cc.bg, color: rubrique.cc.text,
                    fontSize: '0.7rem', fontWeight: 700, fontFamily: FONT_BODY,
                    padding: '3px 10px', borderRadius: 9999, letterSpacing: '0.05em',
                  }}>
                    {count} article{count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p style={{
                  fontFamily: FONT_HEADLINE, fontSize: '1rem', fontWeight: 700,
                  color: active ? rubrique.cc.text : C.primary, margin: '0 0 6px',
                }}>
                  {rubrique.name}
                </p>
                <p style={{
                  fontFamily: FONT_BODY, fontSize: '0.78rem', color: C.onSurfaceVariant,
                  margin: 0, lineHeight: 1.5,
                }}>
                  {rubrique.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Pill: Tout voir */}
        {activeCategory && (
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => { setActiveCategory(null); setPage(1); }}
              style={{
                fontFamily: FONT_BODY, fontSize: '0.82rem', fontWeight: 600,
                padding: '8px 20px', borderRadius: 9999,
                background: 'none', color: C.onSurfaceVariant,
                border: `1.5px solid rgba(27,77,56,0.2)`,
                cursor: 'pointer',
              }}
            >
              ← Voir tous les articles ({publishedPosts.length})
            </button>
          </div>
        )}
      </section>

      {/* ═══ GRID ═══ */}
      <section style={{ maxWidth: MAX_W, margin: '0 auto', padding: '0 32px 88px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: C.onSurfaceVariant }}>
            <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.2rem', color: C.primary, marginBottom: 8 }}>
              Aucun article dans cette catégorie.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.gold, fontWeight: 700, fontFamily: FONT_BODY }}
            >
              Voir tous les articles →
            </button>
          </div>
        ) : (
          <>
            <style>{`
              .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px; }
              @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; gap: 20px; } }
            `}</style>
            <div className="blog-grid">
              {pagePosts.map((post) => {
                const cc = getCatColor(post.category);
                return (
                  <article
                    key={post.id}
                    onClick={() => goToPost(post.id)}
                    style={{
                      background: '#ffffff', borderRadius: '1.5rem', overflow: 'hidden',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      border: `1px solid rgba(27,77,56,0.06)`,
                      boxShadow: '0 2px 16px rgba(27,77,56,0.05)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 20px 48px rgba(27,77,56,0.14)';
                      const img = e.currentTarget.querySelector('img');
                      if (img) (img as HTMLImageElement).style.transform = 'scale(1.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 16px rgba(27,77,56,0.05)';
                      const img = e.currentTarget.querySelector('img');
                      if (img) (img as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, ${C.surfaceContainer}, ${C.surfaceContainerLow})`, flexShrink: 0 }}>
                      {post.img ? (
                        <img
                          src={post.img} alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${cc.bg}80, ${cc.bg})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                          🌿
                        </div>
                      )}
                      <span style={{
                        position: 'absolute', top: 14, left: 14,
                        background: cc.bg, color: cc.text,
                        padding: '5px 14px', borderRadius: 9999,
                        fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY,
                        textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }}>
                        {post.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <p style={{ fontSize: '0.75rem', color: C.onSurfaceVariant, margin: 0, fontFamily: FONT_BODY, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{post.date}</span>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.gold }} />
                        <span>{Math.max(1, Math.ceil(post.content.split(' ').length / 200))} min de lecture</span>
                      </p>
                      <h3 style={{
                        fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700,
                        color: C.primary, margin: '0 0 auto', lineHeight: 1.35,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                      }}>
                        {post.title}
                      </h3>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontFamily: FONT_BODY, fontSize: '0.85rem', fontWeight: 700,
                        color: C.gold, marginTop: 12,
                      }}>
                        Lire la suite
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 56 }}>
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: `1.5px solid rgba(27,77,56,0.15)`,
                    background: currentPage <= 1 ? C.surfaceContainerLow : '#ffffff',
                    color: currentPage <= 1 ? C.onSurfaceVariant + '60' : C.primary,
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: FONT_BODY,
                  }}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: n === currentPage ? 'none' : `1.5px solid rgba(27,77,56,0.15)`,
                      background: n === currentPage ? C.primary : '#ffffff',
                      color: n === currentPage ? '#ffffff' : C.onSurface,
                      cursor: 'pointer', fontFamily: FONT_BODY,
                      fontWeight: n === currentPage ? 700 : 500,
                      fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: `1.5px solid rgba(27,77,56,0.15)`,
                    background: currentPage >= totalPages ? C.surfaceContainerLow : '#ffffff',
                    color: currentPage >= totalPages ? C.onSurfaceVariant + '60' : C.primary,
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: FONT_BODY,
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <WaveDivider topColor={C.surface} bottomColor={C.primary} />
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryContainer} 100%)`, padding: '88px 32px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-20%',
          width: '60%', height: '200%',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: C.gold, margin: '0 0 18px',
          }}>
            ✦ Lettre botanique
          </p>
          <h2 style={{
            fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 700, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.2,
          }}>
            Recevez nos articles en avant-première
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Savoirs botaniques, recettes de saison et traditions africaines — directement dans votre boîte mail.
          </p>
          {subscribed ? (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(5,150,105,0.2)', border: '1.5px solid rgba(5,150,105,0.4)',
              borderRadius: 9999, padding: '14px 28px',
            }}>
              <span style={{ fontSize: '1.2rem' }}>✓</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: '1rem', color: '#A7F3D0', fontWeight: 700 }}>
                Merci pour votre inscription !
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap' as const }}>
              <input
                type="email"
                placeholder="Votre adresse courriel"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  flex: 1, minWidth: 220,
                  padding: '16px 24px', borderRadius: 9999,
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: FONT_BODY, fontSize: '0.95rem',
                  color: '#ffffff', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              />
              <button
                type="submit"
                style={{
                  background: C.gold, color: C.primary,
                  border: 'none', borderRadius: 9999,
                  padding: '16px 32px',
                  fontFamily: FONT_BODY, fontSize: '0.95rem', fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(201,168,76,0.45)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.3)';
                }}
              >
                S'abonner →
              </button>
            </form>
          )}
        </div>
      </section>
      <WaveDivider topColor={C.primaryContainer} bottomColor={C.primaryContainer} />
    </div>
  );
}
