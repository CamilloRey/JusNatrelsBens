import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';

const TYPE_EMOJIS: Record<string, string> = {
  'Marche': '🌍',
  'Festival': '🎉',
  'Degustation': '🥤',
  'Atelier': '👨‍🍳',
  'Marché': '🌍',
  'Dégustation': '🥤',
  'Événement': '📅',
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { events } = useData();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <section className="page-shell" style={{ textAlign: 'center', paddingBottom: 20 }}>
        <p className="page-subtitle" style={{ marginTop: 0 }}>
          Événement non trouvé
        </p>
        <button
          type="button"
          className="btn-light anim-btn"
          onClick={() => navigate(ROUTES.events)}
        >
          ← Retour aux événements
        </button>
      </section>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  const emoji = TYPE_EMOJIS[event.type] || '📅';

  return (
    <div>
      <SEO
        title={event.title}
        description={event.description}
        url={`https://lesjusnatuelsbens.com/evenements/${id}`}
      />

      <section className="page-shell" style={{ paddingTop: 20 }}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.events)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--brand-primary)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'gap 0.24s ease',
            padding: '8px 0',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.gap = '12px';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.gap = '8px';
          }}
        >
          ← Retour aux événements
        </button>

        {/* EVENT HERO */}
        <div
          style={{
            marginTop: 32,
            paddingBottom: 40,
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: 'var(--brand-primary)',
                color: 'white',
                borderRadius: '999px',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {event.type}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            {event.title}
          </h1>

          <div
            style={{
              display: 'flex',
              gap: 24,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              fontSize: 14,
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>📅</span>
              <div>
                <div>{formattedDate}</div>
                {event.time && <div style={{ fontSize: 12, fontWeight: 400 }}>{event.time}</div>}
              </div>
            </div>
            {event.location && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>📍</span>
                <div>
                  <div>{event.location}</div>
                  {event.address && (
                    <div style={{ fontSize: 12, fontWeight: 400 }}>{event.address}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EVENT CONTENT */}
        <div
          style={{
            marginTop: 48,
            maxWidth: 800,
          }}
        >
          {/* HERO IMAGE */}
          <div
            style={{
              height: 400,
              background: event.img
                ? `url(${event.img})`
                : 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 120,
              marginBottom: 48,
              overflow: 'hidden',
            }}
          >
            {!event.img && emoji}
          </div>

          {/* DESCRIPTION */}
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: 48,
            }}
          >
            <p>{event.description}</p>
          </div>

          {/* KEY DETAILS */}
          <div
            style={{
              padding: 32,
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 48,
            }}
          >
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                fontFamily: "'Playfair Display', serif",
                color: 'var(--text-primary)',
                marginBottom: 24,
                margin: '0 0 24px 0',
              }}
            >
              ℹ️ Détails de l'événement
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  Date
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {formattedDate}
                </div>
              </div>

              {event.time && (
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    Horaire
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {event.time}
                  </div>
                </div>
              )}

              {event.location && (
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    Lieu
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {event.location}
                  </div>
                </div>
              )}

              {event.address && (
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    Adresse
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {event.address}
                  </div>
                </div>
              )}

              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  Type
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {event.type}
                </div>
              </div>
            </div>

            {event.address && (
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${event.location} ${event.address}`
                    )}`,
                    '_blank'
                  );
                }}
                style={{
                  marginTop: 20,
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.24s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'var(--accent-primary)';
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'var(--brand-primary)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                📍 Voir sur Google Maps
              </button>
            )}
          </div>

          {/* CTA */}
          <div
            style={{
              padding: 32,
              background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.08), rgba(255, 138, 26, 0.06))',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 12,
                margin: '0 0 12px 0',
              }}
            >
              Vous êtes intéressé?
            </h3>
            <p
              style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                marginBottom: 20,
                margin: '0 0 20px 0',
              }}
            >
              Découvrez nos produits pour cet événement
            </p>
            <button
              className="btn-solid anim-btn"
              onClick={() => navigate(ROUTES.products)}
              style={{
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              🛍️ Découvrir nos produits
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
