import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS }      from '@/shared/constants/styles';
import { ProductCard } from '../components/ProductCard';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { products } = useData();
  const filterAll = t('products.filterAll');
  const [filter, setFilter] = useState(filterAll);
  const available = products.filter(p => p.available);
  const cats = [filterAll, ...Array.from(new Set(available.map(p => p.category)))];
  const filtered = filter === filterAll ? available : available.filter(p => p.category === filter);

  return (
    <div style={{ padding: '48px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: '0 0 8px' }}>{t('products.title')}</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 32 }}>{t('products.subtitle')}</p>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding: '8px 20px', borderRadius: 50, border: filter === c ? `2px solid ${C.red}` : `1px solid ${C.border}`, background: filter === c ? `${C.red}12` : '#fff', color: filter === c ? C.red : C.muted, cursor: 'pointer', fontSize: 13, fontWeight: filter === c ? 600 : 400 }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
