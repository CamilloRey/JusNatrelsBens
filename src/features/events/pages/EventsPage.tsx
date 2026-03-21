import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { Icon } from '@/shared/ui/Icon';

const TYPE_EMOJIS: Record<string, string> = {
  'Marche': '🌍',
  'Festival': '🎉',
  'Degustation': '🥤',
  'Atelier': '👨‍🍳',
  'Marché': '🌍',
  'Dégustation': '🥤',
  'Événement': '📅',
};

export default function EventsPage() {
  const { t } = useTranslation();
  const { events } = useData();

  const active = events.filter((event) => event.active).sort((a, b) => a.date.localeCompare(b.date));
  const today = new Date().toISOString().split('T')[0];

  const upcoming = active.filter((event) => event.date >= today);
  const past = active.filter((event) => event.date < today);

  return (
    <div>
      <SEO
        title="Événements"
        description="Découvrez les événements de Ben's Jus Naturels. Dégustations, ateliers, festivals et marchés à Montréal."
        url="https://lesjusnatuelsbens.com/evenements"
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Agenda</p>
          <h1 className="page-hero-title">{t('events.title')}</h1>
          <p className="page-hero-subtitle">{t('events.subtitle')}</p>
        </div>
      </section>

      <section className="events-page-shell">
        {upcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>📅</p>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{t('events.none')}</p>
          </div>
        ) : (
          <>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 32,
              color: 'var(--text-primary)',
            }}>
              Prochains événements
            </h2>
            <div className="events-timeline">
              {upcoming.map((event) => {
                const date = new Date(event.date);
                const emoji = TYPE_EMOJIS[event.type] ?? '📅';
                return (
                  <article key={event.id} className="event-timeline-item anim-card">
                    <div className="event-timeline-date">
                      <span className="month">
                        {date.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}
                      </span>
                      <span className="day">{date.getUTCDate()}</span>
                      <span className="year">{date.getUTCFullYear()}</span>
                    </div>

                    <div className="event-timeline-content">
                      <span className="event-timeline-type">{emoji} {event.type}</span>
                      <h3>{event.title}</h3>
                      {event.description && (
                        <p style={{
                          fontSize: 14,
                          color: 'var(--text-secondary)',
                          margin: '8px 0 0',
                          lineHeight: 1.5,
                        }}>
                          {event.description}
                        </p>
                      )}
                      <div className="event-timeline-details">
                        <p>
                          <Icon type="map" size={14} />
                          {event.location}{event.address ? ` - ${event.address}` : ''}
                        </p>
                        {event.time && (
                          <p>
                            <Icon type="clock" size={14} />
                            {event.time}
                          </p>
                        )}
                      </div>
                      {event.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location} ${event.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            marginTop: 12,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            color: 'var(--brand-primary)',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: 13,
                            transition: 'all 0.24s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.gap = '10px';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.gap = '6px';
                          }}
                        >
                          {t('events.directions')} →
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: 60, paddingTop: 60, borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 32,
              color: 'var(--text-secondary)',
            }}>
              {t('events.pastTitle')}
            </h2>

            <div className="events-timeline" style={{ opacity: 0.7 }}>
              {past.map((event) => {
                const date = new Date(event.date);
                const emoji = TYPE_EMOJIS[event.type] ?? '📅';
                return (
                  <article key={event.id} className="event-timeline-item">
                    <div className="event-timeline-date">
                      <span className="month">
                        {date.toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}
                      </span>
                      <span className="day">{date.getUTCDate()}</span>
                      <span className="year">{date.getUTCFullYear()}</span>
                    </div>

                    <div className="event-timeline-content">
                      <span className="event-timeline-type">{emoji} {event.type}</span>
                      <h3>{event.title}</h3>
                      <div className="event-timeline-details">
                        <p>
                          <Icon type="map" size={14} />
                          {event.location}
                        </p>
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


