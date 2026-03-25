import { useState, useRef } from 'react';
import { useData }    from '@/app/providers/DataContext';
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

/* ─── Petit toggle checkbox stylisé ─── */
function CheckPill({ label, checked, onChange, icon }: { label: string; checked: boolean; onChange: () => void; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 9999,
        border: `1.5px solid ${checked ? C.green : C.border}`,
        background: checked ? `${C.green}14` : '#ffffff',
        color: checked ? C.green : C.muted,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '0.78rem', fontWeight: checked ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.15s',
        userSelect: 'none' as const,
      }}
    >
      {icon && <span>{icon}</span>}
      {checked && <span style={{ fontSize: '0.7rem' }}>✓</span>}
      {label}
    </button>
  );
}

export function AdminProductForm({ initial, onSave, onClose }: AdminProductFormProps) {
const { ingredients, productSettings } = useData();

// Utiliser les paramètres dynamiques de la BD
const CATEGORIES = productSettings.categories;
const FORMATS = productSettings.formats;
const TAGS = productSettings.tags;
const CHARACTERISTICS = productSettings.characteristics;
const COLORS = productSettings.colors;

const [form, setForm] = useState<ProductFormState>(
  initial
    ? {
        name:            initial.name,
        category:        initial.category,
        price:           initial.price.toString(),
        formats:         [...initial.formats],
        desc:            initial.desc,
        tag:             initial.tag,
        img:             initial.img,
        available:       initial.available,
        color:           initial.color ?? (COLORS[0] || '#c44536'),
        characteristics: [...(initial.characteristics ?? [])],
        ingredients:     [...(initial.ingredients ?? [])],
      }
    : {
        name:            '',
        category:        CATEGORIES[0] || 'Jus',
        price:           '',
        formats:         FORMATS.slice(0, 2),
        desc:            '',
        tag:             '',
        img:             '🍹',
        available:       true,
        color:           COLORS[0] || '#c44536',
        characteristics: CHARACTERISTICS.slice(0, 2).map(c => c.label),
        ingredients:     [],
      }
);

  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [customFormat, setCustomFormat] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imgIsUrl = form.img.startsWith('http') || form.img.startsWith('/');

  /* ─── Upload direct Supabase ─── */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setUploadError('Fichier trop volumineux (max 8 MB)'); return; }
    setUploading(true);
    setUploadError('');
    const url = await uploadImage(file, 'products');
    if (url) {
      setForm(f => ({ ...f, img: url }));
      setUploadError('');
    } else {
      setUploadError("Erreur upload — vérifiez que le bucket 'product-images' existe dans Supabase.");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─── Helpers ─── */
  const toggleFormat = (fmt: string) =>
    setForm(f => ({
      ...f,
      formats: f.formats.includes(fmt)
        ? f.formats.filter(x => x !== fmt)
        : [...f.formats, fmt],
    }));

  const toggleChar = (label: string) =>
    setForm(f => ({
      ...f,
      characteristics: f.characteristics.includes(label)
        ? f.characteristics.filter(x => x !== label)
        : [...f.characteristics, label],
    }));

  const toggleIngredient = (id: string) =>
    setForm(f => ({
      ...f,
      ingredients: f.ingredients.includes(id)
        ? f.ingredients.filter(x => x !== id)
        : [...f.ingredients, id],
    }));

  const addCustomFormat = () => {
    const v = customFormat.trim();
    if (v && !form.formats.includes(v)) {
      setForm(f => ({ ...f, formats: [...f.formats, v] }));
    }
    setCustomFormat('');
  };

  const isValid = form.name.trim() && parseFloat(form.price) > 0 && form.formats.length > 0;

  const sectionTitle = (text: string) => (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: C.muted, margin: '20px 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
      {text}
    </p>
  );

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: `1px solid ${C.border}`, maxWidth: 680 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ ...CSS.heading, fontSize: 20, fontWeight: 700, margin: 0 }}>
          {initial ? `Modifier — ${initial.name}` : 'Nouveau produit'}
        </h3>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon type="x" color={C.muted} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── 1. PHOTO ── */}
        {sectionTitle('📸 Photo du produit')}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
          {/* Preview */}
          <div style={{
            width: 100, height: 100, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${form.color}18, ${form.color}08)`,
            border: `1px solid ${form.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            <ProductImg src={form.img} size={90} borderRadius={0} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Upload button */}
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', borderRadius: 8,
              border: `1.5px solid ${uploading ? C.border : C.green}`,
              background: uploading ? '#f9fafb' : `${C.green}08`,
              fontSize: 13, fontWeight: 600,
              cursor: uploading ? 'wait' : 'pointer',
              color: uploading ? C.muted : C.green,
              transition: 'all 0.15s',
            }}>
              {uploading ? (
                <><span style={{ fontSize: 14 }}>⏳</span> Téléversement…</>
              ) : (
                <><span style={{ fontSize: 14 }}>📁</span> Choisir une photo (JPG, PNG, WebP)</>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {uploadError && (
              <p style={{ fontSize: 12, color: '#dc2626', margin: 0 }}>{uploadError}</p>
            )}
            {/* URL manuelle */}
            <input
              value={imgIsUrl ? form.img : ''}
              onChange={e => setForm(f => ({ ...f, img: e.target.value }))}
              placeholder="Ou coller une URL d'image (https://…)"
              style={{ ...inputSt, fontSize: 12 }}
            />
            {form.img.startsWith('http') && (
              <button type="button" onClick={() => setForm(f => ({ ...f, img: '🍹' }))}
                style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#dc2626', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                ✕ Supprimer la photo
              </button>
            )}
            {/* Emoji de secours */}
            <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 4px' }}>Icône de secours :</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
              {['🍹','🍓','🍋','🍍','🫐','🥭','🌺','🥕','🍊','🌿','🫚','🍇'].map(e => (
                <button key={e} type="button" onClick={() => setForm(f => ({ ...f, img: e }))}
                  style={{ fontSize: 20, padding: '4px 8px', borderRadius: 7, border: form.img === e ? `2px solid ${C.hibiscus}` : `1px solid ${C.border}`, background: form.img === e ? `${C.hibiscus}12` : '#fff', cursor: 'pointer' }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. INFORMATIONS DE BASE ── */}
        {sectionTitle('📋 Informations')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}>Nom du produit *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputSt} placeholder="Ex: Jus d'Hibiscus & Gingembre" />
          </div>
          <div>
            <label style={labelSt}>Catégorie</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputSt}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Prix ($) *</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputSt} placeholder="12.99" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelSt}>Description</label>
            <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3}
              style={{ ...inputSt, resize: 'vertical' as const }}
              placeholder="Décrivez le goût, les ingrédients, les bienfaits…" />
          </div>
        </div>

        {/* ── 3. FORMATS ── */}
        {sectionTitle('📦 Formats disponibles')}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 8 }}>
          {FORMATS.map(fmt => (
            <CheckPill key={fmt} label={fmt} checked={form.formats.includes(fmt)} onChange={() => toggleFormat(fmt)} />
          ))}
        </div>
        {/* Format personnalisé */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={customFormat}
            onChange={e => setCustomFormat(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomFormat()}
            placeholder="Autre format (ex: 330ml)"
            style={{ ...inputSt, maxWidth: 180, fontSize: 13 }}
          />
          <button type="button" onClick={addCustomFormat}
            style={{ padding: '9px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, cursor: 'pointer', color: C.text, fontWeight: 600 }}>
            + Ajouter
          </button>
        </div>
        {form.formats.length === 0 && (
          <p style={{ fontSize: 12, color: '#dc2626', margin: '4px 0 0' }}>Sélectionnez au moins un format.</p>
        )}

        {/* ── 4. BADGE / ÉTIQUETTE ── */}
        {sectionTitle('🏷️ Étiquette badge')}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
          <CheckPill label="Aucune" checked={form.tag === ''} onChange={() => setForm(f => ({ ...f, tag: '' }))} />
          {TAGS.map(t => (
            <CheckPill key={t} label={t} checked={form.tag === t} onChange={() => setForm(f => ({ ...f, tag: f.tag === t ? '' : t }))} />
          ))}
        </div>
        <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>Un seul badge affiché en haut à droite de la fiche produit.</p>

        {/* ── 5. CARACTÉRISTIQUES ── */}
        {sectionTitle('✅ Caractéristiques / Certifications')}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
          {CHARACTERISTICS.map(ch => (
            <CheckPill
              key={ch.label}
              label={ch.label}
              icon={ch.icon}
              checked={form.characteristics.includes(ch.label)}
              onChange={() => toggleChar(ch.label)}
            />
          ))}
        </div>
        <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>Affiché comme badges qualité sous la photo du produit.</p>

        {/* ── 6. INGRÉDIENTS ── */}
        {sectionTitle('🥬 Ingrédients du produit')}
        {ingredients.filter(i => i.active).length === 0 ? (
          <p style={{ fontSize: 13, color: C.muted, fontStyle: 'italic', margin: 0 }}>
            Aucun ingrédient créé. Ajoutez des ingrédients dans la section "Ingrédients" du menu admin.
          </p>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {ingredients.filter(i => i.active).map(ing => (
              <CheckPill
                key={ing.id}
                label={ing.name}
                icon={ing.image.startsWith('http') ? undefined : ing.image || '🌿'}
                checked={form.ingredients.includes(ing.id)}
                onChange={() => toggleIngredient(ing.id)}
              />
            ))}
          </div>
        )}
        <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>
          Sélectionnez les ingrédients principaux de ce produit (affichés sur la fiche produit).
        </p>

        {/* ── 7. COULEUR ── */}
        {sectionTitle('🎨 Couleur accent du produit')}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          {COLORS.map(col => (
            <button key={col} type="button" onClick={() => setForm(f => ({ ...f, color: col }))}
              style={{
                width: 28, height: 28, borderRadius: '50%', background: col, border: 'none',
                cursor: 'pointer', flexShrink: 0,
                outline: form.color === col ? `3px solid ${col}` : '3px solid transparent',
                outlineOffset: 2,
                transition: 'outline 0.15s, transform 0.15s',
                transform: form.color === col ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
          {/* Custom color */}
          <label style={{ position: 'relative', cursor: 'pointer' }} title="Couleur personnalisée">
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`, border: `2px solid ${C.border}` }} />
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
          </label>
          <span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>Couleur actuelle : <span style={{ fontWeight: 700, color: form.color }}>{form.color}</span></span>
        </div>

        {/* ── 8. DISPONIBILITÉ ── */}
        {sectionTitle('⚙️ Statut')}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" onClick={() => setForm(f => ({ ...f, available: !f.available }))}
            style={{ width: 44, height: 24, borderRadius: 12, border: 'none', background: form.available ? C.green : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.available ? 23 : 3, transition: 'left 0.2s' }} />
          </button>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{form.available ? 'Disponible à la vente' : 'Indisponible'}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
              {form.available ? 'Le produit est visible et achetable sur le site.' : 'Le produit est masqué du catalogue public.'}
            </p>
          </div>
        </div>

        {/* ── ACTIONS ── */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="button" onClick={() => onSave(form)} disabled={!isValid}
            style={{
              flex: 1, padding: '13px 0', borderRadius: 12, border: 'none',
              background: isValid ? C.hibiscus : '#d1d5db',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: isValid ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}>
            {initial ? '✓ Enregistrer les modifications' : '+ Ajouter le produit'}
          </button>
          <button type="button" onClick={onClose}
            style={{ padding: '13px 20px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.text, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
