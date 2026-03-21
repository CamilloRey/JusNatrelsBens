import { useMemo, useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';
import type { Ingredient } from '../types/ingredient.types';

interface IngredientForm {
  name: string;
  image: string;
  note: string;
  benefitsText: string;
  active: boolean;
}

const EMPTY_FORM: IngredientForm = {
  name: '',
  image: '',
  note: '',
  benefitsText: '',
  active: true,
};

function toForm(ingredient: Ingredient): IngredientForm {
  return {
    name: ingredient.name,
    image: ingredient.image,
    note: ingredient.note,
    benefitsText: ingredient.benefits.join('\n'),
    active: ingredient.active,
  };
}

function toIngredient(id: string, form: IngredientForm): Ingredient {
  return {
    id,
    name: form.name.trim(),
    image: form.image.trim(),
    note: form.note.trim(),
    benefits: form.benefitsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    active: form.active,
  };
}

export default function AdminIngredientsPage() {
  const { ingredients, updateIngredients, logActivity } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IngredientForm>(EMPTY_FORM);

  const sortedIngredients = useMemo(
    () => [...ingredients].sort((a, b) => a.name.localeCompare(b.name)),
    [ingredients]
  );

  const startCreate = () => {
    setEditingId('new');
    setForm(EMPTY_FORM);
  };

  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id);
    setForm(toForm(ingredient));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const saveIngredient = () => {
    if (!editingId || !form.name.trim()) return;

    if (editingId === 'new') {
      const newIngredient = toIngredient(`ing-${Date.now()}`, form);
      updateIngredients([...ingredients, newIngredient]);
      logActivity('Ingredient ajoute', newIngredient.name, 'product');
    } else {
      updateIngredients(
        ingredients.map((ingredient) =>
          ingredient.id === editingId ? toIngredient(editingId, form) : ingredient
        )
      );
      logActivity('Ingredient modifie', form.name, 'product');
    }

    cancelEdit();
  };

  const deleteIngredient = (ingredient: Ingredient) => {
    if (!confirm(`Supprimer ${ingredient.name} ?`)) return;
    updateIngredients(ingredients.filter((item) => item.id !== ingredient.id));
    logActivity('Ingredient supprime', ingredient.name, 'product');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, gap: 10, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", color: C.dark, fontSize: 26 }}>
          Ingredients et bienfaits
        </h2>
        <button
          type="button"
          onClick={startCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            borderRadius: 12,
            padding: '10px 16px',
            background: C.hibiscus,
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Icon type="plus" size={16} color="#fff" />
          Nouvel ingredient
        </button>
      </div>

      {editingId && (
        <div className="surface-card" style={{ padding: 18, marginBottom: 16 }}>
          <div className="two-col" style={{ alignItems: 'start' }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Nom</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Ex: Gingembre"
              />

              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Image (URL internet)</label>
              <input
                className="form-input"
                value={form.image}
                onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                placeholder="https://images.unsplash.com/..."
              />

              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Description courte</label>
              <input
                className="form-input"
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Resume rapide de l'ingredient"
              />
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
                Bienfaits (1 ligne = 1 benefice)
              </label>
              <textarea
                className="form-area"
                value={form.benefitsText}
                onChange={(event) => setForm((prev) => ({ ...prev, benefitsText: event.target.value }))}
                placeholder={'Aide la digestion\nRiche en antioxydants'}
                rows={8}
              />

              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
                className={`chip-btn ${form.active ? 'chip-btn-active' : ''}`.trim()}
                style={{ width: 'fit-content' }}
              >
                {form.active ? 'Actif' : 'Inactif'}
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-solid anim-btn" onClick={saveIngredient}>
                  {editingId === 'new' ? 'Ajouter' : 'Enregistrer'}
                </button>
                <button type="button" className="btn-light anim-btn" onClick={cancelEdit}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {sortedIngredients.map((ingredient) => (
          <article key={ingredient.id} className="surface-card" style={{ padding: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
              <img
                src={ingredient.image}
                alt={ingredient.name}
                style={{ width: 84, height: 84, borderRadius: 12, objectFit: 'cover', border: `1px solid ${C.border}` }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: C.dark }}>{ingredient.name}</h3>
                  <span className={`chip-btn ${ingredient.active ? 'chip-btn-active' : ''}`.trim()} style={{ cursor: 'default' }}>
                    {ingredient.active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                {ingredient.note && <p className="mini-muted" style={{ marginTop: 5 }}>{ingredient.note}</p>}
                <p className="mini-muted" style={{ marginTop: 5 }}>
                  {ingredient.benefits.length} bienfait(s)
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" onClick={() => startEdit(ingredient)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Icon type="edit" size={16} color={C.muted} />
                </button>
                <button type="button" onClick={() => deleteIngredient(ingredient)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Icon type="trash" size={16} color="#dc2626" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
