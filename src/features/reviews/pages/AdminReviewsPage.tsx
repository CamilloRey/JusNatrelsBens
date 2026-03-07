import { useData } from '@/app/providers/DataContext';
import { C }       from '@/shared/constants/colors';
import { Icon }    from '@/shared/ui/Icon';
import { formatDate } from '@/shared/utils/format';

export default function AdminReviewsPage() {
  const { reviews, updateReviews, logActivity } = useData();

  const toggle = (id: string, approved: boolean) => {
    updateReviews(reviews.map(r => r.id === id ? { ...r, approved: !approved } : r));
    logActivity('Avis ' + (!approved ? 'approuvé' : 'masqué'), `Avis de ${reviews.find(r => r.id === id)?.name}`, 'review');
  };

  const remove = (id: string) => {
    const r = reviews.find(r => r.id === id);
    if (!r || !confirm(`Supprimer l'avis de ${r.name} ?`)) return;
    updateReviews(reviews.filter(r => r.id !== id));
    logActivity('Avis supprimé', `Avis de ${r.name} supprimé`, 'review');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {reviews.map(r => (
        <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{r.name}</span>
                <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: r.approved ? '#dcfce7' : '#fef3c7', color: r.approved ? '#166534' : '#92400e', fontWeight: 600 }}>
                  {r.approved ? '✓ Approuvé' : '⏳ En attente'}
                </span>
              </div>
              <p style={{ fontSize: 14, color: C.text, lineHeight: 1.6, margin: '0 0 4px' }}>"{r.text}"</p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{formatDate(r.date)}</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => toggle(r.id, r.approved)}
                style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${r.approved ? C.border : C.green}`, background: r.approved ? '#fff' : `${C.green}12`, color: r.approved ? C.muted : C.green, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                {r.approved ? 'Masquer' : 'Approuver'}
              </button>
              <button onClick={() => remove(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
                <Icon type="trash" size={16} color="#dc2626" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
