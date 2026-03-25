import { useEffect, useMemo, useRef, useState } from 'react';
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
const GOLD          = '#E07A20';

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  secondary:           '#A85010',
  secondaryContainer:  '#FFD4A0',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a2e22',
  onSurfaceVariant:    '#3d5248',
  onTertiaryContainer: '#E07A20',
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

/* SVG wave divider — fills from dark/color above to white/surface below */
function WaveDivider({ topColor, bottomColor }: { topColor: string; bottomColor: string }) {
  return (
    <div style={{ display: 'block', lineHeight: 0, background: bottomColor }}>
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 80, display: 'block' }}
      >
        <path
          d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z"
          fill={topColor}
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { products, reviews, locations, subscribers, updateSubscribers, locationSettings } = useData();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [subDone, setSubDone]   = useState(false);
  const [reviewIdx, setReviewIdx]   = useState(0);
  const [regionFilter, setRegionFilter] = useState('Tous');
  const reviewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    () => reviews.filter((r) => r.approved),
    [reviews],
  );

  /* Auto-scroll reviews carousel every 4s */
  useEffect(() => {
    if (approvedReviews.length <= 3) return;
    reviewIntervalRef.current = setInterval(() => {
      setReviewIdx((prev) => (prev + 1) % approvedReviews.length);
    }, 4000);
    return () => {
      if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current);
    };
  }, [approvedReviews.length]);

  const activeLocations = useMemo(
    () => locations.filter((l) => l.active),
    [locations],
  );

  const filteredLocations = useMemo(
    () => (regionFilter === 'Tous'
      ? activeLocations
      : activeLocations.filter((l) => (l.region ?? 'Montreal') === regionFilter)),
    [activeLocations, regionFilter],
  );

  const regionOptions = useMemo(
    () => ['Tous', ...locationSettings.regions],
    [locationSettings.regions],
  );

  const locationsByRegion = useMemo(
    () => {
      const grouped = filteredLocations.reduce((acc, loc) => {
        const region = loc.region || 'Autre';
        if (!acc[region]) acc[region] = [];
        acc[region].push(loc);
        return acc;
      }, {} as Record<string, typeof filteredLocations>);

      const regionEntries = Object.entries(grouped);
      const selected: typeof filteredLocations = [];
      let index = 0;

      while (selected.length < 8) {
        let added = false;
        for (const [, items] of regionEntries) {
          if (items[index]) {
            selected.push(items[index]);
            added = true;
            if (selected.length === 8) break;
          }
        }
        if (!added) break;
        index += 1;
      }

      const groupedSelected = selected.reduce((acc, loc) => {
        const region = loc.region || 'Autre';
        if (!acc[region]) acc[region] = [];
        acc[region].push(loc);
        return acc;
      }, {} as Record<string, typeof selected>);

      return Object.entries(groupedSelected).map(([region, items]) => ({
        region,
        locations: items,
      }));
    },
    [filteredLocations],
  );


  /* ── Category cards data ── */
  const categories = [
    {
      name:    'Jus',
      img:     `${SUPA}/collection/jus-hibiscus-gingembre.jpg`,
      desc:    'Pressés à froid pour préserver enzymes et vitalité — énergie naturelle, sans sucre ajouté',
      anchor:  '#jus',
      bg:      '#D1FAE5',
      accent:  '#065F46',
      pill:    '#A7F3D0',
      emoji:   '🥤',
    },
    {
      name:    'Tisanes',
      img:     `${SUPA}/collection/banniere-fruits-exotiques.png`,
      desc:    'Plantes africaines et québécoises pour apaiser, détoxifier et retrouver votre équilibre',
      anchor:  '#tisanes',
      bg:      '#FEF9C3',
      accent:  '#92400E',
      pill:    '#FDE68A',
      emoji:   '🌿',
    },
    {
      name:    'Sirops',
      img:     `${SUPA}/collection/sirop-hibiscus-gingembre.jpg`,
      desc:    "Concentrés de bien-être — quelques gouttes suffisent pour transformer votre journée",
      anchor:  '#sirops',
      bg:      '#FCE7F3',
      accent:  '#831843',
      pill:    '#FBCFE8',
      emoji:   '🌺',
    },
    {
      name:    'Poudres',
      img:     `${SUPA}/collection/poudre-gingembre.jpg`,
      desc:    "Superaliments en poudre — gingembre, hibiscus, baobab — pour nourrir votre corps en profondeur",
      anchor:  '#poudres',
      bg:      '#FED7AA',
      accent:  '#7C2D12',
      pill:    '#FDBA74',
      emoji:   '✨',
    },
  ];

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.onSurface, background: C.surface }}>
      <SEO
        title="Accueil"
        description="Élixirs de bien-être nés entre l'Afrique et le Québec. Pressés à froid, sans sucre ajouté — pour nourrir votre corps et éveiller vos sens."
        url="https://lesjusnaturelsbens.com/"
      />
      <StructuredData type="Organization" data={organizationSchema} />

      {/* ═══════════ 1. HERO ═══════════ */}
      <section style={{
        backgroundImage:    `url(${SUPA}/hero/hero-bens-premium.png)`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        minHeight:  '100vh',
        display:    'flex',
        alignItems: 'center',
        position:   'relative',
        overflow:   'hidden',
      }}>
        {/* Left-side gradient overlay only */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.62) 35%, rgba(0,0,0,0.18) 62%, transparent 100%)',
          zIndex:     0,
        }} />

        <div style={{
          position: 'relative',
          zIndex:   1,
          maxWidth: MAX_W,
          width:    '100%',
          padding:  `${SECTION_PY}px ${SECTION_PX}`,
        }}>
          <div style={{ maxWidth: 580 }}>
            {/* Gold pill badge */}
            <span style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           8,
              background:    'rgba(212,168,83,0.18)',
              border:        '1px solid rgba(212,168,83,0.5)',
              color:         GOLD,
              fontFamily:    FONT_BODY,
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              padding:       '8px 22px',
              borderRadius:  9999,
              marginBottom:  32,
            }}>
              ✦ Artisanal &amp; Biologique • Montréal
            </span>

            <h1 style={{
              fontFamily:   FONT_HEADLINE,
              color:        '#ffffff',
              fontSize:     'clamp(2.6rem, 4.5vw, 4.5rem)',
              fontWeight:   700,
              lineHeight:   1.1,
              marginBottom: 24,
            }}>
              Nés entre l'Afrique<br />et le Québec.
            </h1>

            <p style={{
              color:        'rgba(255,255,255,0.82)',
              fontSize:     '1.05rem',
              lineHeight:   1.8,
              marginBottom: 44,
            }}>
              Des élixirs de bien-être pressés à froid — pour nourrir votre corps, éveiller vos sens et vous reconnecter à la nature au quotidien.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate(ROUTES.products)}
                style={{
                  background:   '#C9A84C',
                  color:        '#032416',
                  fontFamily:   FONT_BODY,
                  fontSize:     '1rem',
                  fontWeight:   700,
                  padding:      '15px 36px',
                  borderRadius: 9999,
                  border:       'none',
                  cursor:       'pointer',
                  transition:   'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.45)';
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
                  background:   'rgba(255,255,255,0.08)',
                  color:        '#ffffff',
                  fontFamily:   FONT_BODY,
                  fontSize:     '1rem',
                  fontWeight:   600,
                  padding:      '15px 36px',
                  borderRadius: 9999,
                  border:       '1.5px solid rgba(255,255,255,0.55)',
                  cursor:       'pointer',
                  transition:   'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                Notre histoire
              </button>
            </div>
          </div>
        </div>

        {/* Animated chevron */}
        <div style={{
          position:  'absolute',
          bottom:    32,
          left:      '50%',
          transform: 'translateX(-50%)',
          fontSize:  '1.8rem',
          color:     GOLD,
          animation: 'heroBounce 2s infinite',
          zIndex:    1,
        }}>
          ▾
        </div>
        <style>{`@keyframes heroBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }`}</style>
      </section>

      {/* Wave hero → section 2 */}
      <WaveDivider topColor={C.primary} bottomColor={C.surfaceContainerLow} />

      {/* ═══════════ 2. L'UNIVERS BEN'S ═══════════ */}
      <section style={{
        background: C.surfaceContainerLow,
        overflow:   'hidden',
        position:   'relative',
      }}>
        {/* Subtle dot-grid background */}
        <div style={{
          position:      'absolute',
          inset:         0,
          backgroundImage: `radial-gradient(circle, rgba(43,106,79,0.09) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          zIndex:        0,
        }} />

        <div style={{
          position: 'relative',
          zIndex:   1,
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
            {/* Gold pill badge — premium */}
            <span style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           8,
              background:    'rgba(212,168,83,0.14)',
              border:        '1px solid rgba(212,168,83,0.45)',
              color:         C.secondary,
              fontFamily:    FONT_BODY,
              fontSize:      11,
              fontWeight:    700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              padding:       '7px 20px',
              borderRadius:  9999,
              marginBottom:  28,
            }}>
              ✦ L'univers Ben's
            </span>

            <h2 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(2rem, 4vw, 3rem)',
              fontWeight:   700,
              color:        C.primary,
              marginBottom: 8,
              lineHeight:   1.15,
            }}>
              L'univers des Jus Ben's
            </h2>
            <h2 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(1.4rem, 2.5vw, 1.9rem)',
              fontWeight:   600,
              fontStyle:    'italic',
              color:        C.onSurfaceVariant,
              marginBottom: 28,
              lineHeight:   1.3,
            }}>
              Un voyage au cœur des saveurs vibrantes.
            </h2>

            <GoldBar />

            <p style={{
              color:        C.onSurfaceVariant,
              fontSize:     '1.05rem',
              lineHeight:   1.85,
              marginBottom: 20,
              maxWidth:     480,
            }}>
              Produits à partir des fruits cultivés localement, les Jus Ben's sont une explosion de saveurs naturelles, sans sucre ajouté ni conservateurs.
            </p>
            <p style={{
              color:        C.onSurfaceVariant,
              fontSize:     '1rem',
              lineHeight:   1.8,
              marginBottom: 32,
              maxWidth:     480,
            }}>
              Que vous exploriez des goûts exotiques ou recherchiez des options saines, nos jus sont le choix idéal pour partager avec votre famille.
            </p>

            {/* Stats — petites cartes */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
              {[
                { num: '100%',  label: 'Naturel',        icon: '🍃', bg: '#D1FAE5', accent: '#065F46' },
                { num: '20+',   label: 'Produits',        icon: '🥭', bg: '#FEF9C3', accent: '#92400E' },
                { num: '0',     label: 'Sucre ajouté',    icon: '🌺',  bg: '#FCE7F3', accent: '#831843' },
              ].map((s) => (
                <div key={s.label} style={{
                  background:    s.bg,
                  border:        `1.5px solid ${s.accent}22`,
                  borderRadius:  16,
                  padding:       '14px 18px',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           12,
                  flex:          '1 1 0',
                  minWidth:      120,
                }}>
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{s.icon}</span>
                  <div>
                    <p style={{
                      fontFamily: FONT_HEADLINE,
                      fontSize:   '1.5rem',
                      fontWeight: 700,
                      color:      s.accent,
                      margin:     0,
                      lineHeight: 1,
                    }}>
                      {s.num}
                    </p>
                    <p style={{
                      fontFamily: FONT_BODY,
                      fontSize:   '0.72rem',
                      fontWeight: 600,
                      color:      s.accent + 'bb',
                      margin:     '3px 0 0',
                      letterSpacing: '0.03em',
                    }}>
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA — filled gold */}
            <button
              type="button"
              onClick={() => navigate(ROUTES.about)}
              style={{
                background:   GOLD,
                color:        C.primary,
                fontFamily:   FONT_BODY,
                fontSize:     '0.95rem',
                fontWeight:   700,
                padding:      '15px 36px',
                borderRadius: 9999,
                border:       'none',
                cursor:       'pointer',
                transition:   'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.02em',
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
              Découvrir notre histoire →
            </button>
          </div>

          {/* Right — photo with floating card */}
          <div style={{ position: 'relative' }}>
            {/* Decorative background blob */}
            <div style={{
              position:     'absolute',
              top:          -24,
              right:        -24,
              width:        '85%',
              height:       '85%',
              borderRadius: '40% 20% 40% 20%',
              background:   `linear-gradient(135deg, rgba(212,168,83,0.18) 0%, rgba(3,36,22,0.08) 100%)`,
              zIndex:       0,
            }} />

            {/* Main photo */}
            <div style={{
              backgroundImage:    `url(${SUPA}/atelier/atelier-fruits.jpg)`,
              backgroundSize:     'cover',
              backgroundPosition: 'center',
              borderRadius:       '2.5rem 0.75rem 2.5rem 0.75rem',
              aspectRatio:        '4/5',
              overflow:           'hidden',
              boxShadow:          '0 32px 80px rgba(3,36,22,0.18)',
              position:           'relative',
              zIndex:             1,
            }} />

            {/* Floating stat card — bottom left */}
            <div style={{
              position:     'absolute',
              bottom:       28,
              left:         -28,
              zIndex:       2,
              background:   '#ffffff',
              borderRadius: 20,
              padding:      '18px 24px',
              boxShadow:    '0 12px 40px rgba(3,36,22,0.18)',
              display:      'flex',
              alignItems:   'center',
              gap:          14,
              minWidth:     200,
            }}>
              <div style={{
                width:          48,
                height:         48,
                borderRadius:   '50%',
                background:     'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       '1.4rem',
                flexShrink:     0,
              }}>
                🌿
              </div>
              <div>
                <p style={{ fontFamily: FONT_HEADLINE, fontWeight: 700, color: C.primary, margin: 0, fontSize: '0.95rem' }}>
                  Pressé à froid
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.75rem', color: C.onSurfaceVariant, margin: '2px 0 0' }}>
                  100% enzymes préservées
                </p>
              </div>
            </div>

            {/* Floating badge — top right */}
            <div style={{
              position:     'absolute',
              top:          20,
              right:        -20,
              zIndex:       2,
              background:   C.primaryContainer,
              borderRadius: 16,
              padding:      '12px 18px',
              boxShadow:    '0 8px 28px rgba(3,36,22,0.22)',
              textAlign:    'center',
            }}>
              <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.4rem', fontWeight: 700, color: GOLD, margin: 0, lineHeight: 1 }}>
                ✦
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: '0.7rem', fontWeight: 700, color: '#ffffff', margin: '4px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                Artisanal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave section 2 → section 3 */}
      <WaveDivider topColor={C.surfaceContainerLow} bottomColor="#ffffff" />

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
              Quatre univers. Une même philosophie.
            </h2>
          </div>

          {/* 4-col grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap:                 20,
          }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate(ROUTES.products + (cat.anchor ?? ''))}
                style={{
                  background:    cat.bg,
                  borderRadius:  '2rem',
                  overflow:      'hidden',
                  cursor:        'pointer',
                  display:       'flex',
                  flexDirection: 'column',
                  transition:    'transform 0.35s ease, box-shadow 0.35s ease',
                  boxShadow:     '0 4px 24px rgba(0,0,0,0.06)',
                  position:      'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform  = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow  = '0 20px 48px rgba(0,0,0,0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform  = 'translateY(0)';
                  e.currentTarget.style.boxShadow  = '0 4px 24px rgba(0,0,0,0.06)';
                }}
              >
                {/* Category pill */}
                <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    background:    cat.pill,
                    color:         cat.accent,
                    fontSize:      11,
                    fontWeight:    700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    padding:       '5px 14px',
                    borderRadius:  9999,
                    fontFamily:    FONT_BODY,
                  }}>
                    {cat.emoji} {cat.name}
                  </span>
                </div>

                {/* Image block — featured, prominent */}
                <div style={{
                  flex:               1,
                  backgroundImage:    `url(${cat.img})`,
                  backgroundSize:     'cover',
                  backgroundPosition: 'center',
                  borderRadius:       '1.5rem',
                  margin:             '16px',
                  minHeight:          240,
                  transition:         'transform 0.4s ease',
                }} />

                {/* Text + CTA */}
                <div style={{ padding: '4px 20px 24px' }}>
                  <h3 style={{
                    fontFamily:   FONT_HEADLINE,
                    fontSize:     '1.35rem',
                    fontWeight:   700,
                    color:        cat.accent,
                    marginBottom: 6,
                    lineHeight:   1.2,
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{
                    fontSize:     '0.8rem',
                    color:        cat.accent + 'bb',
                    lineHeight:   1.55,
                    marginBottom: 16,
                    fontFamily:   FONT_BODY,
                  }}>
                    {cat.desc}
                  </p>
                  <span style={{
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           6,
                    background:    cat.accent,
                    color:         '#ffffff',
                    fontFamily:    FONT_BODY,
                    fontSize:      12,
                    fontWeight:    700,
                    letterSpacing: '0.06em',
                    padding:       '9px 20px',
                    borderRadius:  9999,
                  }}>
                    Découvrir →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave section 3 → section 4 */}
      <WaveDivider topColor="#ffffff" bottomColor={C.surfaceContainerLow} />

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
                Nos créations signature
              </h2>
              <p style={{
                color:     C.onSurfaceVariant,
                fontSize:  '1rem',
                lineHeight: 1.7,
                maxWidth:  460,
                margin:    '0 auto',
              }}>
                Chaque bouteille est une histoire. Chaque gorgée, un voyage entre deux continents.
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
                const catColorMap: Record<string, { bg: string; imgBg: string; accent: string }> = {
                  'Jus':      { bg: '#ffffff', imgBg: '#D1FAE5', accent: '#065F46' },
                  'Tisanes':  { bg: '#ffffff', imgBg: '#FEF9C3', accent: '#92400E' },
                  'Sirops':   { bg: '#ffffff', imgBg: '#FCE7F3', accent: '#831843' },
                  'Poudres':  { bg: '#ffffff', imgBg: '#FED7AA', accent: '#7C2D12' },
                };
                const catTheme = catColorMap[p.category] ?? { bg: '#ffffff', imgBg: C.surfaceContainerLow, accent: C.primary };

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
                    onClick={() => navigate(ROUTES.product(p.id))}
                    style={{
                      background:   catTheme.bg,
                      borderRadius: '1.5rem',
                      overflow:     'hidden',
                      boxShadow:    '0 2px 16px rgba(3,36,22,0.07)',
                      transition:   'transform 0.3s, box-shadow 0.3s',
                      display:      'flex',
                      flexDirection: 'column',
                      border:       '1px solid rgba(3,36,22,0.06)',
                      cursor:       'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform  = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow  = '0 24px 56px rgba(3,36,22,0.14)';
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
                      background:  catTheme.imgBg,
                      borderRadius: '1.25rem',
                      margin: '12px 12px 0',
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12 }}>
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
                          onClick={(e) => { e.stopPropagation(); navigate(ROUTES.product(p.id)); }}
                          title="Voir le produit"
                          style={{
                            width:          40,
                            height:         40,
                            borderRadius:   '50%',
                            background:     C.primary,
                            color:          '#ffffff',
                            border:         'none',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            cursor:         'pointer',
                            flexShrink:     0,
                            transition:     'background 0.2s, transform 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background  = GOLD;
                            e.currentTarget.style.transform   = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background  = C.primary;
                            e.currentTarget.style.transform   = 'scale(1)';
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
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

      {/* Wave section 4 → section 5 */}
      <WaveDivider topColor={C.surfaceContainerLow} bottomColor={C.primaryContainer} />

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
          gap:      72,
          alignItems: 'center',
        }}>
          {/* Left — photo */}
          <div style={{
            backgroundImage:    `url(/images-bens/hero-banners/Recompense.png)`,
            backgroundSize:     'cover',
            backgroundPosition: 'center top',
            borderRadius:       '2rem',
            aspectRatio:        '4/5',
            overflow:           'hidden',
            boxShadow:          '0 24px 64px rgba(0,0,0,0.28)',
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
              Promouvoir une alimentation saine et naturelle.
            </h2>
            <p style={{
              color:        'rgba(255,255,255,0.82)',
              fontSize:     '1rem',
              lineHeight:   1.85,
              marginBottom: 32,
            }}>
              Notre mission est de promouvoir une alimentation saine et naturelle, en partageant notre amour pour les fruits exotiques et en inspirant un mode de vie équilibré.
            </p>

            {/* 4 piliers */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 14,
            }}>
              {[
                { icon: '♻️', label: 'Approche durable', desc: 'Résidus de gingembre et hibiscus réutilisés comme épices et cosmétiques' },
                { icon: '🤝', label: 'Producteurs locaux', desc: 'Travail avec les producteurs locaux pour garantir la qualité et soutenir l\'économie' },
                { icon: '🍃', label: 'Produits authentiques', desc: 'Ingrédients naturels soigneusement sélectionnés, sans sucre ajouté ni conservateurs' },
                { icon: '✨', label: 'Expérience gustative', desc: 'Procédés respectant les propriétés nutritionnelles — chaque gorgée est un voyage' },
              ].map((pillar) => (
                <div key={pillar.label} style={{
                  background:   'rgba(255,255,255,0.08)',
                  border:       '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '1rem',
                  padding:      '14px 16px',
                }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 5 }}>{pillar.icon}</div>
                  <p style={{
                    fontFamily:   FONT_BODY,
                    fontSize:     '0.83rem',
                    fontWeight:   700,
                    color:        '#ffffff',
                    margin:       '0 0 3px',
                  }}>{pillar.label}</p>
                  <p style={{
                    fontFamily:   FONT_BODY,
                    fontSize:     '0.72rem',
                    color:        'rgba(255,255,255,0.65)',
                    margin:       0,
                    lineHeight:   1.5,
                  }}>{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave mission → engagements */}
      <WaveDivider topColor={C.primaryContainer} bottomColor={C.surface} />

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
              Ce qui nous distingue
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
                Racines Africaines
              </h3>
              <p style={{
                color:      'rgba(255,255,255,0.72)',
                fontSize:   '0.9rem',
                lineHeight: 1.7,
                flex:       1,
              }}>
                Bissap, gingembre, baobab, gnamakoudji — des superfruits africains aux vertus thérapeutiques millénaires, transmis de génération en génération pour votre vitalité.
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
                Terroir Québécois
              </h3>
              <p style={{
                color:      C.onSurfaceVariant,
                fontSize:   '0.9rem',
                lineHeight: 1.7,
                flex:       1,
              }}>
                Pressés à la main dans notre atelier montréalais, avec des fruits frais du Québec — pour la santé de votre corps et le soutien de notre communauté locale.
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
                Zéro sucre ajouté, zéro conservateur, zéro chaleur. 100% de la vitalité du fruit préservée. Votre santé mérite ce qu'il y a de meilleur — sans exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave engagements → points de vente */}
      <WaveDivider topColor={C.surface} bottomColor={C.surfaceContainer} />

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
              Près de chez vous, partout où la santé compte
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {regionOptions.map((region) => {
              const active = regionFilter === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setRegionFilter(region)}
                  style={{
                    background:    active ? C.primary : '#ffffff',
                    color:         active ? '#ffffff' : C.primary,
                    border:        `1.5px solid ${C.primary}33`,
                    borderRadius:  9999,
                    padding:       '8px 16px',
                    fontFamily:    FONT_BODY,
                    fontSize:      '0.8rem',
                    fontWeight:    700,
                    cursor:        'pointer',
                    transition:    'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(3,36,22,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {region}
                </button>
              );
            })}
          </div>

          {locationsByRegion.length === 0 && (
            <p style={{ textAlign: 'center', color: C.onSurfaceVariant, marginBottom: 48 }}>
              Aucun point de vente pour cette région pour le moment.
            </p>
          )}

          {locationsByRegion.map(({ region, locations }) => (
            <div key={region} style={{ marginBottom: 48 }}>
              {regionFilter !== 'Tous' && (
                <h3 style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize:   '1.2rem',
                  fontWeight: 700,
                  color:      C.primary,
                  margin:     '0 0 20px',
                }}>
                  {region}
                </h3>
              )}
              <div style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap:                 16,
              }}>
                {locations.map((loc, idx) => {
                  const locColors = ['#D1FAE5','#FEF9C3','#FCE7F3','#FED7AA','#DBEAFE','#EDE9FE','#FEE2E2','#ECFDF5'];
                  const locAccent = ['#065F46','#92400E','#831843','#7C2D12','#1D4ED8','#5B21B6','#991B1B','#064E3B'];
                  const li = idx % locColors.length;
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' Montréal')}`;
                  return (
                    <a
                      key={loc.id}
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background:     locColors[li],
                        borderRadius:   '1.5rem',
                        padding:        '24px 20px',
                        border:         `1.5px solid ${locAccent[li]}28`,
                        textDecoration: 'none',
                        display:        'flex',
                        flexDirection:  'column',
                        gap:            10,
                        transition:     'transform 0.25s, box-shadow 0.25s',
                        boxShadow:      '0 2px 12px rgba(3,36,22,0.06)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(3,36,22,0.13)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(3,36,22,0.06)';
                      }}
                    >
                      <div style={{
                        width:          40,
                        height:         40,
                        borderRadius:   '50%',
                        background:     locAccent[li],
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        flexShrink:     0,
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ffffff" />
                        </svg>
                      </div>

                      <h3 style={{
                        fontFamily:   FONT_HEADLINE,
                        fontSize:     '0.95rem',
                        fontWeight:   700,
                        color:        locAccent[li],
                        lineHeight:   1.3,
                        margin:       0,
                      }}>
                        {loc.name}
                      </h3>

                      <p style={{
                        fontFamily: FONT_BODY,
                        color:      locAccent[li] + 'aa',
                        fontSize:   '0.78rem',
                        lineHeight: 1.5,
                        margin:     0,
                        flex:       1,
                      }}>
                        {loc.address}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            background:    locAccent[li] + '18',
                            color:         locAccent[li],
                            fontSize:      '0.7rem',
                            fontWeight:    700,
                            fontFamily:    FONT_BODY,
                            padding:       '3px 10px',
                            borderRadius:  9999,
                            letterSpacing: '0.04em',
                          }}>
                            {loc.type || 'Partenaire'}
                          </span>
                          {regionFilter === 'Tous' && (
                            <span style={{
                              background:    'rgba(255,255,255,0.7)',
                              color:         locAccent[li],
                              fontSize:      '0.68rem',
                              fontWeight:    700,
                              fontFamily:    FONT_BODY,
                              padding:       '3px 8px',
                              borderRadius:  9999,
                              letterSpacing: '0.04em',
                            }}>
                              {loc.region || 'Autre'}
                            </span>
                          )}
                        </div>
                        <span style={{ color: locAccent[li], fontSize: '0.8rem', fontWeight: 700 }}>→</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.locations)}
              style={{
                background:    C.primaryContainer,
                color:         '#ffffff',
                fontFamily:    FONT_BODY,
                fontSize:      '0.95rem',
                fontWeight:    700,
                border:        'none',
                borderRadius:  9999,
                padding:       '14px 36px',
                cursor:        'pointer',
                transition:    'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(3,36,22,0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Voir tous nos partenaires →
            </button>
          </div>
        </div>
      </section>

      {/* Wave locations → reviews */}
      <WaveDivider topColor={C.surfaceContainer} bottomColor="#ffffff" />

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
                Ils l'ont goûté. Ils en parlent.
              </h2>
            </div>

            {/* Carousel container */}
            <div style={{ position: 'relative' }}>
              {/* Cards — 3 visible, sliding */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  display:    'flex',
                  gap:        24,
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transform:  `translateX(calc(-${reviewIdx} * (33.333% + 8px)))`,
                }}>
                  {/* Duplicate for smooth looping */}
                  {[...approvedReviews, ...approvedReviews].map((review, idx) => {
                    const initial = review.name.charAt(0).toUpperCase();
                    const cardAccents = ['#D1FAE5','#FEF9C3','#FCE7F3','#FED7AA','#E0F2FE','#EDE9FE','#FEE2E2'];
                    const cardBorder  = ['#059669','#D97706','#BE185D','#EA580C','#0284C7','#7C3AED','#DC2626'];
                    const accentIdx   = idx % cardAccents.length;
                    return (
                      <div
                        key={`${review.id}-${idx}`}
                        style={{
                          flex:         '0 0 calc(33.333% - 16px)',
                          minWidth:     0,
                          background:   cardAccents[accentIdx],
                          borderRadius: '1.5rem',
                          padding:      '32px',
                          border:       `1.5px solid ${cardBorder[accentIdx]}28`,
                          borderTop:    `4px solid ${cardBorder[accentIdx]}`,
                          boxShadow:    '0 4px 24px rgba(0,0,0,0.05)',
                          position:     'relative',
                        }}
                      >
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
                          minHeight:    96,
                        }}>
                          "{review.text}"
                        </p>

                        {/* Reviewer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width:          40,
                            height:         40,
                            borderRadius:   '50%',
                            background:     cardBorder[accentIdx],
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

              {/* Nav arrows */}
              <button
                type="button"
                onClick={() => {
                  if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current);
                  setReviewIdx((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length);
                }}
                style={{
                  position:       'absolute',
                  left:           -20,
                  top:            '50%',
                  transform:      'translateY(-50%)',
                  width:          44,
                  height:         44,
                  borderRadius:   '50%',
                  background:     '#ffffff',
                  border:         `1.5px solid rgba(3,36,22,0.15)`,
                  boxShadow:      '0 4px 14px rgba(3,36,22,0.1)',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '1.1rem',
                  color:          C.primary,
                  zIndex:         2,
                  transition:     'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(3,36,22,0.18)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(3,36,22,0.1)'; }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current);
                  setReviewIdx((prev) => (prev + 1) % approvedReviews.length);
                }}
                style={{
                  position:       'absolute',
                  right:          -20,
                  top:            '50%',
                  transform:      'translateY(-50%)',
                  width:          44,
                  height:         44,
                  borderRadius:   '50%',
                  background:     '#ffffff',
                  border:         `1.5px solid rgba(3,36,22,0.15)`,
                  boxShadow:      '0 4px 14px rgba(3,36,22,0.1)',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       '1.1rem',
                  color:          C.primary,
                  zIndex:         2,
                  transition:     'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(3,36,22,0.18)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(3,36,22,0.1)'; }}
              >
                ›
              </button>
            </div>

            {/* Dot indicators */}
            <div style={{
              display:        'flex',
              justifyContent: 'center',
              gap:            8,
              marginTop:      32,
            }}>
              {approvedReviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (reviewIntervalRef.current) clearInterval(reviewIntervalRef.current);
                    setReviewIdx(i);
                  }}
                  style={{
                    width:      i === reviewIdx ? 24 : 8,
                    height:     8,
                    borderRadius: 9999,
                    background: i === reviewIdx ? C.primary : 'rgba(3,36,22,0.2)',
                    border:     'none',
                    cursor:     'pointer',
                    padding:    0,
                    transition: 'width 0.35s, background 0.35s',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wave reviews → newsletter */}
      <WaveDivider topColor="#ffffff" bottomColor={C.surface} />

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
              Entrez dans la famille Ben's
            </h2>
            <p style={{
              color:        'rgba(255,255,255,0.72)',
              fontSize:     '1rem',
              lineHeight:   1.75,
              marginBottom: 36,
              maxWidth:     480,
              margin:       '0 auto 36px',
            }}>
              Recettes exclusives, nouvelles saveurs, événements au marché — soyez les premiers à le savoir.
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
