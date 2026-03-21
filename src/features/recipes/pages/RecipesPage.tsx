import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/shared/components/SEO';
import type { Recipe } from '../types/recipe.types';

// Mock recipes data
const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Smoothie Tropicale Énergisant',
    description: 'Un smoothie rafraîchissant avec nos jus naturels, banane et yogourt grec',
    category: 'Smoothie',
    difficulty: 'Facile',
    prepTime: 5,
    servings: 2,
    products: [],
    ingredients: ['250ml de jus Ben\'s', '1 banane', '150ml yogourt grec', '50g miel', 'Glaçons'],
    instructions: [
      'Versez le jus Ben\'s dans le mélangeur',
      'Ajoutez la banane coupée en morceaux',
      'Incorporez le yogourt grec',
      'Ajoutez le miel et les glaçons',
      'Mélangez jusqu\'à obtenir une texture lisse',
      'Versez dans des verres et servez immédiatement'
    ],
    image: '🥤',
    featured: true,
    published: true,
    tags: ['énergisant', 'tropical', 'rapide'],
  },
  {
    id: '2',
    name: 'Detox Vert du Matin',
    description: 'Un jus vert puissant pour bien démarrer la journée',
    category: 'Jus',
    difficulty: 'Facile',
    prepTime: 3,
    servings: 1,
    products: [],
    ingredients: ['200ml jus Ben\'s', '1 pomme verte', '1/2 citron', '1 cuillère miel'],
    instructions: [
      'Pressez le citron',
      'Coupez la pomme en morceaux',
      'Mélangez le jus Ben\'s avec le citron frais',
      'Ajoutez la pomme',
      'Complétez avec du miel selon le goût',
      'Dégustez frais'
    ],
    image: '🍎',
    featured: true,
    published: true,
    tags: ['détox', 'sain', 'matin'],
  },
  {
    id: '3',
    name: 'Cocktail Sucré du Coucher de Soleil',
    description: 'Un cocktail sans alcool parfait pour les soirées d\'été',
    category: 'Cocktail',
    difficulty: 'Moyen',
    prepTime: 10,
    servings: 4,
    products: [],
    ingredients: ['500ml jus Ben\'s', '100ml jus citron frais', 'Sirop sucre', 'Glaçons', 'Menthe fraîche', 'Tranche d\'orange'],
    instructions: [
      'Versez le jus Ben\'s dans un pichet',
      'Ajoutez le jus de citron frais',
      'Complétez avec du sirop selon le goût',
      'Mélangez bien',
      'Versez dans des verres remplis de glaçons',
      'Décorez avec une tranche d\'orange et de la menthe'
    ],
    image: '🍹',
    featured: false,
    published: true,
    tags: ['cocktail', 'été', 'soirée'],
  },
];

export default function RecipesPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const recipes = MOCK_RECIPES.filter(r => r.published);

  const filtered = useMemo(() => {
    return recipes.filter(recipe => {
      const categoryMatch = !selectedCategory || recipe.category === selectedCategory;
      const difficultyMatch = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  const featured = filtered.filter(r => r.featured);
  const others = filtered.filter(r => !r.featured);

  const categories = ['Smoothie', 'Jus', 'Cocktail', 'Dessert', 'Sauté'];
  const difficulties = ['Facile', 'Moyen', 'Difficile'];

  return (
    <div>
      <SEO
        title="Recettes"
        description="Découvrez des recettes délicieuses et faciles avec nos jus naturels Ben's."
        url="https://lesjusnatuelsbens.com/recettes"
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Inspiration Culinaire</p>
          <h1 className="page-hero-title">{t('recipes.title', 'Nos Recettes')}</h1>
          <p className="page-hero-subtitle">{t('recipes.subtitle', 'Des recettes délicieuses avec nos jus naturels')}</p>
        </div>
      </section>

      <section className="page-shell">
        {/* Filters */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 12,
            }}>
              Catégorie
            </h3>
            <div className="chip-row">
              <button
                type="button"
                className={`chip-btn ${!selectedCategory ? 'chip-btn-active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                Tout
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip-btn ${selectedCategory === cat ? 'chip-btn-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 12,
            }}>
              Niveau de Difficulté
            </h3>
            <div className="chip-row">
              <button
                type="button"
                className={`chip-btn ${!selectedDifficulty ? 'chip-btn-active' : ''}`}
                onClick={() => setSelectedDifficulty(null)}
              >
                Tout
              </button>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  className={`chip-btn ${selectedDifficulty === diff ? 'chip-btn-active' : ''}`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Recipes */}
        {featured.length > 0 && (
          <div style={{ marginBottom: 64 }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              marginBottom: 32,
            }}>
              Recettes en vedette
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
            }}>
              {featured.map((recipe) => (
                <div key={recipe.id} className="anim-card" style={{
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: 200,
                    background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 80,
                  }}>
                    {recipe.image}
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      marginBottom: 12,
                      alignItems: 'center',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        background: 'var(--brand-primary)',
                        color: 'white',
                        borderRadius: '999px',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {recipe.category}
                      </span>
                      <span style={{
                        fontSize: 12,
                        color: 'var(--text-tertiary)',
                        fontWeight: 600,
                      }}>
                        {recipe.difficulty}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0',
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      {recipe.name}
                    </h3>
                    <p style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      margin: '0 0 16px 0',
                      lineHeight: 1.6,
                    }}>
                      {recipe.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: 16,
                      fontSize: 13,
                      color: 'var(--text-tertiary)',
                      marginBottom: 16,
                    }}>
                      <span>⏱️ {recipe.prepTime} min</span>
                      <span>👥 {recipe.servings} portions</span>
                    </div>
                    <button className="btn-solid anim-btn" style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: 14,
                      fontWeight: 700,
                    }}>
                      Voir la recette
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Recipes */}
        {others.length > 0 && (
          <div>
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              marginBottom: 32,
            }}>
              Autres recettes
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {others.map((recipe) => (
                <div key={recipe.id} className="anim-card" style={{
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{
                    height: 160,
                    background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 60,
                  }}>
                    {recipe.image}
                  </div>
                  <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      marginBottom: 8,
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        background: 'var(--accent-primary)',
                        color: 'white',
                        borderRadius: '999px',
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {recipe.category}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 6px 0',
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      {recipe.name}
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      margin: '0 0 12px 0',
                      lineHeight: 1.5,
                      flex: 1,
                    }}>
                      {recipe.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: 12,
                      fontSize: 12,
                      color: 'var(--text-tertiary)',
                      marginBottom: 12,
                    }}>
                      <span>⏱️ {recipe.prepTime} min</span>
                      <span>👥 {recipe.servings} portions</span>
                    </div>
                    <button className="btn-light anim-btn" style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: 13,
                      fontWeight: 700,
                    }}>
                      Voir la recette →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>🍽️</p>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
              Aucune recette ne correspond à votre recherche
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
