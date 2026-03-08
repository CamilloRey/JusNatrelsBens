import { useNavigate } from 'react-router-dom';
import { useData }     from '@/app/providers/DataContext';
import { C }           from '@/shared/constants/colors';
import { ROUTES }      from '@/shared/constants/routes';

export default function DashboardPage() {
  const { products, reviews, blogs, locations, subscribers, messages } = useData();
  const navigate = useNavigate();

  const pendingReviews  = reviews.filter(r => !r.approved).length;
  const draftBlogs      = blogs.filter(b => !b.published).length;
  const unreadMessages  = messages.filter(m => !m.read).length;
  const hour            = new Date().getHours();
  const greeting        = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const quickActions = [
    { label: 'Ajouter un produit',   icon: '🍹', route: ROUTES.admin.products, color: C.red },
    { label: 'Voir les messages',    icon: '📩', route: ROUTES.admin.messages, color: '#2563eb', badge: unreadMessages > 0 ? unreadMessages : null },
    { label: 'Publier un article',   icon: '📝', route: ROUTES.admin.blog,     color: C.green },
    { label: 'Points de vente',      icon: '📍', route: ROUTES.admin.locations, color: '#2563eb' },
    { label: 'Envoyer infolettre',   icon: '✉️', route: ROUTES.admin.subscribers, color: '#8b5cf6' },
    { label: 'Voir les avis',        icon: '⭐', route: ROUTES.admin.reviews,   color: '#f59e0b', badge: pendingReviews > 0 ? pendingReviews : null },
  ];

  const todos: { icon: string; text: string; route: string; color: string; textColor: string }[] = [];
  if (unreadMessages > 0) todos.push({ icon: '📩', text: `${unreadMessages} message${unreadMessages > 1 ? 's' : ''} non lu${unreadMessages > 1 ? 's' : ''}`, route: ROUTES.admin.messages, color: '#dbeafe', textColor: '#1e40af' });
  if (pendingReviews > 0) todos.push({ icon: '⭐', text: `${pendingReviews} avis à vérifier`, route: ROUTES.admin.reviews, color: '#fef3c7', textColor: '#92400e' });
  if (draftBlogs > 0)     todos.push({ icon: '📝', text: `${draftBlogs} article${draftBlogs > 1 ? 's' : ''} en brouillon`, route: ROUTES.admin.blog, color: '#f3e8ff', textColor: '#6b21a8' });

  return (
    <div>
      {/* GREETING */}
      <div style={{ background: `linear-gradient(135deg, ${C.hibiscus}, ${C.red}, ${C.gold})`, borderRadius: 18, padding: '28px 30px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{greeting} Ben's 👋</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0 }}>Que voulez-vous faire aujourd'hui ?</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 12, marginBottom: 24 }}>
        {quickActions.map(a => (
          <button key={a.label} onClick={() => navigate(a.route)} className="anim-card"
            style={{ background: '#fff', borderRadius: 14, padding: '20px 16px', border: `1px solid ${C.border}`, cursor: 'pointer', textAlign: 'center', position: 'relative', transition: 'transform 0.15s, box-shadow 0.15s' }}>
            {a.badge !== null && a.badge !== undefined && (
              <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.badge}</div>
            )}
            <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>{a.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.dark, lineHeight: 1.3 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Produits actifs', value: products.filter(p => p.available).length, emoji: '🍹' },
          { label: 'Messages',        value: messages.length,                            emoji: '📩' },
          { label: 'Abonnés',         value: subscribers.filter(s => s.active).length,  emoji: '📧' },
          { label: 'Points de vente', value: locations.filter(l => l.active).length,    emoji: '📍' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 14px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: 18 }}>{s.emoji}</span>
            <p style={{ fontSize: 26, fontWeight: 800, color: C.dark, margin: '4px 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* TWO COLUMNS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* MESSAGES RÉCENTS */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.dark }}>📩 Messages récents</h3>
            <button onClick={() => navigate(ROUTES.admin.messages)} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Voir tout →</button>
          </div>
          {messages.length === 0 ? (
            <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', padding: '20px 0' }}>Aucun message</p>
          ) : [...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4).map(m => (
            <div key={m.id} onClick={() => navigate(ROUTES.admin.messages)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.read ? '#d1d5db' : '#2563eb', flexShrink: 0, marginTop: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: m.read ? 400 : 700, color: C.dark }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{new Date(m.date).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS À FAIRE */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 22, border: `1px solid ${C.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: C.dark, display: 'flex', alignItems: 'center', gap: 8 }}>
            🔔 Actions à faire
            {todos.length > 0 && <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{todos.length}</span>}
          </h3>
          {todos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>✅</span>
              <p style={{ fontSize: 14, color: C.green, fontWeight: 600, margin: 0 }}>Tout est à jour !</p>
              <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>Aucune action requise</p>
            </div>
          ) : todos.map((t, i) => (
            <div key={i} onClick={() => navigate(t.route)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: t.color, borderRadius: 10, marginBottom: 8, cursor: 'pointer' }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 14, color: t.textColor, fontWeight: 500 }}>{t.text}</span>
              <span style={{ marginLeft: 'auto', fontSize: 18, color: t.textColor }}>→</span>
            </div>
          ))}

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>📧 Derniers abonnés</p>
            {[...subscribers].slice(-3).reverse().map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                <span style={{ color: C.text }}>{s.email}</span>
                <span style={{ color: C.muted }}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
