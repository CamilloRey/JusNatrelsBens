import { useState } from 'react';
import { C }          from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { ProductImg } from '@/shared/ui/ProductImg';
import { Icon }       from '@/shared/ui/Icon';
import { uploadImage } from '@/lib/api/http-client';
import type { Product, ProductFormState } from '../types/product.types';

interface AdminProductFormProps {
  initial?: Product | null;
  onSave:  (data: ProductFormState) => void;
  onClose: () => void;
}

const EMOJIS = ['🍹', '🍓', '🍋', '🍍', '🫐', '🥭', '🫚', '🌺', '🥕', '🍊'];

export function AdminProductForm({ initial, onSave, onClose }: AdminProductFormProps) {
  const [form, setForm] = useState<ProductFormState>({
    name:      initial?.name      ?? '',
    category:  initial?.category  ?? 'Jus',
    price:     initial?.price.toString() ?? '',
    formats:   initial?.formats.join(', ') ?? '250ml, 1L',
    desc:      initial?.desc      ?? '',
    tag:       initial?.tag       ?? '',
    img:       initial?.img       ?? '🍹',
    available: initial?.available ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const imgIsUrl = form.img.startsWith('http') || form.img.startsWith('/');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file, 'products');
    if (url) setForm(f => ({ ...f, img: url }));
    else alert("Erreur upload. Vérifiez que le bucket 'product-images' existe dans Supabase.");
    setUploading(false);
  };

  const isValid = form.name.trim() && parseFloat(form.price) > 0;

  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 28, border: `1px solid ${C.border}`, maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>
          {initial ? 'Modifier le produit' : 'Nouveau produit'}
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon type="x" color={C.muted} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Image */}
        <div>
          <label style={labelSt}>Photo ou icône</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 64, height: 64, borderRadius: 10, background: C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <ProductImg src={form.img} size={64} borderRadius={0} />
            </div>
            <div>
              <label style={{ display: 'inline-block', padding: '8px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, cursor: uploading ? 'wait' : 'pointer', color: C.text }}>
                {uploading ? 'Téléversement…' : '📁 Choisir une photo'}
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
              <p style={{ fontSize: 11, color: C.muted, margin: '4px 0 0' }}>JPG, PNG, WebP — max 5 MB</p>
            </div>
          </div>
          <input value={imgIsUrl ? form.img : ''} onChange={e => setForm(f => ({ ...f, img: e.target.value }))}
            placeholder="Ou coller une URL d'image (https://…)" style={{ ...inputSt, marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setForm(f => ({ ...f, img: e }))}
                style={{ fontSize: 22, padding: '5px 9px', borderRadius: 8, border: form.img === e ? `2px solid ${C.red}` : `1px solid ${C.border}`, background: form.img === e ? `${C.red}12` : '#fff', cursor: 'pointer' }}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div><label style={labelSt}>Nom du produit</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputSt} /></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelSt}>Catégorie</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputSt}>
              <option>Jus</option><option>Tisanes</option><option>Épices</option><option>Cosmétiques</option>
            </select>
          </div>
          <div><label style={labelSt}>Prix ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputSt} /></div>
        </div>

        <div><label style={labelSt}>Formats (séparés par virgule)</label><input value={form.formats} onChange={e => setForm(f => ({ ...f, formats: e.target.value }))} placeholder="250ml, 354ml, 1L" style={inputSt} /></div>
        <div><label style={labelSt}>Description</label><textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} style={{ ...inputSt, resize: 'vertical' }} /></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelSt}>Étiquette</label>
            <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} style={inputSt}>
              <option value="">Aucune</option><option>Nouveau</option><option>Populaire</option><option>En promotion</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
            <button onClick={() => setForm(f => ({ ...f, available: !f.available }))}
              style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.available ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.available ? 23 : 3, transition: 'left 0.2s' }} />
            </button>
            <span style={{ fontSize: 14, color: C.text }}>Disponible</span>
          </div>
        </div>

        <button onClick={() => onSave(form)} disabled={!isValid}
          style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: isValid ? 'pointer' : 'not-allowed', opacity: isValid ? 1 : 0.5 }}>
          {initial ? 'Enregistrer' : 'Ajouter le produit'}
        </button>
      </div>
    </div>
  );
}
