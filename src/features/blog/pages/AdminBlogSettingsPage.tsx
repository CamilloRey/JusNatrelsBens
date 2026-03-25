import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';

export default function AdminBlogSettingsPage() {
  const { blogSettings, updateBlogSettings, logActivity } = useData();
  const [form, setForm] = useState(blogSettings);
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value || form.categories.includes(value)) return;
    setForm(prev => ({ ...prev, categories: [...prev.categories, value] }));
    setNewCategory('');
  };

  const removeCategory = (value: string) => {
    setForm(prev => ({ ...prev, categories: prev.categories.filter(c => c !== value) }));
  };

  const save = () => {
    updateBlogSettings(form);
    logActivity('Paramètres blog modifiés', 'Catégories mises à jour', 'blog');
  };

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ ...CSS.heading, fontSize: 22, margin: 0 }}>Paramètres Blog</h2>
          <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 0' }}>
            Gérez les catégories disponibles pour vos articles.
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
        <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, margin: '0 0 10px' }}>Catégories</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.categories.map(cat => (
            <span key={cat} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 9999,
              background: `${C.green}12`, color: C.green, fontSize: 12, fontWeight: 600,
            }}>
              {cat}
              <button type="button" onClick={() => removeCategory(cat)} style={{ border: 'none', background: 'none', color: C.green, cursor: 'pointer' }}>?</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Nouvelle catégorie..."
            style={{ ...inputSt, flex: 1 }}
          />
          <button type="button" onClick={addCategory} style={{
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
