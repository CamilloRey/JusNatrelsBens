import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  gold:                '#E07A20',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
};
const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W_CONTENT = 720;
const MAX_W         = 1200;

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

/* Reading-progress hook */
function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function update() {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return progress;
}

export default function BlogDetailPage() {
  const { id }    = useParams<{ id: string }>();
  const { blogs } = useData();
  const navigate  = useNavigate();
  const progress  = useReadingProgress();
  const articleRef = useRef<HTMLDivElement>(null);

  const blog        = blogs.find(b => b.id === id);
  const related     = blogs.filter(b => b.published && b.id !== id).slice(0, 3);
  const readingTime = blog ? Math.max(1, Math.ceil(blog.content.split(' ').length / 200)) : 0;
  const paragraphs  = blog ? blog.content.split('\n').filter(p => p.trim()) : [];

  /* Not found */
  if (!blog) {
    return (
      <div style={{
        background: C.surface, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column' as const, gap: 24, fontFamily: FONT_BODY,
      }}>
        <span style={{ fontSize: '3rem' }}>🌿</span>
        <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.4rem', color: C.primary }}>
          Article introuvable
        </p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.blog)}
          style={{
            background: C.primary, color: '#ffffff', border: 'none',
            borderRadius: 9999, padding: '13px 32px',
            fontFamily: FONT_BODY, fontWeight: 700, cursor: 'pointer',
          }}
        >
          ← Retour au journal
        </button>
      </div>
    );
  }

  const cc = getCatColor(blog.category);

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, minHeight: '100vh' }}>
      <SEO
        title={blog.title}
        description={blog.content.substring(0, 160)}
        url={`https://lesjusnaturelsbens.com/blogue/${id}`}
      />

      {/* ─── Reading progress bar ─── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, zIndex: 200,
        height: 3, background: C.gold,
        width: `${progress}%`,
        transition: 'width 0.1s linear',
        borderRadius: '0 2px 2px 0',
      }} />

      {/* ─── HERO — full bleed ─── */}
      <section style={{ position: 'relative', height: 'min(600px, 70vh)', overflow: 'hidden' }}>
        {blog.img ? (
          <img
            src={blog.img}
            alt={blog.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(160deg, ${C.primaryContainer} 0%, ${C.primary} 60%, #0f2d1e 100%)`,
          }}>
            {/* Decorative dots */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }} />
            <div style={{
              position: 'absolute', bottom: '20%', right: '10%',
              fontSize: '14rem', opacity: 0.06, lineHeight: 1,
            }}>🌿</div>
          </div>
        )}

        {/* Gradient overlay — bottom for text */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,35,25,0.92) 0%, rgba(15,35,25,0.45) 45%, rgba(15,35,25,0.1) 100%)',
        }} />

        {/* Back button — top left */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.blog)}
          style={{
            position: 'absolute', top: 28, left: 'clamp(20px, 4vw, 56px)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff', fontFamily: FONT_BODY,
            fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            borderRadius: 9999, padding: '9px 18px',
            zIndex: 3, transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        >
          ← Journal
        </button>

        {/* Content — anchored bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          maxWidth: MAX_W, margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 56px) 48px',
        }}>
          {/* Category + reading time */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' as const }}>
            <span style={{
              background: cc.bg, color: cc.text,
              padding: '5px 14px', borderRadius: 9999,
              fontSize: 10, fontWeight: 700, fontFamily: FONT_BODY,
              textTransform: 'uppercase' as const, letterSpacing: '0.1em',
            }}>
              {blog.category}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)',
              padding: '5px 14px', borderRadius: 9999,
              fontSize: 10, fontWeight: 600, fontFamily: FONT_BODY,
            }}>
              📖 {readingTime} min de lecture
            </span>
          </div>

          <h1 style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)',
            fontWeight: 800, color: '#ffffff',
            lineHeight: 1.1, margin: '0 0 16px',
            maxWidth: 800, textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}>
            {blog.title}
          </h1>

          <p style={{
            fontFamily: FONT_BODY,
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
          }}>
            {blog.date}
          </p>
        </div>
      </section>

      {/* Wave hero → body */}
      <div style={{ display: 'block', lineHeight: 0, background: C.surface }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          style={{ width: '100%', height: 80, display: 'block' }}>
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z" fill="rgba(15,35,25,0.92)" />
        </svg>
      </div>

      {/* ─── ARTICLE BODY ─── */}
      <section style={{ background: C.surface, padding: '16px clamp(20px, 5vw, 56px) 80px' }}>
        <div ref={articleRef} style={{ maxWidth: MAX_W_CONTENT, margin: '0 auto' }}>

          {/* Decorative leaf rule */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48,
          }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.surfaceContainer})` }} />
            <span style={{ fontSize: '1.1rem', opacity: 0.5 }}>🍃</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.surfaceContainer})` }} />
          </div>

          {/* Paragraphs */}
          {paragraphs.map((para, i) => {
            /* Pull quote every ~⅓ of article */
            const isPull = paragraphs.length > 5 && i === Math.floor(paragraphs.length / 2);

            if (isPull) {
              return (
                <div key={i} style={{ margin: '56px -24px', position: 'relative' }}>
                  {/* Decorative large quote mark */}
                  <div style={{
                    position: 'absolute', top: -20, left: 0,
                    fontFamily: 'Georgia, serif',
                    fontSize: '8rem', lineHeight: 1,
                    color: C.gold, opacity: 0.18,
                    fontWeight: 900,
                    userSelect: 'none',
                  }}>
                    "
                  </div>
                  <blockquote style={{
                    borderLeft: `4px solid ${C.gold}`,
                    background: `linear-gradient(to right, rgba(224,122,32,0.06), transparent)`,
                    borderRadius: '0 1rem 1rem 0',
                    padding: '28px 32px',
                    margin: 0,
                    fontFamily: FONT_HEADLINE,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                    lineHeight: 1.75,
                    color: C.primary,
                  }}>
                    {para}
                  </blockquote>
                </div>
              );
            }

            /* First paragraph — lead text */
            if (i === 0) {
              return (
                <p key={i} style={{
                  fontFamily: FONT_BODY,
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  lineHeight: 1.9,
                  color: C.onSurface,
                  margin: '0 0 32px',
                  paddingLeft: 20,
                  borderLeft: `3px solid ${C.surfaceContainer}`,
                }}>
                  {para}
                </p>
              );
            }

            return (
              <p key={i} style={{
                fontFamily: FONT_BODY,
                fontSize: '1.03rem',
                lineHeight: 1.95,
                color: C.onSurfaceVariant,
                margin: '0 0 28px',
                letterSpacing: '0.01em',
              }}>
                {para}
              </p>
            );
          })}

          {/* End of article rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 56 }}>
            <div style={{ flex: 1, height: 1, background: C.surfaceContainer }} />
            <span style={{
              fontFamily: FONT_BODY, fontSize: '0.75rem', fontWeight: 700,
              color: C.onSurfaceVariant, letterSpacing: '0.15em',
              textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
            }}>
              Fin de l'article
            </span>
            <div style={{ flex: 1, height: 1, background: C.surfaceContainer }} />
          </div>
        </div>
      </section>

      {/* Wave body → key points */}
      <WaveDivider topColor={C.surface} bottomColor={C.primaryContainer} />

      {/* ─── KEY POINTS ─── */}
      <section style={{ background: C.primaryContainer, padding: '72px clamp(20px, 5vw, 56px)' }}>
        <div style={{ maxWidth: MAX_W_CONTENT, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', flexShrink: 0,
            }}>
              ✦
            </div>
            <div>
              <p style={{
                fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                color: C.gold, margin: '0 0 4px',
              }}>
                À retenir
              </p>
              <h2 style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2,
              }}>
                L'essentiel de cet article
              </h2>
            </div>
          </div>

          {/* Points list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              "Les jus naturels sans sucre ajouté préservent l'intégralité des nutriments du fruit.",
              'Les plantes médicinales africaines sont utilisées depuis des millénaires pour leurs vertus.',
              'Le pressage à froid conserve les enzymes et vitamines sensibles à la chaleur.',
              "Une alimentation vivante et colorée est la base d'un bien-être durable.",
            ].map((point, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.875rem',
                padding: '16px 20px',
              }}>
                <span style={{
                  background: C.gold,
                  color: '#ffffff',
                  width: 24, height: 24, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800,
                  flexShrink: 0, marginTop: 1,
                  fontFamily: FONT_BODY,
                }}>
                  {i + 1}
                </span>
                <p style={{
                  fontFamily: FONT_BODY,
                  fontSize: '0.92rem', lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.85)',
                  margin: 0,
                }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave key points → CTA */}
      <WaveDivider topColor={C.primaryContainer} bottomColor={C.surface} />

      {/* ─── CTA DÉCOUVRIR ─── */}
      <section style={{
        background: C.surface,
        padding: '80px clamp(20px, 5vw, 56px)',
      }}>
        <div style={{
          maxWidth: MAX_W_CONTENT, margin: '0 auto',
          background: `linear-gradient(135deg, ${C.surfaceContainerLow}, ${C.surfaceContainer})`,
          borderRadius: '2rem',
          padding: '56px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
          border: '1px solid rgba(27,77,56,0.08)',
          boxShadow: '0 8px 40px rgba(27,77,56,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative background */}
          <div style={{
            position: 'absolute', top: '-50%', right: '-30%',
            width: '80%', height: '200%',
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(27,77,56,0.2)',
            }}>
              🥤
            </div>
            <h2 style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700, color: C.primary,
              margin: '0 0 12px', lineHeight: 1.2,
            }}>
              Prêt à déguster ?
            </h2>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: '1rem', color: C.onSurfaceVariant,
              lineHeight: 1.75, margin: '0 0 32px', maxWidth: 400,
            }}>
              Découvrez nos élixirs naturels inspirés de cet article — pressés à froid, sans sucre ajouté.
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.products)}
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                color: '#ffffff',
                border: 'none', borderRadius: 9999,
                padding: '16px 40px', fontFamily: FONT_BODY,
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                transition: 'transform 0.25s, box-shadow 0.25s',
                boxShadow: '0 4px 20px rgba(27,77,56,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform  = 'translateY(-2px)';
                e.currentTarget.style.boxShadow  = '0 10px 36px rgba(27,77,56,0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform  = 'translateY(0)';
                e.currentTarget.style.boxShadow  = '0 4px 20px rgba(27,77,56,0.25)';
              }}
            >
              Explorer nos produits →
            </button>
          </div>
        </div>
      </section>

      {/* ─── RELATED ARTICLES ─── */}
      {related.length > 0 && (
        <>
          <WaveDivider topColor={C.surface} bottomColor={C.surfaceContainerLow} />
          <section style={{ background: C.surfaceContainerLow, padding: '80px clamp(20px, 5vw, 56px)' }}>
          <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{
                  fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  color: C.gold, margin: '0 0 8px',
                }}>
                  Continuez la lecture
                </p>
                <h2 style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 700, color: C.primary, margin: 0,
                }}>
                  Articles similaires
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.blog)}
                style={{
                  background: 'none', border: `1.5px solid rgba(27,77,56,0.2)`,
                  color: C.primary, fontFamily: FONT_BODY, fontWeight: 700,
                  fontSize: '0.85rem', padding: '9px 20px', borderRadius: 9999,
                  cursor: 'pointer',
                }}
              >
                Voir tout le journal →
              </button>
            </div>

            {/* Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {related.map(rel => {
                const rcc = getCatColor(rel.category);
                const relTime = Math.max(1, Math.ceil(rel.content.split(' ').length / 200));
                return (
                  <article
                    key={rel.id}
                    onClick={() => { navigate(`/blog/${rel.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      background: '#ffffff', borderRadius: '1.25rem', overflow: 'hidden',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      border: `1px solid rgba(27,77,56,0.07)`,
                      boxShadow: '0 2px 12px rgba(27,77,56,0.05)',
                      transition: 'transform 0.25s, box-shadow 0.25s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(27,77,56,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,77,56,0.05)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '16/9', background: rcc.bg, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                      {rel.img ? (
                        <img
                          src={rel.img} alt={rel.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '3rem', background: `linear-gradient(135deg, ${rcc.bg}, #ffffff)`,
                        }}>
                          🌿
                        </div>
                      )}
                      <span style={{
                        position: 'absolute', top: 10, left: 10,
                        background: rcc.bg, color: rcc.text,
                        padding: '3px 10px', borderRadius: 9999,
                        fontSize: 9, fontWeight: 700, fontFamily: FONT_BODY,
                        textTransform: 'uppercase' as const, letterSpacing: '0.07em',
                        backdropFilter: 'blur(4px)',
                      }}>
                        {rel.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <p style={{
                        fontSize: '0.7rem', color: C.onSurfaceVariant,
                        margin: 0, fontFamily: FONT_BODY,
                      }}>
                        {rel.date} · {relTime} min
                      </p>
                      <h3 style={{
                        fontFamily: FONT_HEADLINE, fontSize: '0.98rem', fontWeight: 700,
                        color: C.primary, margin: '0 0 auto', lineHeight: 1.35,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                      }}>
                        {rel.title}
                      </h3>
                      <span style={{
                        fontFamily: FONT_BODY, fontSize: '0.82rem', fontWeight: 700,
                        color: C.gold, marginTop: 10,
                      }}>
                        Lire la suite →
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          </section>
        </>
      )}

      {/* Wave finale → footer */}
      <WaveDivider
        topColor={related.length > 0 ? C.surfaceContainerLow : C.surface}
        bottomColor="#1a3a2a"
      />
    </div>
  );
}
