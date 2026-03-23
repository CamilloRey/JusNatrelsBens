import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { StructuredData, organizationSchema } from '@/shared/components/StructuredData';
import { ProductImg } from '@/shared/ui/ProductImg';

/* ── Design tokens ── */
const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1440;
const SECTION_PY    = 112;
const SECTION_PX    = 'clamp(24px, 5vw, 80px)';
const GOLD          = '#d4a853';

const C = {
  primary:             '#032416',
  primaryContainer:    '#1a3a2a',
  secondary:           '#7b5804',
  secondaryContainer:  '#fdcd74',
  surface:             '#fef9ef',
  surfaceContainerLow: '#f8f3e9',
  surfaceContainer:    '#f2ede3',
  onSurface:           '#1d1c16',
  onSurfaceVariant:    '#424843',
  onTertiaryContainer: '#f37b32',
};

const SUPA = 'https://gflkfwalfaeeknauxyig.supabase.co/storage/v1/object/public';

/* ── Helpers ── */
function Overline({ children, color = C.onTertiaryContainer }: { children: string; color?: string }) {
  return (
    <span style={{
      display:       'inline-block',
      fontFamily:    FONT_BODY,
      fontSize:      11,
      fontWeight:    700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
      color,
      marginBottom:  12,
    }}>
      {children}
    </span>
  );
}

function GoldBar() {
  return (
    <div style={{
      width: 56, height: 3,
      background: GOLD,
      borderRadius: 9999,
      marginBottom: 28,
    }} />
  );
}

/* ──────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { products, reviews, locations, subscribers, updateSubscribers } = useData();
  const navigate = useNavigate();

  const [email, setEmail]     = useState('');
  const [subDone, setSubDone] = useState(false);

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

  const featuredProducts = useMemo(
    () => products.filter((p) => p.available).slice(0, 4),
    [products],
  );

  const approvedReviews = useMemo(
    () => reviews.filter((r) => r.approved).slice(0, 3),
    [reviews],
  );

  const activeLocations = useMemo(
    () => locations.filter((l) => l.active),
    [locations],
  );

  /* ── Category cards data ── */
  const categories = [
    {
      name:  'Jus',
      img:   `${SUPA}/jus/hibiscus-gingembre.jpg`,
      desc:  'Bissap, gingembre, ananas — pressés à froid, sans compromis',
    },
    {
      name:  'Tisanes',
      img:   `${SUPA}/tisanes/tisane-gingembre.jpg`,
      desc:  'Plantes séchées à la main, infusées lentement pour libérer leurs bienfaits',
    },
    {
      name:  'Sirops',
      img:   `${SUPA}/sirops/sirop-hibiscus.jpg`,
      desc:  "L'essence pure du fruit concentrée en quelques gouttes. Vivant et authentique",
    },
    {
      name:  'Poudres',
      img:   `${SUPA}/poudres/poudre-gingembre.jpg`,
      desc:  "L'arbre de vie africain dans votre assiette. Récoltée à la main, séchée naturellement",
    },
  ];

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.onSurface, background: C.surface }}>
      <SEO
        title="Accueil"
        description="Jus pressés à froid artisanaux, inspirés de l'Afrique de l'Ouest et du Québec. Sans sucre ajouté, pressés à la main à Montréal."
        url="https://lesjusnaturelsbens.com/"
      />
      <StructuredData type="Organization" data={organizationSchema} />

      {/* ═══════════ 1. HERO ═══════════ */}
      <section style={{
        backgroundImage: `linear-gradient(rgba(3,36,22,0.65), rgba(3,36,22,0.65)), url(${SUPA}/hero/hero-atelier.jpg)`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position:   'relative',
        overflow:   'hidden',
      }}>
        <div style={{
          position:  'relative', zIndex: 1,
          maxWidth:  760,
          width:     '100%',
          padding:   `${SECTION_PY}px ${SECTION_PX}`,
          textAlign: 'center',
        }}>
          {/* Gold pill badge */}
          <span style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           8,
            background:    'rgba(212,168,83,0.18)',
            border:        '1px solid rgba(212,168,83,0.4)',
            color:         GOLD,
            fontFamily:    FONT_BODY,
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            padding:       '8px 22px',
            borderRadius:  9999,
            marginBottom:  32,
          }}>
            ✦ Artisanal · Sans sucre · Montréal
          </span>

          <h1 style={{
            fontFamily:   FONT_HEADLINE,
            color:        '#ffffff',
            fontSize:     'clamp(2.8rem, 5vw, 5rem)',
            fontWeight:   700,
            lineHeight:   1.1,
            marginBottom: 20,
          }}>
            Offrez-vous un voyage gustatif unique !
          </h1>

          <em style={{
            display:      'block',
            color:        GOLD,
            fontFamily:   FONT_HEADLINE,
            fontSize:     '1.25rem',
            fontStyle:    'italic',
            marginBottom: 24,
          }}>
            L'Afrique de l'Ouest rencontre le Québec
          </em>

          <p style={{
            color:        'rgba(255,255,255,0.82)',
            fontSize:     '1.05rem',
            lineHeight:   1.8,
            maxWidth:     600,
            margin:       '0 auto 44px',
          }}>
            En une seule gorgée, savourez le plaisir de nos jus naturels tout en bénéficiant de leurs précieux bienfaits pour votre bien-être.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.products)}
              style={{
                background:  GOLD,
                color:       C.primary,
                fontFamily:  FONT_BODY,
                fontSize:    '1rem',
                fontWeight:  700,
                padding:     '15px 36px',
                borderRadius: 9999,
                border:      'none',
                cursor:      'pointer',
                transition:  'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,168,83,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Découvrir nos jus
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.about)}
              style={{
                background:  'rgba(255,255,255,0.08)',
                color:       '#ffffff',
                fontFamily:  FONT_BODY,
                fontSize:    '1rem',
                fontWeight:  600,
                padding:     '15px 36px',
                borderRadius: 9999,
                border:      '1.5px solid rgba(255,255,255,0.35)',
                cursor:      'pointer',
                transition:  'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              Notre histoire
            </button>
          </div>

          {/* Animated chevron */}
          <div style={{
            marginTop:  56,
            fontSize:   '1.8rem',
            color:      GOLD,
            animation:  'bounce 2s infinite',
          }}>
            ▾
          </div>
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }`}</style>
      </section>

      {/* ═══════════ 2. L'UNIVERS BEN'S ═══════════ */}
      <section style={{
        background: C.surfaceContainerLow,
        overflow:   'hidden',
      }}>
        <div style={{
          maxWidth: MAX_W,
          margin:   '0 auto',
          padding:  `${SECTION_PY}px ${SECTION_PX}`,
          display:  'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:      80,
          alignItems: 'center',
        }}>
          {/* Left — text */}
          <div>
            <Overline color={C.onTertiaryContainer}>Bienvenue dans l'univers Ben's</Overline>
            <h2 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(1.9rem, 4vw, 2.75rem)',
              fontWeight:   700,
              color:        C.onSurface,
              marginBottom: 20,
              lineHeight:   1.2,
            }}>
              Des boissons naturelles inspirées des traditions africaines
            </h2>
            <GoldBar />
            <p style={{
              color:        C.onSurfaceVariant,
              fontSize:     '1rem',
              lineHeight:   1.85,
              marginBottom: 32,
            }}>
              Les Jus Naturels Ben's, c'est un voyage au cœur des saveurs vibrantes du Québec et d'ailleurs. Produits à partir de fruits cultivés localement et d'ingrédients importés d'Afrique de l'Ouest avec soin, nos jus sont une explosion de saveurs naturelles, sans sucre ajouté ni conservateurs.
            </p>

            {/* Value pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
              {['100% Naturel', 'Pressé à froid', 'Écoresponsable', 'Ancrage local'].map((pill) => (
                <span key={pill} style={{
                  background:    C.surfaceContainer,
                  color:         C.primaryContainer,
                  fontFamily:    FONT_BODY,
                  fontSize:      '0.82rem',
                  fontWeight:    600,
                  padding:       '7px 18px',
                  borderRadius:  9999,
                  border:        `1px solid rgba(3,36,22,0.12)`,
                }}>
                  {pill}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTES.about)}
              style={{
                background:   'transparent',
                color:        C.primaryContainer,
                fontFamily:   FONT_BODY,
                fontSize:     '1rem',
                fontWeight:   700,
                padding:      '14px 32px',
                borderRadius: 9999,
                border:       `2px solid ${C.primaryContainer}`,
                cursor:       'pointer',
                transition:   'background 0.25s, color 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.primaryContainer;
                e.currentTarget.style.color      = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color      = C.primaryContainer;
              }}
            >
              Notre histoire
            </button>
          </div>

          {/* Right — photo */}
          <div style={{
            backgroundImage:    `url(${SUPA}/atelier/atelier-fruits.jpg)`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            borderRadius:       '2rem',
            aspectRatio:        '4/5',
            overflow:           'hidden',
            boxShadow:          '0 24px 64px rgba(3,36,22,0.14)',
          }} />
        </div>
      </section>

      {/* ═══════════ 3. 4 CATÉGORIES ═══════════ */}
      <section style={{
        background: '#ffffff',
        padding:    `${SECTION_PY}px ${SECTION_PX}`,
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          {/* Centered header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Overline>Notre collection</Overline>
            <h2 style={{
              fontFamily: FONT_HEADLINE,
              fontSize:   'clamp(1.9rem, 4vw, 2.75rem)',
              fontWeight: 700,
              color:      C.onSurface,
              margin:     '8px auto 0',
            }}>
              Quatre univers de saveurs
            </h2>
          </div>

          {/* 4-col grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap:                 24,
          }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate(ROUTES.products)}
                style={{
                  height:           420,
                  overflow:         'hidden',
                  borderRadius:     '1.5rem',
                  position:         'relative',
                  cursor:           'pointer',
                  backgroundImage:  `url(${cat.img})`,
                  backgroundSize:   'cover',
                  backgroundPosition: 'center',
                  transition:       'transform 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundSize = 'cover';
                  const img = e.currentTarget;
                  img.style.transform = 'scale(1.03)';
                  const inner = img.querySelector('.cat-img-inner') as HTMLElement | null;
                  if (inner) inner.style.transform = 'scale(1.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  const inner = e.currentTarget.querySelector('.cat-img-inner') as HTMLElement | null;
                  if (inner) inner.style.transform = 'scale(1)';
                }}
              >
                {/* Dark gradient overlay */}
                <div style={{
                  position:   'absolute',
                  inset:      0,
                  background: 'linear-gradient(to top, rgba(3,36,22,0.9) 0%, transparent 55%)',
                  zIndex:     1,
                }} />

                {/* Bottom-left text */}
                <div style={{
                  position: 'absolute',
                  bottom:   28,
                  left:     24,
                  right:    24,
                  zIndex:   2,
                }}>
                  <h3 style={{
                    fontFamily:   FONT_HEADLINE,
                    fontSize:     '1.5rem',
                    fontWeight:   700,
                    color:        '#ffffff',
                    marginBottom: 6,
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{
                    fontSize:     '0.82rem',
                    color:        'rgba(255,255,255,0.8)',
                    lineHeight:   1.5,
                    marginBottom: 10,
                  }}>
                    {cat.desc}
                  </p>
                  <span style={{
                    color:      GOLD,
                    fontSize:   '0.88rem',
                    fontWeight: 700,
                  }}>
                    Découvrir →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. ÉLIXIRS SIGNATURE ═══════════ */}
      {featuredProducts.length > 0 && (
        <section style={{
          background: C.surfaceContainerLow,
          padding:    `${SECTION_PY}px ${SECTION_PX}`,
        }}>
          <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
            {/* Centered header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Overline>Nos créations</Overline>
              <h2 style={{
                fontFamily: FONT_HEADLINE,
                fontSize:   'clamp(1.9rem, 4vw, 2.75rem)',
                fontWeight: 700,
                color:      C.onSurface,
                margin:     '8px auto 16px',
              }}>
                Élixirs signature
              </h2>
              <p style={{
                color:     C.onSurfaceVariant,
                fontSize:  '1rem',
                lineHeight: 1.7,
                maxWidth:  460,
                margin:    '0 auto',
              }}>
                Chaque jus est une histoire. Chaque bouteille, un voyage.
              </p>
            </div>

            {/* 4-col grid */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap:                 24,
              marginBottom:        32,
            }}>
              {featuredProducts.map((p) => {
                const tagColors: Record<string, { bg: string; text: string }> = {
                  'Pressé à froid': { bg: C.secondaryContainer, text: C.secondary },
                  '100% Naturel':   { bg: 'rgba(26,58,42,0.12)', text: '#1a5e3a' },
                  'Bio':            { bg: 'rgba(55,110,60,0.12)', text: '#376e3c' },
                  'Boost Immunité': { bg: 'rgba(232,115,42,0.13)', text: '#c45000' },
                };
                const badge = tagColors[p.tag] ?? { bg: C.surfaceContainer, text: C.onSurfaceVariant };

                return (
                  <article
                    key={p.id}
                    style={{
                      background:   '#ffffff',
                      borderRadius: '1.25rem',
                      overflow:     'hidden',
                      boxShadow:    '0 2px 16px rgba(3,36,22,0.07)',
                      transition:   'transform 0.3s, box-shadow 0.3s',
                      display:      'flex',
                      flexDirection: 'column',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform  = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow  = '0 20px 48px rgba(3,36,22,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform  = 'translateY(0)';
                      e.currentTarget.style.boxShadow  = '0 2px 16px rgba(3,36,22,0.07)';
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      aspectRatio: '1/1',
                      overflow:    'hidden',
                      position:    'relative',
                      background:  C.surfaceContainerLow,
                    }}>
                      <ProductImg
                        src={p.img}
                        alt={p.name}
                        size={400}
                        borderRadius={0}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Tag badge */}
                      {p.tag && (
                        <span style={{
                          position:      'absolute',
                          top:           12,
                          left:          12,
                          background:    badge.bg,
                          color:         badge.text,
                          fontSize:      10,
                          fontWeight:    700,
                          textTransform: 'uppercase' as const,
                          letterSpacing: '0.08em',
                          padding:       '5px 12px',
                          borderRadius:  9999,
                        }}>
                          {p.tag}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{
                        fontFamily:   FONT_HEADLINE,
                        fontSize:     '1.1rem',
                        fontWeight:   700,
                        color:        C.primary,
                        marginBottom: 4,
                      }}>
                        {p.name}
                      </h3>
                      <p style={{
                        color:        C.onTertiaryContainer,
                        fontSize:     '0.8rem',
                        fontWeight:   600,
                        marginBottom: 8,
                      }}>
                        {p.category}
                      </p>
                      <p style={{
                        color:              C.onSurfaceVariant,
                        fontSize:           '0.85rem',
                        lineHeight:         1.6,
                        marginBottom:       'auto',
                        paddingBottom:      16,
                        display:            '-webkit-box',
                        WebkitLineClamp:    2,
                        WebkitBoxOrient:    'vertical' as const,
                        overflow:           'hidden',
                      }}>
                        {p.desc}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                        <span style={{
                          fontFamily: FONT_HEADLINE,
                          fontSize:   '1.1rem',
                          fontWeight: 700,
                          color:      GOLD,
                        }}>
                          {p.price.toFixed(2)} $
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate(ROUTES.products)}
                          style={{
                            background:   C.primary,
                            color:        '#ffffff',
                            fontFamily:   FONT_BODY,
                            fontSize:     '0.82rem',
                            fontWeight:   700,
                            padding:      '9px 18px',
                            borderRadius: 9999,
                            border:       'none',
                            cursor:       'pointer',
                            whiteSpace:   'nowrap',
                            transition:   'background 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = C.primaryContainer; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = C.primary; }}
                        >
                          Commander →
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Ghost link */}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => navigate(ROUTES.products)}
                style={{
                  background:  'none',
                  border:      'none',
                  color:       C.secondary,
                  fontFamily:  FONT_BODY,
                  fontSize:    '0.95rem',
                  fontWeight:  700,
                  cursor:      'pointer',
                  padding:     0,
                  transition:  'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary; }}
              >
                Voir toute la collection →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ 5. NOTRE MISSION ═══════════ */}
      <section style={{
        background: C.primaryContainer,
        padding:    `${SECTION_PY}px ${SECTION_PX}`,
        overflow:   'hidden',
      }}>
        <div style={{
          maxWidth: MAX_W,
          margin:   '0 auto',
          display:  'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:      80,
          alignItems: 'center',
        }}>
          {/* Left — photo */}
          <div style={{
            backgroundImage:    `url(${SUPA}/atelier/atelier-preparation.jpg)`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            borderRadius:       '2rem',
            aspectRatio:        '4/5',
            overflow:           'hidden',
            boxShadow:          '0 24px 64px rgba(0,0,0,0.25)',
          }} />

          {/* Right — text */}
          <div>
            <Overline color={C.onTertiaryContainer}>Notre mission</Overline>
            <h2 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(1.9rem, 4vw, 2.75rem)',
              fontWeight:   700,
              color:        '#ffffff',
              marginBottom: 20,
              lineHeight:   1.2,
            }}>
              Promouvoir une alimentation saine et naturelle
            </h2>
            <p style={{
              color:        'rgba(255,255,255,0.75)',
              fontSize:     '1rem',
              lineHeight:   1.85,
              marginBottom: 20,
            }}>
              Notre mission est de promouvoir une alimentation saine et naturelle, en partageant notre amour pour les fruits exotiques et en inspirant un mode de vie équilibré.
            </p>
            <p style={{
              color:        'rgba(255,255,255,0.75)',
              fontSize:     '1rem',
              lineHeight:   1.85,
              marginBottom: 36,
            }}>
              Des produits uniques et savoureux préparés selon des méthodes artisanales qui préservent la fraîcheur, la saveur et l'intégrité nutritionnelle des ingrédients.
            </p>

            {/* Stat chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['Sans sucre ajouté', 'Sans conservateurs', 'Pressé à froid', '100% Artisanal'].map((chip) => (
                <span key={chip} style={{
                  background:   'rgba(255,255,255,0.1)',
                  color:        'rgba(255,255,255,0.9)',
                  border:       '1px solid rgba(255,255,255,0.2)',
                  fontFamily:   FONT_BODY,
                  fontSize:     '0.82rem',
                  fontWeight:   600,
                  padding:      '8px 18px',
                  borderRadius: 9999,
                }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 6. NOS ENGAGEMENTS ═══════════ */}
      <section style={{
        background: C.surface,
        padding:    `${SECTION_PY}px ${SECTION_PX}`,
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          {/* Centered header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Overline>Ce qui nous définit</Overline>
            <h2 style={{
              fontFamily: FONT_HEADLINE,
              fontSize:   'clamp(1.9rem, 4vw, 2.75rem)',
              fontWeight: 700,
              color:      C.onSurface,
              margin:     '8px auto 16px',
            }}>
              Nos engagements
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoldBar />
            </div>
          </div>

          {/* 3 cards */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap:                 24,
          }}>
            {/* Card 1 — dark */}
            <div style={{
              background:   C.primaryContainer,
              borderRadius: '1.5rem',
              padding:      '40px 32px',
              height:       280,
              display:      'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>🌍</div>
              <h3 style={{
                fontFamily:   FONT_HEADLINE,
                fontSize:     '1.15rem',
                fontWeight:   700,
                color:        '#ffffff',
                marginBottom: 12,
              }}>
                Héritage Africain
              </h3>
              <p style={{
                color:      'rgba(255,255,255,0.72)',
                fontSize:   '0.9rem',
                lineHeight: 1.7,
                flex:       1,
              }}>
                Nos recettes s'inspirent des boissons traditionnelles d'Afrique de l'Ouest : bissap, gnamakoudji, baobab — transmises de génération en génération.
              </p>
            </div>

            {/* Card 2 — warm */}
            <div style={{
              background:   C.surfaceContainerLow,
              borderRadius: '1.5rem',
              padding:      '40px 32px',
              height:       280,
              display:      'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border:       `1px solid rgba(3,36,22,0.08)`,
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>🍁</div>
              <h3 style={{
                fontFamily:   FONT_HEADLINE,
                fontSize:     '1.15rem',
                fontWeight:   700,
                color:        C.primary,
                marginBottom: 12,
              }}>
                Savoir-faire Québécois
              </h3>
              <p style={{
                color:      C.onSurfaceVariant,
                fontSize:   '0.9rem',
                lineHeight: 1.7,
                flex:       1,
              }}>
                Nous travaillons avec les producteurs locaux de Montréal et du Québec pour garantir la fraîcheur et soutenir l'économie locale.
              </p>
            </div>

            {/* Card 3 — dark */}
            <div style={{
              background:   C.primaryContainer,
              borderRadius: '1.5rem',
              padding:      '40px 32px',
              height:       280,
              display:      'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>✦</div>
              <h3 style={{
                fontFamily:   FONT_HEADLINE,
                fontSize:     '1.15rem',
                fontWeight:   700,
                color:        '#ffffff',
                marginBottom: 12,
              }}>
                Zéro Compromis
              </h3>
              <p style={{
                color:      'rgba(255,255,255,0.72)',
                fontSize:   '0.9rem',
                lineHeight: 1.7,
                flex:       1,
              }}>
                Aucun sucre ajouté, aucun conservateur, aucune chaleur. Nos résidus sont réutilisés en épices et cosmétiques. La nature, respectée jusqu'au bout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. POINTS DE VENTE ═══════════ */}
      <section style={{
        background: C.surfaceContainer,
        padding:    `${SECTION_PY}px ${SECTION_PX}`,
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          {/* Centered header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Overline color={C.onTertiaryContainer}>Où nous trouver</Overline>
            <h2 style={{
              fontFamily: FONT_HEADLINE,
              fontSize:   'clamp(1.9rem, 4vw, 2.75rem)',
              fontWeight: 700,
              color:      C.onSurface,
              margin:     '8px auto 0',
            }}>
              Nos points de vente
            </h2>
          </div>

          {/* Location cards */}
          <div style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            24,
            justifyContent: 'center',
            maxWidth:       800,
            margin:         '0 auto 48px',
          }}>
            {activeLocations.map((loc) => (
              <div key={loc.id} style={{
                background:   '#ffffff',
                borderRadius: '1rem',
                padding:      '24px 32px',
                minWidth:     220,
                boxShadow:    '0 2px 12px rgba(3,36,22,0.07)',
                border:       '1px solid rgba(3,36,22,0.05)',
                textAlign:    'center',
              }}>
                {/* Gold map pin SVG */}
                <svg
                  width="28" height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ marginBottom: 12 }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={GOLD} />
                </svg>
                <h3 style={{
                  fontFamily:   FONT_HEADLINE,
                  fontSize:     '1.1rem',
                  fontWeight:   700,
                  color:        C.primary,
                  marginBottom: 6,
                }}>
                  {loc.name}
                </h3>
                <p style={{
                  color:        C.onSurfaceVariant,
                  fontSize:     '0.85rem',
                  lineHeight:   1.5,
                  marginBottom: 12,
                }}>
                  {loc.address}
                </p>
                <span style={{
                  background:   C.secondaryContainer,
                  color:        C.secondary,
                  fontSize:     '0.78rem',
                  fontWeight:   600,
                  padding:      '4px 14px',
                  borderRadius: 9999,
                }}>
                  {loc.type}
                </span>
              </div>
            ))}
          </div>

          {/* CTA link */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.locations)}
              style={{
                background:  'none',
                border:      'none',
                color:       C.secondary,
                fontFamily:  FONT_BODY,
                fontSize:    '0.95rem',
                fontWeight:  700,
                cursor:      'pointer',
                padding:     0,
                transition:  'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary; }}
            >
              En savoir plus sur nos partenaires →
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. COMMUNAUTÉ BEN'S ═══════════ */}
      {approvedReviews.length > 0 && (
        <section style={{
          background: '#ffffff',
          padding:    `${SECTION_PY}px ${SECTION_PX}`,
        }}>
          <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
            {/* Centered header */}
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Overline>La famille Ben's</Overline>
              <h2 style={{
                fontFamily: FONT_HEADLINE,
                fontSize:   'clamp(1.9rem, 4vw, 2.75rem)',
                fontWeight: 700,
                color:      C.onSurface,
                margin:     '8px auto 0',
              }}>
                Ce qu'ils en disent
              </h2>
            </div>

            {/* 3-col grid */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap:                 24,
            }}>
              {approvedReviews.map((review) => {
                const initial = review.name.charAt(0).toUpperCase();
                return (
                  <div key={review.id} style={{
                    background:   C.surfaceContainerLow,
                    borderRadius: '1.25rem',
                    padding:      '32px',
                    border:       '1px solid rgba(3,36,22,0.06)',
                  }}>
                    {/* 5 stars */}
                    <div style={{ marginBottom: 16, letterSpacing: 3 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{
                          color:    i < review.rating ? GOLD : '#d1cdc3',
                          fontSize: '1.05rem',
                        }}>★</span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p style={{
                      fontStyle:    'italic',
                      fontSize:     '1rem',
                      lineHeight:   1.8,
                      color:        C.onSurface,
                      marginBottom: 24,
                    }}>
                      "{review.text}"
                    </p>

                    {/* Reviewer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width:          40,
                        height:         40,
                        borderRadius:   '50%',
                        background:     C.primaryContainer,
                        color:          '#ffffff',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        fontFamily:     FONT_HEADLINE,
                        fontWeight:     700,
                        fontSize:       '0.9rem',
                        flexShrink:     0,
                      }}>
                        {initial}
                      </div>
                      <div>
                        <p style={{
                          fontFamily: FONT_HEADLINE,
                          fontWeight: 700,
                          fontSize:   '0.95rem',
                          color:      C.primary,
                          margin:     0,
                        }}>
                          {review.name}
                        </p>
                        <p style={{
                          fontSize: '0.8rem',
                          color:    C.onSurfaceVariant,
                          margin:   '2px 0 0',
                        }}>
                          Montréal, QC
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ 9. NEWSLETTER ═══════════ */}
      <section style={{
        background: C.surface,
        padding:    `${SECTION_PY}px ${SECTION_PX}`,
      }}>
        <div style={{
          background:   'linear-gradient(135deg, #1a3a2a 0%, #032416 100%)',
          borderRadius: '3rem',
          maxWidth:     860,
          margin:       '0 auto',
          padding:      '64px 48px',
          textAlign:    'center',
          position:     'relative',
          overflow:     'hidden',
        }}>
          {/* Soft glow */}
          <div style={{
            position:      'absolute',
            inset:         0,
            background:    'radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.12) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Overline color={GOLD}>La famille Ben's</Overline>
            <h2 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(1.6rem, 3.5vw, 2.25rem)',
              fontWeight:   700,
              color:        '#ffffff',
              margin:       '8px 0 16px',
            }}>
              Rejoignez la famille Ben's
            </h2>
            <p style={{
              color:        'rgba(255,255,255,0.7)',
              fontSize:     '1rem',
              lineHeight:   1.75,
              marginBottom: 36,
              maxWidth:     480,
              margin:       '0 auto 36px',
            }}>
              Profitez de nos offres spéciales et nouveautés régulièrement.
            </p>

            {subDone ? (
              <p style={{
                color:      '#a3e4a3',
                fontWeight: 700,
                fontSize:   '1.05rem',
              }}>
                ✓ Merci d'avoir rejoint la famille !
              </p>
            ) : (
              <div style={{
                display:        'flex',
                gap:            12,
                maxWidth:       480,
                margin:         '0 auto',
                flexWrap:       'wrap',
                justifyContent: 'center',
              }}>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSub()}
                  style={{
                    flex:            1,
                    minWidth:        220,
                    padding:         '15px 24px',
                    borderRadius:    9999,
                    border:          '1.5px solid rgba(255,255,255,0.25)',
                    background:      'rgba(255,255,255,0.1)',
                    color:           '#ffffff',
                    fontFamily:      FONT_BODY,
                    fontSize:        '0.95rem',
                    outline:         'none',
                    backdropFilter:  'blur(8px)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleSub}
                  style={{
                    background:   GOLD,
                    color:        C.primary,
                    fontFamily:   FONT_BODY,
                    fontSize:     '0.95rem',
                    fontWeight:   700,
                    padding:      '15px 32px',
                    borderRadius: 9999,
                    border:       'none',
                    cursor:       'pointer',
                    whiteSpace:   'nowrap',
                    transition:   'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform  = 'scale(1.04)';
                    e.currentTarget.style.boxShadow  = '0 6px 20px rgba(212,168,83,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform  = 'scale(1)';
                    e.currentTarget.style.boxShadow  = 'none';
                  }}
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
