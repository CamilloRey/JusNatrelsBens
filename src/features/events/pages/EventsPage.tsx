import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';

const PRIMARY             = '#032416';
const SECONDARY           = '#7b5804';
const SECONDARY_CONTAINER = '#fdcd74';
const SURFACE_CONTAINER_LOW = '#f8f3e9';
const ON_SURFACE          = '#1d1c16';
const ON_SURFACE_VARIANT  = '#424843';
const FONT_HEADLINE       = "'Noto Serif', serif";
const FONT_BODY           = "'Plus Jakarta Sans', sans-serif";
const FALLBACK_IMG        = '/images-bens/photos/photo-jus.png';

const PLACEHOLDER_EVENTS = [
  {
    id: 'placeholder-1',
    title: "Atelier de Pressage",
    date: '2024-07-20',
    location: "Marche Jean-Talon, Montreal",
    description: "Venez decouvrir l'art du pressage de fruits frais avec nos experts. Un moment convivial pour apprendre et deguster.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-2',
    title: "Festival des Recoltes",
    date: '2024-08-15',
    location: "Marche Atwater, Montreal",
    description: "Celebrez la saison des recoltes avec nous! Degustation, ateliers et rencontres autour des jus naturels.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-3',
    title: "Marche d'Automne",
    date: '2024-09-10',
    location: "Marche Jean-Talon, Montreal",
    description: "Retrouvez-nous au marche pour une selection speciale de jus d'automne avec pommes et courges.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-4',
    title: "Degustation Hivernale",
    date: '2023-12-05',
    location: "Marche Bonsecours, Montreal",
    description: "Une soiree de degustation autour de nos jus chauds et melanges hivernaux.",
    img: FALLBACK_IMG,
    active: true,
  },
];

function parseDateUTC(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatDay(dateStr: string) {
  return parseDateUTC(dateStr).getUTCDate();
}

function formatMonth(dateStr: string) {
  return parseDateUTC(dateStr).toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' });
}

function formatMonthLong(dateStr: string) {
  return parseDateUTC(dateStr).toLocaleString('fr-CA', { month: 'long', timeZone: 'UTC' });
}

function formatYear(dateStr: string) {
  return parseDateUTC(dateStr).getUTCFullYear();
}

interface EventLike {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  img?: string;
  active: boolean;
}

interface EventCardProps {
  event: EventLike;
  offset?: boolean;
  onNavigate: (id: string) => void;
}

function EventCard({ event, offset, onNavigate }: EventCardProps) {
  const img = event.img || FALLBACK_IMG;
  const borderRadius = offset ? '5rem 0 0 0' : '0 5rem 0 0';

  return (
    <div
      style={{
        paddingTop: offset ? '6rem' : '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Image with leaf mask and date badge */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            borderRadius,
            overflow: 'hidden',
            aspectRatio: '4 / 3',
            cursor: 'pointer',
          }}
          onClick={() => onNavigate(event.id)}
        >
          <img
            src={img}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Date badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '-1.25rem',
            left: offset ? 'auto' : '1.5rem',
            right: offset ? '1.5rem' : 'auto',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            padding: '1rem',
            minWidth: '4rem',
            textAlign: 'center',
            borderRadius: '0.5rem',
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: '2.25rem',
              fontWeight: 700,
              color: SECONDARY,
              lineHeight: 1,
            }}
          >
            {formatDay(event.date)}
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: ON_SURFACE_VARIANT,
              marginTop: '0.25rem',
            }}
          >
            {formatMonth(event.date)}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Location row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: FONT_BODY,
            fontSize: '0.8125rem',
            color: ON_SURFACE_VARIANT,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SECONDARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{event.location}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: FONT_HEADLINE,
            fontSize: '1.75rem',
            fontStyle: 'italic',
            fontWeight: 700,
            color: ON_SURFACE,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.9375rem',
            color: ON_SURFACE_VARIANT,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {event.description}
        </p>

        {/* CTA button */}
        <button
          onClick={() => onNavigate(event.id)}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: PRIMARY,
            color: '#ffffff',
            fontFamily: FONT_BODY,
            fontSize: '0.9375rem',
            fontWeight: 600,
            padding: '0.625rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}
        >
          {"Reserver ma place"}
        </button>
      </div>
    </div>
  );
}

interface PastCardProps {
  event: EventLike;
  onNavigate: (id: string) => void;
}

function PastCard({ event, onNavigate }: PastCardProps) {
  const img = event.img || FALLBACK_IMG;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', cursor: 'pointer' }}
      onClick={() => onNavigate(event.id)}
    >
      {/* Square image */}
      <div
        style={{
          aspectRatio: '1 / 1',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={img}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'grayscale(100%)',
            opacity: 0.6,
            transition: 'filter 0.3s ease, opacity 0.3s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%)';
            (e.currentTarget as HTMLImageElement).style.opacity = '1';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%)';
            (e.currentTarget as HTMLImageElement).style.opacity = '0.6';
          }}
        />
      </div>

      {/* Date + title */}
      <div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: '0.75rem',
            color: SECONDARY,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.25rem',
          }}
        >
          {formatMonthLong(event.date)} {formatYear(event.date)}
        </div>
        <div
          style={{
            fontFamily: FONT_HEADLINE,
            fontSize: '1rem',
            fontStyle: 'italic',
            color: ON_SURFACE,
            lineHeight: 1.3,
          }}
        >
          {event.title}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { events } = useData();
  const navigate   = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const activeEvents = useMemo(
    () => events.filter(e => e.active).sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  );

  const upcoming: EventLike[] = useMemo(
    () => activeEvents.filter(e => e.date >= today),
    [activeEvents, today],
  );

  const past: EventLike[] = useMemo(
    () => activeEvents.filter(e => e.date < today),
    [activeEvents, today],
  );

  const displayUpcoming: EventLike[] = upcoming.length > 0 ? upcoming : PLACEHOLDER_EVENTS.filter(e => e.date >= today);
  const displayPast: EventLike[]     = past.length > 0     ? past     : PLACEHOLDER_EVENTS.filter(e => e.date < today);

  function handleNavigate(id: string) {
    if (!id.startsWith('placeholder-')) {
      navigate(`${ROUTES.events}/${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <>
      <SEO
        title={"Nos Evenements"}
        description={"Ateliers, recoltes et celebrations a Montreal — rejoignez la communaute Les Jus Naturels Ben's."}
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: 'min(819px, 100vh)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/images-bens/hero-banners/banniere-evenements.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />

        {/* Gradient overlay left to right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #fef9ef 35%, transparent 75%)',
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '5rem 2rem',
            width: '100%',
          }}
        >
          {/* Pill label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: SECONDARY_CONTAINER,
              color: SECONDARY,
              fontFamily: FONT_BODY,
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.375rem 1rem',
              borderRadius: '999px',
              marginBottom: '1.5rem',
              letterSpacing: '0.04em',
            }}
          >
            {"L\u2019Expérience Ben\u2019s"}
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: 700,
              color: ON_SURFACE,
              lineHeight: 1.05,
              margin: '0 0 1.5rem 0',
              maxWidth: '14ch',
            }}
          >
            {"Nos "}
            <em style={{ fontStyle: 'italic', color: PRIMARY }}>
              {"Événements"}
            </em>
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: '1.0625rem',
              color: ON_SURFACE_VARIANT,
              lineHeight: 1.7,
              maxWidth: '38ch',
              margin: '0 0 2.5rem 0',
            }}
          >
            {"Ateliers de pressage, récoltes en plein air et célébrations saisonnières \u2014 vivez l\u2019expérience Ben\u2019s au cœur de Montréal."}
          </p>

          {/* CTA button */}
          <a
            href="#upcoming"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: PRIMARY,
              color: '#ffffff',
              fontFamily: FONT_BODY,
              fontSize: '1rem',
              fontWeight: 600,
              padding: '0.875rem 2rem',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            {"Découvrir le calendrier \u2192"}
          </a>
        </div>
      </section>

      {/* ── 2. UPCOMING EVENTS ──────────────────────────────────────── */}
      <section
        id="upcoming"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '8rem 2rem',
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '5rem',
            gap: '1rem',
          }}
        >
          <h2
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: ON_SURFACE,
              margin: 0,
            }}
          >
            {"Prochaines Célébrations"}
          </h2>
          <span
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 900,
              color: ON_SURFACE,
              opacity: 0.06,
              lineHeight: 1,
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            {"2024"}
          </span>
        </div>

        {/* 2-col staggered grid */}
        {displayUpcoming.length === 0 ? (
          <p style={{ fontFamily: FONT_BODY, color: ON_SURFACE_VARIANT, textAlign: 'center', padding: '4rem 0' }}>
            {"Aucun événement à venir pour le moment."}
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {displayUpcoming.slice(0, 2).map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                offset={idx === 1}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 3. PAST EVENTS ──────────────────────────────────────────── */}
      {displayPast.length > 0 && (
        <section
          style={{
            backgroundColor: SURFACE_CONTAINER_LOW,
            padding: '8rem 0',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 2rem',
            }}
          >
            {/* Center header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2
                style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  color: ON_SURFACE,
                  margin: 0,
                }}
              >
                {"Souvenirs de Récoltes"}
              </h2>
            </div>

            {/* 4-col photo grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                gap: '1.5rem',
              }}
            >
              {displayPast.map(event => (
                <PastCard key={event.id} event={event} onNavigate={handleNavigate} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
