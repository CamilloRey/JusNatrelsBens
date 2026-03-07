import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData }  from '@/app/providers/DataContext';
import { C }        from '@/shared/constants/colors';
import { CSS }      from '@/shared/constants/styles';

export default function ContactPage() {
  const { t } = useTranslation();
  const { messages, updateMessages, subscribers, updateSubscribers } = useData();
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg]     = useState('');
  const [sent, setSent]   = useState(false);

  const handleSend = () => {
    if (!email || !msg) return;
    updateMessages([...messages, { id: 'm' + Date.now(), name: name || 'Anonyme', email, message: msg, read: false, responded: false, date: new Date().toISOString() }]);
    if (email.includes('@') && !subscribers.find(s => s.email === email)) {
      updateSubscribers([...subscribers, { id: 's' + Date.now(), email, date: new Date().toISOString().split('T')[0], active: true }]);
    }
    setSent(true);
  };

  return (
    <div>
      {/* Bannière */}
      <div style={{ height: 220, backgroundImage: "url('/images-bens/photos/photo-contact.png')", backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55))' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,5vw,40px)', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>{t('contact.title')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, margin: 0 }}>{t('contact.subtitle')}</p>
        </div>
      </div>
    <div style={{ padding: '48px 24px', maxWidth: 600, margin: '0 auto' }}>

      {sent ? (
        <div style={{ background: `${C.green}12`, border: `1px solid ${C.green}44`, borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>✅</span>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.green, margin: '0 0 8px' }}>{t('contact.success.title')}</p>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{t('contact.success.subtitle')}</p>
          <button onClick={() => { setSent(false); setName(''); setEmail(''); setMsg(''); }}
            style={{ marginTop: 16, padding: '10px 24px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.dark, fontSize: 14, cursor: 'pointer' }}>
            {t('contact.success.sendAnother')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { placeholder: t('contact.name'),  value: name,  set: setName,  type: 'text' },
            { placeholder: t('contact.email'), value: email, set: setEmail, type: 'email' },
          ].map(({ placeholder, value, set, type }) => (
            <input key={placeholder} type={type} placeholder={placeholder} value={value}
              onChange={e => set(e.target.value)}
              style={{ padding: '14px 18px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: 'none', fontFamily: 'inherit' }} />
          ))}
          <textarea placeholder={t('contact.message')} value={msg} onChange={e => setMsg(e.target.value)} rows={5}
            style={{ padding: '14px 18px', borderRadius: 12, border: `1px solid ${C.border}`, fontSize: 15, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
          <button onClick={handleSend} disabled={!email || !msg}
            style={{ padding: 14, borderRadius: 12, border: 'none', background: C.hibiscus, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !email || !msg ? 0.5 : 1 }}>
            {t('contact.send')}
          </button>
        </div>
      )}

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: 20, background: C.light, borderRadius: 14, textAlign: 'center' }}>
          <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>📧</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.dark, margin: '0 0 2px' }}>{t('contact.cards.email')}</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>info@lesjusnaturelsbens.com</p>
        </div>
        <a href="https://wa.me/15145550123" target="_blank" rel="noopener noreferrer"
          style={{ padding: 20, background: '#dcfce7', borderRadius: 14, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>💬</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#166534', margin: '0 0 2px' }}>{t('contact.cards.whatsapp')}</p>
          <p style={{ fontSize: 13, color: '#2a6a4f', margin: 0 }}>{t('contact.cards.whatsappSub')}</p>
        </a>
      </div>
    </div>
    </div>
  );
}
