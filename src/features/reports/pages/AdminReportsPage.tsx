import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS }      from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';

/* ── Helpers ── */
function pct(val: number, total: number) {
  return total > 0 ? Math.round((val / total) * 100) : 0;
}

function exportMonthCSV(month: string, data: {
  revenues: number; expenses: number; profit: number;
  topProducts: { name: string; qty: number }[];
  byLocation: { loc: string; rev: number; exits: number }[];
  events: { title: string; date: string; location: string }[];
}) {
  const lines: string[] = [
    `Rapport mensuel Ben's — ${month}`,
    '',
    'BILAN FINANCIER',
    `Revenus totaux;${data.revenues.toFixed(2)} $`,
    `Dépenses totales;${data.expenses.toFixed(2)} $`,
    `Bénéfice net;${data.profit.toFixed(2)} $`,
    '',
    'PERFORMANCE PAR POINT DE VENTE',
    'Lieu;Revenus ($);Sorties (unités)',
    ...data.byLocation.map(l => `${l.loc};${l.rev.toFixed(2)};${l.exits}`),
    '',
    'PRODUITS LES PLUS VENDUS',
    'Produit;Sorties (unités)',
    ...data.topProducts.map(p => `"${p.name}";${p.qty}`),
    '',
    'ÉVÉNEMENTS DU MOIS',
    'Titre;Date;Lieu',
    ...data.events.map(e => `"${e.title}";${e.date};${e.location}`),
  ];
  const csv = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `rapport-bens-${month}.csv`;
  a.click();
}

/* ══════════════════════════════════════════════════════════ */
/*  Onglet 1 — Performance par point de vente                */
/* ══════════════════════════════════════════════════════════ */
function TabPerformance() {
  const { finance, stock } = useData();

  /* Tous les lieux uniques (revenus + sorties stock) */
  const allLocs = Array.from(new Set([
    ...finance.filter(t => t.type === 'revenu' && t.location).map(t => t.location),
    ...stock.filter(s => s.type === 'sortie' && s.location).map(s => s.location),
  ])).filter(Boolean).sort();

  const rows = allLocs.map(loc => {
    const rev     = finance.filter(t => t.type === 'revenu' && t.location === loc).reduce((s, t) => s + t.amount, 0);
    const exits   = stock.filter(s => s.type === 'sortie' && s.location === loc).reduce((s, m) => s + m.quantity, 0);
    const txCount = finance.filter(t => t.type === 'revenu' && t.location === loc).length;
    return { loc, rev, exits, txCount };
  }).sort((a, b) => b.rev - a.rev);

  const maxRev   = Math.max(...rows.map(r => r.rev), 1);
  const maxExits = Math.max(...rows.map(r => r.exits), 1);
  const totalRev = rows.reduce((s, r) => s + r.rev, 0);

  /* Sorties par produit × lieu */
  const allProds = Array.from(new Set(stock.filter(s => s.type === 'sortie').map(s => s.productName)));

  return (
    <div>
      <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, color: C.dark, margin: '0 0 20px' }}>
        Performance par point de vente
      </h3>

      {rows.length === 0 ? (
        <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Aucune donnée. Enregistrez des revenus avec un lieu dans la section Finances.</p>
      ) : (
        <>
          {/* Tableau de comparaison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
            {rows.map((r, i) => (
              <div key={r.loc} style={{ background: '#fff', borderRadius: 14, padding: '18px 22px', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? '#f59e0b' : C.muted, width: 28, flexShrink: 0 }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: 0 }}>{r.loc}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{r.txCount} transaction{r.txCount > 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 20, fontWeight: 900, color: C.green, margin: 0 }}>{r.rev.toFixed(2)} $</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{pct(r.rev, totalRev)}% du total</p>
                  </div>
                </div>
                {/* Barre revenus */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.muted }}>💰 Revenus</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>{r.rev.toFixed(2)} $</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.light }}>
                    <div style={{ height: 8, borderRadius: 4, background: C.green, width: `${pct(r.rev, maxRev)}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
                {/* Barre sorties */}
                {r.exits > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: C.muted }}>📦 Sorties stock</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.hibiscus }}>{r.exits} bouteilles</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: C.light }}>
                      <div style={{ height: 8, borderRadius: 4, background: C.hibiscus, width: `${pct(r.exits, maxExits)}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Matrice produits × lieux */}
          {allProds.length > 0 && (
            <>
              <h4 style={{ ...CSS.heading, fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 12px' }}>
                Sorties par produit et par lieu
              </h4>
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.light }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: C.dark, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>Produit</th>
                      {allLocs.map(loc => (
                        <th key={loc} style={{ padding: '10px 12px', textAlign: 'center', color: C.dark, fontWeight: 700, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{loc}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allProds.map(prod => (
                      <tr key={prod} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '10px 16px', color: C.dark, fontWeight: 500 }}>{prod}</td>
                        {allLocs.map(loc => {
                          const qty = stock.filter(s => s.type === 'sortie' && s.productName === prod && s.location === loc).reduce((s, m) => s + m.quantity, 0);
                          return (
                            <td key={loc} style={{ padding: '10px 12px', textAlign: 'center', color: qty > 0 ? C.hibiscus : C.muted, fontWeight: qty > 0 ? 700 : 400 }}>
                              {qty > 0 ? qty : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  Onglet 2 — Rapport mensuel                               */
/* ══════════════════════════════════════════════════════════ */
function TabMonthly() {
  const { finance, stock, events, products } = useData();

  /* Mois disponibles (union finance + stock + events) */
  const allMonths = Array.from(new Set([
    ...finance.map(t => t.date.slice(0, 7)),
    ...stock.map(s => s.date.slice(0, 7)),
    ...events.map(e => e.date.slice(0, 7)),
  ])).sort().reverse();

  const [month, setMonth] = useState(allMonths[0] ?? new Date().toISOString().slice(0, 7));

  /* ─ Données filtrées ─ */
  const fRev  = finance.filter(t => t.type === 'revenu'  && t.date.startsWith(month));
  const fDep  = finance.filter(t => t.type === 'depense' && t.date.startsWith(month));
  const sOut  = stock.filter(s => s.type === 'sortie' && s.date.startsWith(month));
  const sIn   = stock.filter(s => s.type === 'entree' && s.date.startsWith(month));
  const evts  = events.filter(e => e.date.startsWith(month) && e.active);

  const totalRev = fRev.reduce((s, t) => s + t.amount, 0);
  const totalDep = fDep.reduce((s, t) => s + t.amount, 0);
  const profit   = totalRev - totalDep;

  /* Top produits par sorties */
  const prodMap: Record<string, number> = {};
  sOut.forEach(s => { prodMap[s.productName] = (prodMap[s.productName] ?? 0) + s.quantity; });
  const topProducts = Object.entries(prodMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  /* Performance par lieu */
  const locRev: Record<string, number> = {};
  fRev.forEach(t => { if (t.location) locRev[t.location] = (locRev[t.location] ?? 0) + t.amount; });
  const locExits: Record<string, number> = {};
  sOut.forEach(s => { locExits[s.location] = (locExits[s.location] ?? 0) + s.quantity; });
  const byLocation = Array.from(new Set([...Object.keys(locRev), ...Object.keys(locExits)])).map(loc => ({
    loc, rev: locRev[loc] ?? 0, exits: locExits[loc] ?? 0,
  })).sort((a, b) => b.rev - a.rev);

  const monthLabel = new Date(month + '-01').toLocaleString('fr-CA', { year: 'numeric', month: 'long' });

  const exportData = {
    revenues: totalRev, expenses: totalDep, profit,
    topProducts: topProducts.map(([name, qty]) => ({ name, qty })),
    byLocation,
    events: evts.map(e => ({ title: e.title, date: e.date, location: e.location })),
  };

  const Card = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <p style={{ fontSize: 11, color: C.muted, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
      </div>
      <p style={{ fontSize: 26, fontWeight: 900, color, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div id="monthly-report">
      {/* Controls */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, color: C.dark, margin: 0 }}>Rapport mensuel</h3>
          <select value={month} onChange={e => setMonth(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, fontWeight: 600, color: C.dark, background: '#fff', cursor: 'pointer' }}>
            {allMonths.map(m => (
              <option key={m} value={m}>{new Date(m + '-01').toLocaleString('fr-CA', { year: 'numeric', month: 'long' })}</option>
            ))}
            {allMonths.length === 0 && <option value={month}>{monthLabel}</option>}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => exportMonthCSV(month, exportData)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Icon type="download" size={14} color={C.dark} /> Export Excel
          </button>
          <button onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            🖨️ Imprimer
          </button>
        </div>
      </div>

      {/* En-tête imprimable */}
      <div className="print-only" style={{ display: 'none', marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${C.hibiscus}` }}>
        <p style={{ fontSize: 22, fontWeight: 900, color: C.hibiscus, margin: '0 0 4px' }}>🍹 Les Jus Naturels Ben's</p>
        <p style={{ fontSize: 16, color: C.dark, margin: 0 }}>Rapport mensuel — {monthLabel}</p>
      </div>

      {/* Bilan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <Card icon="💰" label="Revenus"   value={`${totalRev.toFixed(2)} $`}  color={C.green} />
        <Card icon="📤" label="Dépenses"  value={`${totalDep.toFixed(2)} $`}  color="#dc2626" />
        <Card icon={profit >= 0 ? '📈' : '📉'} label="Bénéfice" value={`${profit.toFixed(2)} $`} color={profit >= 0 ? C.green : '#dc2626'} />
      </div>

      {/* Statistiques supplémentaires */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { icon: '📦', label: 'Entrées stock', value: sIn.reduce((s, m) => s + m.quantity, 0) + ' unités' },
          { icon: '📤', label: 'Sorties stock', value: sOut.reduce((s, m) => s + m.quantity, 0) + ' unités' },
          { icon: '🧾', label: 'Transactions',  value: (fRev.length + fDep.length).toString() },
          { icon: '📅', label: 'Événements',    value: evts.length.toString() },
        ].map(s => (
          <div key={s.label} style={{ background: C.light, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: 22, display: 'block', marginBottom: 4 }}>{s.icon}</span>
            <p style={{ fontSize: 18, fontWeight: 800, color: C.dark, margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Top produits */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `1px solid ${C.border}` }}>
          <h4 style={{ ...CSS.heading, fontSize: 14, fontWeight: 700, color: C.dark, margin: '0 0 14px' }}>🏆 Produits les + vendus</h4>
          {topProducts.length === 0 ? (
            <p style={{ fontSize: 13, color: C.muted }}>Aucune sortie ce mois-ci.</p>
          ) : topProducts.map(([name, qty], i) => {
            const maxQ = topProducts[0][1];
            return (
              <div key={name} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, color: C.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, color: i === 0 ? '#f59e0b' : C.muted }}>#{i + 1}</span> {name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.hibiscus }}>{qty} unités</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.light }}>
                  <div style={{ height: 6, borderRadius: 3, background: C.hibiscus, width: `${pct(qty, maxQ)}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance lieux */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `1px solid ${C.border}` }}>
          <h4 style={{ ...CSS.heading, fontSize: 14, fontWeight: 700, color: C.dark, margin: '0 0 14px' }}>📍 Performance par lieu</h4>
          {byLocation.length === 0 ? (
            <p style={{ fontSize: 13, color: C.muted }}>Aucune donnée ce mois-ci.</p>
          ) : byLocation.map(l => (
            <div key={l.loc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: C.text }}>{l.loc}</span>
              <div style={{ textAlign: 'right' }}>
                {l.rev > 0 && <p style={{ fontSize: 13, fontWeight: 700, color: C.green, margin: 0 }}>{l.rev.toFixed(2)} $</p>}
                {l.exits > 0 && <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{l.exits} unités sorties</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Événements du mois */}
      {evts.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <h4 style={{ ...CSS.heading, fontSize: 14, fontWeight: 700, color: C.dark, margin: '0 0 12px' }}>📅 Événements du mois</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {evts.map(e => (
              <div key={e.id} style={{ padding: '10px 16px', borderRadius: 10, background: `${C.hibiscus}0e`, border: `1px solid ${C.hibiscus}30` }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: '0 0 2px' }}>{e.title}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{e.date} · {e.location}{e.time ? ` · ${e.time}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Détail transactions */}
      {(fRev.length > 0 || fDep.length > 0) && (
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `1px solid ${C.border}` }}>
          <h4 style={{ ...CSS.heading, fontSize: 14, fontWeight: 700, color: C.dark, margin: '0 0 12px' }}>🧾 Détail des transactions</h4>
          {[...fRev, ...fDep].sort((a, b) => b.date.localeCompare(a.date)).map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p style={{ fontSize: 13, color: C.dark, margin: 0 }}>{t.description}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{t.date} · {t.category}{t.location ? ` · ${t.location}` : ''}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.type === 'revenu' ? C.green : '#dc2626' }}>
                {t.type === 'revenu' ? '+' : '−'}{t.amount.toFixed(2)} $
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  Page principale                                          */
/* ══════════════════════════════════════════════════════════ */
export default function AdminReportsPage() {
  const [tab, setTab] = useState<'performance' | 'monthly'>('monthly');

  return (
    <>
      {/* CSS print */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #monthly-report, #monthly-report * { visibility: visible; }
          #monthly-report { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'monthly',     label: '📊 Rapport mensuel' },
          { key: 'performance', label: '📍 Performance par lieu' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding: '10px 20px', borderRadius: 10, border: tab === t.key ? `2px solid ${C.hibiscus}` : `1px solid ${C.border}`, background: tab === t.key ? `${C.hibiscus}12` : '#fff', color: tab === t.key ? C.hibiscus : C.muted, fontWeight: tab === t.key ? 700 : 400, fontSize: 14, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'monthly'     && <TabMonthly />}
      {tab === 'performance' && <TabPerformance />}
    </>
  );
}
