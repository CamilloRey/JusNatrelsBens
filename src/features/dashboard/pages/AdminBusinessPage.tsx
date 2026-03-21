import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';

export default function AdminBusinessPage() {
  const { products, stock, finance, events } = useData();

  // ── STOCK CALCULATIONS ──
  const stockSummary = products.map((p) => {
    const mouvements = stock.filter((s) => s.productId === p.id);
    const entrees = mouvements
      .filter((s) => s.type === 'entree')
      .reduce((acc, s) => acc + s.quantity, 0);
    const sorties = mouvements
      .filter((s) => s.type === 'sortie')
      .reduce((acc, s) => acc + s.quantity, 0);
    return { name: p.name, quantite: entrees - sorties };
  });

  const totalStock = stockSummary.reduce((acc, s) => acc + s.quantite, 0);
  const productsWithLowStock = stockSummary.filter((s) => s.quantite < 5);

  // ── FINANCE CALCULATIONS ──
  const totalRevenu = finance
    .filter((t) => t.type === 'revenu')
    .reduce((s, t) => s + t.amount, 0);
  const totalDepense = finance
    .filter((t) => t.type === 'depense')
    .reduce((s, t) => s + t.amount, 0);
  const benefice = totalRevenu - totalDepense;

  // ── VENTES PAR CATÉGORIE ──
  const ventesParCategorie = {};
  finance
    .filter((t) => t.type === 'revenu')
    .forEach((t) => {
      ventesParCategorie[t.category] = (ventesParCategorie[t.category] ?? 0) + t.amount;
    });

  // ── ÉVÉNEMENTS ACTIFS ──
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(
    (e) => e.active && e.date >= today
  ).length;

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ ...CSS.heading, fontSize: 32, fontWeight: 800, margin: 0, marginBottom: 8 }}>
          📊 Gestion du Business
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Vue d'ensemble complète: stocks, ventes, finances
        </p>
      </div>

      {/* TOP KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>STOCK TOTAL</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.dark, margin: 0, marginBottom: 4 }}>
            {totalStock.toLocaleString()}
          </p>
          <p style={{ fontSize: 11, color: '#dc2626', margin: 0 }}>
            ⚠️ {productsWithLowStock.length} produit(s) faible stock
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>REVENUS TOTAUX</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: C.green, margin: 0, marginBottom: 4 }}>
            ${totalRevenu.toFixed(0)}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Toutes sources confondues</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: 0, marginBottom: 8 }}>DÉPENSES TOTALES</p>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#f97316', margin: 0, marginBottom: 4 }}>
            ${totalDepense.toFixed(0)}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Tous types confondus</p>
        </div>

        <div
          style={{
            background: benefice >= 0 ? `${C.green}10` : '#fef2f2',
            borderRadius: 12,
            padding: 20,
            border: `2px solid ${benefice >= 0 ? C.green : '#fca5a5'}`,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, margin: 0, marginBottom: 8, color: benefice >= 0 ? C.green : '#dc2626' }}>
            BÉNÉFICE NET
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 800,
              margin: 0,
              marginBottom: 4,
              color: benefice >= 0 ? C.green : '#dc2626',
            }}
          >
            ${benefice.toFixed(0)}
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
            {benefice >= 0 ? '✓ Marge positive' : '✗ Déficit'}
          </p>
        </div>
      </div>

      {/* STOCK SECTION */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Icon type="box" size={24} color={C.hibiscus} />
          <h2 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>Inventaire</h2>
        </div>

        {productsWithLowStock.length > 0 && (
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: 10,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <p style={{ fontSize: 13, color: '#92400e', fontWeight: 600, margin: 0 }}>
              ⚠️ {productsWithLowStock.length} produit(s) avec stock faible (&lt; 5 unités)
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stockSummary.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                background: C.light,
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{s.name}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: s.quantite < 5 ? '#dc2626' : C.green,
                }}
              >
                {s.quantite.toFixed(0)} unité(s)
              </span>
            </div>
          ))}
        </div>

        <a
          href="/admin/stock"
          style={{
            display: 'inline-block',
            marginTop: 16,
            padding: '10px 20px',
            borderRadius: 10,
            background: C.hibiscus,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          📦 Gérer le stock
        </a>
      </div>

      {/* FINANCES SECTION */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Icon type="dollar" size={24} color={C.green} />
          <h2 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>Finances</h2>
        </div>

        {/* Ventes par catégorie */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 12 }}>Ventes par catégorie</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(ventesParCategorie)
              .sort((a, b) => (b[1] as number) - (a[1] as number))
              .map(([cat, amt], i) => {
                const pct = (((amt as number) / totalRevenu) * 100).toFixed(1);
                return (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{cat}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
                          ${(amt as number).toFixed(0)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 8,
                          background: C.light,
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            background: C.green,
                            width: `${pct}%`,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 10, color: C.muted }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <a
          href="/admin/finance"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: 10,
            background: C.green,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          💰 Voir finances détaillées
        </a>
      </div>

      {/* SQUARE INTEGRATION */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 14,
          padding: 24,
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>💳</span>
          <h2 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>Paiements Square</h2>
        </div>

        <p style={{ fontSize: 14, margin: '0 0 16px 0', opacity: 0.95 }}>
          Intégration Square pour traiter les paiements en ligne et en personne
        </p>

        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 12, margin: 0, opacity: 0.85 }}>
            ✓ Paiements par carte de crédit / débit<br />
            ✓ Terminal de paiement physique<br />
            ✓ Suivi automatique des transactions<br />
            ✓ Rapports détaillés par vente
          </p>
        </div>

        <button
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.24s ease',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
            (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
            (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
          }}
        >
          🔗 Connecter à Square
        </button>
      </div>

      {/* EVENTS SECTION */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <Icon type="calendar" size={24} color={C.hibiscus} />
          <h2 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>Événements actifs</h2>
        </div>

        <p style={{ fontSize: 14, color: C.muted, margin: 0, marginBottom: 16 }}>
          {upcomingEvents} événement(s) à venir sur le calendrier
        </p>

        <a
          href="/admin/events"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: 10,
            background: C.hibiscus,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          📅 Gérer les événements
        </a>
      </div>
    </div>
  );
}
