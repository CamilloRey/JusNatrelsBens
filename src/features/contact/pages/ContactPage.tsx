import { useState } from 'react';
import { useData } from '@/app/providers/DataContext';
import { SEO } from '@/shared/components/SEO';
import type { Message } from '@/features/contact/types/message.types';

const C = {
  primary:             '#1B4D38',
  primaryContainer:    '#2B6A4F',
  gold:                '#C9A84C',
  surface:             '#F5FBF7',
  surfaceContainerLow: '#EAF3EC',
  surfaceContainer:    '#DDE9E0',
  onSurface:           '#1a1a17',
  onSurfaceVariant:    '#3f4840',
};
const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY     = "'Plus Jakarta Sans', sans-serif";
const MAX_W         = 1280;

function WaveDivider({ topColor, bottomColor }: { topColor: string; bottomColor: string }) {
  return (
    <div style={{ display: 'block', lineHeight: 0, background: bottomColor }}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ width: '100%', height: 80, display: 'block' }}>
        <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,0 L0,0 Z" fill={topColor} />
      </svg>
    </div>
  );
}

const FIELD_STYLE = {
  background: '#ffffff',
  border: `1.5px solid rgba(27,77,56,0.12)`,
  borderRadius: 12,
  padding: '16px 20px',
  fontSize: '0.95rem',
  fontFamily: FONT_BODY,
  color: C.onSurface,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s',
};

export default function ContactPage() {
  const { settings, messages, updateMessages } = useData();

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!name.trim())  { setError('Veuillez entrer votre nom.'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide.'); return;
    }
    if (!message.trim()) { setError('Veuillez entrer votre message.'); return; }

    setSending(true);
    try {
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        message: `[${subject || 'Général'}] ${message.trim()}`,
        read: false, responded: false,
        date: new Date().toISOString(),
      };
      updateMessages([...messages, newMsg]);
      setSent(true);
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.surface, minHeight: '100vh' }}>
      <SEO
        title="Contact"
        description="Contactez Les Jus Naturels Ben's pour toute question. Nous sommes à Montréal et ravis de vous servir."
        url="https://lesjusnaturelsbens.com/contact"
      />

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: 'min(580px, 78vh)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images-bens/hero-banners/banniere-Contacter%20nous%20hero.png')",
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,77,56,0.92) 28%, rgba(27,77,56,0.55) 62%, rgba(27,77,56,0.12) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: MAX_W, margin: '0 auto', padding: '5rem 2rem', width: '100%' }}>
          <p style={{
            fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase' as const,
            color: C.gold, margin: '0 0 20px',
          }}>
            Parlons ensemble
          </p>
          <h1 style={{
            fontFamily: FONT_HEADLINE,
            fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
            fontWeight: 700, color: '#ffffff',
            lineHeight: 1.1, margin: '0 0 24px', maxWidth: 680,
          }}>
            Nous aimerions entendre{' '}
            <em style={{ fontStyle: 'italic', color: C.gold }}>les curieux.</em>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.68)', fontSize: '1.05rem',
            lineHeight: 1.75, maxWidth: '40ch', margin: 0,
          }}>
            Une question sur nos jus, une envie de collaboration ou simplement l'envie de nous dire bonjour&nbsp;? Nous sommes là.
          </p>
        </div>
      </section>

      <WaveDivider topColor={C.primary} bottomColor={C.surface} />

      {/* ═══ MAIN GRID ═══ */}
      <section style={{ maxWidth: MAX_W, margin: '0 auto', padding: '8px 32px 96px' }}>
        <style>{`
          .contact-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 40px; align-items: start; }
          @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; } }
          .contact-input:focus { border-color: rgba(27,77,56,0.4) !important; }
        `}</style>
        <div className="contact-grid">

          {/* ── FORM ── */}
          <div style={{
            background: C.surfaceContainerLow,
            borderRadius: '2rem', padding: '48px',
            boxShadow: '0 4px 32px rgba(27,77,56,0.07)',
          }}>
            <p style={{
              fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: C.gold, margin: '0 0 8px',
            }}>
              Formulaire de contact
            </p>
            <h2 style={{
              fontFamily: FONT_HEADLINE, fontSize: '1.5rem', fontWeight: 700,
              color: C.primary, margin: '0 0 32px', lineHeight: 1.2,
            }}>
              Envoyez-nous un message
            </h2>

            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <input
                type="text" placeholder="Votre nom"
                value={name} onChange={e => setName(e.target.value)}
                className="contact-input"
                style={FIELD_STYLE}
              />
              <input
                type="email" placeholder="Votre email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="contact-input"
                style={FIELD_STYLE}
              />
            </div>

            {/* Subject */}
            <select
              value={subject} onChange={e => setSubject(e.target.value)}
              style={{
                ...FIELD_STYLE,
                marginBottom: 14,
                color: subject ? C.onSurface : C.onSurfaceVariant,
                appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="" disabled>Sujet de votre message</option>
              <option value="commande">Commande</option>
              <option value="collaboration">Collaboration</option>
              <option value="question">Question générale</option>
              <option value="autre">Autre</option>
            </select>

            {/* Message */}
            <textarea
              placeholder="Votre message…"
              rows={5} value={message}
              onChange={e => setMessage(e.target.value)}
              className="contact-input"
              style={{ ...FIELD_STYLE, marginBottom: 28, resize: 'vertical' }}
            />

            {/* Error */}
            {error && (
              <p style={{
                color: '#b91c1c', fontSize: '0.87rem',
                marginBottom: 16, fontFamily: FONT_BODY,
                background: '#fef2f2', borderRadius: 10, padding: '10px 16px',
                border: '1px solid #fca5a5',
              }}>
                {error}
              </p>
            )}

            {/* Success */}
            {sent && (
              <div style={{
                background: C.surfaceContainerLow,
                border: `1.5px solid ${C.primary}40`,
                borderRadius: 14, padding: '18px 22px',
                marginBottom: 18,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: C.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.primary, margin: 0, fontSize: '0.95rem' }}>Message envoyé !</p>
                  <p style={{ fontFamily: FONT_BODY, color: C.onSurfaceVariant, margin: 0, fontSize: '0.82rem' }}>Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="button" onClick={handleSubmit}
              disabled={sending || sent}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: sent 
                  ? 'linear-gradient(135deg, #059669, #047857)' 
                  : `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                color: '#ffffff', border: 'none', borderRadius: 9999,
                padding: '18px 48px', fontSize: '1rem', fontWeight: 700,
                fontFamily: FONT_BODY,
                cursor: sending || sent ? 'default' : 'pointer',
                opacity: sending ? 0.7 : 1,
                transition: 'all 0.25s',
                boxShadow: sent 
                  ? '0 4px 20px rgba(5,150,105,0.3)' 
                  : '0 4px 20px rgba(27,77,56,0.2)',
              }}
              onMouseEnter={e => { 
                if (!sending && !sent) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(27,77,56,0.3)';
                }
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = sent 
                  ? '0 4px 20px rgba(5,150,105,0.3)' 
                  : '0 4px 20px rgba(27,77,56,0.2)';
              }}
            >
              {sending ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                  Envoi en cours…
                </span>
              ) : sent ? (
                '✓ Message envoyé'
              ) : (
                <>
                  Envoyer le message
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M10 4l6 6-6 6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>

            {/* Trust badges */}
            <div style={{
              display: 'flex', gap: 20, marginTop: 28,
              paddingTop: 24, borderTop: '1px solid rgba(27,77,56,0.1)',
            }}>
              {[
                { icon: '🔒', label: 'Données sécurisées' },
                { icon: '⚡', label: 'Réponse rapide' },
                { icon: '💬', label: 'Support dédié' },
              ].map((b) => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1rem' }}>{b.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: C.onSurfaceVariant }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── INFO COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Premium header */}
            <div style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
              borderRadius: '1.25rem',
              padding: '24px 28px',
              marginBottom: 8,
            }}>
              <p style={{
                fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: C.gold, margin: '0 0 10px',
              }}>
                ✦ Nous joindre
              </p>
              <h3 style={{
                fontFamily: FONT_HEADLINE, fontSize: '1.25rem', fontWeight: 700,
                color: '#ffffff', margin: 0, lineHeight: 1.3,
              }}>
                Une question? On est là pour vous.
              </h3>
            </div>

            {/* Contact cards */}
            {[
              {
                label: 'Notre Atelier',
                value: settings.address || '1234 Rue des Jus, Montréal, QC',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill={C.primary} />
                  </svg>
                ),
              },
              {
                label: 'Téléphone',
                value: settings.phone || '+1 (514) 555-0123',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={C.primary} />
                  </svg>
                ),
              },
              {
                label: 'Courriel',
                value: settings.email || 'info@lesjusnaturelsbens.com',
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={C.primary} />
                  </svg>
                ),
              },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                background: '#ffffff',
                borderRadius: '1rem',
                padding: '18px 20px',
                border: '1px solid rgba(27,77,56,0.08)',
                boxShadow: '0 2px 12px rgba(27,77,56,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(27,77,56,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,77,56,0.04)';
              }}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${C.surfaceContainerLow}, ${C.surfaceContainer})`,
                  borderRadius: '50%', width: 52, height: 52, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid rgba(27,77,56,0.08)`,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontFamily: FONT_HEADLINE, color: C.primary, fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>
                    {item.label}
                  </p>
                  <p style={{ color: C.onSurfaceVariant, fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Map link */}
            <a
              href="https://maps.google.com/?q=Marché+Jean-Talon+Montréal"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', borderRadius: '1.5rem',
                background: C.surfaceContainerLow, height: 220,
                overflow: 'hidden', position: 'relative', textDecoration: 'none',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${C.surfaceContainer} 0%, ${C.surfaceContainerLow} 50%, #c8ddc8 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.15 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={C.primary} />
                </svg>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(27,77,56,0.35) 100%)', zIndex: 1 }} />
              <div style={{
                position: 'absolute', bottom: 18, left: '50%',
                transform: 'translateX(-50%)', zIndex: 2,
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
                borderRadius: 9999, padding: '9px 20px',
                fontSize: '0.82rem', fontWeight: 700,
                color: C.primary, fontFamily: FONT_BODY, whiteSpace: 'nowrap',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={C.primary} />
                </svg>
                Voir sur Google Maps
              </div>
            </a>

            {/* Social icons */}
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: C.onSurfaceVariant, margin: '0 0 14px' }}>
                Suivez-nous
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  {
                    label: 'Instagram',
                    href: settings.instagram || 'https://instagram.com/lesjusnaturelsbens',
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke={C.primary} strokeWidth="1.8" />
                        <circle cx="12" cy="12" r="4" stroke={C.primary} strokeWidth="1.8" />
                        <circle cx="17.5" cy="6.5" r="1" fill={C.primary} />
                      </svg>
                    ),
                  },
                  {
                    label: 'Facebook',
                    href: settings.facebook || 'https://facebook.com/lesjusnaturelsbens',
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                  {
                    label: 'WhatsApp',
                    href: settings.phone ? `https://wa.me/${settings.phone.replace(/\D/g, '')}` : 'https://wa.me/15145550123',
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                  {
                    label: 'TikTok',
                    href: settings.tiktok || 'https://tiktok.com/@lesjusnaturelsbens',
                    icon: (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                ].map(s => (
                  <a
                    key={s.label} href={s.href}
                    target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{
                      width: 46, height: 46, borderRadius: '50%',
                      border: `1.5px solid rgba(27,77,56,0.15)`,
                      background: C.surfaceContainerLow,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none', transition: 'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = C.surfaceContainer;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(27,77,56,0.3)`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.background = C.surfaceContainerLow;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(27,77,56,0.15)`;
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider topColor={C.surface} bottomColor="#032416" />
    </div>
  );
}
