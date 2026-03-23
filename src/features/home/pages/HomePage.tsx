import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { StructuredData, organizationSchema } from '@/shared/components/StructuredData';
import { ProductImg } from '@/shared/ui/ProductImg';

/* ── Color tokens ── */
const C = {
  primary:              '#032416',
  primaryContainer:     '#1a3a2a',
  secondary:            '#7b5804',
  secondaryContainer:   '#fdcd74',
  secondaryFixed:       '#ffdea6',
  surface:              '#fef9ef',
  surfaceContainer:     '#f2ede3',
  surfaceContainerLow:  '#f8f3e9',
  onSurface:            '#1d1c16',
  onSurfaceVariant:     '#424843',
  onTertiaryContainer:  '#f37b32',
};

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1440;
const SECTION_PY    = 112;
const SECTION_PX    = 32;

/* ──────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────── */
function Overline({ children, color = C.secondary }: { children: string; color?: string }) {
  return (
    <span style={{
      display:       'inline-block',
      fontFamily:    FONT_BODY,
      fontSize:      11,
      fontWeight:    700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      marginBottom:  12,
    }}>
      {children}
    </span>
  );
}

function GoldBar() {
  return <div style={{ width: 56, height: 3, background: '#d4a853', borderRadius: 9999, marginBottom: 28 }} />;
}

/* ──────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────── */
export default function HomePage() {
  useTranslation();
  const { products, reviews, subscribers, updateSubscribers } = useData();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [subDone, setSubDone]   = useState(false);

  const handleSub = () => {
    if (!email || !email.includes('@')) return;
    updateSubscribers([...subscribers, {
      id:     's' + Date.now(),
      email,
      date:   new Date().toISOString().split('T')[0],
      active: true,
    }]);
    setEmail('');
    setSubDone(true);
    setTimeout(() => setSubDone(false), 4000);
  };

  const availableProducts  = useMemo(() => products.filter((p) => p.available), [products]);
  const featuredProducts   = useMemo(() => {
    const sorted = [...availableProducts].sort((a, b) => {
      const rank = (t: string) => t === 'Pressé à froid' ? 0 : t === 'Boost Immunité' ? 1 : 2;
      return rank(a.tag) - rank(b.tag);
    });
    return sorted.slice(0, 4);
  }, [availableProducts]);
  const approvedReviews    = useMemo(() => reviews.filter((r) => r.approved).slice(0, 3), [reviews]);

  /* ── hover helpers ── */
  const hoverLift   = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform  = 'translateY(-6px)';
    e.currentTarget.style.boxShadow  = '0 20px 48px rgba(3,36,22,0.12)';
  };
  const hoverReset  = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform  = 'translateY(0)';
    e.currentTarget.style.boxShadow  = 'none';
  };
  const hoverLiftSm = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform  = 'translateY(-4px)';
    e.currentTarget.style.boxShadow  = '0 12px 32px rgba(3,36,22,0.10)';
  };

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.onSurface, background: C.surface }}>
      <SEO
        title="Accueil"
        description="Jus pressés à froid artisanaux, inspirés de l'Afrique de l'Ouest et du Québec. Sans sucre ajouté, pressés à la main à Montréal."
        url="https://lesjusnaturelsbens.com/"
      />
      <StructuredData type="Organization" data={organizationSchema} />

      {/* ═══════════ 1. HERO ═══════════
          Fond : gradient vert foncé → or
      ══════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1a3a2a 0%, #1a3a2a 55%, #2d5a3d 100%)',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        position:   'relative',
        overflow:   'hidden',
      }}>
        {/* soft gold glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.18) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: MAX_W, margin: '0 auto', width: '100%',
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 72,
          alignItems: 'center',
        }}>
          {/* ── Left – Copy ── */}
          <div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(212,168,83,0.18)',
              border: '1px solid rgba(212,168,83,0.35)',
              color: '#ffdea6',
              fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '8px 20px', borderRadius: 9999,
              marginBottom: 32,
            }}>
              ✦ Artisanal &amp; Biologique &bull; Montréal
            </span>

            <h1 style={{
              fontFamily: FONT_HEADLINE,
              color: '#ffffff',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 700, lineHeight: 1.1,
              marginBottom: 24,
            }}>
              Pressés à froid.{' '}
              <em style={{ color: '#ffdea6', fontStyle: 'italic' }}>
                Nés de deux continents.
              </em>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1.05rem', lineHeight: 1.8,
              maxWidth: 500, marginBottom: 44,
            }}>
              Des jus artisanaux qui portent en eux l&rsquo;Afrique de l&rsquo;Ouest et le Québec &mdash;
              pressés dans notre atelier montréalais, sans compromis sur la nature.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigate(ROUTES.products)}
                style={{
                  background: '#d4a853', color: C.primary,
                  fontFamily: FONT_BODY, fontSize: '1rem', fontWeight: 700,
                  padding: '15px 36px', borderRadius: 9999,
                  border: 'none', cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform  = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow  = '0 8px 24px rgba(212,168,83,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform  = 'translateY(0)';
                  e.currentTarget.style.boxShadow  = 'none';
                }}
              >
                Découvrir nos jus
              </button>

              <button type="button" onClick={() => navigate(ROUTES.about)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontFamily: FONT_BODY, fontSize: '1rem', fontWeight: 600,
                  padding: '15px 36px', borderRadius: 9999,
                  border: '1.5px solid rgba(255,255,255,0.22)',
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                Notre histoire
              </button>
            </div>
          </div>

          {/* ── Right – Image ── */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              width: '75%', height: '75%',
              background: 'radial-gradient(circle, rgba(212,168,83,0.30) 0%, transparent 70%)',
              filter: 'blur(64px)',
              borderRadius: '50%',
            }} />
            {/* decorative ring */}
            <div style={{
              position: 'absolute',
              width: '90%', maxWidth: 500,
              aspectRatio: '4/5',
              border: '1.5px solid rgba(212,168,83,0.2)',
              borderRadius: '40% 10% 40% 10%',
              transform: 'rotate(-2deg)',
              zIndex: 0,
            }} />
            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: '40% 10% 40% 10%',
              overflow: 'hidden',
              transform: 'rotate(2deg)',
              width: '85%', maxWidth: 480,
              aspectRatio: '4/5',
              boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
            }}>
              <ProductImg
                src={featuredProducts[0]?.img || '/images-bens/photos/photo-jus.png'}
                alt="Jus Ben's"
                size={480}
                borderRadius={0}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. BANDE MARQUE
          Fond : blanc pur — 4 chiffres clés en ligne
      ══════════════════════════════════════════════ */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(3,36,22,0.06)',
      }}>
        <div style={{
          maxWidth: MAX_W, margin: '0 auto',
          padding: '40px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          textAlign: 'center',
        }}>
          {[
            { stat: '100%',         label: 'Pressé à froid' },
            { stat: '0',            label: 'Sucre ajouté' },
            { stat: '3',            label: 'Marchés à Montréal' },
            { stat: '2 continents', label: 'Dans chaque bouteille' },
          ].map((item) => (
            <div key={item.label}>
              <div style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700, color: C.primaryContainer,
                marginBottom: 4,
              }}>
                {item.stat}
              </div>
              <div style={{ fontSize: '0.85rem', color: C.onSurfaceVariant, fontWeight: 500 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ 3. PRODUITS SIGNATURE
          Fond : crème clair — 4 cards avec images Supabase
      ══════════════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section style={{ background: C.surface, padding: `${SECTION_PY}px ${SECTION_PX}px` }}>
          <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
            {/* header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <Overline>Nos créations</Overline>
                <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 700, color: C.onSurface, marginBottom: 12 }}>
                  Élixirs Signature
                </h2>
                <p style={{ color: C.onSurfaceVariant, fontSize: '1rem', lineHeight: 1.7, maxWidth: 520 }}>
                  Chaque bouteille est une œuvre artisanale, pressée à froid dans les 24h pour préserver toute la vie de la nature.
                </p>
              </div>
              <button type="button" onClick={() => navigate(ROUTES.products)}
                style={{
                  background: 'none', border: 'none',
                  color: C.secondary, fontFamily: FONT_BODY,
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: 0, transition: 'gap 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.gap = '10px'; }}
                onMouseLeave={(e) => { e.currentTarget.style.gap = '6px'; }}
              >
                Voir toute la collection <span style={{ fontSize: '1.1rem' }}>&#8594;</span>
              </button>
            </div>

            {/* grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {featuredProducts.map((p) => {
                const badgeColors: Record<string, { bg: string; text: string }> = {
                  'Pressé à froid': { bg: 'rgba(26,58,42,0.10)', text: '#1a5e3a' },
                  '100% Naturel':            { bg: 'rgba(42,106,79,0.12)', text: '#2a6a4f' },
                  'Bio':                     { bg: 'rgba(55,110,60,0.12)', text: '#376e3c' },
                  'Boost Immunité':     { bg: 'rgba(232,115,42,0.13)', text: '#c45000' },
                  'Sans sucre ajouté':  { bg: 'rgba(107,45,139,0.10)', text: '#5a2080' },
                };
                const badge = badgeColors[p.tag] ?? { bg: C.surfaceContainer, text: C.onSurfaceVariant };
                return (
                  <article key={p.id}
                    onClick={() => navigate(ROUTES.product(p.id))}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(3,36,22,0.07)',
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 2px 16px rgba(3,36,22,0.05)',
                      transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s',
                    }}
                    onMouseEnter={hoverLift}
                    onMouseLeave={hoverReset}
                  >
                    {/* full-bleed image */}
                    <div style={{
                      aspectRatio: '4/3',
                      overflow: 'hidden',
                      background: C.surfaceContainerLow,
                      position: 'relative',
                    }}>
                      <ProductImg
                        src={p.img}
                        alt={p.name}
                        size={400}
                        borderRadius={0}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                      />
                      {/* badge overlay */}
                      {p.tag && (
                        <span style={{
                          position: 'absolute', top: 14, left: 14,
                          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
                          color: badge.text,
                          fontSize: 10, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          padding: '5px 12px', borderRadius: 9999,
                        }}>
                          {p.tag}
                        </span>
                      )}
                    </div>

                    {/* info */}
                    <div style={{ padding: '20px 20px 22px' }}>
                      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700, color: C.onSurface, marginBottom: 6 }}>
                        {p.name}
                      </h3>
                      <p style={{ color: C.onSurfaceVariant, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 18,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.desc}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.2rem', fontWeight: 700, color: '#7b5804' }}>
                          {p.price.toFixed(2)}&nbsp;$
                        </span>
                        <button type="button"
                          onClick={(e) => { e.stopPropagation(); navigate(ROUTES.product(p.id)); }}
                          style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: C.primaryContainer, color: '#ffffff',
                            border: 'none', cursor: 'pointer',
                            fontSize: '1.2rem', fontWeight: 300,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.2s, background 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.background = '#d4a853'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = C.primaryContainer; }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ 4. L'ATELIER BEN'S
          Fond : crème warm #f8f3e9 — photo organique + texte
      ═══════════════════════════════════════════════════ */}
      <section style={{ background: C.surfaceContainerLow, overflow: 'hidden' }}>
        <div style={{
          maxWidth: MAX_W, margin: '0 auto',
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 88, alignItems: 'center',
        }}>
          {/* Image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -12, left: -12,
              width: '100%', height: '100%',
              border: '2px solid rgba(212,168,83,0.25)',
              borderRadius: '40% 10% 40% 10%', zIndex: 0,
            }} />
            <div style={{
              position: 'relative', zIndex: 1,
              borderRadius: '40% 10% 40% 10%',
              overflow: 'hidden', height: 520,
              boxShadow: '0 20px 60px rgba(3,36,22,0.14)',
            }}>
              <img
                src={`https://gflkfwalfaeeknauxyig.supabase.co/storage/v1/object/public/images/ui/about-atelier.jpg`}
                alt="L'Atelier Ben's"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* floating badge */}
            <div style={{
              position: 'absolute', bottom: 28, right: -16, zIndex: 2,
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
              borderRadius: '1.25rem', padding: '18px 22px',
              boxShadow: '0 8px 32px rgba(3,36,22,0.12)',
              display: 'flex', alignItems: 'center', gap: 14,
              border: '1px solid rgba(212,168,83,0.2)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: C.surfaceContainerLow,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.4rem' }}>🌿</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: C.primary, margin: 0, fontSize: '0.9rem', fontFamily: FONT_HEADLINE }}>
                  100% Naturel
                </p>
                <p style={{ fontSize: '0.78rem', color: C.onSurfaceVariant, margin: '2px 0 0', fontFamily: FONT_BODY }}>
                  Pressé à froid chaque matin
                </p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <Overline color={C.onTertiaryContainer}>Notre mission</Overline>
            <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 700, color: C.onSurface, marginBottom: 20 }}>
              L&rsquo;Atelier Ben&rsquo;s
            </h2>
            <GoldBar />
            <p style={{ fontFamily: FONT_HEADLINE, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.75, color: C.onSurfaceVariant, marginBottom: 24 }}>
              &ldquo;De Dakar à Montréal, notre voyage est celui des saveurs qui transcendent les frontières.&rdquo;
            </p>
            <p style={{ color: C.onSurfaceVariant, fontSize: '1rem', lineHeight: 1.85, marginBottom: 14 }}>
              Les Jus Naturels Ben&rsquo;s sont nés d&rsquo;une passion pour les traditions de bien-être africaines.
              Chaque matin, nous pressons à la main dans notre atelier montréalais des fruits sélectionnés
              avec soin au marché Jean-Talon et auprès de producteurs africains partenaires.
            </p>
            <p style={{ color: C.onSurfaceVariant, fontSize: '1rem', lineHeight: 1.85, marginBottom: 40 }}>
              Parce que la nature est déjà parfaite &mdash; notre seul rôle est de la presser.
            </p>
            <button type="button" onClick={() => navigate(ROUTES.about)}
              style={{
                background: 'transparent', color: C.primaryContainer,
                fontFamily: FONT_BODY, fontSize: '1rem', fontWeight: 700,
                padding: '14px 32px', borderRadius: 9999,
                border: `2px solid ${C.primaryContainer}`,
                cursor: 'pointer', transition: 'background 0.25s, color 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryContainer; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.primaryContainer; }}
            >
              Découvrir notre histoire
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ 5. NOS ENGAGEMENTS
          Fond : vert marque #1a3a2a — 3 piliers (couleur uniforme)
      ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: C.primaryContainer,
        padding: `${SECTION_PY}px ${SECTION_PX}px`,
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          {/* header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Overline color="rgba(212,168,83,0.9)">Ce qui nous définit</Overline>
            <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 700, color: '#fef9ef', marginBottom: 16, maxWidth: 560, margin: '8px auto 0' }}>
              Nos Engagements
            </h2>
            <p style={{ color: 'rgba(254,249,239,0.65)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 580, margin: '16px auto 0' }}>
              Chaque décision que nous prenons &mdash; du champ à la bouteille &mdash; est guidée par ces trois principes fondamentaux.
            </p>
          </div>

          {/* 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[
              {
                emoji: '🌺',
                title: 'Héritage Africain',
                desc: 'Bissap de Casamance, moringa du Sahel, baobab de l\u2019Ouest africain &mdash; des ingrédients ancestraux sélectionnés avec intention et respect.',
              },
              {
                emoji: '🍁',
                title: 'Racines Québécoises',
                desc: 'Pommes Cortland, canneberges de l\u2019Estrie, épinards du marché Jean-Talon &mdash; le meilleur du Québec, récolté à maturité.',
              },
              {
                emoji: '🥦',
                title: 'Zéro Compromis',
                desc: 'Aucun sucre ajouté, aucun conservateur, aucune pasteurisation. Pressé à froid dans les 24h, livré vivant, plein de nutriments intacts.',
              },
            ].map((card) => (
              <div key={card.title}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1.5rem', padding: '36px 32px',
                  transition: 'background 0.3s, transform 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background  = 'rgba(255,255,255,0.11)';
                  e.currentTarget.style.transform   = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform   = 'translateY(0)';
                }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '1.25rem',
                  background: 'rgba(212,168,83,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem', marginBottom: 24,
                }}>
                  {card.emoji}
                </div>
                <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700, color: '#fef9ef', marginBottom: 12 }}>
                  {card.title}
                </h3>
                <p style={{ color: 'rgba(254,249,239,0.65)', fontSize: '0.93rem', lineHeight: 1.75 }}
                  dangerouslySetInnerHTML={{ __html: card.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. POINTS DE VENTE
          Fond : #f2ede3 pleine largeur — centré et mis en avant
      ═══════════════════════════════════════════════════════ */}
      <section style={{ background: C.surfaceContainer }}>
        <div style={{
          maxWidth: MAX_W, margin: '0 auto',
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
        }}>
          {/* centered header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Overline color={C.onTertiaryContainer}>Où nous trouver</Overline>
            <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 700, color: C.onSurface, marginBottom: 16, margin: '8px auto 0' }}>
              Nos Points de Vente
            </h2>
            <p style={{ color: C.onSurfaceVariant, fontSize: '1rem', lineHeight: 1.7, maxWidth: 520, margin: '16px auto 0' }}>
              Retrouvez nos jus artisanaux dans ces marchés et épiceries partenaires à Montréal.
            </p>
          </div>

          {/* 3 centered cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {[
              {
                name:    'Marché Jean-Talon',
                address: '7070 Ave Henri-Julien',
                city:    'Montréal, QC',
                type:    'Marché public',
                hours:   'Mer\u2013Dim',
                emoji:   '🏪',
              },
              {
                name:    'Marché Atwater',
                address: '138 Ave Atwater',
                city:    'Montréal, QC',
                type:    'Marché public',
                hours:   'Jeu\u2013Dim',
                emoji:   '🛒',
              },
              {
                name:    'Épicerie Afro-Antillaise',
                address: '3456 Boul. Décarie',
                city:    'Montréal, QC',
                type:    'Épicerie spécialisée',
                hours:   'Lun\u2013Sam',
                emoji:   '🌍',
              },
            ].map((loc) => (
              <div key={loc.name}
                style={{
                  background: '#ffffff',
                  borderRadius: '1.75rem',
                  padding: '36px 28px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(3,36,22,0.07)',
                  border: '1px solid rgba(3,36,22,0.05)',
                  transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s',
                }}
                onMouseEnter={hoverLiftSm}
                onMouseLeave={hoverReset}
              >
                {/* emoji icon */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: C.primaryContainer,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.7rem', margin: '0 auto 20px',
                }}>
                  {loc.emoji}
                </div>
                <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.05rem', fontWeight: 700, color: C.onSurface, marginBottom: 8 }}>
                  {loc.name}
                </h3>
                <p style={{ color: C.onSurfaceVariant, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 4 }}>
                  {loc.address}
                </p>
                <p style={{ color: C.onSurfaceVariant, fontSize: '0.88rem', marginBottom: 16 }}>
                  {loc.city}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 600,
                    color: C.secondary, background: C.secondaryContainer,
                    padding: '4px 12px', borderRadius: 9999,
                  }}>
                    {loc.type}
                  </span>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 600,
                    color: '#1a5e3a', background: 'rgba(26,94,58,0.10)',
                    padding: '4px 12px', borderRadius: 9999,
                  }}>
                    {loc.hours}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA sous les cards */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button type="button" onClick={() => navigate(ROUTES.locations)}
              style={{
                background: C.primaryContainer, color: '#ffffff',
                fontFamily: FONT_BODY, fontSize: '0.95rem', fontWeight: 700,
                padding: '14px 36px', borderRadius: 9999,
                border: 'none', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(3,36,22,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Voir tous nos points de vente
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. TÉMOIGNAGES (conditionnel)
          Fond : blanc — cards crème warm
      ════════════════════════════════════════ */}
      {approvedReviews.length > 0 && (
        <section style={{ background: '#ffffff', padding: `${SECTION_PY}px ${SECTION_PX}px` }}>
          <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Overline>Ce qu&rsquo;ils en pensent</Overline>
              <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', fontWeight: 700, color: C.onSurface, margin: '8px auto 0', maxWidth: 500 }}>
                La communauté Ben&rsquo;s
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {approvedReviews.map((review) => {
                const initials = review.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                return (
                  <div key={review.id}
                    style={{
                      background: C.surfaceContainerLow,
                      borderRadius: '1.5rem',
                      padding: '32px 28px',
                      border: '1px solid rgba(3,36,22,0.06)',
                      transition: 'transform 0.25s, box-shadow 0.25s',
                    }}
                    onMouseEnter={hoverLiftSm}
                    onMouseLeave={hoverReset}
                  >
                    <div style={{ marginBottom: 16, letterSpacing: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < review.rating ? '#d4a853' : '#d1cdc3', fontSize: '1.05rem' }}>★</span>
                      ))}
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '0.98rem', lineHeight: 1.8, color: C.onSurface, marginBottom: 28 }}>
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: C.primaryContainer, color: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: '0.85rem',
                        flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.92rem', color: C.onSurface, margin: 0 }}>{review.name}</p>
                        <p style={{ fontSize: '0.8rem', color: C.onSurfaceVariant, margin: '2px 0 0' }}>Montréal, QC</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ 8. NEWSLETTER
          Fond : card gradient vert→or
      ═══════════════════════════════ */}
      <section style={{ padding: `${SECTION_PY / 2}px ${SECTION_PX}px`, maxWidth: MAX_W, margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 50%, #7b5804 100%)',
          borderRadius: '3rem',
          padding: 'clamp(52px, 6vw, 88px) clamp(32px, 5vw, 72px)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
            <div style={{ fontSize: '2.25rem', marginBottom: 20 }}>✉</div>
            <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>
              Rejoignez la famille Ben&rsquo;s
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.75, marginBottom: 36 }}>
              Recettes, arrivages du marché, offres exclusives et histoires d&rsquo;Afrique &mdash; directement dans votre boîte.
            </p>
            {subDone ? (
              <p style={{ color: '#ffdea6', fontWeight: 700, fontSize: '1.05rem' }}>
                ✓ Merci ! Vous êtes maintenant de la famille Ben&rsquo;s.
              </p>
            ) : (
              <div style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSub()}
                  style={{
                    flex: 1, minWidth: 220,
                    padding: '15px 24px', borderRadius: 9999,
                    border: '1.5px solid rgba(255,255,255,0.22)',
                    background: 'rgba(255,255,255,0.1)', color: '#ffffff',
                    fontFamily: FONT_BODY, fontSize: '0.95rem', outline: 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <button type="button" onClick={handleSub}
                  style={{
                    background: '#d4a853', color: C.primary,
                    fontFamily: FONT_BODY, fontSize: '0.95rem', fontWeight: 700,
                    padding: '15px 32px', borderRadius: 9999,
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,168,83,0.4)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Je rejoins la famille
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
