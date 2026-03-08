import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';

export default function BlogPage() {
  const { t } = useTranslation();
  const { blogs } = useData();
  const published = blogs.filter((blog) => blog.published);

  return (
    <div>
      <SEO 
        title="Blogue"
        description="Lisez nos articles sur les jus naturels, la santé, les traditions africaines et les nouvelles de Ben's."
        url="https://lesjusnatuelsbens.com/blogue"
      />
      
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Journal</p>
          <h1 className="page-hero-title">{t('blog.title')}</h1>
          <p className="page-hero-subtitle">{t('blog.subtitle')}</p>
        </div>
      </section>

      <section className="page-shell" style={{ paddingBottom: 10 }}>
        {published.length === 0 ? (
          <article className="surface-card" style={{ padding: 28, textAlign: 'center' }}>
            <p className="page-subtitle" style={{ marginTop: 0 }}>{t('blog.subtitle')}</p>
          </article>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {published.map((blog, index) => (
              <article key={blog.id} className="surface-card anim-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="pill-label">{blog.category}</span>
                  <span className="mini-muted">{blog.date}</span>
                </div>

                <h2
                  style={{
                    marginTop: 10,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(22px,3vw,30px)',
                    color: 'var(--ink-strong)',
                    lineHeight: 1.18,
                  }}
                >
                  {blog.title}
                </h2>

                <p
                  className="page-subtitle"
                  style={{
                    marginTop: 10,
                    display: '-webkit-box',
                    WebkitLineClamp: index === 0 ? 10 : 6,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {blog.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
