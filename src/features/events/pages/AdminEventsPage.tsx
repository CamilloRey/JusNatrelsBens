import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';
import { uploadImage } from '@/lib/api/http-client';
import type { Event, EventFormState } from '../types/event.types';

const EMPTY: EventFormState = { title: '', description: '', date: '', time: '', location: '', address: '', type: 'Marché', active: true, img: '' };
const TYPES = ['Marché', 'Festival', 'Dégustation', 'Atelier', 'Autre'];

export default function AdminEventsPage() {
  const { events, updateEvents, logActivity } = useData();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);

  const startEdit = (ev: Event) => {
    setEditing(ev.id);
    setForm({ title: ev.title, description: ev.description, date: ev.date, time: ev.time, location: ev.location, address: ev.address, type: ev.type, active: ev.active, img: ev.img ?? '' });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, 'events');
    if (url) setForm(prev => ({ ...prev, img: url }));
    else alert("Erreur upload. Vérifiez que le bucket 'product-images' existe dans Supabase.");
    setUploading(false);
  };

  const save = () => {
    if (editing === 'new') {
      const ne: Event = { ...form, id: 'ev' + Date.now() };
      updateEvents([...events, ne]);
      logActivity('Événement créé', form.title, 'blog');
    } else {
      updateEvents(events.map(e => e.id === editing ? { ...e, ...form } : e));
      logActivity('Événement modifié', form.title, 'blog');
    }
    setEditing(null);
  };

  const remove = (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    updateEvents(events.filter(e => e.id !== id));
    logActivity('Événement supprimé', title, 'blog');
  };

  const toggle = (ev: Event) => {
    updateEvents(events.map(e => e.id === ev.id ? { ...e, active: !e.active } : e));
  };

  const f = <K extends keyof EventFormState>(k: K, v: EventFormState[K]) => setForm(prev => ({ ...prev, [k]: v }));

  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  const today  = new Date().toISOString().split('T')[0];

  if (editing) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === 'new' ? 'Nouvel événement' : "Modifier l'événement"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Photo */}
        <div>
          <label style={labelSt}>Photo de l'événement</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {form.img && <img src={form.img} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />}
            <label style={{ display: 'inline-block', padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, cursor: uploading ? 'wait' : 'pointer', color: C.text }}>
              {uploading ? 'Téléversement…' : '📁 Choisir une photo'}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {form.img && <button onClick={() => setForm(p => ({ ...p, img: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 13 }}>✕ Supprimer</button>}
          </div>
        </div>
        <div><label style={labelSt}>Titre *</label><input value={form.title} onChange={e => f('title', e.target.value)} style={inputSt} placeholder="Ex: Marché Jean-Talon — Été 2026" /></div>
        <div><label style={labelSt}>Description</label><textarea value={form.description} onChange={e => f('description', e.target.value)} rows={3} style={{ ...inputSt, resize: 'vertical' }} placeholder="Décrivez l'événement..." /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={labelSt}>Date *</label><input type="date" value={form.date} onChange={e => f('date', e.target.value)} style={inputSt} /></div>
          <div><label style={labelSt}>Horaire</label><input value={form.time} onChange={e => f('time', e.target.value)} style={inputSt} placeholder="10h00 - 17h00" /></div>
        </div>
        <div>
          <label style={labelSt}>Type</label>
          <select value={form.type} onChange={e => f('type', e.target.value)} style={inputSt}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div><label style={labelSt}>Lieu</label><input value={form.location} onChange={e => f('location', e.target.value)} style={inputSt} placeholder="Ex: Marché Jean-Talon" /></div>
        <div><label style={labelSt}>Adresse</label><input value={form.address} onChange={e => f('address', e.target.value)} style={inputSt} placeholder="Ex: 7070 Henri Julien, Montréal" /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => f('active', !form.active)}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.active ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <span style={{ fontSize: 14, color: C.text }}>Visible sur le site</span>
        </div>
        <button onClick={save} disabled={!form.title || !form.date}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.title || !form.date ? 0.5 : 1 }}>
          {editing === 'new' ? 'Créer l\'événement' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>Événements ({events.length})</h2>
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Nouvel événement
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(ev => {
          const isPast = ev.date < today;
          return (
            <div key={ev.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, opacity: isPast ? 0.7 : 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `${C.hibiscus}12`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: C.hibiscus, lineHeight: 1 }}>{new Date(ev.date).getUTCDate()}</span>
                <span style={{ fontSize: 10, color: C.hibiscus, textTransform: 'uppercase' }}>{new Date(ev.date).toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{ev.title}</span>
                  <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: ev.active ? '#dcfce7' : '#f3f4f6', color: ev.active ? '#166534' : C.muted, fontWeight: 600 }}>
                    {ev.active ? '✓ Visible' : 'Masqué'}
                  </span>
                  {isPast && <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>Passé</span>}
                </div>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{ev.type} · {ev.location} · {ev.date}{ev.time ? ` · ${ev.time}` : ''}</p>
              </div>
              <button onClick={() => toggle(ev)} title={ev.active ? 'Masquer' : 'Afficher'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: C.muted, fontSize: 18 }}>
                {ev.active ? '👁' : '👁‍🗨'}
              </button>
              <button onClick={() => startEdit(ev)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
              <button onClick={() => remove(ev.id, ev.title)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
            </div>
          );
        })}
        {events.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: C.muted }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📅</span>
            <p>Aucun événement. Créez votre premier événement !</p>
          </div>
        )}
      </div>
    </div>
  );
}
