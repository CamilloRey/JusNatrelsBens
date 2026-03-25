import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';
import type { AttendanceRequest } from '../types/event.types';

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
const CONTENT_W     = 900;
const MAX_W         = 1280;

const FALLBACK_IMG = 'https://gflkfwalfaeeknauxyig.supabase.co/storage/v1/object/public/images/photos/photo-jus.png';

const PLACEHOLDER_EVENTS = [
  {
    id: 'placeholder-1',
    title: 'Atelier de Pressage',
    date: '2026-05-17',
    location: 'Marché Jean-Talon, Montréal',
    description: "Venez découvrir l'art du pressage de fruits frais avec nos experts.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-2',
    title: 'Festival des Récoltes',
    date: '2026-06-20',
    location: 'Marché Atwater, Montréal',
    description: "Célébrez la saison des récoltes avec nous\u00a0! Dégustation, ateliers et rencontres.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-3',
    title: "Marché d'Été Ben's",
    date: '2026-07-12',
    location: 'Marché Jean-Talon, Montréal',
    description: "Retrouvez-nous au marché pour une sélection spéciale de jus d'été.",
    img: FALLBACK_IMG,
    active: true,
  },
  {
    id: 'placeholder-4',
    title: 'Dégustation Hivernale',
    date: '2025-12-05',
    location: 'Marché Bonsecours, Montréal',
    description: 'Une soirée de dégustation autour de nos jus chauds et mélanges hivernaux.',
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
  return parseDateUTC(dateStr).toLocaleString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

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

interface EventLike {
  id: string; title: string; date: string;
  location?: string; description: string; img?: string; active: boolean;
}

/* ─── Small card (upcoming + past) ─── */
function SmallEventCard({ event, onNavigate, isPast = false }: {
  event: EventLike; onNavigate: (id: string) => void; isPast?: boolean;
}) {
  const img = event.img || FALLBACK_IMG;
  return (
    <div
      style={{
        background: isPast ? 'rgba(255,255,255,0.07)' : '#ffffff',
        borderRadius: '1.25rem', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: isPast ? 'none' : '0 4px 20px rgba(27,77,56,0.08)',
        border: isPast ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(27,77,56,0.06)',
        cursor: 'pointer',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
      onClick={() => onNavigate(event.id)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = isPast ? '0 12px 32px rgba(0,0,0,0.2)' : '0 12px 36px rgba(27,77,56,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isPast ? 'none' : '0 4px 20px rgba(27,77,56,0.08)'; }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        <img
          src={img} alt={event.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: isPast ? 'grayscale(70%) brightness(0.85)' : 'none',
            transition: 'filter 0.4s, transform 0.4s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)';
            if (isPast) (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%) brightness(1)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
            if (isPast) (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(70%) brightness(0.85)';
          }}
        />
        {isPast && (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,77,56,0.65) 0%, transparent 55%)' }} />
        )}
        {!isPast && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: C.primary, color: '#ffffff',
            borderRadius: '0.6rem', padding: '6px 10px',
            textAlign: 'center', minWidth: 40,
            boxShadow: '0 4px 14px rgba(27,77,56,0.3)',
          }}>
            <div style={{ fontFamily: FONT_HEADLINE, fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}>
              {formatDay(event.date)}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', marginTop: 2 }}>
              {formatMonth(event.date)}
            </div>
          </div>
        )}
        {isPast && (
          <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: '0.6rem', fontWeight: 700, color: C.gold, margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
              {formatMonthLong(event.date)} {formatYear(event.date)}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {event.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isPast ? 'rgba(255,255,255,0.45)' : C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ fontFamily: FONT_BODY, fontSize: '0.7rem', color: isPast ? 'rgba(255,255,255,0.5)' : C.onSurfaceVariant, fontWeight: 600 }}>
              {event.location}
            </span>
          </div>
        )}
        <h3 style={{
          fontFamily: FONT_HEADLINE, fontSize: '0.95rem', fontStyle: 'italic',
          fontWeight: 700, color: isPast ? '#ffffff' : C.onSurface,
          lineHeight: 1.3, margin: 0,
        }}>
          {event.title}
        </h3>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════ MAIN ═══════════════════════════════════════ */
export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { events, updateEvents } = useData();
  const navigate = useNavigate();
  const today    = new Date().toISOString().split('T')[0];

  const [showForm,   setShowForm]   = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [formData,   setFormData]   = useState({ name: '', email: '', phone: '', message: '' });

  const event = events.find(e => e.id === id);

  /* related events */
  const activeEvents   = events.filter(e => e.active && e.id !== id);
  const otherUpcoming  = activeEvents.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const pastEvents     = activeEvents.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  const displayOtherUpcoming: EventLike[] =
    otherUpcoming.length > 0
      ? otherUpcoming
      : PLACEHOLDER_EVENTS.filter(e => e.date >= today && e.id !== id).slice(0, 3);
  const displayPast: EventLike[] =
    pastEvents.length > 0
      ? pastEvents
      : PLACEHOLDER_EVENTS.filter(e => e.date < today).slice(0, 4);

  function handleNavigate(targetId: string) {
    if (!targetId.startsWith('placeholder-')) {
      navigate(`${ROUTES.events}/${targetId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleAttendanceRequest() {
    if (!event || !formData.name || !formData.email) return;
    const request: AttendanceRequest = {
      id: `att_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.message || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = events.map(e =>
      e.id === event.id ? { ...e, attendanceRequests: [...(e.attendanceRequests || []), request] } : e
    );
    updateEvents(updated);
    setSubmitted(true);
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  }

  /* ─── Not found ─── */
  if (!event) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: FONT_BODY, background: C.surface }}>
        <span style={{ fontSize: '3rem' }}>🗓️</span>
        <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.4rem', color: C.primary, margin: 0 }}>Événement introuvable</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.events)}
          style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 9999, padding: '12px 28px', fontFamily: FONT_BODY, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          ← Retour aux événements
        </button>
      </div>
    );
  }

  const heroImg  = event.img || FALLBACK_IMG;
  const approvedCount = (event.attendanceRequests || []).filter(r => r.status === 'approved').length;
  const isFull   = event.maxAttendees ? approvedCount >= event.maxAttendees : false;

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface }}>
      <SEO
        title={event.title}
        description={event.description}
        url={`https://lesjusnaturelsbens.com/evenements/${id}`}
      />

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: 'min(600px, 75vh)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        {/* Event photo as background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${heroImg}')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 0,
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(27,77,56,0.88) 0%, rgba(27,77,56,0.45) 45%, rgba(27,77,56,0.15) 100%)',
          zIndex: 1,
        }} />

        {/* Back button — glassmorphism */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.events)}
          style={{
            position: 'absolute', top: 32, left: 32, zIndex: 3,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#ffffff',
            fontFamily: FONT_BODY, fontSize: '0.82rem', fontWeight: 700,
            padding: '10px 20px', borderRadius: 9999, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
        >
          ← Tous les événements
        </button>

        {/* Hero content anchored bottom */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: MAX_W, margin: '0 auto', padding: '0 2rem 56px', width: '100%' }}>
          {/* Type badge */}
          <span style={{
            display: 'inline-block',
            background: C.gold, color: '#ffffff',
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            padding: '6px 16px', borderRadius: 9999, marginBottom: 20,
          }}>
            ✦ {event.type || 'Événement'}
          </span>

          <h1 style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
            fontWeight: 700,
            color: '#ffffff', lineHeight: 1.08,
            margin: '0 0 20px', maxWidth: '18ch',
          }}>
            {event.title}
          </h1>

          {/* Date + Location inline */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '12px 32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: C.primary, color: '#ffffff',
                borderRadius: '0.75rem', padding: '8px 14px',
                textAlign: 'center', minWidth: 52,
              }}>
                <div style={{ fontFamily: FONT_HEADLINE, fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>
                  {formatDay(event.date)}
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', marginTop: 3 }}>
                  {formatMonth(event.date)}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.75rem', fontWeight: 700, color: C.gold, margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                  {formatMonthLong(event.date)} {formatYear(event.date)}
                </p>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0, textTransform: 'capitalize' as const }}>
                  {formatFullDate(event.date).split(',')[0]}
                  {event.time && <span> · {event.time}</span>}
                </p>
              </div>
            </div>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ fontFamily: FONT_BODY, fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                  {event.location}
                  {event.address && <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}> — {event.address}</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor={C.surface} />

      {/* ═══ CONTENT ═══ */}
      <section style={{ maxWidth: CONTENT_W, margin: '0 auto', padding: '64px 2rem 80px' }}>

        {/* Description */}
        <div style={{
          fontFamily: FONT_BODY, fontSize: '1.05rem', color: C.onSurfaceVariant,
          lineHeight: 1.85, marginBottom: 48,
          borderLeft: `3px solid ${C.gold}`,
          paddingLeft: 24,
        }}>
          {event.description}
        </div>

        {/* Places restantes — seule info non répétée du hero */}
        {event.maxAttendees && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            background: C.surfaceContainerLow, borderRadius: '1rem',
            padding: '18px 24px', marginBottom: 48,
            border: `1px solid ${C.surfaceContainer}`,
          }}>
            <span style={{ fontSize: '1.4rem' }}>👥</span>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: C.onSurfaceVariant, margin: '0 0 2px' }}>
                Places
              </p>
              <p style={{ fontFamily: FONT_BODY, fontSize: '0.95rem', fontWeight: 700, color: isFull ? '#b91c1c' : C.primaryContainer, margin: 0 }}>
                {isFull ? 'Complet' : `${event.maxAttendees - approvedCount} places disponibles`}
              </p>
            </div>
          </div>
        )}

        {/* Google Maps button */}
        {event.address && (
          <button
            type="button"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location ?? ''} ${event.address}`)}`, '_blank')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'none', color: C.primaryContainer,
              fontFamily: FONT_BODY, fontSize: '0.88rem', fontWeight: 700,
              padding: '11px 22px', borderRadius: 9999,
              border: `1.5px solid ${C.primaryContainer}40`,
              cursor: 'pointer', marginBottom: 56,
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.primaryContainer; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.primaryContainer; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            Voir sur Google Maps
          </button>
        )}

        {/* ─── Attendance form ─── */}
        {event.attendanceEnabled && (
          <div style={{
            background: `linear-gradient(135deg, ${C.surfaceContainerLow} 0%, ${C.surfaceContainer} 100%)`,
            borderRadius: '1.75rem',
            padding: '40px 44px',
            border: `1px solid ${C.surfaceContainer}`,
            marginBottom: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' as const, marginBottom: 24 }}>
              <div>
                <p style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 8px' }}>
                  ✦ Participation
                </p>
                <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: C.onSurface, margin: 0 }}>
                  Réserver ma place
                </h2>
              </div>
              {event.maxAttendees && (
                <div style={{ background: isFull ? '#fee2e2' : '#dcfce7', borderRadius: '0.75rem', padding: '8px 16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: FONT_HEADLINE, fontSize: '1.4rem', fontWeight: 700, color: isFull ? '#991b1b' : C.primaryContainer, margin: 0, lineHeight: 1 }}>
                    {event.maxAttendees - approvedCount}
                  </p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: '0.65rem', fontWeight: 700, color: isFull ? '#b91c1c' : C.primaryContainer, margin: '2px 0 0', letterSpacing: '0.05em' }}>
                    {isFull ? 'complet' : 'places restantes'}
                  </p>
                </div>
              )}
            </div>

            {submitted && (
              <div style={{ padding: '16px 20px', background: '#dcfce7', borderRadius: '0.75rem', border: '1px solid #86efac', marginBottom: 20 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: '0.9rem', color: '#166534', fontWeight: 600, margin: 0 }}>
                  ✅ Votre demande a bien été envoyée ! Nous vous contacterons pour confirmer votre place.
                </p>
              </div>
            )}

            {!isFull && !submitted && !showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                  color: '#ffffff', border: 'none', borderRadius: 9999,
                  padding: '16px 36px', fontFamily: FONT_BODY, fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: '0 4px 20px rgba(27,77,56,0.2)',
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.transform = 'translateY(-2px)'; 
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(27,77,56,0.3)'; 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(27,77,56,0.2)'; 
                }}
              >
                Je souhaite participer →
              </button>
            )}

            {isFull && !submitted && (
              <p style={{ fontFamily: FONT_BODY, color: '#b91c1c', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                Cet événement est complet. Contactez-nous pour être sur liste d'attente.
              </p>
            )}

            {showForm && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
                {[
                  { key: 'name', label: 'Nom complet *', type: 'text', placeholder: 'Votre nom' },
                  { key: 'email', label: 'Adresse email *', type: 'email', placeholder: 'votre@email.com' },
                  { key: 'phone', label: 'Téléphone', type: 'tel', placeholder: '(514) 555-0123' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontFamily: FONT_BODY, fontSize: '0.7rem', fontWeight: 700, color: C.onSurfaceVariant, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: '0.75rem',
                        border: `1.5px solid ${C.surfaceContainer}`,
                        fontFamily: FONT_BODY, fontSize: '0.9rem', color: C.onSurface,
                        background: '#ffffff', outline: 'none', boxSizing: 'border-box' as const,
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontFamily: FONT_BODY, fontSize: '0.7rem', fontWeight: 700, color: C.onSurfaceVariant, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 6 }}>
                    Message (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Un message pour nous..."
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '0.75rem',
                      border: `1.5px solid ${C.surfaceContainer}`,
                      fontFamily: FONT_BODY, fontSize: '0.9rem', color: C.onSurface,
                      background: '#ffffff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' as const,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={handleAttendanceRequest}
                    disabled={!formData.name || !formData.email}
                    style={{
                      background: C.primary, color: '#fff', border: 'none', borderRadius: 9999,
                      padding: '12px 28px', fontFamily: FONT_BODY, fontSize: '0.9rem', fontWeight: 700,
                      cursor: 'pointer', opacity: !formData.name || !formData.email ? 0.5 : 1,
                    }}
                  >
                    Envoyer ma demande
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{
                      background: 'none', color: C.onSurfaceVariant,
                      border: `1.5px solid ${C.surfaceContainer}`, borderRadius: 9999,
                      padding: '12px 24px', fontFamily: FONT_BODY, fontSize: '0.9rem', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══ AUTRES ÉVÉNEMENTS À VENIR ═══ */}
      {displayOtherUpcoming.length > 0 && (
        <>
          <WaveDivider topColor={C.surface} bottomColor={C.surfaceContainerLow} />
          <section style={{ background: C.surfaceContainerLow, padding: '72px 2rem 88px' }}>
            <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 12px' }}>
                  Calendrier
                </p>
                <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, color: C.onSurface, margin: 0 }}>
                  Autres Événements à Venir
                </h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                gap: 24,
              }}>
                {displayOtherUpcoming.map(ev => (
                  <SmallEventCard key={ev.id} event={ev} onNavigate={handleNavigate} isPast={false} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.events)}
                  style={{
                    background: 'none', color: C.primaryContainer,
                    border: `1.5px solid ${C.primaryContainer}40`,
                    borderRadius: 9999, padding: '12px 28px',
                    fontFamily: FONT_BODY, fontSize: '0.9rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.primaryContainer; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.primaryContainer; }}
                >
                  Voir tous les événements →
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══ ÉVÉNEMENTS PASSÉS ═══ */}
      {displayPast.length > 0 && (
        <>
          <WaveDivider topColor={displayOtherUpcoming.length > 0 ? C.surfaceContainerLow : C.surface} bottomColor={C.primaryContainer} />
          <section style={{ background: C.primaryContainer, padding: '72px 2rem 88px' }}>
            <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: C.gold, margin: '0 0 12px' }}>
                  Souvenirs
                </p>
                <h2 style={{ fontFamily: FONT_HEADLINE, fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontStyle: 'italic', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Événements Passés
                </h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                gap: 20,
              }}>
                {displayPast.map(ev => (
                  <SmallEventCard key={ev.id} event={ev} onNavigate={handleNavigate} isPast={true} />
                ))}
              </div>
            </div>
          </section>
          <WaveDivider topColor={C.primaryContainer} bottomColor="#1a3a2a" />
        </>
      )}
      {displayPast.length === 0 && <WaveDivider topColor={displayOtherUpcoming.length > 0 ? C.surfaceContainerLow : C.surface} bottomColor="#1a3a2a" />}
    </div>
  );
}
