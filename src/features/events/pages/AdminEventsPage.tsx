import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import { uploadImage } from '@/lib/api/http-client';
import type { Event, EventFormState, AttendanceRequest } from '../types/event.types';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', fg: '#92400e', label: 'En attente' },
  approved: { bg: '#dcfce7', fg: '#166534', label: 'Approuve' },
  declined: { bg: '#fee2e2', fg: '#991b1b', label: 'Refuse' },
};

export default function AdminEventsPage() {
  const { events, updateEvents, logActivity, eventSettings } = useData();
  const TYPES = eventSettings.types;
  const EMPTY: EventFormState = { title: '', description: '', date: '', time: '', location: '', address: '', type: TYPES[0] || 'Marche', active: true, img: '', attendanceEnabled: false, maxAttendees: 0 };
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormState>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [viewingAttendance, setViewingAttendance] = useState<string | null>(null);

  const startEdit = (ev: Event) => {
    setEditing(ev.id);
    setForm({
      title: ev.title, description: ev.description, date: ev.date,
      time: ev.time, location: ev.location, address: ev.address,
      type: ev.type, active: ev.active, img: ev.img ?? '',
      attendanceEnabled: ev.attendanceEnabled ?? false,
      maxAttendees: ev.maxAttendees ?? 0,
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, 'events');
    if (url) setForm(prev => ({ ...prev, img: url }));
    else alert("Erreur upload. Verifiez que le bucket 'product-images' existe dans Supabase.");
    setUploading(false);
  };

  const save = () => {
    if (editing === 'new') {
      const ne: Event = {
        ...form, id: 'ev' + Date.now(),
        attendanceEnabled: form.attendanceEnabled,
        maxAttendees: form.maxAttendees || undefined,
        attendanceRequests: [],
      };
      updateEvents([...events, ne]);
      logActivity('Evenement cree', form.title, 'blog');
    } else {
      updateEvents(events.map(e => e.id === editing ? {
        ...e, ...form,
        attendanceEnabled: form.attendanceEnabled,
        maxAttendees: form.maxAttendees || undefined,
      } : e));
      logActivity('Evenement modifie', form.title, 'blog');
    }
    setEditing(null);
  };

  const remove = (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    updateEvents(events.filter(e => e.id !== id));
    logActivity('Evenement supprime', title, 'blog');
  };

  const toggle = (ev: Event) => {
    updateEvents(events.map(e => e.id === ev.id ? { ...e, active: !e.active } : e));
  };

  const updateAttendanceStatus = (eventId: string, requestId: string, status: AttendanceRequest['status']) => {
    updateEvents(events.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        attendanceRequests: (e.attendanceRequests || []).map(r =>
          r.id === requestId ? { ...r, status } : r
        ),
      };
    }));
  };

  const removeAttendance = (eventId: string, requestId: string) => {
    updateEvents(events.map(e => {
      if (e.id !== eventId) return e;
      return { ...e, attendanceRequests: (e.attendanceRequests || []).filter(r => r.id !== requestId) };
    }));
  };

  const f = <K extends keyof EventFormState>(k: K, v: EventFormState[K]) => setForm(prev => ({ ...prev, [k]: v }));

  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];

  // ATTENDANCE VIEW
  if (viewingAttendance) {
    const ev = events.find(e => e.id === viewingAttendance);
    if (!ev) { setViewingAttendance(null); return null; }
    const requests = ev.attendanceRequests || [];
    const pending = requests.filter(r => r.status === 'pending');
    const approved = requests.filter(r => r.status === 'approved');
    const declined = requests.filter(r => r.status === 'declined');

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setViewingAttendance(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon type="back" size={20} color={C.dark} />
          </button>
          <div>
            <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>
              Participations — {ev.title}
            </h2>
            <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0' }}>
              {ev.date} · {approved.length} approuve(s) · {pending.length} en attente · {declined.length} refuse(s)
              {ev.maxAttendees ? ` · Max: ${ev.maxAttendees}` : ''}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'En attente', count: pending.length, color: '#f59e0b', bg: '#fef3c7' },
            { label: 'Approuves', count: approved.length, color: C.green, bg: '#dcfce7' },
            { label: 'Refuses', count: declined.length, color: '#dc2626', bg: '#fee2e2' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: s.color, margin: '0 0 4px' }}>{s.count}</p>
              <p style={{ fontSize: 12, color: s.color, fontWeight: 600, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: C.muted }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🙋</span>
            <p>Aucune demande de participation pour cet evenement.</p>
          </div>
        )}

        {requests.map(req => {
          const st = STATUS_COLORS[req.status];
          return (
            <div key={req.id} style={{
              background: '#fff', borderRadius: 12, padding: '16px 20px',
              border: `1px solid ${C.border}`, marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%', background: `${C.hibiscus}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: C.hibiscus, flexShrink: 0,
              }}>
                {req.name.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{req.name}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: st.bg, color: st.fg, fontWeight: 700 }}>
                    {st.label}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                  {req.email}{req.phone ? ` · ${req.phone}` : ''} · {new Date(req.createdAt).toLocaleDateString('fr-CA')}
                </p>
                {req.message && (
                  <p style={{ fontSize: 12, color: C.text, margin: '4px 0 0', fontStyle: 'italic' }}>"{req.message}"</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {req.status !== 'approved' && (
                  <button onClick={() => updateAttendanceStatus(ev.id, req.id, 'approved')}
                    title="Approuver"
                    style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    ✓
                  </button>
                )}
                {req.status !== 'declined' && (
                  <button onClick={() => updateAttendanceStatus(ev.id, req.id, 'declined')}
                    title="Refuser"
                    style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#991b1b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    ✗
                  </button>
                )}
                <button onClick={() => removeAttendance(ev.id, req.id)}
                  title="Supprimer"
                  style={{ padding: '6px 8px', borderRadius: 8, border: 'none', background: '#f3f4f6', color: C.muted, fontSize: 12, cursor: 'pointer' }}>
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // EDIT FORM
  if (editing) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === 'new' ? 'Nouvel evenement' : "Modifier l'evenement"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Photo */}
        <div>
          <label style={labelSt}>Photo de l'evenement</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {form.img && <img src={form.img} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />}
            <label style={{ display: 'inline-block', padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, cursor: uploading ? 'wait' : 'pointer', color: C.text }}>
              {uploading ? 'Televersement...' : '📁 Choisir une photo'}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {form.img && <button onClick={() => setForm(p => ({ ...p, img: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 13 }}>✕ Supprimer</button>}
          </div>
        </div>
        <div><label style={labelSt}>Titre *</label><input value={form.title} onChange={e => f('title', e.target.value)} style={inputSt} placeholder="Ex: Marche Jean-Talon" /></div>
        <div><label style={labelSt}>Description</label><textarea value={form.description} onChange={e => f('description', e.target.value)} rows={3} style={{ ...inputSt, resize: 'vertical' }} placeholder="Decrivez l'evenement..." /></div>
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
        <div><label style={labelSt}>Lieu</label><input value={form.location} onChange={e => f('location', e.target.value)} style={inputSt} placeholder="Ex: Marche Jean-Talon" /></div>
        <div><label style={labelSt}>Adresse</label><input value={form.address} onChange={e => f('address', e.target.value)} style={inputSt} placeholder="Ex: 7070 Henri Julien, Montreal" /></div>

        {/* Attendance settings */}
        <div style={{ padding: 16, background: C.cream, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, margin: '0 0 12px' }}>Gestion des participations</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button onClick={() => f('attendanceEnabled', !form.attendanceEnabled)}
              style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.attendanceEnabled ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.attendanceEnabled ? 23 : 3, transition: 'left 0.2s' }} />
            </button>
            <span style={{ fontSize: 13, color: C.text }}>Permettre les demandes de participation</span>
          </div>
          {form.attendanceEnabled && (
            <div>
              <label style={labelSt}>Nombre max de participants (0 = illimite)</label>
              <input type="number" value={form.maxAttendees} onChange={e => f('maxAttendees', parseInt(e.target.value) || 0)} style={{ ...inputSt, maxWidth: 200 }} min={0} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => f('active', !form.active)}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.active ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <span style={{ fontSize: 14, color: C.text }}>Visible sur le site</span>
        </div>
        <button onClick={save} disabled={!form.title || !form.date}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.title || !form.date ? 0.5 : 1 }}>
          {editing === 'new' ? "Creer l'evenement" : 'Enregistrer'}
        </button>
      </div>
    </div>
  );

  // LIST VIEW
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>Evenements ({events.length})</h2>
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Nouvel evenement
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map(ev => {
          const isPast = ev.date < today;
          const pendingRequests = (ev.attendanceRequests || []).filter(r => r.status === 'pending').length;
          const totalRequests = (ev.attendanceRequests || []).length;
          return (
            <div key={ev.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, opacity: isPast ? 0.7 : 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `${C.hibiscus}12`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: C.hibiscus, lineHeight: 1 }}>{new Date(ev.date).getUTCDate()}</span>
                <span style={{ fontSize: 10, color: C.hibiscus, textTransform: 'uppercase' }}>{new Date(ev.date).toLocaleString('fr-CA', { month: 'short', timeZone: 'UTC' })}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{ev.title}</span>
                  <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: ev.active ? '#dcfce7' : '#f3f4f6', color: ev.active ? '#166534' : C.muted, fontWeight: 600 }}>
                    {ev.active ? '✓ Visible' : 'Masque'}
                  </span>
                  {isPast && <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>Passe</span>}
                  {ev.attendanceEnabled && (
                    <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                      🙋 {totalRequests} demande(s)
                    </span>
                  )}
                  {pendingRequests > 0 && (
                    <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                      {pendingRequests} en attente
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{ev.type} · {ev.location} · {ev.date}{ev.time ? ` · ${ev.time}` : ''}</p>
              </div>
              {ev.attendanceEnabled && (
                <button onClick={() => setViewingAttendance(ev.id)} title="Gerer les participations"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#2563eb', fontSize: 14, fontWeight: 600 }}>
                  🙋 {totalRequests}
                </button>
              )}
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
            <p>Aucun evenement. Creez votre premier evenement !</p>
          </div>
        )}
      </div>
    </div>
  );
}
