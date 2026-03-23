import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { ProductImg } from '@/shared/ui/ProductImg';

// ── Design tokens ─────────────────────────────────────────────
const C = {
  primary:               '#032416',
  primaryContainer:      '#1a3a2a',
  secondary:             '#7b5804',
  secondaryContainer:    '#fdcd74',
  secondaryFixed:        '#ffdea6',
  surface:               '#fef9ef',
  surfaceContainer:      '#f2ede3',
  surfaceContainerLow:   '#f8f3e9',
  surfaceContainerHigh:  '#ece8de',
  onSurface:             '#1d1c16',
  onSurfaceVariant:      '#424843',
  onTertiaryContainer:   '#f37b32',
  outlineVariant:        '#c1c8c2',
} as const;

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1440;

// ── Static filter data ─────────────────────────────────────────
const COLLECTIONS = ['Botanique', 'Tropical', 'Racines'] as const;
type Collection   = typeof COLLECTIONS[number];

const BIENFAITS = ['Énergie', 'Détox', 'Immunité', 'Focus'] as const;
type Bienfait   = typeof BIENFAITS[number];

// ── Helpers ────────────────────────────────────────────────────
function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + ' $';
}

// ── Component ──────────────────────────────────────────────────
export default function ProductsPage() {
  const { products } = useData();
  const navigate     = useNavigate();

  // Filter state
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedBenefits,   setSelectedBenefits]   = useState<Bienfait[]>([]);
  const [search,             setSearch]             = useState('');

  const available = useMemo(
    () => products.filter((p) => p.available),
    [products],
  );

  const filtered = useMemo(() => {
    let list = available;
    if (selectedCollection) {
      list = list.filter((p) =>
        p.category.toLowerCase().includes(selectedCollection.toLowerCase()),
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [available, selectedCollection, search]);

  function toggleBenefit(b: Bienfait) {
    setSelectedBenefits((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
    );
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        background: C.surface,
        minHeight:  '100vh',
        color:      C.onSurface,
      }}
    >
      <SEO
        title="La Collection Botanique"
        description={
          'Découvrez nos élixirs artisanaux — des jus naturels inspirés des traditions africaines, conçus ' +
          'à Montréal pour votre bien-être quotidien.'
        }
        url="https://lesjusnatuelsbens.com/nos-produits"
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          background:   C.primaryContainer,
          padding:      '72px 24px 64px',
          textAlign:    'center',
        }}
      >
        <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
          <span
            style={{
              display:        'inline-block',
              background:     C.onTertiaryContainer,
              color:          '#fff',
              fontSize:       '0.75rem',
              fontWeight:     700,
              letterSpacing:  '0.1em',
              textTransform:  'uppercase',
              borderRadius:   '999px',
              padding:        '6px 18px',
              marginBottom:   '20px',
            }}
          >
            {"La Collection Botanique"}
          </span>

          <h1
            style={{
              fontFamily:   FONT_HEADLINE,
              fontSize:     'clamp(2.5rem, 6vw, 4rem)',
              fontWeight:   700,
              color:        C.secondaryFixed,
              lineHeight:   1.15,
              margin:       '0 0 20px',
            }}
          >
            <em style={{ fontStyle: 'italic' }}>{"Élixirs"}</em>
            {" Artisanaux"}
          </h1>

          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize:   '1.1rem',
              color:      C.secondaryContainer,
              maxWidth:   560,
              margin:     '0 auto',
              lineHeight: 1.7,
            }}
          >
            {"Des saveurs authentiques, extraites d\u2019ingrédients soigneusement sélectionnés " +
             "pour nourrir le corps et l\u2019âme."}
          </p>
        </div>
      </section>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div
        style={{
          maxWidth:   MAX_W,
          margin:     '0 auto',
          padding:    '48px 24px',
          display:    'flex',
          gap:        '3rem',
          alignItems: 'flex-start',
        }}
      >
        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <aside style={{ width: 256, flexShrink: 0 }}>

          {/* Search */}
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder={"Rechercher un élixir\u2026"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width:        '100%',
                padding:      '10px 16px',
                borderRadius: '999px',
                border:       `1.5px solid ${C.outlineVariant}`,
                background:   C.surfaceContainerLow,
                color:        C.onSurface,
                fontFamily:   FONT_BODY,
                fontSize:     '0.875rem',
                outline:      'none',
                boxSizing:    'border-box',
              }}
            />
          </div>

          {/* Collection */}
          <div style={{ marginBottom: '2rem' }}>
            <p
              style={{
                fontFamily:    FONT_HEADLINE,
                fontWeight:    700,
                fontSize:      '1rem',
                color:         C.primary,
                marginBottom:  '12px',
                letterSpacing: '0.03em',
              }}
            >
              {"Collection"}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {COLLECTIONS.map((col) => {
                const active = selectedCollection === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() =>
                      setSelectedCollection(active ? null : col)
                    }
                    style={{
                      display:      'flex',
                      alignItems:   'center',
                      gap:          '10px',
                      background:   'none',
                      border:       'none',
                      cursor:       'pointer',
                      padding:      0,
                      fontFamily:   FONT_BODY,
                      fontSize:     '0.9rem',
                      color:        active ? C.primary : C.onSurfaceVariant,
                      fontWeight:   active ? 700 : 400,
                    }}
                  >
                    <span
                      style={{
                        width:        20,
                        height:       20,
                        borderRadius: '50%',
                        border:       `2px solid ${active ? C.primary : C.outlineVariant}`,
                        background:   active ? C.primary : 'transparent',
                        flexShrink:   0,
                        display:      'flex',
                        alignItems:   'center',
                        justifyContent: 'center',
                      }}
                    >
                      {active && (
                        <span
                          style={{
                            width:        8,
                            height:       8,
                            borderRadius: '50%',
                            background:   '#fff',
                          }}
                        />
                      )}
                    </span>
                    {col}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bienfaits */}
          <div style={{ marginBottom: '2rem' }}>
            <p
              style={{
                fontFamily:    FONT_HEADLINE,
                fontWeight:    700,
                fontSize:      '1rem',
                color:         C.primary,
                marginBottom:  '12px',
                letterSpacing: '0.03em',
              }}
            >
              {"Bienfaits"}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BIENFAITS.map((b) => {
                const active = selectedBenefits.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBenefit(b)}
                    style={{
                      padding:      '6px 16px',
                      borderRadius: '999px',
                      border:       'none',
                      cursor:       'pointer',
                      fontFamily:   FONT_BODY,
                      fontSize:     '0.8rem',
                      fontWeight:   active ? 700 : 500,
                      background:   active ? C.primaryContainer : C.surfaceContainerHigh,
                      color:        active ? '#fff' : C.onSurfaceVariant,
                      transition:   'background 0.2s, color 0.2s',
                    }}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coffret Artisan promo card */}
          <div
            style={{
              background:   C.primaryContainer,
              borderRadius: '2rem',
              padding:      '2rem',
            }}
          >
            <h4
              style={{
                fontFamily:   FONT_HEADLINE,
                fontSize:     '1.15rem',
                fontWeight:   700,
                color:        C.secondaryFixed,
                margin:       '0 0 10px',
              }}
            >
              {"Coffret Artisan"}
            </h4>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize:   '0.85rem',
                color:      C.secondaryContainer,
                lineHeight: 1.6,
                margin:     '0 0 20px',
              }}
            >
              {"Découvrez notre sélection exclusive d'élixirs artisanaux en coffret cadeau."}
            </p>
            <button
              type="button"
              style={{
                background:   C.secondaryContainer,
                color:        C.primary,
                border:       'none',
                borderRadius: '999px',
                padding:      '10px 22px',
                fontFamily:   FONT_BODY,
                fontWeight:   700,
                fontSize:     '0.875rem',
                cursor:       'pointer',
              }}
            >
              {"Découvrir"}
            </button>
          </div>
        </aside>

        {/* ── PRODUCT GRID ─────────────────────────────────────── */}
        <div
          style={{
            flex:                1,
            display:             'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap:                 '2rem',
          }}
        >
          {filtered.length === 0 && (
            <p
              style={{
                gridColumn: '1 / -1',
                textAlign:  'center',
                color:      C.onSurfaceVariant,
                fontFamily: FONT_BODY,
                padding:    '3rem 0',
              }}
            >
              {"Aucun élixir trouvé pour ces filtres."}
            </p>
          )}

          {filtered.map((p) => {
            const isBestseller = p.tag?.toLowerCase().includes('best');
            const isLimited    = p.tag?.toLowerCase().includes('limit');

            return (
              <article
                key={p.id}
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  background:     C.surfaceContainerLow,
                  borderRadius:   '2rem',
                  overflow:       'hidden',
                }}
              >
                {/* Image container */}
                <div
                  style={{
                    position:     'relative',
                    aspectRatio:  '4 / 5',
                    overflow:     'hidden',
                    background:   C.surfaceContainerHigh,
                    cursor:       'pointer',
                  }}
                  onClick={() => navigate(ROUTES.product(p.id))}
                >
                  <div
                    style={{
                      width:      '100%',
                      height:     '100%',
                      transition: 'transform 0.35s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                    }}
                  >
                    <ProductImg
                      src={p.img}
                      alt={p.name}
                      size={320}
                      style={{
                        width:        '100%',
                        height:       '100%',
                        objectFit:    'cover',
                        borderRadius: 0,
                      }}
                    />
                  </div>

                  {/* Badge */}
                  {(isBestseller || isLimited || p.tag) && (
                    <span
                      style={{
                        position:     'absolute',
                        top:          16,
                        left:         16,
                        background:   isBestseller
                          ? `${C.primary}e6`
                          : `${C.secondaryContainer}e6`,
                        color:        isBestseller ? '#fff' : C.primary,
                        fontSize:     '0.7rem',
                        fontWeight:   700,
                        letterSpacing:'0.08em',
                        textTransform:'uppercase',
                        borderRadius: '999px',
                        padding:      '5px 14px',
                        fontFamily:   FONT_BODY,
                      }}
                    >
                      {isBestseller
                        ? 'Bestseller'
                        : isLimited
                          ? 'Limited Release'
                          : p.tag}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Name + category */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h2
                      style={{
                        fontFamily: FONT_HEADLINE,
                        fontSize:   '1.5rem',
                        fontWeight: 700,
                        color:      C.primary,
                        margin:     '0 0 6px',
                        lineHeight: 1.2,
                        cursor:     'pointer',
                      }}
                      onClick={() => navigate(ROUTES.product(p.id))}
                    >
                      {p.name}
                    </h2>
                    <span
                      style={{
                        fontSize:      '0.7rem',
                        fontWeight:    700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color:         C.onTertiaryContainer,
                        fontFamily:    FONT_BODY,
                      }}
                    >
                      {p.category}
                    </span>
                  </div>

                  {/* Price */}
                  <p
                    style={{
                      fontFamily: FONT_HEADLINE,
                      fontSize:   '1.25rem',
                      fontWeight: 700,
                      color:      C.primary,
                      margin:     '0 0 10px',
                    }}
                  >
                    {formatPrice(p.price)}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize:   '0.875rem',
                      color:      C.onSurfaceVariant,
                      lineHeight: 1.65,
                      margin:     '0 0 1.5rem',
                      flex:       1,
                    }}
                  >
                    {p.desc}
                  </p>

                  {/* CTA buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.product(p.id))}
                      style={{
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        gap:            '8px',
                        background:     C.primaryContainer,
                        color:          '#fff',
                        border:         'none',
                        borderRadius:   '999px',
                        width:          '100%',
                        padding:        '1rem 1.5rem',
                        fontFamily:     FONT_BODY,
                        fontWeight:     700,
                        fontSize:       '0.9rem',
                        cursor:         'pointer',
                        transition:     'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                      }}
                    >
                      {"Ajouter au Panier"}
                      <span style={{ fontSize: '1.1rem' }}>{"→"}</span>
                    </button>

                    <button
                      type="button"
                      style={{
                        background:   'transparent',
                        color:        C.primary,
                        border:       `2px solid ${C.outlineVariant}4d`,
                        borderRadius: '999px',
                        padding:      '0.75rem 1.5rem',
                        fontFamily:   FONT_BODY,
                        fontWeight:   600,
                        fontSize:     '0.8rem',
                        cursor:       'pointer',
                        transition:   'border-color 0.2s',
                        width:        '100%',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = C.outlineVariant;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = `${C.outlineVariant}4d`;
                      }}
                    >
                      {"S\u2019abonner \u0026 Économiser 15\u00a0%"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
