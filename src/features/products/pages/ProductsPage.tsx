import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ProductCard } from '../components/ProductCard';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { products } = useData();

  const filterAll = t('products.filterAll');
  const [filter, setFilter] = useState(filterAll);

  const available = useMemo(() => products.filter((p) => p.available), [products]);
  const categories = useMemo(
    () => [filterAll, ...Array.from(new Set(available.map((p) => p.category)))],
    [available, filterAll]
  );

  const filtered =
    filter === filterAll ? available : available.filter((p) => p.category === filter);

  return (
    <div>
      <SEO 
        title="Nos Produits"
        description="Découvrez notre gamme complète de jus naturels artisanaux sans sucre ajouté. Inspirés des traditions africaines et fabriqués à Montréal."
        url="https://lesjusnatuelsbens.com/nos-produits"
      />
      
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Catalogue</p>
          <h1 className="page-hero-title">{t('products.title')}</h1>
          <p className="page-hero-subtitle">{t('products.subtitle')}</p>
        </div>
      </section>

      <section className="page-shell">
        <div className="chip-row" style={{ marginTop: 0 }}>
          {categories.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`chip-btn ${active ? 'chip-btn-active' : ''}`.trim()}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="home-products-grid" style={{ marginTop: 22 }}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
