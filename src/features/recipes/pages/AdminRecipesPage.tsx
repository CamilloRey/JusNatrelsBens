import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import type { Recipe } from '../types/recipe.types';

const CATEGORIES = ['Smoothie', 'Jus', 'Cocktail', 'Dessert', 'Sauté'];
const DIFFICULTIES = ['Facile', 'Moyen', 'Difficile'];

interface RecipeFormState extends Omit<Recipe, 'id' | 'tags'> {
  tags: string;
}

export default function AdminRecipesPage() {
  const { recipes, updateRecipes, logActivity } = useData();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<RecipeFormState>({
    name: '',
    description: '',
    category: 'Smoothie',
    difficulty: 'Facile',
    prepTime: 10,
    servings: 1,
    products: [],
    ingredients: [],
    instructions: [],
    image: '🥤',
    featured: false,
    published: false,
    tags: '',
  });

  const startEdit = (recipe: Recipe) => {
    setEditing(recipe.id);
    setForm({
      ...recipe,
      tags: recipe.tags.join(', '),
    });
  };

  const handleSave = () => {
    if (!form.name || !form.description) {
      alert('Le nom et la description sont requis');
      return;
    }

    const recipe: Omit<Recipe, 'id'> = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: form.ingredients.length === 0 ? [''] : form.ingredients,
      instructions: form.instructions.length === 0 ? [''] : form.instructions,
    };

    if (editing === 'new') {
      const newRecipe: Recipe = {
        ...recipe,
        id: 'r' + Date.now(),
      };
      updateRecipes([...recipes, newRecipe]);
      logActivity('Recette créée', form.name, 'blog');
    } else {
      updateRecipes(
        recipes.map((r) => (r.id === editing ? { ...r, ...recipe } : r))
      );
      logActivity('Recette modifiée', form.name, 'blog');
    }
    setEditing(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    updateRecipes(recipes.filter((r) => r.id !== id));
    logActivity('Recette supprimée', name, 'blog');
  };

  const f = <K extends keyof RecipeFormState>(k: K, v: RecipeFormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  if (editing) {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          padding: 28,
          border: `1px solid ${C.border}`,
          maxWidth: 720,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <h3
            style={{
              ...CSS.heading,
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {editing === 'new' ? 'Nouvelle recette' : 'Modifier la recette'}
          </h3>
          <button
            onClick={() => setEditing(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon type="x" color={C.muted} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelSt}>Émoji / Icône</label>
            <input
              value={form.image}
              onChange={(e) => f('image', e.target.value)}
              style={{ ...inputSt, fontSize: 24 }}
              placeholder="🥤"
            />
          </div>

          <div>
            <label style={labelSt}>Nom *</label>
            <input
              value={form.name}
              onChange={(e) => f('name', e.target.value)}
              style={inputSt}
              placeholder="Ex: Smoothie Tropicale"
            />
          </div>

          <div>
            <label style={labelSt}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => f('description', e.target.value)}
              rows={2}
              style={{ ...inputSt, resize: 'vertical' }}
              placeholder="Brève description de la recette"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelSt}>Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => f('category', e.target.value as any)}
                style={inputSt}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelSt}>Difficulté</label>
              <select
                value={form.difficulty}
                onChange={(e) => f('difficulty', e.target.value as any)}
                style={inputSt}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelSt}>Temps de préparation (min)</label>
              <input
                type="number"
                value={form.prepTime}
                onChange={(e) => f('prepTime', parseInt(e.target.value) || 0)}
                style={inputSt}
                min="1"
              />
            </div>
            <div>
              <label style={labelSt}>Portions</label>
              <input
                type="number"
                value={form.servings}
                onChange={(e) => f('servings', parseInt(e.target.value) || 1)}
                style={inputSt}
                min="1"
              />
            </div>
          </div>

          <div>
            <label style={labelSt}>Ingrédients (un par ligne)</label>
            <textarea
              value={form.ingredients.join('\n')}
              onChange={(e) =>
                f(
                  'ingredients',
                  e.target.value
                    .split('\n')
                    .map((i) => i.trim())
                    .filter(Boolean)
                )
              }
              rows={4}
              style={{ ...inputSt, resize: 'vertical' }}
              placeholder="250ml de jus Ben's&#10;1 banane&#10;150ml yogourt grec"
            />
          </div>

          <div>
            <label style={labelSt}>Instructions (un par ligne)</label>
            <textarea
              value={form.instructions.join('\n')}
              onChange={(e) =>
                f(
                  'instructions',
                  e.target.value
                    .split('\n')
                    .map((i) => i.trim())
                    .filter(Boolean)
                )
              }
              rows={4}
              style={{ ...inputSt, resize: 'vertical' }}
              placeholder="Versez le jus&#10;Ajoutez la banane&#10;Mélangez"
            />
          </div>

          <div>
            <label style={labelSt}>Tags (séparés par virgules)</label>
            <input
              value={form.tags}
              onChange={(e) => f('tags', e.target.value)}
              style={inputSt}
              placeholder="tropical, rapide, énergisant"
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => f('published', !form.published)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: 'none',
                  background: form.published ? C.green : '#d1d5db',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 3,
                    left: form.published ? 23 : 3,
                    transition: 'left 0.2s',
                  }}
                />
              </button>
              <span style={{ fontSize: 14, color: C.text }}>Publiée</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => f('featured', !form.featured)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: 'none',
                  background: form.featured ? C.hibiscus : '#d1d5db',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 3,
                    left: form.featured ? 23 : 3,
                    transition: 'left 0.2s',
                  }}
                />
              </button>
              <span style={{ fontSize: 14, color: C.text }}>En vedette</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!form.name || !form.description}
            style={{
              padding: 14,
              borderRadius: 12,
              border: 'none',
              background: C.hibiscus,
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: !form.name || !form.description ? 0.5 : 1,
            }}
          >
            {editing === 'new' ? 'Créer la recette' : 'Enregistrer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: 0 }}>
          Recettes ({recipes.length})
        </h2>
        <button
          onClick={() => {
            setEditing('new');
            setForm({
              name: '',
              description: '',
              category: 'Smoothie',
              difficulty: 'Facile',
              prepTime: 10,
              servings: 1,
              products: [],
              ingredients: [],
              instructions: [],
              image: '🥤',
              featured: false,
              published: false,
              tags: '',
            });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: C.hibiscus,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Icon type="plus" size={16} color="#fff" /> Nouvelle recette
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '16px 20px',
              border: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 44,
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              {recipe.image}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 4,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>
                  {recipe.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '1px 8px',
                    borderRadius: 6,
                    background: recipe.published ? '#dcfce7' : '#fef3c7',
                    color: recipe.published ? '#166534' : '#92400e',
                    fontWeight: 600,
                  }}
                >
                  {recipe.published ? '✓ Publié' : 'Brouillon'}
                </span>
                {recipe.featured && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: '1px 8px',
                      borderRadius: 6,
                      background: `${C.hibiscus}20`,
                      color: C.hibiscus,
                      fontWeight: 600,
                    }}
                  >
                    ⭐ Vedette
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                {recipe.category} · {recipe.difficulty} · ⏱️ {recipe.prepTime} min
              </p>
            </div>

            <button
              onClick={() => startEdit(recipe)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
              }}
            >
              <Icon type="edit" size={16} color={C.muted} />
            </button>
            <button
              onClick={() => handleDelete(recipe.id, recipe.name)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
              }}
            >
              <Icon type="trash" size={16} color="#dc2626" />
            </button>
          </div>
        ))}

        {recipes.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              color: C.muted,
            }}
          >
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>
              🍳
            </span>
            <p>Aucune recette. Créez votre première recette !</p>
          </div>
        )}
      </div>
    </div>
  );
}
