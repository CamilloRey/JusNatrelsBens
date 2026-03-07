import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';
import type { StockMovement, StockFormState } from '../types/stock.types';

const UNITS     = ['bouteilles', 'litres', 'kg', 'unités'];
const LOCATIONS = ['Entrepôt', 'Marché Jean-Talon', 'Marché Atwater', 'Épicerie Afro-Antillaise', 'Autre'];

const EMPTY: StockFormState = {
  productId: '', productName: '', type: 'entree', quantity: '',
  unit: 'bouteilles', location: 'Entrepôt', note: '',
  date: new Date().toISOString().slice(0, 16),
};

export default function AdminStockPage() {
  const { stock, updateStock, products, logActivity } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StockFormState>(EMPTY);
  const [filterProduct, setFilterProduct] = useState('');

  const f = <K extends keyof StockFormState>(k: K, v: StockFormState[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  /* ── Résumé par produit ── */
  const summary = products.map(p => {
    const mouvements = stock.filter(s => s.productId === p.id);
    const entrees    = mouvements.filter(s => s.type === 'entree').reduce((acc, s) => acc + s.quantity, 0);
    const sorties    = mouvements.filter(s => s.type === 'sortie').reduce((acc, s) => acc + s.quantity, 0);
    return { id: p.id, name: p.name, img: p.img, entrees, sorties, stock: entrees - sorties };
  }).filter(p => p.entrees > 0 || p.sorties > 0);

  const save = () => {
    if (!form.productId || !form.quantity) return;
    const nm: StockMovement = {
      ...form,
      id: 'st' + Date.now(),
      quantity: parseFloat(form.quantity),
    };
    updateStock([nm, ...stock]);
    logActivity(form.type === 'entree' ? 'Entrée stock' : 'Sortie stock', `${form.quantity} ${form.unit} — ${form.productName}`, 'product');
    setShowForm(false);
    setForm(EMPTY);
  };

  const remove = (id: string) => {
    if (!confirm('Supprimer ce mouvement ?')) return;
    updateStock(stock.filter(s => s.id !== id));
  };

  const filtered = stock
    .filter(s => !filterProduct || s.productId === filterProduct)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>Gestion de stock</h2>
        <button onClick={() => { setShowForm(true); setForm(EMPTY); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Ajouter un mouvement
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24, maxWidth: 600 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, margin: 0 }}>Nouveau mouvement</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Type */}
            <div style={{ display: 'flex', gap: 10 }}>
              {(['entree', 'sortie'] as const).map(type => (
                <button key={type} onClick={() => f('type', type)}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, border: `2px solid ${form.type === type ? (type === 'entree' ? C.green : C.red) : C.border}`, background: form.type === type ? (type === 'entree' ? `${C.green}12` : `${C.red}10`) : '#fff', color: form.type === type ? (type === 'entree' ? C.green : C.red) : C.muted, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                  {type === 'entree' ? '📦 Entrée' : '📤 Sortie'}
                </button>
              ))}
            </div>
            {/* Produit */}
            <div>
              <label style={labelSt}>Produit *</label>
              <select value={form.productId} onChange={e => {
                const p = products.find(p => p.id === e.target.value);
                f('productId', e.target.value);
                f('productName', p?.name ?? '');
              }} style={inputSt}>
                <option value="">— Sélectionner un produit —</option>
                {products.filter(p => p.available).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={labelSt}>Quantité *</label><input type="number" min="1" value={form.quantity} onChange={e => f('quantity', e.target.value)} style={inputSt} /></div>
              <div>
                <label style={labelSt}>Unité</label>
                <select value={form.unit} onChange={e => f('unit', e.target.value)} style={inputSt}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelSt}>Point de vente / Lieu</label>
              <select value={form.location} onChange={e => f('location', e.target.value)} style={inputSt}>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div><label style={labelSt}>Date & heure</label><input type="datetime-local" value={form.date} onChange={e => f('date', e.target.value)} style={inputSt} /></div>
            <div><label style={labelSt}>Note</label><input value={form.note} onChange={e => f('note', e.target.value)} placeholder="Ex: Production du jour, Livraison client…" style={inputSt} /></div>
            <button onClick={save} disabled={!form.productId || !form.quantity}
              style={{ padding: 13, borderRadius: 10, border: 'none', background: form.type === 'entree' ? C.green : C.red, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.productId || !form.quantity ? 0.5 : 1 }}>
              Enregistrer le mouvement
            </button>
          </div>
        </div>
      )}

      {/* Résumé stock actuel */}
      {summary.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ ...CSS.heading, fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 12 }}>Stock actuel</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {summary.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{p.img.startsWith('http') || p.img.startsWith('/') ? '🍹' : p.img}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: '0 0 4px' }}>{p.name}</p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: p.stock > 0 ? C.green : C.red, margin: 0, lineHeight: 1 }}>
                    {p.stock} <span style={{ fontSize: 11, fontWeight: 400, color: C.muted }}>bouteilles</span>
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>↑{p.entrees} entrées · ↓{p.sorties} sorties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ ...CSS.heading, fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>Historique des mouvements ({filtered.length})</h3>
        <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
          style={{ ...inputSt, width: 'auto', padding: '8px 14px', fontSize: 13 }}>
          <option value="">Tous les produits</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 10, padding: '13px 18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{s.type === 'entree' ? '📦' : '📤'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{s.productName}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.type === 'entree' ? C.green : C.red }}>
                  {s.type === 'entree' ? '+' : '−'}{s.quantity} {s.unit}
                </span>
                <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: C.light, color: C.muted }}>{s.location}</span>
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>
                {new Date(s.date).toLocaleString('fr-CA')} {s.note && `· ${s.note}`}
              </p>
            </div>
            <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
              <Icon type="trash" size={15} color="#dc2626" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
            <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>📦</span>
            <p>Aucun mouvement enregistré.</p>
          </div>
        )}
      </div>
    </div>
  );
}
