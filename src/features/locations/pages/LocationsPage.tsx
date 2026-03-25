import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';

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
const MAX_W         = 1280;
const PAGE_STEP     = 12;

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

/* ─── Haversine ─── */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a    = Math.sin(dLat / 2) ** 2 +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

/* Coordonnées de secours pour les placeholders uniquement */
const PLACEHOLDER_COORDS: Record<string, [number, number]> = {
  'ph-1':  [45.5088, -73.5878],
  'ph-2':  [45.5341, -73.6148],
  'ph-3':  [45.4783, -73.5788],
  'ph-4':  [45.5231, -73.5789],
  'ph-5':  [45.5017, -73.5673],
  'ph-6':  [45.4949, -73.5779],
  'ph-7':  [45.5195, -73.6025],
  'ph-8':  [45.5450, -73.6200],
  'ph-9':  [45.4720, -73.6050],
  'ph-10': [45.5080, -73.5530],
};

interface LocItem {
  id: string; name: string; address: string;
  type?: string; active: boolean;
  region?: 'Montreal' | 'Rive Sud' | 'Rive Nord';
  phone?: string; hours?: string;
  coords?: [number, number];
  neighborhood?: string;
}

const PLACEHOLDERS: LocItem[] = [
  { id: 'ph-1',  name: "Atelier Ben's",           address: '1234 Rue Sainte-Catherine, Montréal', type: 'Atelier Signature', active: true, phone: '(514) 555-0100', hours: 'Lun–Ven 9h–19h\nSam–Dim 10h–17h', neighborhood: 'Centre-Ville',    coords: PLACEHOLDER_COORDS['ph-1'] },
  { id: 'ph-2',  name: 'Marché Jean-Talon',        address: '7070 Av. Henri-Julien, Montréal',    type: 'Partenaire Local',  active: true, phone: '(514) 555-0200', hours: 'Lun–Ven 8h–18h\nSam–Dim 8h–17h',  neighborhood: 'Mile-End',         coords: PLACEHOLDER_COORDS['ph-2'] },
  { id: 'ph-3',  name: 'Marché Atwater',           address: '138 Av. Atwater, Montréal',          type: 'Partenaire Local',  active: true,                          hours: 'Mar–Sam 9h–18h\nDim 9h–17h',      neighborhood: 'Saint-Henri',      coords: PLACEHOLDER_COORDS['ph-3'] },
  { id: 'ph-4',  name: 'Épicerie Plateau',          address: '3450 Rue Saint-Denis, Montréal',     type: 'Partenaire Local',  active: true,                          hours: 'Lun–Sam 9h–20h\nDim 10h–18h',     neighborhood: 'Plateau',          coords: PLACEHOLDER_COORDS['ph-4'] },
  { id: 'ph-5',  name: 'Café Verdure',              address: '890 Rue Ontario E., Montréal',       type: 'Partenaire Local',  active: true, phone: '(514) 555-0500', hours: 'Lun–Ven 7h–18h\nSam 8h–17h',      neighborhood: 'Hochelaga',        coords: PLACEHOLDER_COORDS['ph-5'] },
  { id: 'ph-6',  name: 'Naturalia Griffintown',     address: '555 Rue William, Montréal',          type: 'Partenaire Local',  active: true,                          hours: 'Lun–Dim 8h–20h',                  neighborhood: 'Griffintown',      coords: PLACEHOLDER_COORDS['ph-6'] },
  { id: 'ph-7',  name: 'Bio Saveur Côte-des-Neiges',address: '5800 Ch. Côte-des-Neiges, Montréal', type: 'Partenaire Local',  active: true, phone: '(514) 555-0700', hours: 'Lun–Sam 9h–19h\nDim 10h–17h',     neighborhood: 'Côte-des-Neiges',  coords: PLACEHOLDER_COORDS['ph-7'] },
  { id: 'ph-8',  name: 'Épicerie Ahuntsic',         address: '10255 Rue Lajeunesse, Montréal',     type: 'Partenaire Local',  active: true,                          hours: 'Lun–Sam 9h–19h',                  neighborhood: 'Ahuntsic',         coords: PLACEHOLDER_COORDS['ph-8'] },
  { id: 'ph-9',  name: 'Espace Santé Verdun',       address: '4200 Boul. LaSalle, Verdun',         type: 'Partenaire Local',  active: true,                          hours: 'Mar–Sam 10h–18h',                 neighborhood: 'Verdun',           coords: PLACEHOLDER_COORDS['ph-9'] },
  { id: 'ph-10', name: 'Marché du Village Rosemont', address: '4750 Rue Beaubien E., Montréal',    type: 'Partenaire Local',  active: true,                          hours: 'Mer–Dim 9h–17h',                  neighborhood: 'Rosemont',         coords: PLACEHOLDER_COORDS['ph-10'] },
];

type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable';
type FilterType = 'Tous' | 'Montreal' | 'Rive Sud' | 'Rive Nord';

export default function LocationsPage() {
  const { locations, locationSettings } = useData();
  const navigate      = useNavigate();

  /* coords viennent directement de l'objet Location (seed / Supabase) */
  const active: LocItem[] = useMemo(() =>
    locations.filter(l => l.active),
  [locations]);

  const allLocs: LocItem[] = useMemo(() => {
    if (active.length >= 4) return active;
    return [...active, ...PLACEHOLDERS.slice(0, Math.max(0, 10 - active.length))];
  }, [active]);

  /* ─── Filters ─── */
  const [query,      setQuery]      = useState('');
  const [filterType, setFilterType] = useState<FilterType>('Tous');
  const [showCount,  setShowCount]  = useState(PAGE_STEP);

  /* ─── Geolocation ─── */
  const [geoStatus,  setGeoStatus]  = useState<GeoStatus>('idle');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  const requestGeo = useCallback(() => {
    if (!('geolocation' in navigator)) { setGeoStatus('unavailable'); return; }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => { setUserCoords([pos.coords.latitude, pos.coords.longitude]); setGeoStatus('granted'); },
      ()  => setGeoStatus('denied'),
      { timeout: 8000, maximumAge: 120000 }
    );
  }, []);

  function getDist(loc: LocItem): number {
    if (!userCoords || !loc.coords) return Infinity;
    return haversine(userCoords[0], userCoords[1], loc.coords[0], loc.coords[1]);
  }
  function getDistLabel(loc: LocItem): string | null {
    const d = getDist(loc);
    if (d === Infinity) return null;
    return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
  }

  /* ─── Derived list ─── */
  const filtered = useMemo(() => {
    let list = [...allLocs];
    if (filterType !== 'Tous') list = list.filter(l => (l.region ?? 'Montreal') === filterType);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        (l.neighborhood || '').toLowerCase().includes(q)
      );
    }
    if (userCoords) list.sort((a, b) => getDist(a) - getDist(b));
    return list;
  }, [allLocs, filterType, query, userCoords]);

  const visible    = filtered.slice(0, showCount);
  const hasMore    = showCount < filtered.length;
  const nearestId  = userCoords && filtered[0] ? filtered[0].id : null;

  const typeCounts = useMemo(() => ({
    all: allLocs.length,
    byRegion: locationSettings.regions.reduce<Record<string, number>>((acc, region) => {
      acc[region] = allLocs.filter(l => (l.region ?? 'Montreal') === region).length;
      return acc;
    }, {}),
  }), [allLocs, locationSettings.regions]);

  /* ─── Neighborhoods list for quick pick ─── */
  const neighborhoods = useMemo(() =>
    [...new Set(allLocs.map(l => l.neighborhood).filter(Boolean))],
  [allLocs]);

  return (
    <div style={{ fontFamily: FONT_BODY, color: C.onSurface, background: C.surface }}>
      <SEO
        title="Points de Vente"
        description="Trouvez nos élixirs naturels près de chez vous — ateliers et partenaires à travers Montréal."
        url="https://lesjusnaturelsbens.com/nos-points-de-vente"
      />

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: 'min(520px, 72vh)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images-bens/hero-banners/banniere-nous%20trouver-hero.png')",
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,77,56,0.82) 25%, rgba(27,77,56,0.45) 60%, rgba(27,77,56,0.05) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: MAX_W, margin: '0 auto', padding: '5rem 2rem', width: '100%' }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 18px' }}>
            ✦ Nos Ateliers & Partenaires
          </p>
          <h1 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(2.5rem, 5.5vw, 4rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.08, margin: '0 0 16px', maxWidth: '16ch' }}>
            Près de chez vous,<br />partout où la santé compte
          </h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: '1rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.75, maxWidth: '38ch', margin: '0 0 28px' }}>
            Retrouvez nos élixirs naturels dans nos ateliers artisanaux et chez nos partenaires sélectionnés à travers la ville.
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 18px', borderRadius: 9999,
            background: 'rgba(255,255,255,0.16)',
            border: '1px solid rgba(255,255,255,0.22)',
            marginBottom: 18,
          }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
              Activez la localisation pour trier par distance
            </span>
          </div>

          {/* Geo CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            {geoStatus === 'idle' && (
              <button type="button" onClick={requestGeo} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.gold, color: '#ffffff', border: 'none', borderRadius: 9999,
                padding: '12px 24px', fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(224,122,32,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                </svg>
                Trouver le plus proche
              </button>
            )}
            {geoStatus === 'loading' && (
              <span style={{ fontFamily: FONT_BODY, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>Localisation…</span>
            )}
            {geoStatus === 'granted' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 9999, padding: '9px 18px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>
                  Trié par distance
                </span>
              </div>
            )}
            {geoStatus === 'denied' && (
              <span style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>Localisation refusée</span>
            )}

            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 9999, padding: '9px 20px' }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                {allLocs.length} points de vente
              </span>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor={C.surface} />

      {/* ═══ SEARCH + FILTERS ═══ */}
      <section style={{ maxWidth: MAX_W, margin: '0 auto', padding: '48px 2rem 0' }}>

        {/* Search bar */}
        <div style={{ position: 'relative', maxWidth: 560, marginBottom: 28 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.onSurfaceVariant} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, adresse ou quartier…"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowCount(PAGE_STEP); }}
            style={{
              width: '100%', padding: '14px 18px 14px 46px',
              borderRadius: 9999,
              border: `1.5px solid ${C.surfaceContainer}`,
              background: '#ffffff',
              fontFamily: FONT_BODY, fontSize: '0.9rem', color: C.onSurface,
              outline: 'none', boxSizing: 'border-box' as const,
              boxShadow: '0 2px 12px rgba(27,77,56,0.06)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = C.primaryContainer; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primaryContainer}18`; }}
            onBlur={e => { e.currentTarget.style.borderColor = C.surfaceContainer; e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,77,56,0.06)'; }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, fontSize: '1.1rem', lineHeight: 1, padding: 4 }}>
              ×
            </button>
          )}
        </div>

        {/* Filter pills row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginBottom: 8 }}>
          {([
            ['Tous', typeCounts.all, 'Tous'],
            ...locationSettings.regions.map(region => [
              region,
              typeCounts.byRegion[region] || 0,
              region === 'Montreal' ? 'Montréal' : region === 'Rive Sud' ? 'Rive Sud' : 'Rive Nord',
            ] as const),
          ] as const).map(([val, count, label]) => {
            const active = filterType === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => { setFilterType(val as FilterType); setShowCount(PAGE_STEP); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 9999,
                  fontFamily: FONT_BODY, fontSize: '0.8rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.18s',
                  border: active ? 'none' : `1.5px solid ${C.surfaceContainer}`,
                  background: active ? C.primary : '#ffffff',
                  color: active ? '#ffffff' : C.onSurfaceVariant,
                }}
              >
                {label}
                <span style={{
                  background: active ? 'rgba(255,255,255,0.22)' : C.surfaceContainerLow,
                  color: active ? '#ffffff' : C.onSurfaceVariant,
                  borderRadius: 9999, padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Neighborhood quick filters */}
          <div style={{ width: 1, height: 20, background: C.surfaceContainer, margin: '0 4px' }} />
          {neighborhoods.slice(0, 6).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => { setQuery(q => q === n ? '' : n as string); setShowCount(PAGE_STEP); }}
              style={{
                padding: '7px 14px', borderRadius: 9999,
                fontFamily: FONT_BODY, fontSize: '0.75rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.18s',
                border: `1.5px solid ${query === n ? C.gold : C.surfaceContainer}`,
                background: query === n ? `${C.gold}14` : '#ffffff',
                color: query === n ? C.gold : C.onSurfaceVariant,
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Results count + sort indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 32px', borderBottom: `1px solid ${C.surfaceContainer}`, flexWrap: 'wrap' as const, gap: 8 }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: C.onSurfaceVariant, margin: 0 }}>
            <strong style={{ color: C.onSurface }}>{filtered.length}</strong> point{filtered.length !== 1 ? 's' : ''} de vente
            {query && <span> pour <em>"{query}"</em></span>}
            {filterType !== 'Tous' && (
              <span>
                · {filterType === 'Montreal' ? 'Montréal' : filterType === 'Rive Sud' ? 'Rive Sud de Montréal' : 'Rive Nord de Montréal'}
              </span>
            )}
          </p>
          {geoStatus === 'idle' && (
            <button type="button" onClick={requestGeo}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${C.surfaceContainer}`, borderRadius: 9999, padding: '6px 14px', fontFamily: FONT_BODY, fontSize: '0.75rem', fontWeight: 600, color: C.primaryContainer, cursor: 'pointer' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
              Trier par distance
            </button>
          )}
          {geoStatus === 'granted' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: '0.75rem', fontWeight: 600, color: C.onSurfaceVariant }}>Trié par distance</span>
            </div>
          )}
        </div>
      </section>

      {/* ═══ GRID ═══ */}
      <section style={{ maxWidth: MAX_W, margin: '0 auto', padding: '32px 2rem 80px' }}>

        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 16 }}>🔍</span>
            <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.15rem', color: C.primary, marginBottom: 8 }}>
              Aucun résultat pour "{query}"
            </p>
            <button type="button" onClick={() => { setQuery(''); setFilterType('Tous'); }}
              style={{ background: 'none', border: `1.5px solid ${C.primaryContainer}`, borderRadius: 9999, padding: '10px 24px', fontFamily: FONT_BODY, fontSize: '0.88rem', fontWeight: 700, color: C.primaryContainer, cursor: 'pointer' }}>
              Effacer les filtres
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
              gap: 18,
            }}>
              {visible.map(loc => {
                const isSignature = loc.type === 'Atelier Signature';
                const isNearest   = loc.id === nearestId;
                const distLabel   = getDistLabel(loc);
                const mapsUrl     = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.name} ${loc.address}`)}`;
                const hoursLines  = (loc.hours || 'Lun–Ven 9h–19h\nSam–Dim 10h–17h').split('\n');

                return (
                  <article
                    key={loc.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '1.5rem',
                      border: isNearest
                        ? `2px solid ${C.primaryContainer}`
                        : '1px solid rgba(27,77,56,0.06)',
                      boxShadow: isNearest
                        ? '0 8px 40px rgba(43,106,79,0.16)'
                        : '0 2px 20px rgba(27,77,56,0.04)',
                      display: 'flex', flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      position: 'relative' as const,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(27,77,56,0.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = isNearest ? '0 8px 40px rgba(43,106,79,0.16)' : '0 2px 20px rgba(27,77,56,0.04)'; }}
                  >
                    {/* Nearest badge floating */}
                    {isNearest && (
                      <div style={{
                        position: 'absolute', top: -1, right: 16,
                        background: `linear-gradient(135deg, ${C.gold}, #D97706)`,
                        color: '#ffffff',
                        fontFamily: FONT_BODY, fontSize: '0.65rem', fontWeight: 800,
                        letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                        padding: '6px 12px 8px',
                        borderRadius: '0 0 10px 10px',
                        boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
                      }}>
                        Le + proche
                      </div>
                    )}

                    {/* Color stripe */}
                    <div style={{
                      height: 5,
                      background: isNearest
                        ? `linear-gradient(to right, ${C.primary}, ${C.primaryContainer}, ${C.gold})`
                        : isSignature 
                          ? `linear-gradient(to right, ${C.primary}, ${C.primaryContainer})` 
                          : C.surfaceContainer,
                    }} />

                    <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Badges row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                        <span style={{
                          fontFamily: FONT_BODY, fontSize: '0.6rem', fontWeight: 800,
                          letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                          padding: '3px 10px', borderRadius: 9999,
                          background: isSignature ? C.primary : C.surfaceContainerLow,
                          color: isSignature ? '#ffffff' : C.primaryContainer,
                        }}>
                          {isSignature ? 'Signature' : 'Partenaire'}
                        </span>
                        {distLabel && (
                          <span style={{
                            fontFamily: FONT_BODY, fontSize: '0.62rem', fontWeight: 700,
                            padding: '3px 10px', borderRadius: 9999,
                            background: isNearest ? `${C.primaryContainer}14` : C.surfaceContainerLow,
                            color: isNearest ? C.primaryContainer : C.onSurfaceVariant,
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}>
                            📍 {distLabel}
                            {isNearest && <span style={{ color: C.gold }}>· 1er</span>}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h3 style={{ fontFamily: FONT_HEADLINE, fontSize: '1.05rem', fontWeight: 700, color: C.onSurface, margin: 0, lineHeight: 1.25 }}>
                        {loc.name}
                      </h3>

                      {/* Address */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span style={{ fontFamily: FONT_BODY, fontSize: '0.78rem', color: C.onSurfaceVariant, lineHeight: 1.5 }}>
                          {loc.address}
                          {loc.neighborhood && (
                            <span style={{ display: 'block', fontSize: '0.7rem', color: C.gold, fontWeight: 600, marginTop: 2 }}>
                              {loc.neighborhood}
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Hours */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <div style={{ fontFamily: FONT_BODY, fontSize: '0.78rem', color: C.onSurfaceVariant, lineHeight: 1.55 }}>
                          {hoursLines.map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                      </div>

                      {/* Phone */}
                      {loc.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
                          </svg>
                          <a href={`tel:${loc.phone}`} style={{ fontFamily: FONT_BODY, fontSize: '0.78rem', color: C.onSurfaceVariant, textDecoration: 'none' }}>
                            {loc.phone}
                          </a>
                        </div>
                      )}

                      <div style={{ flex: 1 }} />

                      {/* CTA */}
                      <a
                        href={mapsUrl} target="_blank" rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                          color: '#ffffff',
                          fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.82rem',
                          textDecoration: 'none', padding: '12px 20px', borderRadius: 9999,
                          marginTop: 8, transition: 'all 0.25s',
                          boxShadow: '0 4px 12px rgba(27,77,56,0.15)',
                        }}
                        onMouseEnter={e => { 
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,77,56,0.25)';
                        }}
                        onMouseLeave={e => { 
                          e.currentTarget.style.transform = '';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(27,77,56,0.15)';
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        Voir l'itinéraire →
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: C.onSurfaceVariant, marginBottom: 16 }}>
                  {visible.length} sur {filtered.length} points de vente
                </p>
                <button
                  type="button"
                  onClick={() => setShowCount(c => c + PAGE_STEP)}
                  style={{
                    background: 'none', color: C.primaryContainer,
                    border: `1.5px solid ${C.primaryContainer}40`,
                    borderRadius: 9999, padding: '12px 36px',
                    fontFamily: FONT_BODY, fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.primaryContainer; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.primaryContainer; }}
                >
                  Afficher {Math.min(PAGE_STEP, filtered.length - showCount)} de plus
                </button>
              </div>
            )}
          </>
        )}

        {geoStatus === 'denied' && (
          <p style={{ textAlign: 'center', fontFamily: FONT_BODY, fontSize: '0.82rem', color: C.onSurfaceVariant, marginTop: 24 }}>
            Localisation refusée. Activez-la dans les paramètres de votre navigateur pour voir les distances.
          </p>
        )}
      </section>

      {/* ═══ DEVENIR REVENDEUR ═══ */}
      <WaveDivider topColor={C.surface} bottomColor={C.primaryContainer} />
      <section style={{ background: C.primaryContainer, padding: '80px 2rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: C.gold }}>
            ✦ Collaborations
          </span>
          <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
            Devenir Revendeur
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: '0.98rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
            Vous êtes propriétaire d'un café, d'une épicerie ou d'un espace bien-être&nbsp;? Rejoignez notre réseau et offrez à vos clients des élixirs naturels d'exception, nés entre l'Afrique et le Québec.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.contact)}
            style={{
              background: C.gold, color: '#ffffff', border: 'none', borderRadius: 9999,
              padding: '14px 36px', fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.92rem',
              cursor: 'pointer', marginTop: 8, transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(224,122,32,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            Nous Contacter →
          </button>
        </div>
      </section>
      <WaveDivider topColor={C.primaryContainer} bottomColor="#1a3a2a" />
    </div>
  );
}
