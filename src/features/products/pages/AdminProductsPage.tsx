import { useState } from 'react';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { Icon }     from '@/shared/ui/Icon';
import { ProductImg } from '@/shared/ui/ProductImg';
import { AdminProductForm } from '../components/AdminProductForm';
import type { Product, ProductFormState } from '../types/product.types';

export default function AdminProductsPage() {
  const { products, updateProducts, logActivity } = useData();
  const [editing, setEditing] = useState<string | null>(null);

  const current = products.find(p => p.id === editing) ?? null;

  const handleSave = (formData: ProductFormState) => {
    const data: Omit<Product, 'id'> = {
      ...formData,
      price:   parseFloat(formData.price) || 0,
      formats: formData.formats.split(',').map(f => f.trim()).filter(Boolean),
      color:   '#c44536',
    };
    if (editing === 'new') {
      const newProduct = { ...data, id: 'p' + Date.now() };
      updateProducts([...products, newProduct]);
      logActivity('Produit ajouté', `${data.name} ajouté au catalogue`, 'product');
    } else {
      updateProducts(products.map(p => p.id === editing ? { ...p, ...data } : p));
      logActivity('Produit modifié', `${data.name} mis à jour`, 'product');
    }
    setEditing(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    updateProducts(products.filter(p => p.id !== id));
    logActivity('Produit supprimé', `${name} retiré du catalogue`, 'product');
  };

  if (editing) return (
    <AdminProductForm
      initial={current}
      onSave={handleSave}
      onClose={() => setEditing(null)}
    />
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{products.length} produits au total</p>
        <button onClick={() => setEditing('new')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <Icon type="plus" size={16} color="#fff" /> Nouveau produit
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <ProductImg src={p.img} size={44} borderRadius={8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.dark }}>{p.name}</span>
                {p.tag && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: `${C.red}15`, color: C.red, fontWeight: 600 }}>{p.tag}</span>}
                {!p.available && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#fee2e2', color: '#dc2626' }}>Indisponible</span>}
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{p.category} · {p.formats.join(', ')} · {p.price.toFixed(2)}$</p>
            </div>
            <button onClick={() => setEditing(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="edit" size={16} color={C.muted} /></button>
            <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}><Icon type="trash" size={16} color="#dc2626" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
