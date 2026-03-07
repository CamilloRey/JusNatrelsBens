import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { C }           from '@/shared/constants/colors';
import { CSS }         from '@/shared/constants/styles';
import { ProductImg }  from '@/shared/ui/ProductImg';
import { ROUTES }      from '@/shared/constants/routes';
import type { Product } from '../types/product.types';

interface ProductCardProps {
  product: Product;
  size?: 'sm' | 'md';
}

export function ProductCard({ product: p, size = 'md' }: ProductCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const height = size === 'sm' ? 160 : 180;

  return (
    <div
      onClick={() => navigate(ROUTES.product(p.id))}
      className="anim-card"
      style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
    >
      <div style={{ height, background: `linear-gradient(135deg, ${p.color}22, ${p.color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <ProductImg src={p.img} size={size === 'sm' ? 100 : 110} borderRadius={0} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: size === 'sm' ? '16px 18px' : '18px 20px' }}>
        {p.tag && (
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: C.red, background: `${C.red}15`, padding: '2px 8px', borderRadius: 4 }}>
            {p.tag}
          </span>
        )}
        <h3 style={{ ...CSS.heading, fontSize: size === 'sm' ? 17 : 18, fontWeight: 700, margin: '8px 0 6px', color: C.dark }}>{p.name}</h3>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.desc}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: size === 'sm' ? 18 : 20, fontWeight: 700, color: C.hibiscus }}>{p.price.toFixed(2)}$</span>
          <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{t('products.viewDetails')}</span>
        </div>
      </div>
    </div>
  );
}
