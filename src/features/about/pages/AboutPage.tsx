import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
const MAX_W = 1440;
const SECTION_PY = 128;
const SECTION_PX = 32;

const C = {
  primary: '#032416',
  primaryContainer: '#1a3a2a',
  secondary: '#7b5804',
  secondaryContainer: '#fdcd74',
  secondaryFixed: '#ffdea6',
  surface: '#fef9ef',
  surfaceContainer: '#f2ede3',
  surfaceContainerLow: '#f8f3e9',
  surfaceContainerHighest: '#e7e2d8',
  onSurface: '#1d1c16',
  onSurfaceVariant: '#424843',
  onTertiaryContainer: '#f37b32',
};

const IMG = '/images-bens/photos/photo-jus.png';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, color: C.onSurface }}>
      <SEO
        title={"Notre Histoire"}
        description={"Découvrez l'histoire de Ben\u2019s\u00a0: une femme, un héritage africain et une passion pour les jus naturels fabriqués à Montréal."}
        url={"https://lesjusnatuelsbens.com/notre-histoire"}
      />

      {/* ── 1. HERO ── */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
          display: 'grid',
          gridTemplateColumns: '7fr 5fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Left */}
        <div>
          <span
            style={{
              display: 'inline-block',
              background: C.secondaryFixed,
              color: C.secondary,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: 9999,
              padding: '6px 18px',
              marginBottom: 24,
            }}
          >
            {"Dakar à Montréal"}
          </span>

          <h1
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(2.5rem, 4vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.primary,
              margin: '0 0 16px 0',
            }}
          >
            {"Un Voyage entre Deux Mondes,"}
            <br />
            <span
              style={{
                fontStyle: 'italic',
                color: C.onSurfaceVariant,
              }}
            >
              {"Une Essence Naturelle"}
            </span>
          </h1>

          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 17,
              lineHeight: 1.75,
              color: C.onSurfaceVariant,
              maxWidth: 520,
              margin: 0,
            }}
          >
            {"Née des marchés ensoleillés de Dakar et affinée dans les cuisines de Montréal, chaque bouteille raconte un voyage. Des ingrédients sélectionnés à la source, une extraction lente, une sincérité sans compromis."}
          </p>
        </div>

        {/* Right */}
        <div style={{ position: 'relative' }}>
          {/* Decorative offset background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'translate(16px, 16px)',
              borderRadius: '40% 10% 40% 10%',
              background: C.secondaryFixed,
              zIndex: 0,
            }}
          />
          <img
            src={IMG}
            alt={"Jus naturels Ben's"}
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              aspectRatio: '4 / 5',
              objectFit: 'cover',
              borderRadius: '40% 10% 40% 10%',
              display: 'block',
            }}
          />
        </div>
      </section>

      {/* ── 2. OUR HERITAGE ── */}
      <section
        style={{
          background: C.surfaceContainerLow,
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
        }}
      >
        <div
          style={{
            maxWidth: MAX_W,
            margin: '0 auto',
            display: 'flex',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Image left */}
          <div style={{ flex: '0 0 45%', position: 'relative' }}>
            <img
              src={IMG}
              alt={"Héritage africain"}
              style={{
                width: '100%',
                aspectRatio: '3 / 4',
                objectFit: 'cover',
                borderRadius: 24,
                display: 'block',
              }}
            />
            {/* Floating card overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                right: -24,
                background: C.surface,
                borderRadius: 16,
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(3,36,22,0.18)',
                minWidth: 180,
              }}
            >
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: C.onTertiaryContainer,
                  margin: '0 0 4px 0',
                }}
              >
                {"Origines"}
              </p>
              <p
                style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.primary,
                  margin: 0,
                }}
              >
                {"Les Racines de Dakar"}
              </p>
            </div>
          </div>

          {/* Text right */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 'clamp(1.8rem, 2.5vw, 2.8rem)',
                fontWeight: 700,
                color: C.primary,
                margin: '0 0 24px 0',
              }}
            >
              {"Notre Héritage"}
            </h2>

            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 16,
                lineHeight: 1.8,
                color: C.onSurfaceVariant,
                margin: '0 0 18px 0',
              }}
            >
              {"Depuis des générations, les familles d'Afrique de l'Ouest préparent des infusions et des jus à partir de plantes rares\u00a0: l'hibiscus séché au soleil, la pulpe de baobab crémeuse, le gingembre ardent. Ces savoirs sont transmis par gestes, par odeurs, par amour."}
            </p>

            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 16,
                lineHeight: 1.8,
                color: C.onSurfaceVariant,
                margin: '0 0 32px 0',
              }}
            >
              {"Ben\u2019s est né du désir de porter ces traditions à Montréal sans les trahir \u2014 en sourcant directement auprès des producteurs sénégalais et en extrayant lentement chaque saveur pour préserver l\u2019intégrité des ingrédients."}
            </p>

            {/* Tag pills */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Hibiscus', 'Baobab', 'Gingembre'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: C.secondaryContainer,
                    color: C.secondary,
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    fontSize: 14,
                    borderRadius: 9999,
                    padding: '8px 24px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THE PROCESS (Bento Grid) ── */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span
            style={{
              display: 'inline-block',
              background: C.secondaryFixed,
              color: C.secondary,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: 9999,
              padding: '6px 18px',
              marginBottom: 20,
            }}
          >
            {"Artisanat"}
          </span>
          <h2
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(1.8rem, 2.5vw, 2.8rem)',
              fontWeight: 700,
              color: C.primary,
              margin: 0,
            }}
          >
            {"L\u2019Art de l\u2019Extraction Lente"}
          </h2>
        </div>

        {/* 4-col 2-row bento grid, 800px tall */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: '1fr 1fr',
            gap: 16,
            height: 800,
          }}
        >
          {/* Card 1: col-span-2 row-span-2 */}
          <div
            style={{
              gridColumn: 'span 2',
              gridRow: 'span 2',
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              background: C.primaryContainer,
            }}
          >
            <img
              src={IMG}
              alt={"Petites Batches"}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(3,36,22,0.85) 40%, rgba(3,36,22,0.15) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 36,
                left: 36,
                right: 36,
              }}
            >
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: C.secondaryFixed,
                  margin: '0 0 8px 0',
                }}
              >
                {"01"}
              </p>
              <h3
                style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {"Petites Batches"}
                <br />
                {"Intégrité"}
              </h3>
            </div>
          </div>

          {/* Card 2: small, surfaceContainerHighest */}
          <div
            style={{
              gridColumn: 'span 1',
              gridRow: 'span 1',
              borderRadius: 20,
              background: C.surfaceContainerHighest,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.onTertiaryContainer,
                margin: '0 0 8px 0',
              }}
            >
              {"02"}
            </p>
            <h3
              style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 20,
                fontWeight: 700,
                color: C.primary,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {"Triple Infusion"}
            </h3>
          </div>

          {/* Card 3: dark green, primaryContainer */}
          <div
            style={{
              gridColumn: 'span 1',
              gridRow: 'span 1',
              borderRadius: 20,
              background: C.primaryContainer,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.secondaryFixed,
                margin: '0 0 8px 0',
              }}
            >
              {"03"}
            </p>
            <h3
              style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 20,
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {"Pressage à Froid"}
            </h3>
          </div>

          {/* Card 4: col-span-2 with dark accent on right */}
          <div
            style={{
              gridColumn: 'span 2',
              gridRow: 'span 1',
              borderRadius: 20,
              background: C.surfaceContainer,
              padding: 28,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: C.onTertiaryContainer,
                  margin: '0 0 8px 0',
                }}
              >
                {"04"}
              </p>
              <h3
                style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.primary,
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {"L\u2019Alchimie Montréalaise"}
              </h3>
            </div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: C.primaryContainer,
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      </section>

      {/* ── 4. SOURCING ETHICS ── */}
      <section
        style={{
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
          background: C.surfaceContainerLow,
        }}
      >
        <div
          style={{
            maxWidth: MAX_W,
            margin: '0 auto',
            borderRadius: '3rem',
            background: C.primaryContainer,
            backgroundImage: 'linear-gradient(135deg, rgba(253,205,116,0.12) 0%, transparent 60%)',
            padding: '72px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Text left */}
          <div>
            <h2
              style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 'clamp(1.8rem, 2.5vw, 2.8rem)',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 36px 0',
              }}
            >
              {"Éthique de Sourcing"}
            </h2>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                '100\u00a0% Traçable',
                'Sans Pesticides',
                'Logistique Zéro Plastique',
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    fontFamily: FONT_BODY,
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 9999,
                      background: C.secondaryContainer,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 14,
                      color: C.secondary,
                      fontWeight: 700,
                    }}
                  >
                    {"✓"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image right: tall rounded pill */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 280,
                height: 420,
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <img
                src={IMG}
                alt={"Sourcing éthique"}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FINAL CTA ── */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `${SECTION_PY}px ${SECTION_PX}px`,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(2rem, 3vw, 3.5rem)',
            fontWeight: 700,
            color: C.primary,
            margin: '0 0 40px 0',
          }}
        >
          {"Goûtez l\u2019Histoire."}
        </h2>

        <button
          onClick={() => navigate(ROUTES.products)}
          style={{
            display: 'inline-block',
            background: C.primary,
            color: '#ffffff',
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 9999,
            padding: '18px 48px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.03em',
          }}
        >
          {"Explorer la Collection"}
        </button>
      </section>
    </div>
  );
}
