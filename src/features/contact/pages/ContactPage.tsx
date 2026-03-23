import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';

const COLORS = {
  primary: '#032416',
  primaryContainer: '#1a3a2a',
  secondary: '#7b5804',
  secondaryContainer: '#fdcd74',
  surface: '#fef9ef',
  surfaceContainer: '#f2ede3',
  surfaceContainerLow: '#f8f3e9',
  surfaceContainerHigh: '#ece8de',
  onSurface: '#1d1c16',
  onSurfaceVariant: '#424843',
  onTertiaryContainer: '#f37b32',
  primaryFixed: '#c7ebd4',
};

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
const MAX_W = 1440;

export default function ContactPage() {
  const { settings } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    console.log({ name, email, subject, message });
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: COLORS.surface, minHeight: '100vh' }}>
      <SEO
        title={'Contact'}
        description={'Contactez Les Jus Naturels Ben\'s pour toute question. Nous sommes à Montréal et ravis de vous servir.'}
        url={'https://lesjusnatuelsbens.com/contact'}
      />

      {/* ── HEADER ── */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: '80px 48px 64px',
        }}
      >
        {/* Orange pill label */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: COLORS.secondaryContainer,
            color: COLORS.secondary,
            borderRadius: 9999,
            padding: '6px 20px',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: 28,
          }}
        >
          {'Contactez-nous'}
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: FONT_HEADLINE,
            color: COLORS.primaryContainer,
            fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            margin: '0 0 24px',
            maxWidth: 720,
          }}
        >
          {'Nous aimerions entendre\u00a0'}
          <em
            style={{
              fontStyle: 'italic',
              color: COLORS.onTertiaryContainer,
            }}
          >
            {'les curieux.'}
          </em>
        </h1>

        {/* Description */}
        <p
          style={{
            color: COLORS.onSurfaceVariant,
            fontSize: 18,
            lineHeight: 1.7,
            maxWidth: 560,
            margin: 0,
          }}
        >
          {'Une question sur nos jus, une envie de collaboration ou simplement l\u2019envie de nous dire bonjour\u00a0? Nous sommes là.'}
        </p>
      </section>

      {/* ── MAIN GRID ── */}
      <section
        style={{
          maxWidth: MAX_W,
          margin: '0 auto',
          padding: '0 48px 96px',
          display: 'grid',
          gridTemplateColumns: '7fr 5fr',
          gap: 40,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: Form card ── */}
        <div
          style={{
            background: COLORS.surfaceContainerLow,
            borderRadius: '2.5rem',
            padding: '48px',
            boxShadow: '0 4px 32px rgba(3,36,22,0.08)',
          }}
        >
          {/* 2-col grid: Name + Email */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <input
              type={'text'}
              placeholder={'Votre nom'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: COLORS.surfaceContainer,
                border: 'none',
                borderRadius: 12,
                padding: '16px 24px',
                fontSize: 15,
                fontFamily: FONT_BODY,
                color: COLORS.onSurface,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <input
              type={'email'}
              placeholder={'Votre email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: COLORS.surfaceContainer,
                border: 'none',
                borderRadius: 12,
                padding: '16px 24px',
                fontSize: 15,
                fontFamily: FONT_BODY,
                color: COLORS.onSurface,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Subject select */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              background: COLORS.surfaceContainer,
              border: 'none',
              borderRadius: 12,
              padding: '16px 24px',
              fontSize: 15,
              fontFamily: FONT_BODY,
              color: subject ? COLORS.onSurface : COLORS.onSurfaceVariant,
              outline: 'none',
              width: '100%',
              marginBottom: 16,
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            <option value={''} disabled>{'Sujet de votre message'}</option>
            <option value={'commande'}>{'Commande'}</option>
            <option value={'collaboration'}>{'Collaboration'}</option>
            <option value={'question'}>{'Question générale'}</option>
            <option value={'autre'}>{'Autre'}</option>
          </select>

          {/* Message textarea */}
          <textarea
            placeholder={'Votre message\u2026'}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              background: COLORS.surfaceContainer,
              border: 'none',
              borderRadius: 12,
              padding: '16px 24px',
              fontSize: 15,
              fontFamily: FONT_BODY,
              color: COLORS.onSurface,
              outline: 'none',
              width: '100%',
              marginBottom: 32,
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          {/* Submit button */}
          <button
            type={'button'}
            onClick={handleSubmit}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: COLORS.primaryContainer,
              color: '#ffffff',
              border: 'none',
              borderRadius: 9999,
              padding: '20px 48px',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: FONT_BODY,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            {'Envoyer le message'}
            <svg width={'20'} height={'20'} viewBox={'0 0 20 20'} fill={'none'}>
              <path
                d={'M4 10h12M10 4l6 6-6 6'}
                stroke={'#ffffff'}
                strokeWidth={'1.8'}
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
              />
            </svg>
          </button>
        </div>

        {/* ── RIGHT: Contact info + map + socials ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Contact items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div
                style={{
                  background: COLORS.primaryFixed,
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width={'22'} height={'22'} viewBox={'0 0 24 24'} fill={'none'}>
                  <path
                    d={'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z'}
                    fill={COLORS.primaryContainer}
                  />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: FONT_HEADLINE,
                    color: COLORS.primaryContainer,
                    fontSize: 18,
                    fontWeight: 700,
                    margin: '0 0 4px',
                  }}
                >
                  {'Notre Atelier'}
                </h3>
                <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  {settings.address || '1234 Rue des Jus, Montréal, QC'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div
                style={{
                  background: COLORS.primaryFixed,
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width={'22'} height={'22'} viewBox={'0 0 24 24'} fill={'none'}>
                  <path
                    d={'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'}
                    fill={COLORS.primaryContainer}
                  />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: FONT_HEADLINE,
                    color: COLORS.primaryContainer,
                    fontSize: 18,
                    fontWeight: 700,
                    margin: '0 0 4px',
                  }}
                >
                  {'Téléphone'}
                </h3>
                <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  {settings.phone || '+1 (514) 555-0123'}
                </p>
              </div>
            </div>

            {/* Email / Digital */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div
                style={{
                  background: COLORS.primaryFixed,
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width={'22'} height={'22'} viewBox={'0 0 24 24'} fill={'none'}>
                  <path
                    d={'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'}
                    fill={COLORS.primaryContainer}
                  />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: FONT_HEADLINE,
                    color: COLORS.primaryContainer,
                    fontSize: 18,
                    fontWeight: 700,
                    margin: '0 0 4px',
                  }}
                >
                  {'Digital'}
                </h3>
                <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  {settings.email || 'info@lesjusnaturelsbens.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div
            style={{
              borderRadius: '2.5rem',
              background: COLORS.surfaceContainerHigh,
              height: 300,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, transparent 40%, rgba(3,36,22,0.35) 100%)',
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 9999,
                  padding: '10px 24px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.primaryContainer,
                  fontFamily: FONT_BODY,
                }}
              >
                {'Voir sur Google Maps'}
              </div>
            </div>
          </div>

          {/* Social icons row */}
          <div style={{ display: 'flex', gap: 12 }}>
            {/* Instagram */}
            <button
              type={'button'}
              aria-label={'Instagram'}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${COLORS.surfaceContainerHigh}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width={'20'} height={'20'} viewBox={'0 0 24 24'} fill={'none'}>
                <rect x={'2'} y={'2'} width={'20'} height={'20'} rx={'5'} stroke={COLORS.onSurfaceVariant} strokeWidth={'1.8'} />
                <circle cx={'12'} cy={'12'} r={'4'} stroke={COLORS.onSurfaceVariant} strokeWidth={'1.8'} />
                <circle cx={'17.5'} cy={'6.5'} r={'1'} fill={COLORS.onSurfaceVariant} />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type={'button'}
              aria-label={'Facebook'}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${COLORS.surfaceContainerHigh}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width={'20'} height={'20'} viewBox={'0 0 24 24'} fill={'none'}>
                <path
                  d={'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'}
                  stroke={COLORS.onSurfaceVariant}
                  strokeWidth={'1.8'}
                  strokeLinecap={'round'}
                  strokeLinejoin={'round'}
                />
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              type={'button'}
              aria-label={'WhatsApp'}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${COLORS.surfaceContainerHigh}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width={'20'} height={'20'} viewBox={'0 0 24 24'} fill={'none'}>
                <path
                  d={'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'}
                  stroke={COLORS.onSurfaceVariant}
                  strokeWidth={'1.8'}
                  strokeLinecap={'round'}
                  strokeLinejoin={'round'}
                />
              </svg>
            </button>

            {/* TikTok */}
            <button
              type={'button'}
              aria-label={'TikTok'}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${COLORS.surfaceContainerHigh}`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width={'20'} height={'20'} viewBox={'0 0 24 24'} fill={'none'}>
                <path
                  d={'M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5'}
                  stroke={COLORS.onSurfaceVariant}
                  strokeWidth={'1.8'}
                  strokeLinecap={'round'}
                  strokeLinejoin={'round'}
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
