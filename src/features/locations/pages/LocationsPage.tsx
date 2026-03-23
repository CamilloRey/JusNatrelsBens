import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';

/* ── Color tokens ── */
const C = {
  primary: '#032416',
  primaryContainer: '#1a3a2a',
  secondary: '#7b5804',
  secondaryContainer: '#fdcd74',
  surface: '#fef9ef',
  surfaceContainer: '#f2ede3',
  surfaceContainerLow: '#f8f3e9',
  onSurface: '#1d1c16',
  onSurfaceVariant: '#424843',
  onTertiaryContainer: '#f37b32',
};

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
const MAX_W = 1440;
const SECTION_PY = 96;
const SECTION_PX = 32;
const FALLBACK_IMG = '/images-bens/photos/photo-jus.png';

/* Map marker data (decorative interactive markers) */
interface MapMarker {
  id: string;
  label: string;
  top: string;
  left: string;
  variant: 'main' | 'partner';
}

const MARKERS: MapMarker[] = [
  { id: 'm1', label: "Atelier Ben's Centre-Ville", top: '42%', left: '38%', variant: 'main' },
  { id: 'm2', label: 'Marché Jean-Talon', top: '28%', left: '55%', variant: 'partner' },
  { id: 'm3', label: 'Épicerie Plateau', top: '58%', left: '62%', variant: 'partner' },
  { id: 'm4', label: 'Café Verdure', top: '35%', left: '70%', variant: 'partner' },
];

function MapMarkerPin({ marker }: { marker: MapMarker }) {
  const bg = marker.variant === 'main' ? C.primary : C.secondary;
  return (
    <div
      style={{
        position: 'absolute',
        top: marker.top,
        left: marker.left,
        zIndex: 10,
        cursor: 'pointer',
      }}
      className="map-marker-pin"
    >
      <div
        style={{
          width: marker.variant === 'main' ? 22 : 16,
          height: marker.variant === 'main' ? 22 : 16,
          borderRadius: '50%',
          background: bg,
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s',
        }}
        className="map-marker-circle"
      />
      <div
        style={{
          position: 'absolute',
          bottom: '130%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          color: C.onSurface,
          fontFamily: FONT_BODY,
          fontSize: 12,
          fontWeight: 600,
          padding: '6px 12px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
        className="map-marker-tooltip"
      >
        {marker.label}
      </div>
      <style>{`
        .map-marker-pin:hover .map-marker-tooltip { opacity: 1; }
        .map-marker-pin:hover .map-marker-circle { transform: scale(1.25); }
      `}</style>
    </div>
  );
}

export default function LocationsPage() {
  const { locations } = useData();
  const navigate = useNavigate();

  const active = useMemo(() => locations.filter((loc) => loc.active), [locations]);

  /* Build display cards: use real data + fill with placeholders to show at least 2 */
  const placeholders = useMemo(() => [
    {
      id: 'placeholder-1',
      name: "Atelier Ben's",
      address: '1234 Rue Sainte-Catherine, Montréal, QC',
      type: 'Atelier Signature',
      active: true,
      phone: '(514) 555-0100',
      hours: 'Lun\u2013Ven 9h\u201319h / Sam\u2013Dim 10h\u201317h',
    },
    {
      id: 'placeholder-2',
      name: 'Marché Jean-Talon',
      address: '7070 Av. Henri-Julien, Montréal, QC',
      type: 'Partenaire Local',
      active: true,
      phone: '(514) 555-0200',
      hours: 'Lun\u2013Ven 8h\u201318h / Sam\u2013Dim 8h\u201317h',
    },
  ], []);

  const displayCards = useMemo(() => {
    const enriched = active.map((loc) => ({
      ...loc,
      phone: '',
      hours: '',
    }));
    if (enriched.length >= 2) return enriched;
    const needed = 2 - enriched.length;
    return [...enriched, ...placeholders.slice(0, needed)];
  }, [active, placeholders]);

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.onSurface, background: C.surface }}>
      <SEO
        title={"Points de Vente"}
        description={"Découvrez nos ateliers et partenaires à Montréal. Trouvez nos élixirs naturels près de chez vous."}
        url={"https://lesjusnatuelsbens.com/locations"}
      />

      {/* ═══════════════ 1. HERO HEADER ═══════════════ */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `${SECTION_PY}px ${SECTION_PX}px 64px`,
          textAlign: 'center',
        }}
      >
        {/* Orange label */}
        <span
          style={{
            display: 'inline-block',
            background: C.onTertiaryContainer + '22',
            color: C.onTertiaryContainer,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '6px 18px',
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          {"Nos Ateliers \u0026 Partenaires"}
        </span>

        {/* H1 */}
        <h1
          style={{
            fontFamily: FONT_HEADLINE,
            fontStyle: 'italic',
            fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: C.primary,
            lineHeight: 1.1,
            margin: '0 auto 24px',
            maxWidth: 720,
          }}
        >
          {"Nos Points de Vente"}
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: C.onSurfaceVariant,
            lineHeight: 1.7,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {"Retrouvez nos élixirs naturels dans nos ateliers artisanaux et chez nos partenaires sélectionnés à travers la ville. Chaque point de vente a été choisi avec soin pour vous offrir la meilleure expérience."}
        </p>
      </section>

      {/* ═══════════════ 2. MAP SECTION ═══════════════ */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `0 ${SECTION_PX}px`,
          marginBottom: SECTION_PY,
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 600,
            borderRadius: '3rem',
            overflow: 'hidden',
            background: C.surfaceContainerLow,
          }}
        >
          {/* Background map image with grayscale + multiply blend */}
          <img
            src={'/images-bens/hero-banners/banniere-points-vente.png'}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
            alt={"Carte de Montréal"}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(1)',
              mixBlendMode: 'multiply',
              opacity: 0.4,
            }}
          />

          {/* Interactive map markers */}
          {MARKERS.map((marker) => (
            <MapMarkerPin key={marker.id} marker={marker} />
          ))}

          {/* Botanical leaf overlay top-right */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 260,
              height: 280,
              overflow: 'hidden',
              borderRadius: '5rem 0 0 0',
              pointerEvents: 'none',
            }}
          >
            <img
              src={'/images-bens/botanicals/leaf-overlay.png'}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
              alt={""}
              aria-hidden={true}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'rotate(25deg)',
                opacity: 0.65,
              }}
            />
          </div>

          {/* Legend overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 28,
              left: 32,
              display: 'flex',
              gap: 20,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: 16,
              padding: '12px 20px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.primary, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: C.onSurface }}>{"Atelier Signature"}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: C.secondary, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: C.onSurface }}>{"Partenaire Local"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. LOCATIONS GRID ═══════════════ */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `0 ${SECTION_PX}px ${SECTION_PY}px`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 64,
          }}
        >
          {displayCards.map((loc, idx) => {
            const isSignature = loc.type === 'Atelier Signature' || idx === 0;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`;
            const phone = (loc as { phone?: string }).phone || '';
            const hours = (loc as { hours?: string }).hours || 'Lun\u2013Ven 9h\u201319h / Sam\u2013Dim 10h\u201317h';

            return (
              <article key={loc.id} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Image */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={FALLBACK_IMG}
                    alt={loc.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      display: 'block',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                  />

                  {/* Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: isSignature ? C.secondary + 'e6' : C.secondaryContainer,
                      color: isSignature ? 'white' : C.onSurface,
                    }}
                  >
                    {isSignature ? "Atelier Signature" : "Partenaire Local"}
                  </span>
                </div>

                {/* Card body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Location name */}
                  <h3
                    style={{
                      fontFamily: FONT_HEADLINE,
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
                      fontWeight: 700,
                      color: C.primary,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {loc.name}
                  </h3>

                  {/* Info rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20, color: C.secondary, flexShrink: 0, lineHeight: 1.5 }}
                      >
                        {"pin_drop"}
                      </span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.onSurfaceVariant, lineHeight: 1.5 }}>
                        {loc.address}
                      </span>
                    </div>

                    {/* Phone */}
                    {phone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 20, color: C.secondary, flexShrink: 0 }}
                        >
                          {"call"}
                        </span>
                        <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.onSurfaceVariant }}>
                          {phone}
                        </span>
                      </div>
                    ) : null}

                    {/* Hours */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20, color: C.secondary, flexShrink: 0, lineHeight: 1.5 }}
                      >
                        {"schedule"}
                      </span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: C.onSurfaceVariant, lineHeight: 1.5 }}>
                        {hours}
                      </span>
                    </div>
                  </div>

                  {/* CTA button */}
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      alignSelf: 'flex-start',
                      background: C.primary,
                      color: 'white',
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      padding: '16px 32px',
                      borderRadius: 999,
                      transition: 'opacity 0.2s',
                      marginTop: 4,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                  >
                    {"Itinéraire"}
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{"arrow_forward"}</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ 4. BECOME A STOCKIST CTA ═══════════════ */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: `0 ${SECTION_PX}px ${SECTION_PY}px`,
        }}
      >
        <div
          style={{
            background: C.primaryContainer,
            borderRadius: '3rem',
            padding: 96,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Left: text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Eyebrow label */}
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.12)',
                color: C.secondaryContainer,
                fontFamily: FONT_BODY,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 18px',
                borderRadius: 999,
                alignSelf: 'flex-start',
              }}
            >
              {"Collaborations"}
            </span>

            {/* Headline */}
            <h2
              style={{
                fontFamily: FONT_HEADLINE,
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {"Devenir Revendeur"}
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 17,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 480,
              }}
            >
              {"Vous êtes propriétaire d\u2019un café, d\u2019une épicerie ou d\u2019un espace bien-être\u00a0? Rejoignez notre réseau de partenaires et offrez à vos clients des élixirs naturels d\u2019exception."}
            </p>

            {/* CTA gold button */}
            <button
              onClick={() => navigate(ROUTES.contact)}
              style={{
                alignSelf: 'flex-start',
                background: C.secondaryContainer,
                color: C.primary,
                fontFamily: FONT_BODY,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: 'none',
                padding: '16px 36px',
                borderRadius: 999,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                marginTop: 8,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              {"Nous Contacter"}
            </button>
          </div>

          {/* Right: tall image with leaf-mask top-right border-radius */}
          <div
            style={{
              height: 480,
              borderRadius: '5rem 0 0 0',
              overflow: 'hidden',
            }}
          >
            <img
              src={FALLBACK_IMG}
              alt={"Devenir revendeur Ben\u2019s"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
