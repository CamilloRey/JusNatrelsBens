import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';

const TYPE_COLORS: Record<string, string> = {
  Marche: C.green,
  Festival: C.hibiscus,
  Degustation: C.gold,
  Atelier: C.red,
  'Marché': C.green,
  'Dégustation': C.gold,
};

export default function EventsPage() {
  const { t } = useTranslation();
  const { events, settings } = useData();

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
              return (
                <article key={event.id} className="surface-card anim-card" style={{ overflow: 'hidden', padding: 0 }}>
                  {event.img && (
                    <div style={{ height: 210, overflow: 'hidden' }}>
                      <img
                        src={event.img}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
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
                        <span className="type" style={{ background: `${color}1a`, color }}>{event.type}</span>
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
          <div className="section-stack" style={{ marginTop: 34 }}>
            <h2 className="section-title" style={{ fontSize: 24, color: 'var(--ink-muted)' }}>
              {t('events.pastTitle')}
            </h2>

            <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
              {past.map((event) => {
                const date = new Date(event.date);
                return (
                  <article key={event.id} className="surface-card" style={{ padding: 15, opacity: 0.72 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ fontSize: 17, color: 'var(--ink-strong)' }}>{event.title}</h3>
                        <p className="mini-muted" style={{ marginTop: 5 }}>{event.location}</p>
                      </div>
                      <span className="mini-muted">
                        {date.toLocaleDateString('fr-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </span>
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
