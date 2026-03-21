import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { ROUTES } from '@/shared/constants/routes';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

const CHART_COLORS = ['#8b1a1a', '#c44536', '#d4763b', '#2a6a4f', '#6366f1', '#f59e0b'];

export default function DashboardPage() {
  const { products, reviews, blogs, locations, subscribers, messages, events, stock, finance } = useData();
  const navigate = useNavigate();

  const pendingReviews = reviews.filter(r => !r.approved).length;
  const draftBlogs = blogs.filter(b => !b.published).length;
  const unreadMessages = messages.filter(m => !m.read).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon apres-midi' : 'Bonsoir';

  // Revenue data for chart
  const revenueByMonth: Record<string, number> = {};
  const expenseByMonth: Record<string, number> = {};
  finance.forEach(t => {
    const month = t.date?.substring(0, 7) || 'N/A';
    if (t.type === 'revenu') revenueByMonth[month] = (revenueByMonth[month] || 0) + t.amount;
    else expenseByMonth[month] = (expenseByMonth[month] || 0) + t.amount;
  });
  const months = [...new Set([...Object.keys(revenueByMonth), ...Object.keys(expenseByMonth)])].sort();
  const revenueChartData = months.slice(-6).map(m => ({
    name: m.substring(5) || m,
    revenus: revenueByMonth[m] || 0,
    depenses: expenseByMonth[m] || 0,
  }));

  // Sales by category for pie chart
  const salesByCategory: Record<string, number> = {};
  finance.filter(t => t.type === 'revenu').forEach(t => {
    salesByCategory[t.category || 'Autre'] = (salesByCategory[t.category || 'Autre'] || 0) + t.amount;
  });
  const pieData = Object.entries(salesByCategory).map(([name, value]) => ({ name, value }));

  // Stock data for bar chart
  const stockData = products.slice(0, 8).map(p => {
    const mouvements = stock.filter(s => s.productId === p.id);
    const entrees = mouvements.filter(s => s.type === 'entree').reduce((a, s) => a + s.quantity, 0);
    const sorties = mouvements.filter(s => s.type === 'sortie').reduce((a, s) => a + s.quantity, 0);
    return { name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name, stock: entrees - sorties };
  });

  const totalRevenu = finance.filter(t => t.type === 'revenu').reduce((s, t) => s + t.amount, 0);
  const totalDepense = finance.filter(t => t.type === 'depense').reduce((s, t) => s + t.amount, 0);
  const totalStock = stockData.reduce((a, s) => a + s.stock, 0);

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(e => e.active && e.date >= today).length;

  const kpis = [
    { label: 'Revenus', value: `$${totalRevenu.toLocaleString()}`, sub: 'Toutes sources', color: C.green, icon: '💰' },
    { label: 'Depenses', value: `$${totalDepense.toLocaleString()}`, sub: 'Total', color: '#f97316', icon: '📊' },
    { label: 'Benefice', value: `$${(totalRevenu - totalDepense).toLocaleString()}`, sub: totalRevenu - totalDepense >= 0 ? 'Marge positive' : 'Deficit', color: totalRevenu - totalDepense >= 0 ? C.green : '#dc2626', icon: '📈' },
    { label: 'Stock', value: totalStock.toLocaleString(), sub: `${products.length} produits`, color: C.hibiscus, icon: '📦' },
  ];

  const quickActions = [
    { label: 'Produits', icon: '🍹', route: ROUTES.admin.products, badge: null },
    { label: 'Messages', icon: '📩', route: ROUTES.admin.messages, badge: unreadMessages > 0 ? unreadMessages : null },
    { label: 'Blogue', icon: '📝', route: ROUTES.admin.blog, badge: draftBlogs > 0 ? draftBlogs : null },
    { label: 'Evenements', icon: '📅', route: ROUTES.admin.events, badge: upcomingEvents > 0 ? upcomingEvents : null },
    { label: 'Avis', icon: '⭐', route: ROUTES.admin.reviews, badge: pendingReviews > 0 ? pendingReviews : null },
    { label: 'Commandes', icon: '📦', route: '/admin/orders', badge: null },
  ];

  const todos: { icon: string; text: string; route: string; bg: string; fg: string }[] = [];
  if (unreadMessages > 0) todos.push({ icon: '📩', text: `${unreadMessages} message(s) non lu(s)`, route: ROUTES.admin.messages, bg: '#dbeafe', fg: '#1e40af' });
  if (pendingReviews > 0) todos.push({ icon: '⭐', text: `${pendingReviews} avis a verifier`, route: ROUTES.admin.reviews, bg: '#fef3c7', fg: '#92400e' });
  if (draftBlogs > 0) todos.push({ icon: '📝', text: `${draftBlogs} article(s) en brouillon`, route: ROUTES.admin.blog, bg: '#f3e8ff', fg: '#6b21a8' });

  return (
    <div>
      {/* HERO SECTION - Glassmorphism style */}
      <div style={{
        background: `linear-gradient(135deg, ${C.hibiscus} 0%, ${C.red} 40%, ${C.gold} 100%)`,
        borderRadius: 20,
        padding: '32px 36px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
              {greeting}, Ben's
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              Vue d'ensemble de votre activite
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/admin/business')} style={{
              padding: '10px 20px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              Business
            </button>
            <button onClick={() => navigate('/admin/reports')} style={{
              padding: '10px 20px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              Rapports
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 22px',
            border: `1px solid ${C.border}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: C.muted, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k.label}</p>
              <span style={{ fontSize: 20 }}>{k.icon}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: k.color, margin: '0 0 4px', letterSpacing: '-0.03em' }}>{k.value}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Revenue Line Chart */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: C.dark }}>
            Revenus vs Depenses
          </h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }}
                  formatter={(value) => [`$${value}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="revenus" stroke={C.green} strokeWidth={2.5} dot={{ r: 4, fill: C.green }} />
                <Line type="monotone" dataKey="depenses" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'grid', placeItems: 'center', color: C.muted, fontSize: 13 }}>
              Ajoutez des transactions pour voir le graphique
            </div>
          )}
        </div>

        {/* Sales Pie Chart */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: C.dark }}>
            Ventes par categorie
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }}
                  formatter={(value) => [`$${value}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'grid', placeItems: 'center', color: C.muted, fontSize: 13 }}>
              Aucune donnee de vente
            </div>
          )}
        </div>
      </div>

      {/* STOCK BAR CHART */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 24, marginBottom: 28,
        border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: 0, color: C.dark }}>
            Niveaux de stock
          </h3>
          <button onClick={() => navigate('/admin/stock')} style={{
            background: 'none', border: 'none', color: C.hibiscus, cursor: 'pointer', fontSize: 12, fontWeight: 700,
          }}>
            Gerer le stock →
          </button>
        </div>
        {stockData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.muted }} angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }}
              />
              <Bar dataKey="stock" fill={C.hibiscus} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 200, display: 'grid', placeItems: 'center', color: C.muted, fontSize: 13 }}>
            Ajoutez des produits et du stock pour voir le graphique
          </div>
        )}
      </div>

      {/* QUICK ACTIONS + TODOS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Quick Actions */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: C.dark }}>
            Actions rapides
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {quickActions.map(a => (
              <button key={a.label} onClick={() => navigate(a.route)}
                style={{
                  background: C.cream, borderRadius: 14, padding: '16px 12px',
                  border: `1px solid ${C.border}`, cursor: 'pointer', textAlign: 'center',
                  position: 'relative', transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                {a.badge != null && (
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.badge}</div>
                )}
                <span style={{ fontSize: 28, display: 'block', marginBottom: 6 }}>{a.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* To-do / Actions */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 24,
          border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: C.dark, display: 'flex', alignItems: 'center', gap: 8 }}>
            A faire
            {todos.length > 0 && <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>{todos.length}</span>}
          </h3>
          {todos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>✅</span>
              <p style={{ fontSize: 14, color: C.green, fontWeight: 600, margin: 0 }}>Tout est a jour !</p>
            </div>
          ) : todos.map((t, i) => (
            <div key={i} onClick={() => navigate(t.route)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', background: t.bg, borderRadius: 12,
              marginBottom: 8, cursor: 'pointer', transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ fontSize: 13, color: t.fg, fontWeight: 500, flex: 1 }}>{t.text}</span>
              <span style={{ fontSize: 16, color: t.fg }}>→</span>
            </div>
          ))}

          {/* Recent messages */}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Messages recents</p>
            {[...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3).map(m => (
              <div key={m.id} onClick={() => navigate(ROUTES.admin.messages)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.read ? '#d1d5db' : '#2563eb', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: m.read ? 400 : 700, color: C.dark }}>{m.name}</span>
                  <p style={{ fontSize: 11, color: C.muted, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Produits', value: products.filter(p => p.available).length, icon: '🍹' },
          { label: 'Abonnes', value: subscribers.filter(s => s.active).length, icon: '📧' },
          { label: 'Points de vente', value: locations.filter(l => l.active).length, icon: '📍' },
          { label: 'Evenements', value: upcomingEvents, icon: '📅' },
          { label: 'Avis', value: reviews.length, icon: '⭐' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 14, padding: '14px 12px',
            border: `1px solid ${C.border}`, textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <p style={{ fontSize: 22, fontWeight: 800, color: C.dark, margin: '4px 0 2px', letterSpacing: '-0.03em' }}>{s.value}</p>
            <p style={{ fontSize: 10, color: C.muted, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
