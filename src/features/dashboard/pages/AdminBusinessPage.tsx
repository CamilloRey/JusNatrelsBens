import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from 'recharts';

const CHART_COLORS = ['#8b1a1a', '#c44536', '#d4763b', '#2a6a4f', '#6366f1', '#f59e0b', '#0891b2', '#be185d'];

export default function AdminBusinessPage() {
  const { products, stock, finance, events } = useData();

  // Stock calculations
  const stockSummary = products.map(p => {
    const mouvements = stock.filter(s => s.productId === p.id);
    const entrees = mouvements.filter(s => s.type === 'entree').reduce((a, s) => a + s.quantity, 0);
    const sorties = mouvements.filter(s => s.type === 'sortie').reduce((a, s) => a + s.quantity, 0);
    return { name: p.name, quantite: entrees - sorties };
  });
  const totalStock = stockSummary.reduce((a, s) => a + s.quantite, 0);
  const productsWithLowStock = stockSummary.filter(s => s.quantite < 5);

  // Finance calculations
  const totalRevenu = finance.filter(t => t.type === 'revenu').reduce((s, t) => s + t.amount, 0);
  const totalDepense = finance.filter(t => t.type === 'depense').reduce((s, t) => s + t.amount, 0);
  const benefice = totalRevenu - totalDepense;

  // Revenue by month for area chart
  const revenueByMonth: Record<string, { revenue: number; expense: number }> = {};
  finance.forEach(t => {
    const month = t.date?.substring(0, 7) || 'N/A';
    if (!revenueByMonth[month]) revenueByMonth[month] = { revenue: 0, expense: 0 };
    if (t.type === 'revenu') revenueByMonth[month].revenue += t.amount;
    else revenueByMonth[month].expense += t.amount;
  });
  const revenueChartData = Object.entries(revenueByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([month, data]) => ({
      name: month.substring(5) || month,
      revenus: data.revenue,
      depenses: data.expense,
      profit: data.revenue - data.expense,
    }));

  // Sales by category for pie
  const salesByCategory: Record<string, number> = {};
  finance.filter(t => t.type === 'revenu').forEach(t => {
    salesByCategory[t.category || 'Autre'] = (salesByCategory[t.category || 'Autre'] || 0) + t.amount;
  });
  const pieData = Object.entries(salesByCategory).map(([name, value]) => ({ name, value }));

  // Stock for bar chart
  const stockChartData = stockSummary
    .filter(s => s.quantite > 0)
    .slice(0, 10)
    .map(s => ({ name: s.name.length > 14 ? s.name.substring(0, 14) + '...' : s.name, stock: s.quantite }));

  // Events
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(e => e.active && e.date >= today);
  const totalAttendanceRequests = events.reduce((sum, e) => sum + (e.attendanceRequests || []).length, 0);
  const pendingAttendance = events.reduce((sum, e) => sum + (e.attendanceRequests || []).filter(r => r.status === 'pending').length, 0);

  return (
    <div>
      {/* HEADER */}
      <div style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, #2c1f18 100%)`,
        borderRadius: 20, padding: '32px 36px', marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 40px)' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#f0e6d3', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            Gestion du Business
          </h1>
          <p style={{ fontSize: 14, color: '#8a7968', margin: 0 }}>Vue d'ensemble: stocks, ventes, finances, evenements</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'STOCK TOTAL', value: totalStock.toLocaleString(), sub: `${productsWithLowStock.length} faible stock`, color: C.dark, subColor: productsWithLowStock.length > 0 ? '#dc2626' : C.muted, icon: '📦' },
          { label: 'REVENUS', value: `$${totalRevenu.toFixed(0)}`, sub: 'Toutes sources', color: C.green, subColor: C.muted, icon: '💰' },
          { label: 'DEPENSES', value: `$${totalDepense.toFixed(0)}`, sub: 'Tous types', color: '#f97316', subColor: C.muted, icon: '📊' },
          { label: 'BENEFICE NET', value: `$${benefice.toFixed(0)}`, sub: benefice >= 0 ? 'Marge positive' : 'Deficit', color: benefice >= 0 ? C.green : '#dc2626', subColor: benefice >= 0 ? C.green : '#dc2626', icon: '📈' },
        ].map(k => (
          <div key={k.label} style={{
            background: '#fff', borderRadius: 16, padding: '20px 22px',
            border: k.label === 'BENEFICE NET' ? `2px solid ${k.color}30` : `1px solid ${C.border}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <p style={{ fontSize: 10, color: C.muted, fontWeight: 700, margin: 0, letterSpacing: '0.1em' }}>{k.label}</p>
              <span style={{ fontSize: 18 }}>{k.icon}</span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: k.color, margin: '0 0 4px', letterSpacing: '-0.03em' }}>{k.value}</p>
            <p style={{ fontSize: 11, color: k.subColor, margin: 0 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Revenue Area Chart */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: C.dark }}>
            Evolution des revenus
          </h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.muted }} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={(v) => [`$${v}`, '']} />
                <Area type="monotone" dataKey="revenus" stroke={C.green} fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="depenses" stroke="#f97316" fill="url(#expGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 240, display: 'grid', placeItems: 'center', color: C.muted, fontSize: 13 }}>
              Ajoutez des transactions pour voir le graphique
            </div>
          )}
        </div>

        {/* Sales Pie */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: C.dark }}>
            Repartition des ventes
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={(v) => [`$${v}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 240, display: 'grid', placeItems: 'center', color: C.muted, fontSize: 13 }}>
              Aucune donnee
            </div>
          )}
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {pieData.map((d, i) => (
              <span key={d.name} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* STOCK SECTION */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Icon type="box" size={22} color={C.hibiscus} />
          <h2 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Inventaire</h2>
          <div style={{ marginLeft: 'auto' }}>
            <a href="/admin/stock" style={{ fontSize: 12, color: C.hibiscus, fontWeight: 700, textDecoration: 'none' }}>Gerer →</a>
          </div>
        </div>

        {productsWithLowStock.length > 0 && (
          <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#92400e', fontWeight: 600, margin: 0 }}>
              ⚠️ {productsWithLowStock.length} produit(s) avec stock faible (&lt; 5 unites)
            </p>
          </div>
        )}

        {stockChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.muted }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                {stockChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.stock < 5 ? '#dc2626' : C.hibiscus} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>
            Aucune donnee de stock
          </div>
        )}
      </div>

      {/* EVENTS + ATTENDANCE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Square */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 16, padding: 24, color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>💳</span>
            <h2 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Paiements Square</h2>
          </div>
          <p style={{ fontSize: 13, margin: '0 0 16px', opacity: 0.9 }}>
            Traitement des paiements en ligne et en personne
          </p>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: 12, margin: 0, opacity: 0.85, lineHeight: 1.8 }}>
              ✓ Carte de credit / debit<br />
              ✓ Terminal physique<br />
              ✓ Suivi automatique<br />
              ✓ Rapports detailles
            </p>
          </div>
          <a href="/admin/square" style={{
            display: 'inline-block', padding: '10px 20px', borderRadius: 10,
            border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
            color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            Configurer →
          </a>
        </div>

        {/* Events + Attendance */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Icon type="calendar" size={22} color={C.hibiscus} />
            <h2 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Evenements</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div style={{ background: C.cream, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: C.hibiscus, margin: '0 0 2px' }}>{upcomingEvents.length}</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>A venir</p>
            </div>
            <div style={{ background: C.cream, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', margin: '0 0 2px' }}>{totalAttendanceRequests}</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Demandes</p>
            </div>
          </div>

          {pendingAttendance > 0 && (
            <div style={{ background: '#fef3c7', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#92400e', fontWeight: 600, margin: 0 }}>
                🙋 {pendingAttendance} demande(s) de participation en attente
              </p>
            </div>
          )}

          <a href="/admin/events" style={{
            display: 'inline-block', padding: '10px 20px', borderRadius: 10,
            background: C.hibiscus, color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            Gerer les evenements →
          </a>
        </div>
      </div>
    </div>
  );
}
