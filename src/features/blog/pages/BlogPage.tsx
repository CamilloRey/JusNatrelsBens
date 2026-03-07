import { useData } from '@/app/providers/DataContext';
import { C }       from '@/shared/constants/colors';
import { CSS }     from '@/shared/constants/styles';

export default function BlogPage() {
  const { blogs } = useData();
  const published = blogs.filter(b => b.published);

  return (
    <div style={{ padding: '48px 24px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ ...CSS.heading, fontSize: 36, fontWeight: 900, color: C.dark, margin: '0 0 8px' }}>Blogue</h1>
      <p style={{ color: C.muted, fontSize: 15, marginBottom: 40 }}>Recettes, conseils santé et nouvelles de l'univers Ben's.</p>
      {published.map(b => (
        <article key={b.id} style={{ background: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: `${C.red}12`, color: C.red, fontWeight: 600 }}>{b.category}</span>
            <span style={{ fontSize: 12, color: C.muted }}>{b.date}</span>
          </div>
          <h2 style={{ ...CSS.heading, fontSize: 22, fontWeight: 700, margin: '0 0 12px', color: C.dark }}>{b.title}</h2>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, margin: 0 }}>{b.content}</p>
        </article>
      ))}
      {published.length === 0 && <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Aucun article publié pour l'instant.</p>}
    </div>
  );
}
