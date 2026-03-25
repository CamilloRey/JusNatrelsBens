import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { useCart } from '@/features/shop/context/CartContext';
import { useToast } from '@/features/shop/context/ToastContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { ProductImg } from '@/shared/ui/ProductImg';

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
  gold:                '#C9A84C',
  accent:              '#E07A20',
};

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1280;

const CATS = [
  { id: 'all',     label: 'Tout voir', icon: '✦' },
  { id: 'Jus',     label: 'Jus',       icon: '🍹' },
  { id: 'Tisanes', label: 'Tisanes',    icon: '🌿' },
  { id: 'Sirops',  label: 'Sirops',     icon: '🍯' },
  { id: 'Poudres', label: 'Poudres',    icon: '✨' },
] as const;

const TAGS = ['Pressé à froid', '100% Naturel', 'Bio', 'Boost Immunité', 'Sans sucre ajouté'];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Pressé à froid':   { bg: '#FEF9C3', text: '#92400E' },
  '100% Naturel':     { bg: '#D1FAE5', text: '#065F46' },
  'Bio':              { bg: '#D1FAE5', text: '#065F46' },
  'Boost Immunité':   { bg: '#FED7AA', text: '#7C2D12' },
  'Sans sucre ajouté': { bg: '#FCE7F3', text: '#831843' },
};

function WaveDivider({ topColor, bottomColor }: { topColor: string; bottomColor: string }) {
  return (
    <div style={{ display: 'block', lineHeight: 0, background: bottomColor }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: 80, display: 'block' }}>
        <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z" fill={topColor} />
      </svg>
    </div>
  );
}

export default function ProductsPage() {
const { products }    = useData();
const navigate        = useNavigate();
const { addItem }     = useCart();
const { addToast }    = useToast();
const [activeCat, setActiveCat] = useState<string>('all');
const [activeTag, setActiveTag] = useState<string>('');

  const available = useMemo(() => products.filter((p) => p.available), [products]);

  const filtered = useMemo(() => {
    let list = available;
    if (activeCat !== 'all') list = list.filter((p) => p.category === activeCat);
    if (activeTag)           list = list.filter((p) => p.tag === activeTag);
    return list;
  }, [available, activeCat, activeTag]);

  const countByCat = useMemo(() => {
    const counts: Record<string, number> = { all: available.length };
    for (const cat of CATS.slice(1)) {
      counts[cat.id] = available.filter((p) => p.category === cat.id).length;
    }
    return counts;
  }, [available]);

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, color: C.onSurface, minHeight: '100vh' }}>
      <SEO
        title="Nos Produits"
        description="Jus pressés à froid, tisanes, sirops et poudres artisanaux — nés entre l'Afrique et le Québec."
        url="https://lesjusnaturelsbens.com/nos-produits"
      />

      {/* ═══════ HERO ═══════ */}
      <section style={{
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryContainer} 100%)`,
        padding:    '88px 32px 72px',
        textAlign:  'center',
        position:   'relative',
        overflow:   'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% -20%, rgba(201,168,76,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase' as const,
            color: C.gold, marginBottom: 20,
          }}>
            ✦ Artisanal &amp; Biologique
          </p>
          <h1 style={{
            fontFamily: FONT_HEADLINE,
            fontSize:   'clamp(2.6rem, 5vw, 4rem)',
            fontWeight: 700, color: '#ffffff',
            margin: '0 0 20px', lineHeight: 1.1,
          }}>
            Nos Produits
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.72)', fontSize: '1.05rem',
            lineHeight: 1.8, margin: 0,
          }}>
            20+ produits artisanaux inspirés des traditions africaines. Pressés à froid, sans sucre ajouté — chaque gorgée est une invitation à prendre soin de vous.
          </p>
        </div>
      </section>

      <WaveDivider topColor={C.primaryContainer} bottomColor={C.surface} />

      {/* ═══════ SIDEBAR + GRID ═══════ */}
      <div style={{
        maxWidth: MAX_W,
        margin:   '0 auto',
        padding:  '0 32px 80px',
        display:  'grid',
        gridTemplateColumns: '260px 1fr',
        gap:      48,
        alignItems: 'start',
      }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          position:    'sticky',
          top:         90,
          background:  '#ffffff',
          borderRadius: '1.5rem',
          padding:     '32px 24px',
          boxShadow:   '0 4px 24px rgba(27,77,56,0.08)',
          border:      `1px solid rgba(27,77,56,0.07)`,
        }}>
          {/* Brand mark */}
          <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid rgba(27,77,56,0.08)` }}>
            <p style={{
              fontFamily: FONT_HEADLINE, fontWeight: 700, fontSize: '1rem',
              color: C.primary, margin: '0 0 4px',
            }}>
              Les Jus Ben's
            </p>
            <p style={{ color: C.onSurfaceVariant, fontSize: '0.8rem', margin: 0 }}>
              {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Categories */}
          <p style={{
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            color: C.gold, margin: '0 0 12px',
          }}>
            Catégorie
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
            {CATS.map((cat) => {
              const active = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'space-between',
                    gap:          8,
                    padding:      '10px 14px',
                    borderRadius: '0.75rem',
                    border:       'none',
                    background:   active ? C.primary : 'transparent',
                    color:        active ? '#ffffff' : C.onSurfaceVariant,
                    fontFamily:   FONT_BODY,
                    fontWeight:   active ? 700 : 500,
                    fontSize:     '0.9rem',
                    cursor:       'pointer',
                    textAlign:    'left' as const,
                    transition:   'background 0.18s',
                  }}
                >
                  <span>{cat.icon} {cat.label}</span>
                  <span style={{
                    fontSize:   '0.72rem',
                    fontWeight: 700,
                    background: active ? 'rgba(255,255,255,0.18)' : C.surfaceContainerLow,
                    color:      active ? '#ffffff' : C.onSurfaceVariant,
                    borderRadius: 9999,
                    padding:    '2px 8px',
                  }}>
                    {countByCat[cat.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tag filters */}
          <div style={{ paddingTop: 20, borderTop: `1px solid rgba(27,77,56,0.08)` }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase' as const,
              color: C.gold, margin: '0 0 12px',
            }}>
              Caractéristiques
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TAGS.map((tag) => {
                const active  = activeTag === tag;
                const colors  = TAG_COLORS[tag] ?? { bg: C.surfaceContainerLow, text: C.onSurfaceVariant };
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(active ? '' : tag)}
                    style={{
                      padding:      '8px 14px',
                      borderRadius: '0.75rem',
                      border:       active ? `1.5px solid ${colors.text}` : `1.5px solid transparent`,
                      background:   active ? colors.bg : C.surfaceContainerLow,
                      color:        colors.text,
                      fontFamily:   FONT_BODY,
                      fontWeight:   active ? 700 : 500,
                      fontSize:     '0.82rem',
                      cursor:       'pointer',
                      textAlign:    'left' as const,
                      transition:   'all 0.18s',
                    }}
                  >
                    {active ? '✓ ' : ''}{tag}
                  </button>
                );
              })}
            </div>

            {/* Reset */}
            {(activeCat !== 'all' || activeTag) && (
              <button
                type="button"
                onClick={() => { setActiveCat('all'); setActiveTag(''); }}
                style={{
                  marginTop:    16,
                  width:        '100%',
                  padding:      '9px',
                  borderRadius: '0.75rem',
                  border:       `1px solid rgba(27,77,56,0.2)`,
                  background:   'transparent',
                  color:        C.primary,
                  fontFamily:   FONT_BODY,
                  fontWeight:   600,
                  fontSize:     '0.82rem',
                  cursor:       'pointer',
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </aside>

        {/* ── GRID ── */}
        <main>
          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 0 24px' }}>
            <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.4rem', fontWeight: 700, color: C.primary, margin: 0 }}>
              {activeCat === 'all' ? 'Toute la collection' : CATS.find(c => c.id === activeCat)?.label}
              {activeTag && <span style={{ color: C.onSurfaceVariant, fontStyle: 'italic', fontWeight: 400, fontSize: '1.1rem' }}> — {activeTag}</span>}
            </h2>
            <span style={{ color: C.onSurfaceVariant, fontSize: '0.85rem' }}>
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: C.onSurfaceVariant }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.surfaceContainerLow}, ${C.surfaceContainer})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', margin: '0 auto 20px',
              }}>
                🌿
              </div>
              <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.3rem', color: C.primary, marginBottom: 8 }}>Aucun produit trouvé</p>
              <p style={{ fontSize: '0.95rem' }}>Essayez d'autres filtres pour découvrir nos créations</p>
            </div>
          ) : (
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap:                 24,
            }}>
              {filtered.map((p) => {
                const badge = TAG_COLORS[p.tag] ?? { bg: C.surfaceContainerLow, text: C.onSurfaceVariant };
                const catColors: Record<string, { bg: string; accent: string }> = {
                  'Jus':      { bg: '#D1FAE5', accent: '#065F46' },
                  'Tisanes':  { bg: '#FEF9C3', accent: '#92400E' },
                  'Sirops':   { bg: '#FCE7F3', accent: '#831843' },
                  'Poudres':  { bg: '#FED7AA', accent: '#7C2D12' },
                };
                const catTheme = catColors[p.category] ?? { bg: C.surfaceContainerLow, accent: C.primary };
                return (
                  <article
                    key={p.id}
                    onClick={() => navigate(ROUTES.product(p.id))}
                    style={{
                      background:   '#ffffff',
                      borderRadius: '1.5rem',
                      overflow:     'hidden',
                      cursor:       'pointer',
                      display:      'flex',
                      flexDirection: 'column',
                      border:       `1px solid rgba(27,77,56,0.06)`,
                      transition:   'transform 0.3s, box-shadow 0.3s',
                      boxShadow:    '0 2px 16px rgba(27,77,56,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 20px 48px rgba(27,77,56,0.14)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 16px rgba(27,77,56,0.05)';
                    }}
                  >
                    {/* Image with colored background */}
                    <div style={{
                      aspectRatio: '1/1',
                      overflow: 'hidden',
                      position: 'relative',
                      background: `linear-gradient(135deg, ${catTheme.bg}80, ${catTheme.bg})`,
                      borderRadius: '1.25rem',
                      margin: 12,
                    }}>
                      <ProductImg
                        src={p.img}
                        alt={p.name}
                        size={400}
                        borderRadius={0}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      />
                      {/* Tag badge */}
                      {p.tag && (
                        <span style={{
                          position:      'absolute', top: 14, left: 14,
                          background:    badge.bg, color: badge.text,
                          fontSize:      10, fontWeight: 700,
                          textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                          padding:       '6px 14px', borderRadius: 9999,
                          boxShadow:     '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                          {p.tag}
                        </span>
                      )}
                      {/* Quick view button on hover */}
                      <div style={{
                        position: 'absolute', bottom: 14, right: 14,
                        opacity: 0, transition: 'opacity 0.25s',
                      }} className="quick-view">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); navigate(ROUTES.product(p.id)); }}
                          style={{
                            padding: '10px 18px',
                            borderRadius: 9999,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            color: C.primary,
                            border: 'none',
                            fontFamily: FONT_BODY,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                          }}
                        >
                          Voir détails →
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '8px 20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Category pill */}
                      <span style={{
                        display: 'inline-block', width: 'fit-content',
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const,
                        letterSpacing: '0.12em', color: catTheme.accent,
                        background: `${catTheme.accent}12`,
                        padding: '4px 10px', borderRadius: 9999,
                        marginBottom: 10,
                      }}>
                        {p.category}
                      </span>
                      <h3 style={{
                        fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700,
                        color: C.primary, margin: '0 0 8px', lineHeight: 1.3,
                      }}>
                        {p.name}
                      </h3>
                      {/* Characteristics badges */}
                      {p.characteristics && p.characteristics.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {p.characteristics.slice(0, 2).map((ch) => (
                            <span key={ch} style={{
                              fontSize: '0.68rem', color: C.onSurfaceVariant,
                              background: C.surfaceContainerLow,
                              padding: '3px 8px', borderRadius: 6,
                            }}>
                              {ch}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8 }}>
                        <span style={{ fontFamily: FONT_HEADLINE, fontSize: '1.2rem', fontWeight: 700, color: C.gold }}>
                          {p.price.toFixed(2).replace('.', ',')} <span style={{ fontSize: '0.9rem' }}>$</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            addItem({
                              id:        `${p.id}-1`,
                              productId: p.id,
                              name:      p.name,
                              price:     Math.round(p.price * 100),
                              quantity:  1,
                              format:    p.formats[0] || '1L',
                              img:       p.img,
                            });
                            addToast(`${p.name} ajouté au panier`);
                          }}
                          style={{
                            width: 42, height: 42, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                            color: '#ffffff',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s', flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(27,77,56,0.2)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(27,77,56,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(27,77,56,0.2)';
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
          )}
        </main>
      </div>

      <WaveDivider topColor={C.surface} bottomColor={C.primary} />

      {/* ═══════ CTA ═══════ */}
      <section style={{ background: C.primary, padding: '72px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <p style={{ color: C.gold, fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
            ✦ Commande personnalisée
          </p>
          <h2 style={{ fontFamily: FONT_HEADLINE, color: '#ffffff', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, marginBottom: 16 }}>
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36 }}>
            Contactez-nous pour une commande sur mesure — mélanges personnalisés, coffrets cadeaux ou grandes quantités.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.contact)}
            style={{
              background: C.gold, color: C.primary, fontFamily: FONT_BODY,
              fontWeight: 700, fontSize: '1rem', padding: '16px 44px',
              borderRadius: 9999, border: 'none', cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
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
            Nous contacter
          </button>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor="#032416" />
    </div>
  );
}
