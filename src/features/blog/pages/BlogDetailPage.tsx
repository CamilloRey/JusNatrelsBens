import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  useTranslation();
  const { blogs } = useData();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <section className="page-shell" style={{ textAlign: 'center', paddingBottom: 20 }}>
        <p className="page-subtitle" style={{ marginTop: 0 }}>Article non trouvé</p>
        <button type="button" className="btn-light anim-btn" onClick={() => navigate(ROUTES.blog)}>
          ← Retour au blogue
        </button>
      </section>
    );
  }

  return (
    <div>
      <SEO
        title={blog.title}
        description={blog.content.substring(0, 160)}
        url={`https://lesjusnatuelsbens.com/blogue/${id}`}
      />

      <section className="page-shell" style={{ paddingTop: 20 }}>
        <button
          type="button"
          onClick={() => navigate(ROUTES.blog)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: 'none',
            background: 'transparent',
            color: 'var(--brand-primary)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'gap 0.24s ease',
            padding: '8px 0',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.gap = '12px';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.gap = '8px';
          }}
        >
          ← Retour au blogue
        </button>

        {/* ARTICLE HERO */}
        <div style={{
          marginTop: 32,
          paddingBottom: 40,
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: 'var(--brand-primary)',
              color: 'white',
              borderRadius: '999px',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              {blog.category}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 16px 0',
            lineHeight: 1.2,
          }}>
            {blog.title}
          </h1>

          <div style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            fontSize: 14,
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}>
            <span>📅 {blog.date}</span>
            <span>•</span>
            <span>📖 {Math.ceil(blog.content.split(' ').length / 200)} min de lecture</span>
          </div>
        </div>

        {/* ARTICLE CONTENT */}
        <div style={{
          marginTop: 48,
          maxWidth: 800,
        }}>
          {/* HERO IMAGE */}
          <div style={{
            height: 400,
            background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 120,
            marginBottom: 48,
          }}>
            📰
          </div>

          {/* CONTENU PRINCIPAL */}
          <div style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
          }}>
            {blog.content.split('\n').map((paragraph, i) => (
              <p key={i} style={{
                marginBottom: 20,
                fontSize: 16,
              }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* BIENFAITS / KEY POINTS */}
          <div style={{
            marginTop: 60,
            padding: 32,
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text-primary)',
              marginBottom: 24,
              margin: '0 0 24px 0',
            }}>
              ✨ Points clés à retenir
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: 16,
            }}>
              {[
                '🌱 Les jus naturels sans sucre ajouté sont meilleurs pour votre santé',
                '💪 Riche en vitamines et minéraux essentiels',
                '♻️ Respectueux de l\'environnement et de votre bien-être',
                '😋 Un goût authentique inspiré des traditions africaines',
              ].map((point, i) => (
                <li key={i} style={{
                  fontSize: 15,
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 48,
            padding: 32,
            background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.08), rgba(255, 138, 26, 0.06))',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 12,
              margin: '0 0 12px 0',
            }}>
              Prêt à déguster?
            </h3>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              marginBottom: 20,
              margin: '0 0 20px 0',
            }}>
              Découvrez nos jus naturels inspirés par cet article
            </p>
            <button
              className="btn-solid anim-btn"
              onClick={() => navigate(ROUTES.products)}
              style={{
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              🛍️ Découvrir nos produits
            </button>
          </div>
        </div>

        {/* RELATED ARTICLES */}
        <div style={{
          marginTop: 80,
          paddingTop: 60,
          borderTop: '1px solid var(--border-color)',
        }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text-primary)',
            marginBottom: 32,
            textAlign: 'center',
          }}>
            Articles similaires
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {blogs
              .filter((b) => b.published && b.id !== id)
              .slice(0, 3)
              .map((relatedBlog) => (
                <div
                  key={relatedBlog.id}
                  className="anim-card"
                  onClick={() => {
                    navigate(`/blog/${relatedBlog.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const elem = e.currentTarget as HTMLElement;
                    elem.style.transform = 'translateY(-6px)';
                    elem.style.boxShadow = 'var(--shadow-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    const elem = e.currentTarget as HTMLElement;
                    elem.style.transform = 'translateY(0)';
                    elem.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{
                    height: 150,
                    background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.1), rgba(255, 138, 26, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 50,
                  }}>
                    📝
                  </div>
                  <div style={{ padding: 20 }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      borderRadius: '999px',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 10,
                    }}>
                      {relatedBlog.category}
                    </span>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0',
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      {relatedBlog.title}
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      margin: '0 0 12px 0',
                      lineHeight: 1.5,
                    }}>
                      {relatedBlog.content.substring(0, 100)}...
                    </p>
                    <div style={{
                      fontSize: 12,
                      color: 'var(--text-tertiary)',
                    }}>
                      {relatedBlog.date}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
