import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import { Icon } from '@/shared/ui/Icon';

export default function ContactPage() {
  const { t } = useTranslation();
  const { messages, updateMessages, subscribers, updateSubscribers, settings } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSent(false);
  };

  const handleSend = () => {
    if (!email || !message) return;

    updateMessages([
      ...messages,
      {
        id: 'm' + Date.now(),
        name: name || 'Anonyme',
        email,
        message,
        read: false,
        responded: false,
        date: new Date().toISOString(),
      },
    ]);

    if (email.includes('@') && !subscribers.find((subscriber) => subscriber.email === email)) {
      updateSubscribers([
        ...subscribers,
        { id: 's' + Date.now(), email, date: new Date().toISOString().split('T')[0], active: true },
      ]);
    }

    setSent(true);
  };

  return (
    <div>
      <SEO
        title="Contact"
        description="Contactez Les Jus Naturels Ben's pour toute question. Nous sommes a Montreal et ravis de vous servir."
        url="https://lesjusnatuelsbens.com/contact"
      />

      <section
        className="page-hero"
        style={{
          backgroundImage: `url('${settings.bannerContact || '/images-bens/photos/photo-contact.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="page-hero-inner">
          <p className="page-hero-eyebrow">Contact</p>
          <h1 className="page-hero-title">{t('contact.title')}</h1>
          <p className="page-hero-subtitle">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="page-shell" style={{ paddingBottom: 10 }}>
        <div className="two-col" style={{ alignItems: 'start' }}>
          <article className="surface-card" style={{ padding: 22 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '22px 8px' }}>
                <p style={{ fontSize: 40, margin: 0, display: 'inline-flex' }}>
                  <Icon type="check" size={40} color="var(--accent)" />
                </p>
                <h2 style={{ marginTop: 8, fontFamily: "'Playfair Display', serif", color: 'var(--ink-strong)' }}>
                  {t('contact.success.title')}
                </h2>
                <p className="page-subtitle" style={{ marginTop: 8 }}>{t('contact.success.subtitle')}</p>
                <button type="button" className="btn-light anim-btn" onClick={resetForm} style={{ marginTop: 14 }}>
                  {t('contact.success.sendAnother')}
                </button>
              </div>
            ) : (
              <>
                <h2 className="section-title" style={{ marginTop: 0, fontSize: 28 }}>{t('contact.title')}</h2>
                <p className="page-subtitle" style={{ marginTop: 6 }}>{t('contact.subtitle')}</p>

                <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('contact.name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    type="email"
                    className="form-input"
                    placeholder={t('contact.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <textarea
                    className="form-area"
                    placeholder={t('contact.message')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn-solid anim-btn"
                    onClick={handleSend}
                    disabled={!email || !message}
                    style={{ opacity: !email || !message ? 0.55 : 1 }}
                  >
                    {t('contact.send')}
                  </button>
                </div>
              </>
            )}
          </article>

          <div style={{ display: 'grid', gap: 12 }}>
            <article className="surface-card" style={{ padding: 18 }}>
              <p className="pill-label">{t('contact.cards.email')}</p>
              <h3 style={{ marginTop: 10, fontSize: 19, color: 'var(--ink-strong)' }}>info@lesjusnaturelsbens.com</h3>
              <p className="page-subtitle" style={{ marginTop: 6, fontSize: 13 }}>
                Nous repondons generalement dans la meme journee.
              </p>
            </article>

            <a
              href="https://api.whatsapp.com/send?phone=15145550123&text=Bonjour%20Ben%27s%2C%20je%20veux%20des%20infos%20sur%20vos%20jus."
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card anim-card"
              style={{
                display: 'block',
                textDecoration: 'none',
                padding: 18,
                background: 'linear-gradient(140deg, rgba(31,188,88,0.12), rgba(255,255,255,0.9))',
              }}
            >
              <p className="pill-label" style={{ background: 'rgba(31,188,88,0.18)', color: '#1f8d4f' }}>
                {t('contact.cards.whatsapp')}
              </p>
              <h3 style={{ marginTop: 10, fontSize: 19, color: '#135d35' }}>+1 (514) 555-0123</h3>
              <p className="page-subtitle" style={{ marginTop: 6, fontSize: 13, color: '#246142' }}>
                {t('contact.cards.whatsappSub')}
              </p>
            </a>

            <article className="surface-card" style={{ overflow: 'hidden' }}>
              <img
                src={settings.bannerContact || '/images-bens/photos/photo-contact.png'}
                alt="Contact Ben's"
                style={{ width: '100%', height: 220, objectFit: 'cover' }}
              />
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
