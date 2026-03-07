import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon }     from '@/shared/ui/Icon';
import type { BlogPost, BlogFormState } from '../types/blog.types';

export default function AdminBlogPage() {
  const { blogs, updateBlogs, logActivity } = useData();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>({ title: '', category: 'Santé', content: '', published: false });

  const startEdit = (b: BlogPost) => {
    setEditing(b.id);
    setForm({ title: b.title, category: b.category, content: b.content, published: b.published });
  };

  const save = () => {
    if (editing === 'new') {
      const nb: BlogPost = { ...form, id: 'b' + Date.now(), date: new Date().toISOString().split('T')[0] };
      updateBlogs([...blogs, nb]);
      logActivity('Article créé', nb.title, 'blog');
    } else {
      updateBlogs(blogs.map(b => b.id === editing ? { ...b, ...form } : b));
      logActivity('Article modifié', form.title, 'blog');
    }
    setEditing(null);
  };

  const remove = (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    updateBlogs(blogs.filter(b => b.id !== id));
    logActivity('Article supprimé', title, 'blog');
  };

  if (editing) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === 'new' ? 'Nouvel article' : "Modifier l'article"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label style={labelSt}>Titre</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputSt} /></div>
        <div>
          <label style={labelSt}>Catégorie</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputSt}>
            <option>Santé</option><option>Recettes</option><option>Actualités</option><option>Conseils</option>
          </select>
        </div>
        <div><label style={labelSt}>Contenu</label><textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} style={{ ...inputSt, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setForm(f => ({ ...f, published: !f.published }))}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.published ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.published ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <span style={{ fontSize: 14, color: C.text }}>Publié</span>
        </div>
        <button onClick={save} disabled={!form.title || !form.content}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.title || !form.content ? 0.5 : 1 }}>
          {editing === 'new' ? "Publier l'article" : 'Enregistrer'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => { setEditing('new'); setForm({ title: '', category: 'Santé', content: '', published: false }); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Nouvel article
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blogs.map(b => (
          <div key={b.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{b.title}</span>
                <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: b.published ? '#dcfce7' : '#fef3c7', color: b.published ? '#166534' : '#92400e', fontWeight: 600 }}>
                  {b.published ? '✓ Publié' : 'Brouillon'}
                </span>
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{b.category} · {b.date}</p>
            </div>
            <button onClick={() => startEdit(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
            <button onClick={() => remove(b.id, b.title)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
