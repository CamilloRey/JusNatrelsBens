import { useMemo } from 'react';
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

const FALLBACK_IMG = 'https://gflkfwalfaeeknauxyig.supabase.co/storage/v1/object/public/images/photos/photo-jus.png';

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

const PLACEHOLDER_EVENTS = [
  {
    id: 'placeholder-1',
    title: 'Atelier de Pressage',
    date: '2026-05-17',
    location: 'Marché Jean-Talon, Montréal',
    description: "Venez découvrir l'art du pressage de fruits frais avec nos experts. Un moment convivial pour apprendre et déguster nos élixirs artisanaux.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-2',
    title: 'Festival des Récoltes',
    date: '2026-06-20',
    location: 'Marché Atwater, Montréal',
    description: "Célébrez la saison des récoltes avec nous\u00a0! Dégustation, ateliers et rencontres autour des jus naturels nés entre l'Afrique et le Québec.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-3',
    title: "Marché d'Été Ben's",
    date: '2026-07-12',
    location: 'Marché Jean-Talon, Montréal',
    description: "Retrouvez-nous au marché pour une sélection spéciale de jus d'été — hibiscus, baobab, mangue et bien d'autres saveurs venues d'Afrique.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-4',
    title: 'Dégustation Hivernale',
    date: '2025-12-05',
    location: 'Marché Bonsecours, Montréal',
    description: 'Une soirée de dégustation autour de nos jus chauds et mélanges hivernaux. Gingembre, cannelle et épices africaines au rendez-vous.',
    img: FALLBACK_IMG,
    active: false,
  },
];

function parseDateUTC(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function formatDay(dateStr: string)       { return parseDateUTC(dateStr).getUTCDate(); }
function formatMonth(dateStr: string)     { return parseDateUTC(dateStr).toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' }).toUpperCase(); }
function formatMonthLong(dateStr: string) { return parseDateUTC(dateStr).toLocaleString('fr-CA', { month: 'long', timeZone: 'UTC' }); }
function formatYear(dateStr: string)      { return parseDateUTC(dateStr).getUTCFullYear(); }
function formatFullDate(dateStr: string)  {
  const d = parseDateUTC(dateStr);
  return d.toLocaleString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

interface EventLike {
  id: string; title: string; date: string;
  location: string; description: string; img?: string; active: boolean;
}

/* ─── Featured event (first/largest card) ─── */
function FeaturedEventCard({ event, onNavigate }: { event: EventLike; onNavigate: (id: string) => void }) {
  const img = event.img || FALLBACK_IMG;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderRadius: '2rem',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 8px 48px rgba(27,77,56,0.12)',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        minHeight: 440,
      }}
      onClick={() => onNavigate(event.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform  = 'translateY(-4px)';
        e.currentTarget.style.boxShadow  = '0 20px 64px rgba(27,77,56,0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform  = 'translateY(0)';
        e.currentTarget.style.boxShadow  = '0 8px 48px rgba(27,77,56,0.12)';
      }}
    >
      {/* Image side */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={img} alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
        {/* À venir badge */}
        <div style={{
          position: 'absolute', top: 20, left: 20,
          background: C.gold, color: '#ffffff',
          fontFamily: FONT_BODY, fontSize: 10, fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase' as const,
          padding: '6px 16px', borderRadius: 9999,
        }}>
          ✦ Prochain événement
        </div>
      </div>

      {/* Content side */}
      <div style={{
        padding: '44px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: `linear-gradient(160deg, #ffffff 0%, ${C.surfaceContainerLow} 100%)`,
      }}>
        {/* Date block */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 16,
          marginBottom: 28,
        }}>
          <div style={{
            background: C.primary, color: '#ffffff',
            borderRadius: '1rem', padding: '12px 18px',
            textAlign: 'center', minWidth: 64,
          }}>
            <div style={{ fontFamily: FONT_HEADLINE, fontSize: '2.2rem', fontWeight: 700, lineHeight: 1 }}>
              {formatDay(event.date)}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', marginTop: 4 }}>
              {formatMonth(event.date)}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: FONT_BODY, fontSize: '0.78rem', fontWeight: 700, color: C.gold, margin: '0 0 3px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
              {formatMonthLong(event.date)} {formatYear(event.date)}
            </p>
            <p style={{ fontFamily: FONT_BODY, fontSize: '0.8rem', color: C.onSurfaceVariant, margin: 0, textTransform: 'capitalize' as const }}>
              {formatFullDate(event.date).split(',')[0]}
            </p>
          </div>
        </div>

        {/* Title + location + desc */}
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 700, fontStyle: 'italic',
            color: C.onSurface, lineHeight: 1.2,
            margin: '0 0 14px',
          }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: C.onSurfaceVariant, fontWeight: 600 }}>
              {event.location}
            </span>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: C.onSurfaceVariant, lineHeight: 1.7, margin: '0 0 28px' }}>
            {event.description}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(event.id); }}
          style={{
            alignSelf: 'flex-start',
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
            color: '#ffffff',
            fontFamily: FONT_BODY, fontSize: '0.95rem', fontWeight: 700,
            padding: '14px 32px', borderRadius: 9999, border: 'none', cursor: 'pointer',
            transition: 'transform 0.25s, box-shadow 0.25s',
            boxShadow: '0 4px 16px rgba(27,77,56,0.2)',
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.transform = 'translateY(-2px)'; 
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,77,56,0.3)'; 
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,77,56,0.2)'; 
          }}
        >
          Réserver ma place →
        </button>
      </div>
    </div>
  );
}

/* ─── Regular upcoming card ─── */
function UpcomingCard({ event, onNavigate }: { event: EventLike; onNavigate: (id: string) => void }) {
  const img = event.img || FALLBACK_IMG;
  return (
    <div
      style={{
        background: '#ffffff', borderRadius: '1.75rem', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 4px 24px rgba(27,77,56,0.08)',
        border: '1px solid rgba(27,77,56,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onClick={() => onNavigate(event.id)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 52px rgba(27,77,56,0.16)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(27,77,56,0.08)'; }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <img
          src={img} alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
        {/* Date badge overlay */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
          color: '#ffffff',
          borderRadius: '1rem', padding: '10px 14px',
          textAlign: 'center', minWidth: 52,
          boxShadow: '0 6px 20px rgba(27,77,56,0.35)',
        }}>
          <div style={{ fontFamily: FONT_HEADLINE, fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>
            {formatDay(event.date)}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', marginTop: 4 }}>
            {formatMonth(event.date)}
          </div>
        </div>
        {/* Gradient overlay bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: '26px 26px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontFamily: FONT_BODY, fontSize: '0.78rem', color: C.onSurfaceVariant, fontWeight: 600 }}>
            {event.location}
          </span>
        </div>
        <h3 style={{
          fontFamily: FONT_HEADLINE, fontSize: '1.25rem', fontStyle: 'italic',
          fontWeight: 700, color: C.onSurface, lineHeight: 1.25, margin: 0,
        }}>
          {event.title}
        </h3>
        <p style={{
          fontFamily: FONT_BODY, fontSize: '0.88rem',
          color: C.onSurfaceVariant, lineHeight: 1.7,
          margin: '0 0 auto',
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {event.description}
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(event.id); }}
          style={{
            alignSelf: 'flex-start', marginTop: 10,
            background: 'none', color: C.primary,
            fontFamily: FONT_BODY, fontSize: '0.88rem', fontWeight: 700,
            padding: '12px 24px', borderRadius: 9999,
            border: `2px solid ${C.primary}25`, cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.background = `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`; 
            e.currentTarget.style.color = '#ffffff'; 
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,77,56,0.2)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.background = 'none'; 
            e.currentTarget.style.color = C.primary; 
            e.currentTarget.style.borderColor = `${C.primary}25`;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          En savoir plus →
        </button>
      </div>
    </div>
  );
}

/* ─── Past event card — same style as UpcomingCard but smaller ─── */
function PastCard({ event, onNavigate }: { event: EventLike; onNavigate: (id: string) => void }) {
  const img = event.img || FALLBACK_IMG;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '1.25rem', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.25s, box-shadow 0.25s, opacity 0.25s',
        opacity: 0.65,
      }}
      onClick={() => onNavigate(event.id)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.2)'; e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.opacity = '0.65'; }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <img
          src={img} alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s', filter: 'grayscale(40%)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
        />
        {/* Past event badge overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(127,97,66,0.4) 0%, rgba(127,97,66,0.1) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.6)', color: '#ffffff',
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            padding: '8px 16px', borderRadius: 9999,
            backdropFilter: 'blur(4px)',
          }}>
            ✓ Événement passé
          </div>
        </div>
        {/* Date badge */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: C.primary, color: '#ffffff',
          borderRadius: '0.6rem', padding: '6px 10px',
          textAlign: 'center', minWidth: 40,
          boxShadow: '0 4px 14px rgba(27,77,56,0.3)',
        }}>
          <div style={{ fontFamily: FONT_HEADLINE, fontSize: '1.15rem', fontWeight: 700, lineHeight: 1 }}>
            {formatDay(event.date)}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>
            {formatMonth(event.date)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <p style={{ fontFamily: FONT_BODY, fontSize: '0.65rem', fontWeight: 700, color: C.gold, margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
          {formatMonthLong(event.date)} {formatYear(event.date)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontFamily: FONT_BODY, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            {event.location}
          </span>
        </div>
        <h3 style={{
          fontFamily: FONT_HEADLINE, fontSize: '1rem', fontStyle: 'italic',
          fontWeight: 700, color: '#ffffff', lineHeight: 1.3, margin: 0,
        }}>
          {event.title}
        </h3>
        <p style={{
          fontFamily: FONT_BODY, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.6, margin: '0 0 auto',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>
          {event.description}
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(event.id); }}
          style={{
            alignSelf: 'flex-start', marginTop: 6,
            background: 'none', color: 'rgba(255,255,255,0.7)',
            fontFamily: FONT_BODY, fontSize: '0.78rem', fontWeight: 700,
            padding: '8px 16px', borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        >
          En savoir plus →
        </button>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { events } = useData();
  const navigate   = useNavigate();
  const today      = new Date().toISOString().split('T')[0];

  const activeEvents   = useMemo(() => events.filter(e => e.active).sort((a, b) => a.date.localeCompare(b.date)), [events]);
  const upcoming       = useMemo(() => activeEvents.filter(e => e.date >= today), [activeEvents, today]);
  const past           = useMemo(() => activeEvents.filter(e => e.date < today),  [activeEvents, today]);

  const displayUpcoming: EventLike[] = upcoming.length > 0 ? upcoming : PLACEHOLDER_EVENTS.filter(e => e.date >= today);
  const displayPast: EventLike[]     = past.length > 0     ? past     : PLACEHOLDER_EVENTS.filter(e => e.date < today);

  function handleNavigate(id: string) {
    if (!id.startsWith('placeholder-')) {
      navigate(`${ROUTES.events}/${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface }}>
      <SEO
        title="Nos Événements"
        description="Marchés, ateliers et célébrations à Montréal — rejoignez la communauté Les Jus Naturels Ben's."
        url="https://lesjusnaturelsbens.com/evenements"
      />

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: 'min(720px, 92vh)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images-bens/hero-banners/banniere-Evenemenets.png')",
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,77,56,0.72) 28%, rgba(27,77,56,0.28) 60%, rgba(27,77,56,0.0) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: MAX_W, margin: '0 auto', padding: '5rem 2rem', width: '100%' }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase' as const,
            color: C.gold, margin: '0 0 20px',
          }}>
            ✦ L'Expérience Ben's
          </p>
          <h1 style={{
            fontFamily: FONT_HEADLINE, fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 700, color: '#ffffff', lineHeight: 1.05,
            margin: '0 0 1.5rem', maxWidth: '14ch',
          }}>
            Nos{' '}
            <em style={{ fontStyle: 'italic', color: C.gold }}>Événements</em>
          </h1>
          <p style={{ fontFamily: FONT_BODY, fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: '40ch', margin: '0 0 2.5rem' }}>
            Marchés, ateliers de pressage et célébrations saisonnières — vivez l'expérience Ben's au cœur de Montréal et partagez des moments de bien-être en communauté.
          </p>
          <a
            href="#upcoming"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: C.gold, color: '#ffffff',
              fontFamily: FONT_BODY, fontSize: '0.95rem', fontWeight: 700,
              padding: '14px 32px', borderRadius: '999px', textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            Voir le calendrier →
          </a>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor={C.surface} />

      {/* ═══ MARCHÉS ET ÉVÉNEMENTS À VENIR ═══ */}
      <section id="upcoming" style={{ maxWidth: MAX_W, margin: '0 auto', padding: '72px 2rem 96px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, gap: 16, flexWrap: 'wrap' as const }}>
          <div>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: C.gold, margin: '0 0 12px',
            }}>
              Calendrier {new Date().getFullYear()}
            </p>
            <h2 style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
              fontWeight: 700, color: C.onSurface, margin: 0, lineHeight: 1.1,
            }}>
              Marchés & Événements à venir
            </h2>
          </div>
          {/* Decorative year */}
          <span style={{
            fontFamily: FONT_HEADLINE, fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 900, color: C.primary, opacity: 0.06,
            lineHeight: 1, userSelect: 'none', flexShrink: 0,
          }}>
            {new Date().getFullYear()}
          </span>
        </div>

        {displayUpcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>🌿</span>
            <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.2rem', color: C.primary, marginBottom: 8 }}>
              Aucun événement à venir pour le moment.
            </p>
            <p style={{ fontFamily: FONT_BODY, color: C.onSurfaceVariant, fontSize: '0.9rem' }}>
              Revenez bientôt ou suivez-nous sur les réseaux sociaux.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Featured — first event, large */}
            <FeaturedEventCard event={displayUpcoming[0]} onNavigate={handleNavigate} />

            {/* Remaining — 3-col grid */}
            {displayUpcoming.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 24,
                marginTop: 8,
              }}>
                {displayUpcoming.slice(1).map(event => (
                  <UpcomingCard key={event.id} event={event} onNavigate={handleNavigate} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══ ÉVÉNEMENTS PASSÉS ═══ */}
      {displayPast.length > 0 && (
        <>
          <WaveDivider topColor={C.surface} bottomColor={C.primaryContainer} />
          <section style={{ background: C.primaryContainer, padding: '80px 0 96px' }}>
            <div style={{ maxWidth: MAX_W, margin: '0 auto', padding: '0 2rem' }}>

              {/* Header + feature image side by side */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 40,
                alignItems: 'center',
                marginBottom: 56,
              }}>
                <div>
                  <p style={{
                    fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                    color: C.gold, margin: '0 0 12px',
                  }}>
                    Souvenirs
                  </p>
                  <h2 style={{
                    fontFamily: FONT_HEADLINE,
                    fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
                    fontStyle: 'italic',
                    fontWeight: 700, color: '#ffffff',
                    margin: '0 0 16px', lineHeight: 1.1,
                  }}>
                    Événements Passés
                  </h2>
                  <p style={{
                    fontFamily: FONT_BODY, fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.65)', lineHeight: 1.7,
                    maxWidth: 480, margin: 0,
                  }}>
                    Découvrez les temps forts de nos précédents marchés et ateliers — des moments de partage, de saveurs et de rencontres inoubliables.
                  </p>
                </div>

                {/* Feature photo */}
                <div style={{
                  width: 'clamp(160px, 22vw, 280px)',
                  aspectRatio: '3/4',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                }}>
                  <img
                    src="/images-bens/hero-banners/banniere-Evenements2-hero.png"
                    alt="L'univers Ben's"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Past events grid — smaller cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                gap: 18,
              }}>
                {displayPast.map(event => (
                  <PastCard key={event.id} event={event} onNavigate={handleNavigate} />
                ))}
              </div>
            </div>
          </section>
          <WaveDivider topColor={C.primaryContainer} bottomColor={C.primary} />
        </>
      )}
      {displayPast.length === 0 && <WaveDivider topColor={C.surface} bottomColor={C.primary} />}

      {/* ═══ CTA ═══ */}
      <section style={{ background: C.primary, padding: '88px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 20 }}>🥭</span>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: C.gold, margin: '0 0 14px',
          }}>
            ✦ Ne manquez rien
          </p>
          <h2 style={{
            fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700, color: '#ffffff', margin: '0 0 14px', lineHeight: 1.2,
          }}>
            Rejoignez la communauté Ben's
          </h2>
          <p style={{
            fontFamily: FONT_BODY,
            color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem',
            lineHeight: 1.8, margin: '0 0 32px',
          }}>
            Marchés, ateliers, dégustations — soyez le premier informé de nos prochains rendez-vous et vivez l'expérience Ben's de près.
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.contact)}
            style={{
              background: C.gold, color: '#ffffff', border: 'none', borderRadius: 9999,
              padding: '15px 40px', fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(224,122,32,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Nous contacter
          </button>
        </div>
      </section>
      <WaveDivider topColor={C.primary} bottomColor="#1a3a2a" />
    </div>
  );
}
