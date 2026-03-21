import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { Reveal } from '@/shared/ui/Reveal';

export default function AboutPage() {
  const navigate = useNavigate();
  useTranslation();

  return (
    <div>
      <SEO
        title="Notre Histoire"
        description="Découvrez l'histoire de Ben's : une femme, un héritage africain et une passion pour les jus naturels fabriqués à Montréal."
        url="https://lesjusnatuelsbens.com/notre-histoire"
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">📖 Notre Voyage</p>
          <h1 className="page-hero-title">Notre Histoire</h1>
          <p className="page-hero-subtitle">Une passion pour les saveurs authentiques, un héritage africain et un rêve de partager la pureté avec Montréal</p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section className="page-shell" style={{ paddingTop: 60 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40,
          alignItems: 'center',
        }}>
          <Reveal anim="slideLeft">
            <div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.15), rgba(255, 138, 26, 0.1))',
                borderRadius: 'var(--radius-xl)',
                padding: 24,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 120,
                  marginBottom: 16,
                }}>
                  👩‍🌾
                </div>
                <h3 style={{
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--text-primary)',
                  margin: '0 0 8px 0',
                }}>
                  Benédicte (Ben)
                </h3>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  Fondatrice & Créatrice
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal anim="slideRight">
            <div>
              <h2 style={{
                fontSize: 32,
                fontWeight: 800,
                fontFamily: "'Playfair Display', serif",
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}>
                Un héritage, une passion
              </h2>

              <p style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                marginBottom: 16,
              }}>
                Benédicte grandit en Afrique de l'Ouest, entourée des traditions culinaires de sa famille. Depuis l'enfance, elle regardait sa grand-mère préparer des jus naturels avec les fruits les plus frais - une sagesse transmise de génération en génération.
              </p>

              <p style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                marginBottom: 16,
              }}>
                Quand elle s'installe à Montréal, elle réalise qu'une partie importante de son héritage lui manque. Elle décide alors de ramener ces saveurs authentiques à ses voisins, en créant une entreprise qui honore les traditions tout en s'inscrivant dans la modernité.
              </p>

              <p style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                marginBottom: 24,
              }}>
                Aujourd'hui, Ben's est bien plus qu'une marque de jus. C'est une celebration des saveurs, un pont entre deux cultures, et une promesse de qualité sans compromis.
              </p>

              <blockquote style={{
                padding: 24,
                background: 'var(--bg-tertiary)',
                borderLeft: '4px solid var(--brand-primary)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 16,
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                "Chaque gorgée devrait goûter comme l'amour de sa grand-mère."
              </blockquote>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section style={{
        marginTop: 80,
        padding: '60px 24px',
        background: 'linear-gradient(135deg, rgba(90, 185, 55, 0.04), rgba(255, 138, 26, 0.02))',
      }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            textAlign: 'center',
            marginBottom: 48,
            color: 'var(--text-primary)',
          }}>
            Notre Mission & Vision
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}>
            <Reveal anim="fadeUp">
              <div style={{
                background: 'white',
                padding: 32,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 48,
                  marginBottom: 16,
                }}>
                  🎯
                </div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}>
                  Notre Mission
                </h3>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}>
                  Fournir des jus naturels de qualité supérieure qui honorent les traditions africaines tout en répondant aux besoins des consommateurs modernes de Montréal.
                </p>
              </div>
            </Reveal>

            <Reveal anim="fadeUp">
              <div style={{
                background: 'white',
                padding: 32,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 48,
                  marginBottom: 16,
                }}>
                  🌍
                </div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}>
                  Notre Vision
                </h3>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}>
                  Devenir la marque incontournable des jus naturels authentiques au Canada, en établissant un pont culturel et en créant une communauté de consommateurs conscients.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="home-section">
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          fontFamily: "'Playfair Display', serif",
          textAlign: 'center',
          marginBottom: 48,
        }}>
          Nos Valeurs Fondamentales
        </h2>

        <div className="home-values-grid">
          {[
            { icon: '🌱', title: 'Authenticité', desc: 'Nos recettes sont authentiques, transmises de génération en génération' },
            { icon: '♻️', title: 'Durabilité', desc: 'Nous respectons l\'environnement dans chaque aspect de notre production' },
            { icon: '❤️', title: 'Passion', desc: 'Chaque bouteille est créée avec amour et dévouement' },
            { icon: '🤝', title: 'Communauté', desc: 'Nous croyons en la force de nos relations avec nos clients' },
          ].map((val) => (
            <div key={val.title} className="home-value-card">
              <div className="icon" style={{ fontSize: 40 }}>{val.icon}</div>
              <h3>{val.title}</h3>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{
        marginTop: 80,
        padding: '60px 24px',
        background: 'var(--bg-tertiary)',
      }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            textAlign: 'center',
            marginBottom: 48,
          }}>
            Notre Parcours
          </h2>

          <div style={{
            display: 'grid',
            gap: 24,
          }}>
            {[
              { year: '2018', title: 'La fondation', desc: 'Ben crée son premier lot de jus dans sa cuisine' },
              { year: '2019', title: 'Première vente', desc: 'Marché Jean-Talon - Premier point de vente officiel' },
              { year: '2020', title: 'Expansion', desc: 'Ouverture dans 3 nouveaux points de vente à Montréal' },
              { year: '2022', title: 'Reconnaissance', desc: 'Récompense de "Meilleur Produit Local" au Salon des Saveurs' },
              { year: '2024', title: 'Aujourd\'hui', desc: 'Plus de 2000 bouteilles vendues, une communauté de 500+ familles' },
            ].map((item, i) => (
              <Reveal key={item.year} anim="slideLeft">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  gap: 24,
                  alignItems: 'flex-start',
                  paddingBottom: i !== 4 ? 32 : 0,
                  borderBottom: i !== 4 ? '1px solid var(--border-color)' : 'none',
                }}>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: 'var(--brand-primary)',
                    fontFamily: "'Playfair Display', serif",
                  }}>
                    {item.year}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0',
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: 15,
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: 1.6,
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-section">
        <div style={{
          textAlign: 'center',
          paddingTop: 40,
          paddingBottom: 40,
        }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            marginBottom: 16,
          }}>
            Prêt à déguster l'authenticité?
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            marginBottom: 28,
            maxWidth: 500,
            margin: '0 auto 28px',
          }}>
            Rejoignez notre communauté de plus de 500 familles satisfaites
          </p>
          <button
            className="btn-solid anim-btn"
            onClick={() => navigate(ROUTES.products)}
            style={{ padding: '16px 32px', fontSize: 16, fontWeight: 700 }}
          >
            🛍️ Découvrir nos produits
          </button>
        </div>
      </section>
    </div>
  );
}
