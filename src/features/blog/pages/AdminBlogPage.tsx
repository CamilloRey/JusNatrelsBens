import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import { uploadImage } from '@/lib/api/http-client';
import type { BlogPost, BlogFormState } from '../types/blog.types';

export default function AdminBlogPage() {
  const { blogs, updateBlogs, logActivity, blogSettings } = useData();
  const CATEGORIES = blogSettings.categories;
  const EMPTY_FORM: BlogFormState = { title: '', category: CATEGORIES[0] || 'Sante', content: '', published: false, img: '', tags: '', contentType: 'article' };
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const startEdit = (b: BlogPost) => {
    setEditing(b.id);
    setForm({
      title: b.title, category: b.category, content: b.content,
      published: b.published, img: b.img ?? '',
      tags: (b.tags || []).join(', '),
      contentType: b.contentType || 'article',
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, 'blog');
    if (url) setForm(f => ({ ...f, img: url }));
    else alert("Erreur upload. Verifiez que le bucket 'product-images' existe dans Supabase.");
    setUploading(false);
  };

  const save = () => {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editing === 'new') {
      const nb: BlogPost = {
        ...form, img: form.img || undefined, id: 'b' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        tags, contentType: form.contentType,
      };
      updateBlogs([...blogs, nb]);
      logActivity('Article cree', nb.title, 'blog');
    } else {
      updateBlogs(blogs.map(b => b.id === editing ? {
        ...b, ...form, img: form.img || undefined, tags, contentType: form.contentType,
      } : b));
      logActivity('Article modifie', form.title, 'blog');
    }
    setEditing(null);
  };

  const remove = (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    updateBlogs(blogs.filter(b => b.id !== id));
    logActivity('Article supprime', title, 'blog');
  };

  if (editing) return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>{editing === 'new' ? 'Nouveau contenu' : "Modifier le contenu"}</h3>
        <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon type="x" color={C.muted} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Content Type */}
        <div>
          <label style={labelSt}>Type de contenu</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['article', 'recette'] as const).map(type => (
              <button key={type} onClick={() => setForm(f => ({ ...f, contentType: type }))}
                style={{
                  padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: `2px solid ${form.contentType === type ? C.hibiscus : C.border}`,
                  background: form.contentType === type ? C.hibiscus : '#fff',
                  color: form.contentType === type ? '#fff' : C.text,
                }}>
                {type === 'article' ? '📝 Article' : '🍹 Recette'}
              </button>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div>
          <label style={labelSt}>Photo de couverture</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {form.img && <img src={form.img} alt="" style={{ width: 100, height: 64, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} />}
            <label style={{ display: 'inline-block', padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, cursor: uploading ? 'wait' : 'pointer', color: C.text }}>
              {uploading ? 'Televersement...' : '📁 Choisir une photo'}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {form.img && <button onClick={() => setForm(f => ({ ...f, img: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 13 }}>✕ Supprimer</button>}
          </div>
        </div>

        <div><label style={labelSt}>Titre</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputSt} /></div>
        <div>
          <label style={labelSt}>Categorie</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputSt}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelSt}>Tags (separes par des virgules)</label>
          <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} style={inputSt} placeholder="ex: sante, tropical, rapide" />
        </div>
        <div><label style={labelSt}>Contenu</label><textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} style={{ ...inputSt, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setForm(f => ({ ...f, published: !f.published }))}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.published ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.published ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <span style={{ fontSize: 14, color: C.text }}>Publie</span>
        </div>
        <button onClick={save} disabled={!form.title || !form.content}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.title || !form.content ? 0.5 : 1 }}>
          {editing === 'new' ? "Publier" : 'Enregistrer'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0, color: C.dark }}>Blogue & Recettes ({blogs.length})</h2>
        <button onClick={() => { setEditing('new'); setForm(EMPTY_FORM); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Nouveau contenu
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blogs.map(b => (
          <div key={b.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            {b.img
              ? <img src={b.img} alt={b.title} style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
              : <div style={{ width: 56, height: 44, borderRadius: 8, background: C.light, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {b.contentType === 'recette' ? '🍹' : '📝'}
                </div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{b.title}</span>
                <span style={{
                  fontSize: 10, padding: '1px 8px', borderRadius: 6, fontWeight: 700, textTransform: 'uppercase',
                  background: b.contentType === 'recette' ? `${C.green}15` : `${C.hibiscus}15`,
                  color: b.contentType === 'recette' ? C.green : C.hibiscus,
                }}>
                  {b.contentType === 'recette' ? 'Recette' : 'Article'}
                </span>
                <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 6, background: b.published ? '#dcfce7' : '#fef3c7', color: b.published ? '#166534' : '#92400e', fontWeight: 600 }}>
                  {b.published ? '✓ Publie' : 'Brouillon'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: C.muted }}>{b.category} · {b.date}</span>
                {(b.tags || []).map(tag => (
                  <span key={tag} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: `${C.muted}15`, color: C.muted, fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => startEdit(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
            <button onClick={() => remove(b.id, b.title)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
