import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';

const TYPE_COLORS: Record<string, string> = {
  'Marche': '#5ab937',
  'Festival': '#ff8a1a',
  'Degustation': '#5ab937',
  'Atelier': '#ff8a1a',
  'Autre': '#9ca3af',
};

const TYPE_EMOJIS: Record<string, string> = {
  'Marche': '🌍',
  'Festival': '🎉',
  'Degustation': '🥤',
  'Atelier': '👨‍🍳',
  'Autre': '📅',
};

export default function EventsPage() {
  const { t } = useTranslation();
  const { events, settings } = useData();
  const navigate = useNavigate();

  const active = events.filter((event) => event.active).sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().split('T')[0];

  const upcoming = active.filter((event) => event.date >= today);
  const past = active.filter((event) => event.date < today);

  return (
    <div>
      <section
        className="page-hero"
        style={{
          backgroundImage: `url('${settings.bannerEvents || '/images-bens/hero-banners/banniere-evenements.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Agenda</p>
          <h1 className="page-hero-title">{t('events.title')}</h1>
          <p className="page-hero-subtitle">{t('events.subtitle')}</p>
        </div>
      </section>

      <section className="page-shell">
        {upcoming.length === 0 && (
          <article className="surface-card" style={{ padding: 28, textAlign: 'center' }}>
            <span style={{ display: 'inline-flex' }}>
              <Icon type="clock" size={40} color={C.hibiscus} />
            </span>
            <p className="page-subtitle" style={{ marginTop: 8 }}>{t('events.none')}</p>
          </article>
        )}

        {upcoming.length > 0 && (
          <div style={{ display: 'grid', gap: 14 }}>
            {upcoming.map((event) => {
              const date = new Date(event.date);
              const color = TYPE_COLORS[event.type] ?? C.hibiscus;
              const approvedCount = (event.attendanceRequests || []).filter(r => r.status === 'approved').length;

              return (
                <article
                  key={event.id}
                  className="surface-card anim-card"
                  onClick={() => {
                    navigate(`/events/${event.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ overflow: 'hidden', padding: 0, cursor: 'pointer' }}
                >
                  {event.img && (
                    <div style={{ height: 210, overflow: 'hidden' }}>
                      <img src={event.img} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ padding: 16 }}>
                    <div className="home-event-row">
                      <div className="home-event-date" style={{ borderColor: `${color}55`, background: `${color}18` }}>
                        <span className="day" style={{ color }}>{date.getUTCDate()}</span>
                        <span className="month" style={{ color }}>
                          {date.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}
                        </span>
                      </div>

                      <div className="home-event-body" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                          <span className="type" style={{ background: `${color}1a`, color }}>{event.type}</span>
                          {event.attendanceEnabled && (
                            <span style={{
                              fontSize: 10, padding: '2px 8px', borderRadius: 999,
                              background: '#dbeafe', color: '#1e40af', fontWeight: 600,
                            }}>
                              🙋 {approvedCount} participant(s)
                              {event.maxAttendees ? ` / ${event.maxAttendees}` : ''}
                            </span>
                          )}
                        </div>
                        <h3>{event.title}</h3>
                        <p style={{ fontSize: 13 }}>{event.description}</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon type="map" size={14} color={color} />
                          {event.location}{event.address ? ` - ${event.address}` : ''}
                        </p>
                        {event.time && (
                          <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Icon type="clock" size={14} color={color} />
                            {event.time}
                          </p>
                        )}

                        {event.address && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location} ${event.address}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ marginTop: 8, display: 'inline-block', color, fontWeight: 700, textDecoration: 'none', fontSize: 13 }}
                          >
                            {t('events.directions')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 60, borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, color: 'var(--text-secondary)' }}>
              {t('events.pastTitle')}
            </h2>

            <div className="events-timeline" style={{ opacity: 0.7 }}>
              {past.map((event) => {
                const date = new Date(event.date);
                const emoji = TYPE_EMOJIS[event.type] ?? '📅';
                return (
                  <article
                    key={event.id}
                    className="event-timeline-item"
                    onClick={() => {
                      navigate(`/events/${event.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="event-timeline-date">
                      <span className="month">{date.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}</span>
                      <span className="day">{date.getUTCDate()}</span>
                      <span className="year">{date.getUTCFullYear()}</span>
                    </div>
                    <div className="event-timeline-content">
                      <span className="event-timeline-type">{emoji} {event.type}</span>
                      <h3>{event.title}</h3>
                      <div className="event-timeline-details">
                        <p><Icon type="map" size={14} />{event.location}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
