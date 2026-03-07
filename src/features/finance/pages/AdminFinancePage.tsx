import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';
import { REVENUE_CATEGORIES, EXPENSE_CATEGORIES } from '../types/finance.types';
import type { Transaction, TransactionFormState } from '../types/finance.types';

const EMPTY: TransactionFormState = {
  type: 'revenu', amount: '', category: REVENUE_CATEGORIES[0],
  description: '', date: new Date().toISOString().split('T')[0], location: '',
};

function exportCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Lieu', 'Montant ($)'];
  const rows = transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(t => [
      t.date,
      t.type === 'revenu' ? 'Revenu' : 'Dépense',
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.location,
      t.amount.toFixed(2),
    ].join(';'));
  const totalRev = transactions.filter(t => t.type === 'revenu').reduce((s, t) => s + t.amount, 0);
  const totalDep = transactions.filter(t => t.type === 'depense').reduce((s, t) => s + t.amount, 0);
  rows.push('');
  rows.push(`;;;Total revenus;;${totalRev.toFixed(2)}`);
  rows.push(`;;;Total dépenses;;${totalDep.toFixed(2)}`);
  rows.push(`;;;Bénéfice net;;${(totalRev - totalDep).toFixed(2)}`);
  const csv = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `bens-finances-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

export default function AdminFinancePage() {
  const { finance, updateFinance, logActivity } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TransactionFormState>(EMPTY);
  const [filterType, setFilterType] = useState<'all' | 'revenu' | 'depense'>('all');
  const [filterMonth, setFilterMonth] = useState('');

  const f = <K extends keyof TransactionFormState>(k: K, v: TransactionFormState[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const save = () => {
    if (!form.amount || !form.description) return;
    const nt: Transaction = { ...form, id: 'fi' + Date.now(), amount: parseFloat(form.amount) };
    updateFinance([nt, ...finance]);
    logActivity(form.type === 'revenu' ? 'Revenu enregistré' : 'Dépense enregistrée', `${form.amount}$ — ${form.description}`, 'product');
    setShowForm(false);
    setForm(EMPTY);
  };

  const remove = (id: string) => {
    if (!confirm('Supprimer cette transaction ?')) return;
    updateFinance(finance.filter(t => t.id !== id));
  };

  /* ── Calculs ── */
  const totalRev  = finance.filter(t => t.type === 'revenu').reduce((s, t) => s + t.amount, 0);
  const totalDep  = finance.filter(t => t.type === 'depense').reduce((s, t) => s + t.amount, 0);
  const benefice  = totalRev - totalDep;

  const filtered = finance
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => !filterMonth || t.date.startsWith(filterMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  /* ── Répartition par catégorie ── */
  const byCategory = (type: 'revenu' | 'depense') => {
    const items = finance.filter(t => t.type === type);
    const total = items.reduce((s, t) => s + t.amount, 0);
    const map: Record<string, number> = {};
    items.forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => ({ cat, amt, pct: total > 0 ? (amt / total) * 100 : 0 }));
  };

  const months = [...new Set(finance.map(t => t.date.slice(0, 7)))].sort().reverse();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>Gestion financière</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => exportCSV(finance)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Icon type="download" size={15} color={C.dark} /> Exporter Excel (CSV)
          </button>
          <button onClick={() => { setShowForm(true); setForm(EMPTY); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <Icon type="plus" size={16} color="#fff" /> Ajouter
          </button>
        </div>
      </div>

      {/* Bilan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Revenus totaux',  amount: totalRev, color: C.green,   icon: '💰' },
          { label: 'Dépenses totales', amount: totalDep, color: '#dc2626', icon: '📤' },
          { label: 'Bénéfice net',    amount: benefice,  color: benefice >= 0 ? C.green : '#dc2626', icon: benefice >= 0 ? '📈' : '📉' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{card.icon}</span>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{card.label}</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: card.color, margin: 0 }}>{card.amount.toFixed(2)} $</p>
          </div>
        ))}
      </div>

      {/* Répartition */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {(['revenu', 'depense'] as const).map(type => (
          <div key={type} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: `1px solid ${C.border}` }}>
            <h4 style={{ ...CSS.heading, fontSize: 14, fontWeight: 700, color: C.dark, margin: '0 0 14px' }}>
              {type === 'revenu' ? '💰 Revenus par catégorie' : '📤 Dépenses par catégorie'}
            </h4>
            {byCategory(type).map(({ cat, amt, pct }) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, color: C.text }}>{cat}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{amt.toFixed(2)} $</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.light }}>
                  <div style={{ height: 6, borderRadius: 3, background: type === 'revenu' ? C.green : C.red, width: `${pct}%`, transition: 'width 0.4s' }} />
                </div>
              </div>
            ))}
            {byCategory(type).length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Aucune donnée.</p>}
          </div>
        ))}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 20, maxWidth: 560 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Nouvelle transaction</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['revenu', 'depense'] as const).map(type => (
                <button key={type} onClick={() => { f('type', type); f('category', type === 'revenu' ? REVENUE_CATEGORIES[0] : EXPENSE_CATEGORIES[0]); }}
                  style={{ flex: 1, padding: 12, borderRadius: 10, border: `2px solid ${form.type === type ? (type === 'revenu' ? C.green : C.red) : C.border}`, background: form.type === type ? (type === 'revenu' ? `${C.green}12` : `${C.red}10`) : '#fff', color: form.type === type ? (type === 'revenu' ? C.green : C.red) : C.muted, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  {type === 'revenu' ? '💰 Revenu' : '📤 Dépense'}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelSt}>Montant ($) *</label><input type="number" step="0.01" min="0" value={form.amount} onChange={e => f('amount', e.target.value)} style={inputSt} placeholder="0.00" /></div>
              <div><label style={labelSt}>Date *</label><input type="date" value={form.date} onChange={e => f('date', e.target.value)} style={inputSt} /></div>
            </div>
            <div>
              <label style={labelSt}>Catégorie</label>
              <select value={form.category} onChange={e => f('category', e.target.value)} style={inputSt}>
                {(form.type === 'revenu' ? REVENUE_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={labelSt}>Description *</label><input value={form.description} onChange={e => f('description', e.target.value)} placeholder="Ex: Marché Jean-Talon samedi" style={inputSt} /></div>
            <div><label style={labelSt}>Lieu / Fournisseur</label><input value={form.location} onChange={e => f('location', e.target.value)} placeholder="Ex: Marché Atwater, Fournisseur X" style={inputSt} /></div>
            <button onClick={save} disabled={!form.amount || !form.description}
              style={{ padding: 13, borderRadius: 10, border: 'none', background: form.type === 'revenu' ? C.green : C.red, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.amount || !form.description ? 0.5 : 1 }}>
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {/* Filtres + liste */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {(['all', 'revenu', 'depense'] as const).map(type => (
          <button key={type} onClick={() => setFilterType(type)}
            style={{ padding: '7px 16px', borderRadius: 50, border: filterType === type ? `2px solid ${C.hibiscus}` : `1px solid ${C.border}`, background: filterType === type ? `${C.hibiscus}12` : '#fff', color: filterType === type ? C.hibiscus : C.muted, fontSize: 13, fontWeight: filterType === type ? 700 : 400, cursor: 'pointer' }}>
            {type === 'all' ? 'Tout' : type === 'revenu' ? '💰 Revenus' : '📤 Dépenses'}
          </button>
        ))}
        {months.length > 0 && (
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            style={{ ...inputSt, width: 'auto', padding: '7px 14px', fontSize: 13, marginLeft: 'auto' }}>
            <option value="">Tous les mois</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ background: '#fff', borderRadius: 10, padding: '13px 18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>{t.type === 'revenu' ? '💰' : '📤'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{t.description}</span>
                <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: C.light, color: C.muted }}>{t.category}</span>
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{t.date}{t.location ? ` · ${t.location}` : ''}</p>
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: t.type === 'revenu' ? C.green : '#dc2626', whiteSpace: 'nowrap' }}>
              {t.type === 'revenu' ? '+' : '−'}{t.amount.toFixed(2)} $
            </span>
            <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
              <Icon type="trash" size={15} color="#dc2626" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
            <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>💰</span>
            <p>Aucune transaction enregistrée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
