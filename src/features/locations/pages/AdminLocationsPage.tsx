import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';
import type { Location } from '../types/location.types';

export default function AdminLocationsPage() {
  const { locations, updateLocations, logActivity } = useData();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', address: '', type: 'Épicerie', active: true });

  const startEdit = (l: Location) => { setEditing(l.id); setForm({ name: l.name, address: l.address, type: l.type, active: l.active }); };

  const save = () => {
    if (editing === 'new') {
      const nl = { ...form, id: 'l' + Date.now() };
      updateLocations([...locations, nl]);
      logActivity('Point de vente ajouté', form.name, 'location');
    } else {
      updateLocations(locations.map(l => l.id === editing ? { ...l, ...form } : l));
      logActivity('Point de vente modifié', form.name, 'location');
    }
    setEditing(null);
  };

  if (editing) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 520 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === 'new' ? 'Nouveau point de vente' : 'Modifier'}</h3>
        <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label style={labelSt}>Nom</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputSt} /></div>
        <div><label style={labelSt}>Adresse</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} style={inputSt} /></div>
        <div>
          <label style={labelSt}>Type</label>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputSt}>
            <option>Marché</option><option>Épicerie</option><option>Restaurant</option><option>En ligne</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.active ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <span style={{ fontSize: 14 }}>Actif</span>
        </div>
        <button onClick={save} disabled={!form.name}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.name ? 0.5 : 1 }}>
          {editing === 'new' ? 'Ajouter' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => { setEditing('new'); setForm({ name: '', address: '', type: 'Épicerie', active: true }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Nouveau point
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {locations.map(l => (
          <div key={l.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.green}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon type="map" size={18} color={C.green} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{l.name}</span>
                {!l.active && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#fee2e2', color: '#dc2626' }}>Inactif</span>}
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{l.address} · {l.type}</p>
            </div>
            <button onClick={() => startEdit(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
            <button onClick={() => { updateLocations(locations.filter(x => x.id !== l.id)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
