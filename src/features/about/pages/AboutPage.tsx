import { useNavigate } from 'react-router-dom';
import { C }           from '@/shared/constants/colors';
import { ROUTES }      from '@/shared/constants/routes';
import { Reveal }      from '@/shared/ui/Reveal';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${C.hibiscus} 0%, ${C.red} 50%, ${C.gold} 100%)`, padding: '72px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(255,255,255,0.02) 25px, rgba(255,255,255,0.02) 50px)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Notre histoire</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0 0 16px' }}>
            De l'Afrique au Québec,<br />une passion pour les saveurs naturelles
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
            L'histoire d'une femme, d'un héritage culinaire et d'une mission : offrir des jus authentiques qui font du bien.
          </p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }}>
          <Reveal anim="slideLeft">
            <div>
              <div style={{ width: 250, height: 300, borderRadius: 20, background: `linear-gradient(135deg, ${C.gold}22, ${C.red}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 100 }}>👩🏾‍🍳</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>La fondatrice</h3>
              <p style={{ fontSize: 14, color: C.red, fontWeight: 600, margin: '0 0 8px' }}>Les Jus Naturels Ben's</p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Entrepreneure passionnée, elle a transformé les recettes de sa famille en une marque québécoise primée.</p>
            </div>
          </Reveal>
          <Reveal anim="slideRight">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.dark, margin: '0 0 20px' }}>Un héritage familial devenu entreprise</h2>
              <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
                Tout a commencé dans une cuisine familiale au Cameroun, où les recettes de jus d'hibiscus et de gingembre se transmettaient de génération en génération. Ces boissons, bien plus que de simples breuvages, portent en elles des siècles de savoir-faire et de traditions africaines.
              </p>
              <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
                En arrivant au Québec, la fondatrice a constaté que ces saveurs authentiques manquaient cruellement sur le marché. Avec passion et détermination, elle a décidé de recréer ces recettes ancestrales en les adaptant aux fruits locaux québécois, créant ainsi un pont unique entre deux cultures.
              </p>
              <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
                Chaque bouteille de jus Ben's est préparée artisanalement, avec des ingrédients soigneusement sélectionnés auprès de producteurs locaux. C'est cette alliance entre traditions africaines et terroir québécois qui rend nos jus uniques.
              </p>
              <div style={{ background: `${C.red}08`, borderLeft: `4px solid ${C.red}`, borderRadius: '0 12px 12px 0', padding: '16px 20px', marginTop: 24 }}>
                <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  « Mon rêve est de faire découvrir à chaque Québécois la richesse des saveurs africaines, tout en soutenant nos producteurs locaux et en respectant notre planète. »
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRIX */}
      <section style={{ background: C.light, padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: C.dark, margin: '0 0 24px' }}>🏆 Reconnaissance</h2>
          <Reveal anim="scaleIn">
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, display: 'inline-block' }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🏅</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.dark, margin: '0 0 8px' }}>Prix Startup — Domaine Bioalimentaire</h3>
              <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Jeune Chambre de Commerce du Cameroun à Montréal</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALEURS */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.dark, margin: '0 0 32px', textAlign: 'center' }}>Nos valeurs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '🌱', title: '100% Naturel', desc: 'Aucun conservateur, aucun additif. Juste des fruits, de l\'eau et de l\'amour.' },
            { icon: '♻️', title: 'Zéro déchet', desc: 'Nos résidus de gingembre, hibiscus et ananas sont transformés en épices et produits de beauté.' },
            { icon: '🍁', title: 'Local d\'abord', desc: 'Nous travaillons avec des producteurs québécois pour garantir fraîcheur et qualité.' },
            { icon: '🌍', title: 'Héritage africain', desc: 'Nos recettes sont inspirées de traditions centenaires du Cameroun et d\'Afrique de l\'Ouest.' },
            { icon: '❤️', title: 'Artisanal', desc: 'Chaque bouteille est préparée à la main avec soin, en petits lots.' },
            { icon: '🤝', title: 'Communauté', desc: 'Présents aux marchés locaux, nous créons des liens avec nos clients.' },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.1} anim="fadeUp">
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{v.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: C.dark }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESSUS */}
      <section style={{ background: C.dark, padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#f0e6d3', margin: '0 0 32px', textAlign: 'center' }}>Comment nous préparons nos jus</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: '01', title: 'Sélection des ingrédients', desc: 'Chaque fruit et épice est soigneusement choisi à maturité auprès de producteurs locaux.' },
              { step: '02', title: 'Préparation artisanale', desc: 'Nos recettes traditionnelles sont suivies à la lettre, avec des méthodes qui préservent les nutriments.' },
              { step: '03', title: 'Embouteillage', desc: 'Les jus sont embouteillés frais, sans pasteurisation excessive, pour garder toute leur saveur.' },
              { step: '04', title: 'Zéro gaspillage', desc: 'Les résidus sont séchés naturellement et transformés en épices ou produits de beauté.' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.15} anim="slideLeft">
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: C.red, fontFamily: "'Playfair Display', serif", flexShrink: 0, width: 50 }}>{s.step}</span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0e6d3', margin: '0 0 6px' }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#a89e91', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: C.dark, margin: '0 0 16px' }}>Envie de goûter ?</h2>
        <p style={{ fontSize: 15, color: C.muted, marginBottom: 24 }}>Découvrez nos jus dans un point de vente près de chez vous.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(ROUTES.products)} className="anim-btn"
            style={{ padding: '14px 32px', borderRadius: 50, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Voir nos produits
          </button>
          <button onClick={() => navigate(ROUTES.locations)} className="anim-btn"
            style={{ padding: '14px 32px', borderRadius: 50, border: `2px solid ${C.hibiscus}`, background: 'transparent', color: C.hibiscus, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Où acheter
          </button>
        </div>
      </section>
    </div>
  );
}
