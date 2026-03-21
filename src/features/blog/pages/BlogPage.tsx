import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { C } from '@/shared/constants/colors';

const CONTENT_FILTERS = [
  { key: 'all', label: 'Tout' },
  { key: 'article', label: 'Articles' },
  { key: 'recette', label: 'Recettes' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Sante': C.green,
  'Nutrition': '#2563eb',
  'Traditions': C.hibiscus,
  'Nouveautes': C.gold,
  'Smoothie': '#059669',
  'Jus': '#0891b2',
  'Cocktail': '#d97706',
  'Dessert': '#be185d',
  'Recette': '#7c3aed',
};

export default function BlogPage() {
  const { t } = useTranslation();
  const { blogs, recipes } = useData();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Combine blogs and recipes into unified list
  const allContent = useMemo(() => {
    const blogItems = blogs
      .filter(b => b.published)
      .map(b => ({
        ...b,
        contentType: (b.contentType || 'article') as 'article' | 'recette',
        tags: b.tags || [b.category],
      }));

    const recipeItems = recipes
      .filter(r => r.published)
      .map(r => ({
        id: r.id,
        title: r.name,
        category: r.category,
        content: `${r.description}\n\nIngredients: ${r.ingredients.join(', ')}\n\nInstructions:\n${r.instructions.join('\n')}`,
        published: true,
        date: new Date().toISOString().split('T')[0],
        img: undefined as string | undefined,
        contentType: 'recette' as const,
        tags: r.tags || [r.category, r.difficulty],
        prepTime: r.prepTime,
        servings: r.servings,
        difficulty: r.difficulty,
        emoji: r.image,
      }));

    return [...blogItems, ...recipeItems];
  }, [blogs, recipes]);

  const filtered = useMemo(() => {
    return allContent.filter(item => {
      const typeMatch = filter === 'all' || item.contentType === filter;
      const searchMatch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [allContent, filter, search]);

  const featured = filtered[0];
  const others = filtered.slice(1);

  return (
    <div>
      <SEO
        title="Blogue & Recettes"
        description="Articles, recettes et inspirations avec nos jus naturels Ben's."
        url="https://lesjusnatuelsbens.com/blogue"
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Journal & Cuisine</p>
          <h1 className="page-hero-title">{t('blog.title', 'Blogue & Recettes')}</h1>
          <p className="page-hero-subtitle">{t('blog.subtitle', 'Articles, recettes et inspirations')}</p>
        </div>
      </section>

      <section className="blog-page-shell">
        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          {/* Content type filters */}
          <div style={{ display: 'flex', gap: 6 }}>
            {CONTENT_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: `2px solid ${filter === f.key ? C.hibiscus : C.border}`,
                  background: filter === f.key ? C.hibiscus : '#fff',
                  color: filter === f.key ? '#fff' : C.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f.key === 'recette' ? '🍹 ' : f.key === 'article' ? '📝 ' : ''}{f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                fontSize: 13,
                outline: 'none',
                background: '#fff',
              }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📚</span>
            <p style={{ fontSize: 16, color: C.muted }}>Aucun contenu ne correspond a votre recherche</p>
          </div>
        ) : (
          <>
            {/* FEATURED */}
            {featured && (
              <div
                onClick={() => {
                  if (featured.contentType === 'article') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    navigate(`/blog/${featured.id}`);
                  }
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 0,
                  background: '#fff',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: `1px solid ${C.border}`,
                  marginBottom: 40,
                  cursor: featured.contentType === 'article' ? 'pointer' : 'default',
                  transition: 'box-shadow 0.2s',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
              >
                <div style={{
                  minHeight: 280,
                  background: featured.img
                    ? `url(${featured.img}) center/cover`
                    : `linear-gradient(135deg, ${C.hibiscus}15, ${C.gold}15)`,
                  display: featured.img ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 64,
                }}>
                  {!featured.img && ((featured as any).emoji || (featured.contentType === 'recette' ? '🍹' : '📰'))}
                  {featured.img && <img src={featured.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                      background: featured.contentType === 'recette' ? `${C.green}15` : `${C.hibiscus}15`,
                      color: featured.contentType === 'recette' ? C.green : C.hibiscus,
                      textTransform: 'uppercase',
                    }}>
                      {featured.contentType === 'recette' ? 'Recette' : 'Article'}
                    </span>
                    {(featured.tags || []).slice(0, 2).map(tag => (
                      <span key={tag} style={{
                        padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600,
                        background: `${CATEGORY_COLORS[tag] || C.muted}15`,
                        color: CATEGORY_COLORS[tag] || C.muted,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: '0 0 12px', color: C.dark, lineHeight: 1.3 }}>
                    {featured.title}
                  </h2>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: '0 0 16px' }}>
                    {featured.content.substring(0, 200)}...
                  </p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: C.muted }}>
                    <span>{featured.date}</span>
                    {(featured as any).prepTime && <span>⏱️ {(featured as any).prepTime} min</span>}
                    {(featured as any).servings && <span>👥 {(featured as any).servings} portions</span>}
                  </div>
                </div>
              </div>
            )}

            {/* GRID */}
            {others.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
              }}>
                {others.map(item => (
                  <article
                    key={`${item.contentType}-${item.id}`}
                    onClick={() => {
                      if (item.contentType === 'article') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate(`/blog/${item.id}`);
                      }
                    }}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: `1px solid ${C.border}`,
                      cursor: item.contentType === 'article' ? 'pointer' : 'default',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
                  >
                    <div style={{
                      height: 180,
                      background: item.img
                        ? `url(${item.img}) center/cover`
                        : `linear-gradient(135deg, ${C.hibiscus}12, ${C.gold}12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 56,
                      position: 'relative',
                    }}>
                      {!item.img && ((item as any).emoji || (item.contentType === 'recette' ? '🍹' : '📝'))}

                      {/* Type badge overlay */}
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        padding: '4px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                        background: item.contentType === 'recette' ? C.green : C.hibiscus,
                        color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {item.contentType === 'recette' ? 'Recette' : 'Article'}
                      </span>
                    </div>

                    <div style={{ padding: '18px 20px' }}>
                      {/* Tags */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        {(item.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} style={{
                            padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600,
                            background: `${CATEGORY_COLORS[tag] || C.muted}12`,
                            color: CATEGORY_COLORS[tag] || C.muted,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 17, fontWeight: 700, color: C.dark,
                        margin: '0 0 8px', lineHeight: 1.3,
                      }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 12px' }}>
                        {item.content.substring(0, 120)}...
                      </p>

                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 11, color: C.muted }}>
                        <span>{item.date}</span>
                        {(item as any).prepTime && <span>⏱️ {(item as any).prepTime} min</span>}
                        {(item as any).difficulty && (
                          <span style={{
                            padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                            background: (item as any).difficulty === 'Facile' ? '#dcfce7' : (item as any).difficulty === 'Moyen' ? '#fef3c7' : '#fee2e2',
                            color: (item as any).difficulty === 'Facile' ? '#166534' : (item as any).difficulty === 'Moyen' ? '#92400e' : '#991b1b',
                          }}>
                            {(item as any).difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
