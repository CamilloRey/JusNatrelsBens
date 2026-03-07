import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation }          from 'react-i18next';
import { useData }                from '@/app/providers/DataContext';
import { C }                      from '@/shared/constants/colors';
import { CSS }                    from '@/shared/constants/styles';
import { ProductImg }             from '@/shared/ui/ProductImg';
import { Icon }                   from '@/shared/ui/Icon';
import { ProductCard }            from '../components/ProductCard';
import { ROUTES }                 from '@/shared/constants/routes';

const INGREDIENTS: Record<string, { emoji: string; benefits: string[] }> = {
  Hibiscus: { emoji: '🌺', benefits: ['Riche en antioxydants', 'Aide à réguler la pression artérielle', 'Renforce le système immunitaire', 'Source de vitamine C'] },
  Gingembre:{ emoji: '🫚', benefits: ['Propriétés anti-inflammatoires', 'Aide à la digestion', "Renforce l'immunité", 'Favorise la perte de poids'] },
  Citron:   { emoji: '🍋', benefits: ['Riche en vitamine C', 'Détoxifiant naturel', 'Aide à la digestion', 'Effet alcalinisant'] },
  Ananas:   { emoji: '🍍', benefits: ['Riche en bromélaïne', 'Anti-inflammatoire naturel', 'Source de manganèse', 'Aide à la digestion'] },
  Fraises:  { emoji: '🍓', benefits: ['Riches en antioxydants', 'Source de vitamine C', 'Faible en calories', 'Bonnes pour le cœur'] },
  Bleuets:  { emoji: '🫐', benefits: ['Super-aliment antioxydant', 'Améliore la mémoire', 'Riche en fibres', 'Protège la vision'] },
  Passion:  { emoji: '🥭', benefits: ['Riche en vitamines A et C', 'Source de fibres', 'Propriétés relaxantes', 'Bon pour la peau'] },
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, reviews } = useData();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const p = products.find(pr => pr.id === id);
  if (!p) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <p>{t('productDetail.notFound')}</p>
      <button onClick={() => navigate(ROUTES.products)} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>{t('productDetail.backLink')}</button>
    </div>
  );

  const foundIngredients = Object.entries(INGREDIENTS)
    .filter(([name]) => p.name.toLowerCase().includes(name.toLowerCase()))
    .map(([name, data]) => ({ name, ...data }));
  const prodIngredients = foundIngredients.length > 0
    ? foundIngredients
    : [{ name: 'Fruits frais', emoji: '🍹', benefits: ['100% naturel', 'Sans conservateurs', 'Sans sucre ajouté'] }];

  const approvedReviews = reviews.filter(r => r.approved);
  const otherProducts = products.filter(pr => pr.id !== p.id && pr.available).slice(0, 3);

  return (
    <div style={{ padding: '32px 24px 64px', maxWidth: 1000, margin: '0 auto' }}>
      <button onClick={() => navigate(ROUTES.products)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: C.red, cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 24 }}>
        <Icon type="back" size={18} color={C.red} /> {t('productDetail.back')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', background: `linear-gradient(135deg, ${p.color}15, ${p.color}35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360, position: 'relative' }}>
          {p.tag && <span style={{ position: 'absolute', top: 16, left: 16, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#fff', background: C.red, padding: '5px 14px', borderRadius: 20 }}>{p.tag}</span>}
          <ProductImg src={p.img} size={200} borderRadius={0} style={{ maxWidth: '100%', maxHeight: 340, objectFit: 'cover' }} />
        </div>

        <div>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>{p.category}</p>
          <h1 style={{ ...CSS.heading, fontSize: 32, fontWeight: 900, color: C.dark, margin: '0 0 16px', lineHeight: 1.2 }}>{p.name}</h1>
          <p style={{ fontSize: 36, fontWeight: 900, color: C.hibiscus, margin: '0 0 8px' }}>{p.price.toFixed(2)}$</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px' }}>{t('productDetail.availableFormats')} {p.formats.join(' · ')}</p>
          <p style={{ fontSize: 16, color: C.text, lineHeight: 1.8, margin: '0 0 24px' }}>{p.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {([
              t('productDetail.badges.noPreservatives'),
              t('productDetail.badges.noSugar'),
              t('productDetail.badges.quebec'),
            ] as string[]).map((b, i) => (
              <span key={i} style={{ padding: '6px 14px', background: C.light, borderRadius: 20, fontSize: 13, color: C.dark }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ingrédients */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, marginBottom: 20 }}>{t('productDetail.ingredients')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {prodIngredients.map(ing => (
            <div key={ing.name} style={{ background: '#fff', borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 28 }}>{ing.emoji}</span>
                <h3 style={{ ...CSS.heading, fontSize: 16, fontWeight: 700, color: C.dark, margin: 0 }}>{ing.name}</h3>
              </div>
              {ing.benefits.map((b, i) => (
                <p key={i} style={{ fontSize: 13, color: C.text, margin: '0 0 6px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: C.green, flexShrink: 0 }}>✓</span> {b}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Avis */}
      {approvedReviews.length > 0 && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, marginBottom: 20 }}>{t('home.reviews.title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {approvedReviews.slice(0, 3).map(r => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ color: '#f59e0b', fontSize: 14, marginBottom: 10 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: '0 0 12px', fontStyle: 'italic' }}>"{r.text}"</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: 0 }}>{r.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Autres produits */}
      {otherProducts.length > 0 && (
        <section>
          <h2 style={{ ...CSS.heading, fontSize: 24, fontWeight: 800, color: C.dark, marginBottom: 20 }}>{t('productDetail.youMightLike')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {otherProducts.map(op => <ProductCard key={op.id} product={op} size="sm" />)}
          </div>
        </section>
      )}
    </div>
  );
}
