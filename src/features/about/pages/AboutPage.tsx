import { useNavigate }   from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { C }              from '@/shared/constants/colors';
import { ROUTES }         from '@/shared/constants/routes';
import { Reveal }      from '@/shared/ui/Reveal';

export default function AboutPage() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  return (
    <div>
      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${C.hibiscus} 0%, ${C.red} 50%, ${C.gold} 100%)`, padding: '72px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 25px, rgba(255,255,255,0.02) 25px, rgba(255,255,255,0.02) 50px)' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>{t('about.hero.eyebrow')}</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
            {t('about.hero.title')}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
            {t('about.hero.subtitle')}
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
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: C.dark, margin: '0 0 4px' }}>{t('about.founder.title')}</h3>
              <p style={{ fontSize: 14, color: C.red, fontWeight: 600, margin: '0 0 8px' }}>{t('about.founder.subtitle')}</p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{t('about.founder.desc')}</p>
            </div>
          </Reveal>
          <Reveal anim="slideRight">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.dark, margin: '0 0 20px' }}>{t('about.story.title')}</h2>
              <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
                {t('about.story.p1')}
              </p>
              <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
                {t('about.story.p2')}
              </p>
              <p style={{ fontSize: 16, color: C.text, lineHeight: 1.9, marginBottom: 16 }}>
                {t('about.story.p3')}
              </p>
              <div style={{ background: `${C.red}08`, borderLeft: `4px solid ${C.red}`, borderRadius: '0 12px 12px 0', padding: '16px 20px', marginTop: 24 }}>
                <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  {t('about.story.quote')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRIX */}
      <section style={{ background: C.light, padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: C.dark, margin: '0 0 24px' }}>{t('about.award.title')}</h2>
          <Reveal anim="scaleIn">
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: `1px solid ${C.border}`, display: 'inline-block' }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>🏅</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.dark, margin: '0 0 8px' }}>{t('about.award.name')}</h3>
              <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{t('about.award.org')}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALEURS */}
      <section style={{ padding: '64px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: C.dark, margin: '0 0 32px', textAlign: 'center' }}>{t('about.values.title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '🌱', key: 'natural' },
            { icon: '♻️', key: 'zero' },
            { icon: '🍁', key: 'local' },
            { icon: '🌍', key: 'heritage' },
            { icon: '❤️', key: 'artisanal' },
            { icon: '🤝', key: 'community' },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.1} anim="fadeUp">
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{v.icon}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: C.dark }}>{t(`about.values.${v.key}.title`)}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{t(`about.values.${v.key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESSUS */}
      <section style={{ background: C.dark, padding: '64px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: '#f0e6d3', margin: '0 0 32px', textAlign: 'center' }}>{t('about.process.title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {(['s1', 's2', 's3', 's4'] as const).map((s, i) => (
              <Reveal key={i} delay={i * 0.15} anim="slideLeft">
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: C.red, fontFamily: "'Playfair Display', serif", flexShrink: 0, width: 50 }}>0{i + 1}</span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0e6d3', margin: '0 0 6px' }}>{t(`about.process.${s}.title`)}</h3>
                    <p style={{ fontSize: 14, color: '#a89e91', lineHeight: 1.7, margin: 0 }}>{t(`about.process.${s}.desc`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: C.dark, margin: '0 0 16px' }}>{t('about.cta.title')}</h2>
        <p style={{ fontSize: 15, color: C.muted, marginBottom: 24 }}>{t('about.cta.subtitle')}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(ROUTES.products)} className="anim-btn"
            style={{ padding: '14px 32px', borderRadius: 50, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {t('about.cta.products')}
          </button>
          <button onClick={() => navigate(ROUTES.locations)} className="anim-btn"
            style={{ padding: '14px 32px', borderRadius: 50, border: `2px solid ${C.hibiscus}`, background: 'transparent', color: C.hibiscus, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            {t('about.cta.locations')}
          </button>
        </div>
      </section>
    </div>
  );
}
