import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';

export default function BlogPage() {
  const { t } = useTranslation();
  const { blogs } = useData();
  const published = blogs.filter((blog) => blog.published);
  const featured = published[0];
  const others = published.slice(1);

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

      <section className="blog-page-shell">
        {published.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{t('blog.subtitle')}</p>
          </div>
        ) : (
          <>
            {featured && (
              <div className="blog-featured">
                <div className="blog-featured-post">
                  <div className="blog-featured-image">
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.05))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 48,
                    }}>
                      📰
                    </div>
                  </div>
                  <div className="blog-featured-content">
                    <span className="blog-card-category">{featured.category}</span>
                    <h2>{featured.title}</h2>
                    <div className="blog-featured-meta">
                      <span>{featured.date}</span>
                      <span>•</span>
                      <span>{featured.content.split(' ').length} mots</span>
                    </div>
                    <p className="blog-featured-excerpt">{featured.content.substring(0, 300)}...</p>
                    <a href={ROUTES.blog} className="blog-featured-cta">
                      Lire plus →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {others.length > 0 && (
              <div>
                <h2 style={{
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 32,
                  color: 'var(--text-primary)',
                }}>
                  Articles récents
                </h2>
                <div className="blog-grid">
                  {others.map((blog) => (
                    <article key={blog.id} className="blog-card">
                      <div className="blog-card-image">
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.05))`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 40,
                        }}>
                          📝
                        </div>
                      </div>
                      <div className="blog-card-content">
                        <div className="blog-card-meta">
                          <span className="blog-card-category">{blog.category}</span>
                          <span>{blog.date}</span>
                        </div>
                        <h3 className="blog-card-title">{blog.title}</h3>
                        <p className="blog-card-excerpt">{blog.content.substring(0, 150)}...</p>
                        <a href={ROUTES.blog} className="blog-card-link">
                          Lire plus →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
