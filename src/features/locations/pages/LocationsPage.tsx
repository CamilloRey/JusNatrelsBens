import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { Icon } from '@/shared/ui/Icon';

export default function LocationsPage() {
  const { t } = useTranslation();
  const { locations, settings } = useData();

  const active = useMemo(() => locations.filter((location) => location.active), [locations]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedLocation = active.find((location) => location.id === selectedId) ?? active[0];
  const mapQuery = encodeURIComponent(
    selectedLocation ? `${selectedLocation.name} ${selectedLocation.address}` : 'Montreal'
  );

  return (
    <div>
      <section
        className="page-hero"
        style={{
          backgroundImage: `url('${settings.bannerEvents || '/images-bens/hero-banners/banniere-points-vente.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Points de vente</p>
          <h1 className="page-hero-title">{t('locations.title')}</h1>
          <p className="page-hero-subtitle">{t('locations.subtitle')}</p>
        </div>
      </section>

      <section className="page-shell">
        <div className="two-col" style={{ alignItems: 'start' }}>
          <div className="surface-card" style={{ overflow: 'hidden', minHeight: 420 }}>
            <iframe
              title={t('locations.mapTitle')}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              style={{ width: '100%', minHeight: 420, border: 'none' }}
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {active.map((location) => {
              const activeCard = selectedLocation?.id === location.id;
              return (
                <article
                  key={location.id}
                  className="surface-card anim-card"
                  style={{
                    padding: 14,
                    borderColor: activeCard ? 'rgba(196, 69, 54, 0.45)' : 'rgba(234, 218, 200, 0.9)',
                    background: activeCard ? 'rgba(196,69,54,0.08)' : 'rgba(255,255,255,0.88)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedId(location.id)}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: 'rgba(42,106,79,0.16)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon type="map" size={18} color="#2a6a4f" />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 16, color: 'var(--ink-strong)' }}>{location.name}</h3>
                        <span className="pill-label">{location.type}</span>
                      </div>

                      <p className="page-subtitle" style={{ marginTop: 5, fontSize: 13 }}>{location.address}</p>

                      {activeCard && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name} ${location.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-light anim-btn"
                          style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}
                        >
                          <Icon type="map" size={14} color="#8b1a1a" />
                          {t('locations.directions')}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
