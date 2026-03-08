import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { C } from '@/shared/constants/colors';
import { ROUTES } from '@/shared/constants/routes';
import { SEO } from '@/shared/components/SEO';
import { Reveal } from '@/shared/ui/Reveal';
import { Icon } from '@/shared/ui/Icon';

export default function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div>
      <SEO 
        title="Notre Histoire"
        description="Découvrez l'histoire de Ben's : une femme, un héritage africain et une passion pour les jus naturels fabriqués à Montréal."
        url="https://lesjusnatuelsbens.com/notre-histoire"
      />
      
      <section className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">{t('about.hero.eyebrow')}</p>
          <h1 className="page-hero-title">{t('about.hero.title')}</h1>
          <p className="page-hero-subtitle">{t('about.hero.subtitle')}</p>
        </div>
      </section>

      <section className="page-shell" style={{ paddingTop: 36 }}>
        <div className="two-col" style={{ alignItems: 'start' }}>
          <Reveal anim="slideLeft">
            <article className="surface-card" style={{ padding: 18 }}>
              <img
                src="/images-bens/photos/univers-jus-bens.png"
                alt="Fondatrice Ben's"
                style={{ width: '100%', height: 340, objectFit: 'cover', borderRadius: 16 }}
              />
              <h3 style={{ marginTop: 14, fontFamily: "'Playfair Display', serif", fontSize: 26, color: 'var(--ink-strong)' }}>
                {t('about.founder.title')}
              </h3>
              <p style={{ marginTop: 5, fontSize: 13, fontWeight: 700, color: C.hibiscus }}>
                {t('about.founder.subtitle')}
              </p>
              <p className="page-subtitle" style={{ marginTop: 8 }}>{t('about.founder.desc')}</p>
            </article>
          </Reveal>

          <Reveal anim="slideRight">
            <article className="surface-card" style={{ padding: 24 }}>
              <h2 className="section-title" style={{ marginTop: 0 }}>{t('about.story.title')}</h2>
              <p className="page-subtitle">{t('about.story.p1')}</p>
              <p className="page-subtitle">{t('about.story.p2')}</p>
              <p className="page-subtitle">{t('about.story.p3')}</p>

              <div
                style={{
                  marginTop: 14,
                  borderLeft: `3px solid ${C.hibiscus}`,
                  background: 'rgba(196,69,54,0.08)',
                  borderRadius: 12,
                  padding: '14px 16px',
                }}
              >
                <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.7, color: 'var(--ink)' }}>
                  {t('about.story.quote')}
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="page-shell section-stack" style={{ paddingTop: 0 }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>{t('about.award.title')}</h2>

        <Reveal anim="fadeUp">
          <div className="two-col" style={{ marginTop: 16 }}>
            {['/images-bens/recompenses/recompense_1.avif', '/images-bens/recompenses/recompense_2.avif'].map((src, i) => (
              <article key={src} className="surface-card anim-card" style={{ padding: 20, textAlign: 'center' }}>
                <img
                  src={src}
                  alt={`Award ${i + 1}`}
                  style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 14, background: 'rgba(255,255,255,0.7)' }}
                />
                <h3 style={{ marginTop: 12, fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--ink-strong)' }}>
                  {t('about.award.name')}
                </h3>
                <p className="page-subtitle" style={{ marginTop: 6 }}>{t('about.award.org')}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="home-values-wrap" style={{ marginTop: 64 }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 24px' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>{t('about.values.title')}</h2>

          <div className="home-values-grid" style={{ marginTop: 18 }}>
            {(([
              { icon: 'shield', key: 'natural' },
              { icon: 'check', key: 'zero' },
              { icon: 'map', key: 'local' },
              { icon: 'star', key: 'heritage' },
              { icon: 'edit', key: 'artisanal' },
              { icon: 'users', key: 'community' },
            ] as const)).map((item, i) => (
              <Reveal key={item.key} delay={i * 0.08} anim="fadeUp">
                <article className="home-value-card anim-card">
                  <span className="icon">
                    <Icon type={item.icon} size={22} color="currentColor" />
                  </span>
                  <h3>{t(`about.values.${item.key}.title`)}</h3>
                  <p>{t(`about.values.${item.key}.desc`)}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell section-stack" style={{ paddingTop: 0 }}>
        <div className="surface-card" style={{ overflow: 'hidden', padding: 0 }}>
          <img
            src="/images-bens/photos/soiree-festive-jus-bens.jpg"
            alt="Ben's moment"
            style={{ width: '100%', height: 290, objectFit: 'cover' }}
          />
        </div>
      </section>

      <section className="page-shell section-stack" style={{ paddingTop: 0 }}>
        <div className="two-col" style={{ alignItems: 'center' }}>
          <article className="surface-card" style={{ padding: 24 }}>
            <h2 className="section-title" style={{ marginTop: 0 }}>{t('about.process.title')}</h2>
            <div style={{ marginTop: 14, display: 'grid', gap: 16 }}>
              {(['s1', 's2', 's3', 's4'] as const).map((step, idx) => (
                <Reveal key={step} delay={idx * 0.08} anim="fadeUp">
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: C.hibiscus, minWidth: 30 }}>
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 style={{ fontSize: 17, color: 'var(--ink-strong)', margin: 0 }}>
                        {t(`about.process.${step}.title`)}
                      </h3>
                      <p className="page-subtitle" style={{ marginTop: 6 }}>
                        {t(`about.process.${step}.desc`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </article>

          <Reveal anim="scaleIn">
            <div className="surface-card" style={{ overflow: 'hidden', padding: 12 }}>
              <img
                src="/images-bens/photos/mission-engagement.png"
                alt="Mission"
                style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 14 }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell section-stack" style={{ textAlign: 'center', paddingBottom: 12 }}>
        <h2 className="section-title">{t('about.cta.title')}</h2>
        <p className="page-subtitle" style={{ marginTop: 8 }}>{t('about.cta.subtitle')}</p>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn-solid anim-btn" onClick={() => navigate(ROUTES.products)}>
            {t('about.cta.products')}
          </button>
          <button type="button" className="btn-light anim-btn" onClick={() => navigate(ROUTES.locations)}>
            {t('about.cta.locations')}
          </button>
        </div>
      </section>
    </div>
  );
}
