import { useTranslation } from 'react-i18next';
import { useData }        from '@/app/providers/DataContext';
import { C }              from '@/shared/constants/colors';
import { CSS }            from '@/shared/constants/styles';

const TYPE_COLORS: Record<string, string> = {
  'Marché':      C.green,
  'Festival':    C.hibiscus,
  'Dégustation': C.gold,
  'Atelier':     C.red,
};

export default function EventsPage() {
  const { t }       = useTranslation();
  const { events }  = useData();
  const active      = events.filter(e => e.active).sort((a, b) => a.date.localeCompare(b.date));
  const today       = new Date().toISOString().split('T')[0];
  const upcoming    = active.filter(e => e.date >= today);
  const past        = active.filter(e => e.date < today);

  const Card = ({ ev }: { ev: typeof active[0] }) => {
    const d        = new Date(ev.date);
    const isPast   = ev.date < today;
    const color    = TYPE_COLORS[ev.type] ?? C.muted;
    return (
      <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.border}`, opacity: isPast ? 0.7 : 1, display: 'flex', flexDirection: 'column' }}>
        {/* Photo or color band */}
        {ev.img
          ? <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
              <img src={ev.img} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }} />
              <span style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 11, padding: '3px 10px', borderRadius: 6, background: color, color: '#fff', fontWeight: 700 }}>{ev.type}</span>
            </div>
          : <div style={{ height: 6, background: color }} />
        }
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', gap: 20 }}>
          {/* Date block */}
          <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 14, background: `${color}18`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>
              {d.getUTCDate()}
            </span>
            <span style={{ fontSize: 11, color, fontWeight: 600, textTransform: 'uppercase' }}>
              {d.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}
            </span>
          </div>
          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 6, background: `${color}18`, color, fontWeight: 700 }}>{ev.type}</span>
              {isPast && <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 6, background: '#f3f4f6', color: C.muted, fontWeight: 600 }}>{t('events.past')}</span>}
            </div>
            <h3 style={{ ...CSS.heading, fontSize: 17, fontWeight: 700, color: C.dark, margin: '0 0 6px' }}>{ev.title}</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 10px', lineHeight: 1.6 }}>{ev.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontSize: 13, color: C.text, margin: 0 }}>📅 {d.toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
              {ev.time     && <p style={{ fontSize: 13, color: C.text, margin: 0 }}>🕐 {ev.time}</p>}
              {ev.location && <p style={{ fontSize: 13, color: C.text, margin: 0 }}>📍 {ev.location}{ev.address ? ` — ${ev.address}` : ''}</p>}
            </div>
            {ev.address && (
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location + ' ' + ev.address)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 13, color, fontWeight: 600, textDecoration: 'none' }}>
                {t('events.directions')} →
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '48px 24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: '0 0 8px' }}>{t('events.title')}</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 40 }}>{t('events.subtitle')}</p>

      {upcoming.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 16, border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>📅</span>
          <p style={{ fontSize: 16, color: C.muted }}>{t('events.none')}</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {upcoming.map(ev => <Card key={ev.id} ev={ev} />)}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, color: C.muted, margin: '0 0 16px' }}>{t('events.pastTitle')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {past.map(ev => <Card key={ev.id} ev={ev} />)}
          </div>
        </>
      )}
    </div>
  );
}
