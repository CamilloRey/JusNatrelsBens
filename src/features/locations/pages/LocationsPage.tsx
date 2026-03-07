import { useState }  from 'react';
import { useData }   from '@/app/providers/DataContext';
import { C }         from '@/shared/constants/colors';
import { CSS }       from '@/shared/constants/styles';
import { Icon }      from '@/shared/ui/Icon';

export default function LocationsPage() {
  const { locations } = useData();
  const active = locations.filter(l => l.active);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ padding: '48px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: '0 0 8px' }}>Où Acheter</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>Trouvez nos jus près de chez vous à Montréal et ses environs.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, minHeight: 400 }}>
          <iframe
            title="Carte des points de vente"
            src="https://www.google.com/maps/embed/v1/search?q=Marché+Jean-Talon+Montréal&center=45.5017,-73.5673&zoom=12&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            style={{ width: '100%', height: '100%', minHeight: 400, border: 'none' }}
            loading="lazy" allowFullScreen
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {active.map(l => (
            <div key={l.id}
              onClick={() => setSelected(selected === l.id ? null : l.id)}
              style={{ background: selected === l.id ? `${C.red}08` : '#fff', borderRadius: 14, padding: '18px 20px', border: selected === l.id ? `2px solid ${C.red}44` : `1px solid ${C.border}`, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.green}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon type="map" size={20} color={C.green} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px', color: C.dark }}>{l.name}</h3>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{l.address}</p>
                </div>
                <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: C.light, color: C.muted }}>{l.type}</span>
              </div>
              {selected === l.id && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.name + ' ' + l.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: C.green, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    <Icon type="map" size={14} color="#fff" /> Itinéraire
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
