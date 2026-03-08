import { useData } from '@/app/providers/DataContext';

export default function IngredientsPage() {
  const { ingredients } = useData();
  const activeIngredients = ingredients.filter((ingredient) => ingredient.active);

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Bienfaits</p>
          <h1 className="page-hero-title">Nos ingredients naturels</h1>
          <p className="page-hero-subtitle">
            Decouvrez les ingredients utilises dans nos jus et les bienfaits associes.
          </p>
        </div>
      </section>

      <section className="page-shell">
        {activeIngredients.length === 0 ? (
          <article className="surface-card" style={{ padding: 24, textAlign: 'center' }}>
            <p className="page-subtitle" style={{ marginTop: 0 }}>
              Aucun ingredient actif pour le moment.
            </p>
          </article>
        ) : (
          <div className="three-col">
            {activeIngredients.map((ingredient) => (
              <article key={ingredient.id} className="surface-card anim-card" style={{ overflow: 'hidden' }}>
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  style={{ width: '100%', height: 170, objectFit: 'cover' }}
                />
                <div style={{ padding: 16 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "'Playfair Display', serif",
                      color: 'var(--ink-strong)',
                      fontSize: 24,
                    }}
                  >
                    {ingredient.name}
                  </h2>
                  {ingredient.note && (
                    <p className="page-subtitle" style={{ marginTop: 6, fontSize: 13 }}>
                      {ingredient.note}
                    </p>
                  )}
                  <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                    {ingredient.benefits.map((benefit) => (
                      <p key={benefit} style={{ margin: 0, fontSize: 13, color: 'var(--ink)' }}>
                        - {benefit}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
