import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
const MAX_W = 1160;

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
  accent:              '#E07A20',
  gold:                '#C9A84C',
};

const OWNER_IMG = '/images-bens/hero-banners/Proprietaire.png';

function WaveDivider({ topColor, bottomColor }: { topColor: string; bottomColor: string }) {
  return (
    <div style={{ display: 'block', lineHeight: 0, background: bottomColor }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
        <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z" fill={topColor} />
      </svg>
    </div>
  );
}

function Overline({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p style={{
      fontFamily:    FONT_BODY,
      fontSize:      11,
      fontWeight:    700,
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color:         light ? 'rgba(255,255,255,0.55)' : C.gold,
      margin:        '0 0 18px',
    }}>
      {children}
    </p>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, color: C.onSurface }}>
      <SEO
        title="Notre Histoire"
        description="Découvrez l'histoire de Bénédicte Tueam, fondatrice des Jus Naturels Ben's — science, héritage africain et passion pour les saveurs naturelles."
        url="https://lesjusnaturelsbens.com/notre-histoire"
      />

      <style>{`
        .drop-cap::first-letter {
          font-family: 'Noto Serif', serif;
          font-size: 4.2rem;
          font-weight: 700;
          line-height: 0.75;
          float: left;
          margin: 6px 12px 0 0;
          color: #1B4D38;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeUp 0.7s ease both; }
      `}</style>

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section style={{
        background: C.primary,
        minHeight:  '92vh',
        display:    'flex',
        alignItems: 'center',
        position:   'relative',
        overflow:   'hidden',
        padding:    '120px 32px 80px',
      }}>
        {/* Background texture */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `radial-gradient(circle at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%),
                            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`,
          pointerEvents:   'none',
        }} />
        {/* Vertical gold line accent */}
        <div style={{
          position:   'absolute',
          left:       'calc((100% - 1160px) / 2)',
          top:        120,
          bottom:     80,
          width:      2,
          background: `linear-gradient(to bottom, transparent, ${C.gold}66, transparent)`,
        }} />

        <div style={{
          maxWidth:            MAX_W,
          margin:              '0 auto',
          display:             'grid',
          gridTemplateColumns: '55fr 45fr',
          gap:                 80,
          alignItems:          'center',
          position:            'relative',
          zIndex:              1,
          width:               '100%',
        }}>
          {/* Left */}
          <div className="animate-in">
            <Overline light>Notre histoire</Overline>
            <div style={{
              width:        40,
              height:       1,
              background:   C.gold,
              marginBottom: 32,
              opacity:      0.6,
            }} />
            <h1 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(2.8rem, 5vw, 4.4rem)',
              fontWeight:   700,
              lineHeight:   1.1,
              color:        '#ffffff',
              margin:       '0 0 12px',
              letterSpacing: '-0.01em',
            }}>
              Je m'appelle
            </h1>
            <h1 style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(2.8rem, 5vw, 4.4rem)',
              fontWeight:   700,
              lineHeight:   1.1,
              color:        C.gold,
              fontStyle:    'italic',
              margin:       '0 0 36px',
              letterSpacing: '-0.01em',
            }}>
              Bénédicte Tueam.
            </h1>

            <p style={{
              color:        'rgba(255,255,255,0.75)',
              fontSize:     '1.1rem',
              lineHeight:   1.9,
              marginBottom: 48,
              maxWidth:     500,
              fontWeight:   400,
            }}>
              Fondatrice des Jus Naturels Ben's — un mélange unique de science et de tradition, né entre le Cameroun et le Québec.
            </p>

            {/* Credentials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { num: '01', label: 'Maîtrise en chimie industrielle' },
                { num: '02', label: 'Originaire du Cameroun, établie au Québec' },
                { num: '03', label: 'Lauréate Défi OSEntreprendre 2024' },
              ].map((item) => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span style={{
                    fontFamily:    FONT_HEADLINE,
                    fontSize:      '0.75rem',
                    fontWeight:    700,
                    color:         C.gold,
                    opacity:       0.7,
                    letterSpacing: '0.08em',
                    flexShrink:    0,
                    width:         28,
                  }}>
                    {item.num}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Glow circle */}
            <div style={{
              position:     'absolute',
              width:        380,
              height:       380,
              borderRadius: '50%',
              background:   `radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)`,
              top:          '50%',
              left:         '50%',
              transform:    'translate(-50%, -50%)',
            }} />
            {/* Decorative border frame */}
            <div style={{
              position:     'absolute',
              top:          -12,
              right:        -12,
              width:        '85%',
              aspectRatio:  '3/4',
              borderRadius: '2rem',
              border:       `1.5px solid ${C.gold}44`,
              zIndex:       0,
            }} />
            <img
              src={OWNER_IMG}
              alt="Bénédicte Tueam, fondatrice des Jus Naturels Ben's"
              style={{
                position:       'relative',
                zIndex:         1,
                width:          '85%',
                aspectRatio:    '3/4',
                objectFit:      'cover',
                objectPosition: 'top center',
                borderRadius:   '2rem',
                boxShadow:      '0 40px 100px rgba(0,0,0,0.5)',
                display:        'block',
              }}
            />
            {/* Floating badge — année */}
            <div style={{
              position:     'absolute',
              bottom:       28,
              left:         -16,
              background:   '#ffffff',
              borderRadius: '1rem',
              padding:      '16px 24px',
              boxShadow:    '0 12px 40px rgba(0,0,0,0.2)',
              zIndex:       2,
            }}>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, margin: '0 0 2px' }}>Fondée en</p>
              <p style={{ fontFamily: FONT_HEADLINE, fontSize: 32, fontWeight: 700, color: C.primary, margin: 0, lineHeight: 1 }}>2022</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10, color: C.onSurfaceVariant, margin: '3px 0 0' }}>Montérégie, Québec</p>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor={C.surface} />

      {/* ══════════════════════════════════════════
          2. HISTOIRE — lecture éditorial
      ══════════════════════════════════════════ */}
      <section style={{
        background: C.surface,
        padding:    '112px 32px',
      }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>

          {/* Section header — magazine style */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 48, marginBottom: 80 }}>
            <div>
              <p style={{
                fontFamily:    FONT_HEADLINE,
                fontSize:      'clamp(4rem, 8vw, 7rem)',
                fontWeight:    700,
                color:         C.surfaceContainerLow,
                lineHeight:    1,
                margin:        0,
                letterSpacing: '-0.03em',
                userSelect:    'none' as const,
              }}>01</p>
            </div>
            <div>
              <Overline>À propos de la fondatrice</Overline>
              <h2 style={{
                fontFamily:   FONT_HEADLINE,
                fontSize:     'clamp(2rem, 3.5vw, 3.2rem)',
                fontWeight:   700,
                color:        C.primary,
                margin:       '0 0 16px',
                lineHeight:   1.15,
              }}>
                Une histoire née entre deux continents
              </h2>
              <div style={{ width: 48, height: 2, background: C.gold }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 80, alignItems: 'start' }}>
            {/* Story text — editorial */}
            <div>
              <p className="drop-cap" style={{
                fontSize:     '1.12rem',
                lineHeight:   2,
                color:        C.onSurface,
                marginBottom: 28,
                fontWeight:   400,
              }}>
                Arrivée au Canada il y a une dizaine d'années, titulaire d'une maîtrise en chimie industrielle, j'ai été frappée par le contraste entre les jus de mon enfance et ceux que je trouvais ici. Les saveurs authentiques et peu sucrées me manquaient.
              </p>
              <p style={{
                fontSize:     '1.08rem',
                lineHeight:   1.95,
                color:        C.onSurfaceVariant,
                marginBottom: 28,
              }}>
                C'est alors que j'ai décidé de marier ma formation scientifique à mon héritage culturel pour créer quelque chose d'unique. Dans ma cuisine, j'ai commencé à expérimenter — utilisant mes connaissances en chimie pour comprendre et optimiser les propriétés des ingrédients naturels comme le gingembre, l'hibiscus et l'ananas. Mon objectif était de recréer ces saveurs familières tout en les adaptant à ma nouvelle vie au Canada.
              </p>
              <p style={{
                fontSize:   '1.08rem',
                lineHeight: 1.95,
                color:      C.onSurfaceVariant,
              }}>
                Ce qui a débuté comme un projet personnel s'est rapidement transformé en une véritable mission. J'ai réalisé que je pouvais non seulement satisfaire ma nostalgie, mais aussi partager ces saveurs uniques avec ma communauté, tout en promouvant une approche plus saine de la consommation de jus.
              </p>
            </div>

            {/* Pull quote — magazine style */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{
                borderLeft:  `4px solid ${C.gold}`,
                paddingLeft: 32,
                marginBottom: 40,
              }}>
                <p style={{
                  fontFamily:   FONT_HEADLINE,
                  fontSize:     '1.25rem',
                  lineHeight:   1.75,
                  color:        C.primary,
                  fontStyle:    'italic',
                  margin:       0,
                }}>
                  "Aujourd'hui, chaque bouteille est le résultat d'un savoir-faire artisanal, combinant des recettes traditionnelles et une compréhension scientifique des ingrédients."
                </p>
              </div>

              {/* Signature block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={OWNER_IMG}
                  alt="Bénédicte Tueam"
                  style={{
                    width:          56,
                    height:         56,
                    borderRadius:   '50%',
                    objectFit:      'cover',
                    objectPosition: 'top',
                    flexShrink:     0,
                    border:         `2px solid ${C.gold}55`,
                  }}
                />
                <div>
                  <p style={{ fontFamily: FONT_HEADLINE, fontWeight: 700, color: C.primary, margin: 0, fontSize: '0.95rem' }}>Bénédicte Tueam</p>
                  <p style={{ color: C.onSurfaceVariant, fontSize: '0.82rem', margin: '3px 0 0', fontStyle: 'italic' }}>Fondatrice & Directrice générale</p>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 32 }}>
                {['Gingembre', 'Hibiscus', 'Ananas', 'Baobab'].map((tag) => (
                  <span key={tag} style={{
                    background:    C.surfaceContainerLow,
                    color:         C.primary,
                    fontFamily:    FONT_BODY,
                    fontSize:      '0.78rem',
                    fontWeight:    600,
                    padding:       '6px 16px',
                    borderRadius:  9999,
                    border:        `1px solid rgba(27,77,56,0.12)`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.surface} bottomColor={C.surfaceContainerLow} />

      {/* ══════════════════════════════════════════
          3. L'ENTREPRISE
      ══════════════════════════════════════════ */}
      <section style={{
        background: C.surfaceContainerLow,
        padding:    '112px 32px',
        position:   'relative',
        overflow:   'hidden',
      }}>
        {/* Large decorative year */}
        <div style={{
          position:      'absolute',
          right:         '-2%',
          top:           '50%',
          transform:     'translateY(-50%)',
          fontFamily:    FONT_HEADLINE,
          fontSize:      'clamp(8rem, 15vw, 18rem)',
          fontWeight:    700,
          color:         'rgba(27,77,56,0.05)',
          lineHeight:    1,
          userSelect:    'none' as const,
          pointerEvents: 'none',
          letterSpacing: '-0.04em',
        }}>
          2022
        </div>

        <div style={{ maxWidth: MAX_W, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 48, marginBottom: 80 }}>
            <div>
              <p style={{
                fontFamily:    FONT_HEADLINE,
                fontSize:      'clamp(4rem, 8vw, 7rem)',
                fontWeight:    700,
                color:         C.surfaceContainer,
                lineHeight:    1,
                margin:        0,
                letterSpacing: '-0.03em',
                userSelect:    'none' as const,
              }}>02</p>
            </div>
            <div>
              <Overline>L'entreprise</Overline>
              <h2 style={{
                fontFamily: FONT_HEADLINE,
                fontSize:   'clamp(2rem, 3.5vw, 3.2rem)',
                fontWeight: 700,
                color:      C.primary,
                margin:     '0 0 16px',
                lineHeight: 1.15,
              }}>
                Présentation de l'entreprise
              </h2>
              <div style={{ width: 48, height: 2, background: C.gold }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 80 }}>
            <div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.95, color: C.onSurface, marginBottom: 24, fontWeight: 400 }}>
                Située dans la Montérégie, <strong style={{ color: C.primary }}>Les Jus Naturels Ben's</strong> est une entreprise québécoise spécialisée dans la transformation des fruits et légumes en boissons naturelles et fonctionnelles, élaborées pour préserver tous leurs nutriments essentiels et offrir un équilibre parfait entre plaisir gustatif et bien-être au quotidien.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: C.onSurfaceVariant, marginBottom: 24 }}>
                Fondée en 2022, l'entreprise se caractérise par la production de jus artisanaux qui célèbrent la diversité culturelle et la richesse des ingrédients locaux, tout en promouvant une approche durable et respectueuse de l'environnement.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: C.onSurfaceVariant }}>
                Nous croyons que la nature offre le meilleur, et c'est avec passion que nous créons des produits qui apportent à la fois plaisir et bienfaits. Chaque gorgée est une invitation à prendre soin de votre corps, tout en savourant des saveurs authentiques et uniques.
              </p>
            </div>

            {/* Gamme */}
            <div>
              <p style={{
                fontFamily:    FONT_BODY,
                fontSize:      10,
                fontWeight:    700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase' as const,
                color:         C.gold,
                marginBottom:  24,
              }}>
                Notre gamme
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { emoji: '🫐', name: 'Jus classiques', desc: 'Fraises, bleuets, ananas, gingembre-citron…' },
                  { emoji: '🌺', name: 'Mélanges exotiques', desc: 'Hibiscus-fraises, ananas-fruit de la passion…' },
                  { emoji: '🫚', name: 'Sirops artisanaux', desc: 'Gingembre-citron, hibiscus-menthe…' },
                ].map((item, i) => (
                  <div key={item.name} style={{
                    padding:        '22px 0',
                    borderBottom:   i < 2 ? `1px solid rgba(27,77,56,0.1)` : 'none',
                    display:        'flex',
                    alignItems:     'flex-start',
                    gap:            18,
                  }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: 2 }}>{item.emoji}</span>
                    <div>
                      <p style={{ fontFamily: FONT_HEADLINE, fontWeight: 700, color: C.primary, margin: '0 0 4px', fontSize: '1rem' }}>{item.name}</p>
                      <p style={{ color: C.onSurfaceVariant, fontSize: '0.85rem', margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.surfaceContainerLow} bottomColor={C.surface} />

      {/* ══════════════════════════════════════════
          4. NOS VALEURS
      ══════════════════════════════════════════ */}
      <section style={{ background: C.surface, padding: '112px 32px' }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 48, marginBottom: 80 }}>
            <div>
              <p style={{
                fontFamily:    FONT_HEADLINE,
                fontSize:      'clamp(4rem, 8vw, 7rem)',
                fontWeight:    700,
                color:         C.surfaceContainerLow,
                lineHeight:    1,
                margin:        0,
                letterSpacing: '-0.03em',
                userSelect:    'none' as const,
              }}>03</p>
            </div>
            <div>
              <Overline>Nos valeurs</Overline>
              <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: C.primary, margin: '0 0 16px', lineHeight: 1.15 }}>
                Ce en quoi nous croyons
              </h2>
              <div style={{ width: 48, height: 2, background: C.gold }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: '🌿', num: '01', title: 'Naturel', body: "Nos boissons sont exemptes d'additifs et d'agents de conservation, garantissant une pureté nutritionnelle totale.", bg: '#D1FAE5', accent: '#065F46', line: '#059669' },
              { icon: '🌍', num: '02', title: 'Authenticité', body: 'Fruits locaux de saison et ingrédients exotiques soigneusement choisis — savoureux, nutritifs, sincères.', bg: '#FEF9C3', accent: '#92400E', line: '#D97706' },
              { icon: '❤️', num: '03', title: 'Santé & bien-être', body: 'Recettes soigneusement élaborées pour soutenir une alimentation équilibrée, avec des ingrédients naturels et nutritifs.', bg: '#FCE7F3', accent: '#831843', line: '#BE185D' },
            ].map((v) => (
              <div key={v.title} style={{
                background:   v.bg,
                borderRadius: '1.5rem',
                padding:      '44px 36px',
                border:       `1px solid ${v.line}22`,
                display:      'flex',
                flexDirection: 'column',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <span style={{ fontSize: '2rem' }}>{v.icon}</span>
                  <span style={{ fontFamily: FONT_HEADLINE, fontSize: '0.75rem', fontWeight: 700, color: `${v.line}66`, letterSpacing: '0.1em' }}>{v.num}</span>
                </div>
                <div style={{ height: 2, width: 32, background: v.line, borderRadius: 9999, marginBottom: 20, opacity: 0.7 }} />
                <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.3rem', fontWeight: 700, color: v.accent, margin: '0 0 14px' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: v.accent + 'bb', margin: 0, flex: 1 }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.surface} bottomColor={C.primaryContainer} />

      {/* ══════════════════════════════════════════
          5. NOTRE VISION
      ══════════════════════════════════════════ */}
      <section style={{
        background: C.primaryContainer,
        padding:    '112px 32px',
        position:   'relative',
        overflow:   'hidden',
      }}>
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `radial-gradient(circle at 85% 15%, rgba(201,168,76,0.14) 0%, transparent 55%),
                            radial-gradient(circle at 15% 85%, rgba(255,255,255,0.03) 0%, transparent 40%)`,
          pointerEvents:   'none',
        }} />

        <div style={{ maxWidth: MAX_W, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 48, marginBottom: 80 }}>
            <div>
              <p style={{
                fontFamily:    FONT_HEADLINE,
                fontSize:      'clamp(4rem, 8vw, 7rem)',
                fontWeight:    700,
                color:         'rgba(255,255,255,0.06)',
                lineHeight:    1,
                margin:        0,
                letterSpacing: '-0.03em',
                userSelect:    'none' as const,
              }}>04</p>
            </div>
            <div>
              <Overline light>Notre vision</Overline>
              <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: '#ffffff', margin: '0 0 16px', lineHeight: 1.15 }}>
                Inspirer une nouvelle génération de consommateurs.
              </h2>
              <div style={{ width: 48, height: 2, background: C.gold }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 80, alignItems: 'center' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'rgba(255,255,255,0.72)', margin: 0 }}>
              Nous sommes des ambassadeurs culturels — nos saveurs uniques servent de pont entre différentes traditions, en favorisant le partage interculturel et la consommation responsable.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { icon: '🌱', text: 'Adopter des produits naturels et locaux pour une consommation responsable' },
                { icon: '🌍', text: "Être des ambassadeurs culturels, utiliser nos saveurs comme pont entre traditions" },
                { icon: '🎓', text: "Transmettre notre savoir-faire à travers des formations et ateliers de transformation" },
                { icon: '✨', text: "Promouvoir la mixité et l'unicité à travers une gamme reflétant la richesse culinaire mondiale" },
              ].map((item, i, arr) => (
                <div key={item.text} style={{
                  display:       'flex',
                  alignItems:    'flex-start',
                  gap:           20,
                  padding:       '22px 0',
                  borderBottom:  i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <span style={{
                    width:          40,
                    height:         40,
                    borderRadius:   '50%',
                    background:     'rgba(255,255,255,0.08)',
                    border:         '1px solid rgba(255,255,255,0.15)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '1rem',
                    flexShrink:     0,
                    marginTop:      2,
                  }}>
                    {item.icon}
                  </span>
                  <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.75, margin: '8px 0 0' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.primaryContainer} bottomColor={C.surfaceContainerLow} />

      {/* ══════════════════════════════════════════
          6. NOS RÉCOMPENSES
      ══════════════════════════════════════════ */}
      <section style={{ background: C.surfaceContainerLow, padding: '112px 32px' }}>
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 48, marginBottom: 80 }}>
            <div>
              <p style={{
                fontFamily:    FONT_HEADLINE,
                fontSize:      'clamp(4rem, 8vw, 7rem)',
                fontWeight:    700,
                color:         C.surfaceContainer,
                lineHeight:    1,
                margin:        0,
                letterSpacing: '-0.03em',
                userSelect:    'none' as const,
              }}>05</p>
            </div>
            <div>
              <Overline>Reconnaissance</Overline>
              <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: C.primary, margin: '0 0 16px', lineHeight: 1.15 }}>
                Nos Récompenses
              </h2>
              <div style={{ width: 48, height: 2, background: C.gold }} />
            </div>
          </div>

          {/* Photo + Timeline côte à côte */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>

            {/* Photo des récompenses */}
            <div style={{ position: 'relative' }}>
              <img
                src="/images-bens/recompenses/Recompenses.png"
                alt="Récompenses Les Jus Naturels Ben's — Défi OSEntreprendre et JCCCAM"
                style={{
                  width:        '100%',
                  borderRadius: '1.75rem',
                  display:      'block',
                  boxShadow:    '0 24px 64px rgba(27,77,56,0.18)',
                  border:       `1px solid rgba(27,77,56,0.08)`,
                }}
              />
              {/* Badge overlay */}
              <div style={{
                position:   'absolute',
                bottom:     24,
                left:       24,
                background: '#ffffff',
                borderRadius: '1rem',
                padding:    '12px 20px',
                boxShadow:  '0 8px 32px rgba(0,0,0,0.14)',
              }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 2px' }}>
                  Deux prix
                </p>
                <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1rem', fontWeight: 700, color: C.primary, margin: 0 }}>
                  2023 &amp; 2024
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              {/* Vertical line */}
              <div style={{
                position:     'absolute',
                left:         0,
                top:          16,
                bottom:       16,
                width:        2,
                background:   `linear-gradient(to bottom, ${C.gold}, ${C.accent})`,
                borderRadius: 9999,
              }} />

              {[
                {
                  year:  '2023',
                  icon:  '🏆',
                  color: C.gold,
                  title: 'JCCCAM — Prix Startup en Bioalimentaire',
                  body:  "Reconnue comme une start-up innovante — Production 100% jus naturels. Une première consécration de l'ambition et du savoir-faire de Ben's.",
                },
                {
                  year:  '2024',
                  icon:  '🌟',
                  color: C.accent,
                  title: 'Défi OSEntreprendre — Montérégie',
                  body:  "Lauréate du volet « Faire affaire ensemble » — récompensée pour son engagement dans l'achat local et la valorisation du terroir québécois.",
                },
              ].map((award, i, arr) => (
                <div key={award.year} style={{
                  display:      'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap:          28,
                  padding:      '40px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid rgba(27,77,56,0.1)` : 'none',
                  position:     'relative',
                }}>
                  {/* Dot */}
                  <div style={{
                    position:     'absolute',
                    left:         -39,
                    top:          48,
                    width:        14,
                    height:       14,
                    borderRadius: '50%',
                    background:   award.color,
                    boxShadow:    `0 0 0 4px ${award.color}33`,
                  }} />

                  <div>
                    <p style={{ fontFamily: FONT_HEADLINE, fontSize: '2.2rem', fontWeight: 700, color: award.color, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
                      {award.year}
                    </p>
                    <span style={{ fontSize: '1.4rem' }}>{award.icon}</span>
                  </div>

                  <div style={{ paddingTop: 4 }}>
                    <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700, color: C.primary, margin: '0 0 12px', lineHeight: 1.3 }}>
                      {award.title}
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: C.onSurfaceVariant, margin: 0 }}>
                      {award.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.surfaceContainerLow} bottomColor={C.primary} />

      {/* ══════════════════════════════════════════
          7. CTA FINAL
      ══════════════════════════════════════════ */}
      <section style={{
        background: C.primary,
        padding:    '112px 32px',
        textAlign:  'center',
        position:   'relative',
        overflow:   'hidden',
      }}>
        <div style={{
          position:  'absolute',
          inset:     0,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.12) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily:    FONT_BODY,
            fontSize:      11,
            fontWeight:    700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color:         C.gold,
            marginBottom:  24,
          }}>
            ✦ La collection
          </p>
          <h2 style={{
            fontFamily:   FONT_HEADLINE,
            fontSize:     'clamp(2.4rem, 4vw, 3.8rem)',
            fontWeight:   700,
            color:        '#ffffff',
            margin:       '0 0 20px',
            lineHeight:   1.1,
          }}>
            Goûtez l'histoire.
          </h2>
          <p style={{
            color:        'rgba(255,255,255,0.65)',
            fontSize:     '1.05rem',
            lineHeight:   1.85,
            marginBottom: 48,
          }}>
            Chaque bouteille raconte un voyage — des ingrédients soigneusement sélectionnés, une extraction artisanale, 100% naturel.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate(ROUTES.products)}
              style={{
                background:    C.gold,
                color:         C.primary,
                fontFamily:    FONT_BODY,
                fontWeight:    700,
                fontSize:      '1rem',
                borderRadius:  9999,
                padding:       '17px 44px',
                border:        'none',
                cursor:        'pointer',
                transition:    'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 10px 32px rgba(201,168,76,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Explorer la collection
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.contact)}
              style={{
                background:   'transparent',
                color:        'rgba(255,255,255,0.85)',
                fontFamily:   FONT_BODY,
                fontWeight:   600,
                fontSize:     '1rem',
                borderRadius: 9999,
                padding:      '17px 44px',
                border:       '1.5px solid rgba(255,255,255,0.3)',
                cursor:       'pointer',
                transition:   'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
              }}
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor="#032416" />
    </div>
  );
}
