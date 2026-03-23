import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { ROUTES } from '@/shared/constants/routes';

/* ── Design tokens ─────────────────────────────────────────── */
const CLR = {
  primary:              '#032416',
  primaryContainer:     '#1a3a2a',
  secondary:            '#7b5804',
  secondaryContainer:   '#fdcd74',
  surface:              '#fef9ef',
  surfaceContainer:     '#f2ede3',
  surfaceContainerLow:  '#f8f3e9',
  onSurface:            '#1d1c16',
  onSurfaceVariant:     '#424843',
  tertiaryContainer:    '#5a2400',
  onTertiaryContainer:  '#f37b32',
};

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1440;

const POSTS_PER_PAGE = 6;

/* ── Category list derived at render time ──────────────────── */
function buildCategories(posts: { category: string }[]) {
  const map: Record<string, number> = {};
  for (const p of posts) {
    map[p.category] = (map[p.category] ?? 0) + 1;
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}

/* ── Article card ──────────────────────────────────────────── */
interface CardPost {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  img?: string;
}

function ArticleCard({
  post,
  onClick,
}: {
  post: CardPost;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const excerpt = post.content.length > 130
    ? post.content.slice(0, 130) + '\u2026'
    : post.content;

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '4/5',
        borderRadius: '40% 10% 40% 10%',
        background: CLR.surfaceContainerLow,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {post.img ? (
          <img
            src={post.img}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.10)' : 'scale(1)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${CLR.secondaryContainer}40, ${CLR.surfaceContainerLow})`,
            }}
          />
        )}
        {/* Overlay gradient for text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(3,36,22,0.82) 0%, rgba(3,36,22,0.18) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Category badge */}
      <div style={{ position: 'relative', padding: '18px 18px 0' }}>
        <span
          style={{
            display: 'inline-block',
            background: CLR.tertiaryContainer,
            color: CLR.onTertiaryContainer,
            padding: '4px 16px',
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: FONT_BODY,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {post.category}
        </span>
      </div>

      {/* Bottom content */}
      <div style={{ position: 'relative', marginTop: 'auto', padding: '0 18px 22px' }}>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 11,
            color: 'rgba(254,249,239,0.7)',
            marginBottom: 6,
          }}
        >
          {post.date}
        </p>

        <h3
          style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 20,
            fontWeight: 700,
            color: '#fef9ef',
            lineHeight: 1.3,
            margin: '0 0 8px',
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 12,
            color: 'rgba(254,249,239,0.75)',
            lineHeight: 1.55,
            margin: '0 0 12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>

        <span
          style={{
            fontFamily: FONT_BODY,
            fontSize: 12,
            fontWeight: 600,
            color: CLR.secondaryContainer,
            borderBottom: `1px solid ${CLR.secondaryContainer}`,
            paddingBottom: 1,
          }}
        >
          {'Lire la suite \u2192'}
        </span>
      </div>
    </article>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function BlogPage() {
  const { blogs } = useData();
  const navigate  = useNavigate();

  const [page,              setPage]              = useState(1);
  const [activeCategory,    setActiveCategory]    = useState<string | null>(null);
  const [email,             setEmail]             = useState('');
  const [subscribed,        setSubscribed]        = useState(false);

  const publishedPosts = useMemo(
    () => blogs.filter(b => b.published),
    [blogs],
  );

  const categories = useMemo(
    () => buildCategories(publishedPosts),
    [publishedPosts],
  );

  const filtered = useMemo(() => {
    if (!activeCategory) return publishedPosts;
    return publishedPosts.filter(b => b.category === activeCategory);
  }, [publishedPosts, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const pagePosts = useMemo(
    () => filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE),
    [filtered, currentPage],
  );

  const featuredPost = publishedPosts.length > 0 ? publishedPosts[0] : null;

  function goToPost(id: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/blog/' + id);
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  }

  return (
    <div style={{ fontFamily: FONT_BODY, background: CLR.surface, minHeight: '100vh' }}>
      <SEO
        title="Notre Journal"
        description={"Découvrez les secrets de la nature à travers nos articles botaniques, recettes et inspirations vertes."}
        url="https://lesjusnatuelsbens.com/blog"
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 80,
          paddingBottom: 72,
          textAlign: 'center',
          background: CLR.surface,
        }}
      >
        <div
          style={{
            maxWidth: 768,
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: CLR.secondaryContainer,
              color: CLR.secondary,
              padding: '6px 20px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: FONT_BODY,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 20,
            }}
          >
            {'Édition Botanique'}
          </span>

          <h1
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: CLR.primaryContainer,
              lineHeight: 1.1,
              margin: '0 0 24px',
            }}
          >
            {'Notre Journal'}
          </h1>

          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 17,
              fontStyle: 'italic',
              color: CLR.onSurfaceVariant,
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            {'Découvrez les secrets de la nature \u2014 plantes, recettes et traditions botaniques partagés avec passion.'}
          </p>
        </div>
      </section>

      {/* ── MAIN LAYOUT ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: '0 32px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Blog grid ──────────────────────────────── */}
        <div style={{ gridColumn: 'span 8' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                color: CLR.onSurfaceVariant,
                fontFamily: FONT_BODY,
                fontSize: 15,
              }}
            >
              {'Aucun article dans cette catégorie pour le moment.'}
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 28,
                }}
              >
                {pagePosts.map(post => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    onClick={() => goToPost(post.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  marginTop: 48,
                }}
              >
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `1px solid ${CLR.onSurfaceVariant}40`,
                    background: currentPage <= 1 ? CLR.surfaceContainerLow : CLR.surfaceContainer,
                    color: currentPage <= 1 ? CLR.onSurfaceVariant + '60' : CLR.onSurface,
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontFamily: FONT_BODY,
                  }}
                  aria-label="Page précédente"
                >
                  {'\u2039'}
                </button>

                <span
                  style={{
                    fontFamily: FONT_HEADLINE,
                    fontSize: 16,
                    color: CLR.primaryContainer,
                    fontWeight: 700,
                    minWidth: 64,
                    textAlign: 'center',
                  }}
                >
                  {currentPage} {'/'} {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `1px solid ${CLR.onSurfaceVariant}40`,
                    background: currentPage >= totalPages ? CLR.surfaceContainerLow : CLR.surfaceContainer,
                    color: currentPage >= totalPages ? CLR.onSurfaceVariant + '60' : CLR.onSurface,
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontFamily: FONT_BODY,
                  }}
                  aria-label="Page suivante"
                >
                  {'\u203a'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
        <div
          style={{
            gridColumn: 'span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Categories card */}
          <div
            style={{
              background: CLR.surfaceContainerLow,
              borderRadius: 12,
              padding: '40px',
            }}
          >
            <h2
              style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 20,
                fontWeight: 700,
                color: CLR.primaryContainer,
                margin: '0 0 20px',
              }}
            >
              {'Catégories'}
            </h2>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {/* "All" entry */}
              <li>
                <button
                  onClick={() => { setActiveCategory(null); setPage(1); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: activeCategory === null ? CLR.secondary : CLR.onSurface,
                    fontWeight: activeCategory === null ? 700 : 400,
                  }}
                >
                  <span>{'Tous les articles'}</span>
                  <span
                    style={{
                      background: activeCategory === null ? CLR.secondary : CLR.surfaceContainer,
                      color: activeCategory === null ? '#fff' : CLR.onSurfaceVariant,
                      borderRadius: 9999,
                      padding: '2px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {publishedPosts.length}
                  </span>
                </button>
                <div style={{ height: 1, background: CLR.onSurfaceVariant + '18' }} />
              </li>

              {categories.map(cat => (
                <li key={cat.name}>
                  <button
                    onClick={() => { setActiveCategory(cat.name); setPage(1); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '10px 0',
                      cursor: 'pointer',
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      color: activeCategory === cat.name ? CLR.secondary : CLR.onSurface,
                      fontWeight: activeCategory === cat.name ? 700 : 400,
                    }}
                  >
                    <span>{cat.name}</span>
                    <span
                      style={{
                        background: activeCategory === cat.name ? CLR.secondary : CLR.surfaceContainer,
                        color: activeCategory === cat.name ? '#fff' : CLR.onSurfaceVariant,
                        borderRadius: 9999,
                        padding: '2px 10px',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                  <div style={{ height: 1, background: CLR.onSurfaceVariant + '18' }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Featured recipe card */}
          {featuredPost && (
            <div
              style={{
                background: CLR.primaryContainer,
                borderRadius: 12,
                padding: '32px',
                color: '#fff',
              }}
            >
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: CLR.secondaryContainer,
                  fontWeight: 700,
                  margin: '0 0 10px',
                }}
              >
                {'Article vedette'}
              </p>

              <h3
                style={{
                  fontFamily: FONT_HEADLINE,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fef9ef',
                  lineHeight: 1.35,
                  margin: '0 0 12px',
                }}
              >
                {featuredPost.title}
              </h3>

              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  color: 'rgba(254,249,239,0.72)',
                  lineHeight: 1.6,
                  margin: '0 0 20px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {featuredPost.content}
              </p>

              <button
                onClick={() => goToPost(featuredPost.id)}
                style={{
                  background: CLR.secondaryContainer,
                  color: CLR.secondary,
                  border: 'none',
                  borderRadius: 9999,
                  padding: '10px 22px',
                  fontFamily: FONT_BODY,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {'Lire l\u2019article'}
              </button>
            </div>
          )}

          {/* Newsletter mini widget */}
          <div
            style={{
              background: CLR.surfaceContainer,
              borderRadius: 12,
              padding: '32px',
            }}
          >
            <h3
              style={{
                fontFamily: FONT_HEADLINE,
                fontSize: 18,
                fontWeight: 700,
                color: CLR.primaryContainer,
                margin: '0 0 8px',
              }}
            >
              {'Notre lettre botanique'}
            </h3>

            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 13,
                color: CLR.onSurfaceVariant,
                lineHeight: 1.6,
                margin: '0 0 18px',
              }}
            >
              {'Recevez nos nouveaux articles et recettes directement dans votre boîte mail.'}
            </p>

            {subscribed ? (
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  color: CLR.secondary,
                  fontWeight: 600,
                }}
              >
                {'\u2713 Merci pour votre inscription\u00a0!'}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="email"
                  placeholder={'Votre adresse courriel'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${CLR.onSurfaceVariant}30`,
                    background: CLR.surface,
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    color: CLR.onSurface,
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: CLR.primaryContainer,
                    color: '#fef9ef',
                    border: 'none',
                    borderRadius: 8,
                    padding: '11px 0',
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {'S\u2019abonner'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
