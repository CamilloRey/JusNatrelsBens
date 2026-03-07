import { useData } from '@/app/providers/DataContext';
import { C }       from '@/shared/constants/colors';
import { Icon }    from '@/shared/ui/Icon';

export default function AdminDataPage() {
  const { products, reviews, blogs, locations, subscribers, activity, exportData, resetAll } = useData();

  const stats = [
    { label: 'Produits',        count: products.length,    icon: '🍹' },
    { label: 'Avis',            count: reviews.length,     icon: '⭐' },
    { label: 'Articles',        count: blogs.length,       icon: '📝' },
    { label: 'Points de vente', count: locations.length,   icon: '📍' },
    { label: 'Abonnés',         count: subscribers.length, icon: '📧' },
    { label: 'Activités',       count: activity.length,    icon: '📋' },
  ];

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Stats summary */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: C.dark }}>Résumé des données</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {stats.map((d, i) => (
            <div key={i} style={{ background: C.light, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
              <span style={{ fontSize: 22, display: 'block', marginBottom: 4 }}>{d.icon}</span>
              <p style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: 0 }}>{d.count}</p>
              <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{d.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.green}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon type="download" size={22} color={C.green} />
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.dark }}>Exporter les données</h4>
            <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Téléchargez toutes vos données au format JSON</p>
          </div>
        </div>
        <button onClick={exportData}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none', background: C.green, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="download" size={16} color="#fff" /> Télécharger l'export JSON
        </button>
      </div>

      {/* Reset */}
      <div style={{ background: '#fef2f2', borderRadius: 14, padding: 24, border: '1px solid #fca5a5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon type="refresh" size={22} color="#dc2626" />
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#dc2626' }}>Réinitialiser les données</h4>
            <p style={{ fontSize: 12, color: '#ef4444', margin: '2px 0 0' }}>⚠️ Cette action est irréversible. Toutes les données seront remplacées par les données initiales.</p>
          </div>
        </div>
        <button onClick={resetAll}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="refresh" size={16} color="#dc2626" /> Réinitialiser toutes les données
        </button>
      </div>
    </div>
  );
}
