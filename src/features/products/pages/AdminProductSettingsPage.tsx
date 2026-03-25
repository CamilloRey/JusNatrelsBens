import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import type { ProductSettings, ProductCharacteristic } from '../types/product.types';

export default function AdminProductSettingsPage() {
  const { productSettings, updateProductSettings, logActivity } = useData();
  const [form, setForm] = useState<ProductSettings>(productSettings);
  const [newCategory, setNewCategory] = useState('');
  const [newFormat, setNewFormat] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newChar, setNewChar] = useState({ icon: '?', label: '' });
  const [newColor, setNewColor] = useState('#c44536');
  const [hasChanges, setHasChanges] = useState(false);

  const markChanged = () => setHasChanges(true);

  /* ??? Helpers génériques ??? */
  const addItem = (key: 'categories' | 'formats' | 'tags' | 'colors', value: string) => {
    if (!value.trim()) return;
    if (form[key].includes(value.trim())) return;
    setForm(f => ({ ...f, [key]: [...f[key], value.trim()] }));
    markChanged();
  };

  const removeItem = (key: 'categories' | 'formats' | 'tags' | 'colors', value: string) => {
    setForm(f => ({ ...f, [key]: f[key].filter(v => v !== value) }));
    markChanged();
  };

  const addCharacteristic = () => {
    if (!newChar.label.trim()) return;
    if (form.characteristics.some(c => c.label === newChar.label.trim())) return;
    setForm(f => ({
      ...f,
      characteristics: [...f.characteristics, { icon: newChar.icon, label: newChar.label.trim() }],
    }));
    setNewChar({ icon: '?', label: '' });
    markChanged();
  };

  const removeCharacteristic = (label: string) => {
    setForm(f => ({
      ...f,
      characteristics: f.characteristics.filter(c => c.label !== label),
    }));
    markChanged();
  };

  const save = () => {
    updateProductSettings(form);
    logActivity('Paramètres produits modifiés', 'Configuration mise à jour', 'product');
    setHasChanges(false);
  };

  /* ??? Styles ??? */
  const sectionStyle = {
    background: '#fff',
    borderRadius: 14,
    padding: 20,
    border: `1px solid ${C.border}`,
    marginBottom: 16,
  };

  const chipStyle = (active = true) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 9999,
    border: `1.5px solid ${active ? C.green : C.border}`,
    background: active ? `${C.green}14` : '#ffffff',
    color: active ? C.green : C.muted,
    fontSize: '0.82rem',
    fontWeight: 600,
  });

  const deleteBtn = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#dc2626',
    fontSize: 12,
    padding: '2px 6px',
    marginLeft: 4,
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 700, margin: 0, color: C.dark }}>
            Paramètres Produits
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: '6px 0 0' }}>
            Personnalisez les options disponibles lors de la création/modification de produits.
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={save}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: 'none',
              background: C.hibiscus,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon type="check" size={16} color="#fff" />
            Enregistrer
          </button>
        )}
      </div>

      {/* ??? CATÉGORIES ??? */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ?? Catégories de produits
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.categories.map(cat => (
            <span key={cat} style={chipStyle()}>
              {cat}
              <button style={deleteBtn} onClick={() => removeItem('categories', cat)}>?</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (addItem('categories', newCategory), setNewCategory(''))}
            placeholder="Nouvelle catégorie..."
            style={{ ...inputSt, flex: 1, maxWidth: 200 }}
          />
          <button
            onClick={() => { addItem('categories', newCategory); setNewCategory(''); }}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600, color: C.text }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* ??? FORMATS ??? */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ?? Formats disponibles
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.formats.map(fmt => (
            <span key={fmt} style={chipStyle()}>
              {fmt}
              <button style={deleteBtn} onClick={() => removeItem('formats', fmt)}>?</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newFormat}
            onChange={e => setNewFormat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (addItem('formats', newFormat), setNewFormat(''))}
            placeholder="Ex: 330ml, 2L..."
            style={{ ...inputSt, flex: 1, maxWidth: 200 }}
          />
          <button
            onClick={() => { addItem('formats', newFormat); setNewFormat(''); }}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600, color: C.text }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* ??? TAGS / ÉTIQUETTES ??? */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ??? Étiquettes / Badges
        </h3>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>
          Badges affichés sur les fiches produits (ex: "Nouveau", "Bio", "En promotion")
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.tags.map(tag => (
            <span key={tag} style={chipStyle()}>
              {tag}
              <button style={deleteBtn} onClick={() => removeItem('tags', tag)}>?</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (addItem('tags', newTag), setNewTag(''))}
            placeholder="Nouvelle étiquette..."
            style={{ ...inputSt, flex: 1, maxWidth: 200 }}
          />
          <button
            onClick={() => { addItem('tags', newTag); setNewTag(''); }}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600, color: C.text }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* ??? CARACTÉRISTIQUES ??? */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ? Caractéristiques / Certifications
        </h3>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>
          Badges qualité avec icône (ex: "?? Sans conservateurs", "?? Bio")
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.characteristics.map(ch => (
            <span key={ch.label} style={chipStyle()}>
              <span>{ch.icon}</span>
              {ch.label}
              <button style={deleteBtn} onClick={() => removeCharacteristic(ch.label)}>?</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            value={newChar.icon}
            onChange={e => setNewChar(c => ({ ...c, icon: e.target.value }))}
            placeholder="Icône"
            style={{ ...inputSt, width: 60, textAlign: 'center' }}
          />
          <input
            value={newChar.label}
            onChange={e => setNewChar(c => ({ ...c, label: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addCharacteristic()}
            placeholder="Nom de la caractéristique..."
            style={{ ...inputSt, flex: 1, maxWidth: 200 }}
          />
          <button
            onClick={addCharacteristic}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600, color: C.text }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* ??? COULEURS ??? */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ?? Palette de couleurs
        </h3>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px' }}>
          Couleurs accent disponibles pour les produits
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
          {form.colors.map(col => (
            <div key={col} style={{ position: 'relative' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: col,
                  border: `2px solid ${C.border}`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              />
              <button
                onClick={() => removeItem('colors', col)}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  fontSize: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ?
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            style={{ width: 50, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 13, color: C.muted, fontFamily: 'monospace' }}>{newColor}</span>
          <button
            onClick={() => { addItem('colors', newColor); }}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600, color: C.text }}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* ??? SAVE BUTTON (bottom) ??? */}
      {hasChanges && (
        <div style={{ position: 'sticky', bottom: 16, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={save}
            style={{
              padding: '14px 32px',
              borderRadius: 12,
              border: 'none',
              background: C.hibiscus,
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(196,69,54,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Icon type="check" size={18} color="#fff" />
            Enregistrer les modifications
          </button>
        </div>
      )}
    </div>
  );
}
