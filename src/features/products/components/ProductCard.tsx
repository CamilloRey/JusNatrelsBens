import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductImg } from '@/shared/ui/ProductImg';
import { ROUTES } from '@/shared/constants/routes';
import type { Product } from '../types/product.types';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md';
}

export function ProductCard({ product: p, size = 'md' }: ProductCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <article
      onClick={() => navigate(ROUTES.product(p.id))}
      className="home-product-card anim-card"
      style={{ borderRadius: size === 'sm' ? 18 : 20 }}
    >
      <div className="cover" style={{ background: `linear-gradient(135deg, ${p.color}2b, ${p.color}14)` }}>
        <ProductImg
          src={p.img}
          alt={p.name}
          size={size === 'sm' ? 180 : 210}
          borderRadius={18}
          style={{ width: 'min(92%, 220px)', height: 'min(92%, 220px)' }}
        />
      </div>

      <div className="body" style={{ padding: size === 'sm' ? '14px 14px 15px' : '15px 16px 16px' }}>
        {p.tag && <span className="tag">{p.tag}</span>}
        <h3 style={{ fontSize: size === 'sm' ? 17 : 18 }}>{p.name}</h3>
        <p>{p.desc}</p>
        <div className="meta">
          <span className="price" style={{ fontSize: size === 'sm' ? 20 : 22 }}>
            {p.price.toFixed(2)}$
          </span>
          <span className="view">{t('products.viewDetails')}</span>
        </div>
      </div>
    </article>
  );
}
