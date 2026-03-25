import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';

export default function AdminEventSettingsPage() {
  const { eventSettings, updateEventSettings, logActivity } = useData();
  const [form, setForm] = useState(eventSettings);
  const [newType, setNewType] = useState('');

  const addType = () => {
    const value = newType.trim();
    if (!value || form.types.includes(value)) return;
    setForm(prev => ({ ...prev, types: [...prev.types, value] }));
    setNewType('');
  };

  const removeType = (value: string) => {
    setForm(prev => ({ ...prev, types: prev.types.filter(t => t !== value) }));
  };

  const save = () => {
    updateEventSettings(form);
    logActivity('Paramètres événements modifiés', 'Types mis à jour', 'event');
  };

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ ...CSS.heading, fontSize: 22, margin: 0 }}>Paramètres Événements</h2>
          <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 0' }}>
            Gérez les types d'événements disponibles.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.hibiscus, color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Icon type="check" size={16} color="#fff" /> Enregistrer
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, margin: '0 0 10px' }}>Types</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.types.map(type => (
            <span key={type} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 9999,
              background: `${C.green}12`, color: C.green, fontSize: 12, fontWeight: 600,
            }}>
              {type}
              <button type="button" onClick={() => removeType(type)} style={{ border: 'none', background: 'none', color: C.green, cursor: 'pointer' }}>?</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addType()}
            placeholder="Nouveau type..."
            style={{ ...inputSt, flex: 1 }}
          />
          <button type="button" onClick={addType} style={{
            padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`,
            background: '#fff', cursor: 'pointer', fontWeight: 700, color: C.text,
          }}>
            + Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
