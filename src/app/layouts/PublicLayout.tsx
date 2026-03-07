import { useState }         from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation }   from 'react-i18next';
import { C }               from '@/shared/constants/colors';
import { Icon }            from '@/shared/ui/Icon';
import { ChatBot }         from '@/shared/components/ChatBot';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ROUTES }          from '@/shared/constants/routes';

export default function PublicLayout() {
  const { t }  = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretTimer, setSecretTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const NAV = [
    { path: ROUTES.home,      label: t('nav.home')      },
    { path: ROUTES.about,     label: t('nav.about')     },
    { path: ROUTES.products,  label: t('nav.products')  },
    { path: ROUTES.blog,      label: t('nav.blog')      },
    { path: ROUTES.events,    label: t('nav.events')    },
    { path: ROUTES.locations, label: t('nav.locations') },
    { path: ROUTES.contact,   label: t('nav.contact')   },
  ];

  const handleSecretClick = () => {
    const n = secretClicks + 1;
    setSecretClicks(n);
    if (secretTimer) clearTimeout(secretTimer);
    if (n >= 5) { setSecretClicks(0); navigate(ROUTES.login); }
    else { const t2 = setTimeout(() => setSecretClicks(0), 2000); setSecretTimer(t2); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", margin: 0, padding: 0, minHeight: '100vh', color: '#1a1a1a', background: '#faf6f0' }}>
      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to={ROUTES.home} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/images-bens/logos/logo-principal.png" alt="Ben's" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {NAV.map(n => (
              <Link key={n.path} to={n.path} onClick={() => setMobileOpen(false)}
                style={{ padding: '8px 14px', border: 'none', background: location.pathname === n.path ? C.light : 'transparent', color: location.pathname === n.path ? C.hibiscus : C.muted, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: location.pathname === n.path ? 600 : 400, textDecoration: 'none', display: window.innerWidth < 768 ? 'none' : 'block' }}>
                {n.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: window.innerWidth >= 768 ? 'none' : 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <Icon type={mobileOpen ? 'x' : 'menu'} color={C.dark} />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div style={{ paddingBottom: 16 }}>
            {NAV.map(n => (
              <Link key={n.path} to={n.path} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', background: location.pathname === n.path ? C.light : 'transparent', color: location.pathname === n.path ? C.hibiscus : C.dark, textAlign: 'left', cursor: 'pointer', fontSize: 15, borderRadius: 8, textDecoration: 'none' }}>
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />

      {/* FOOTER */}
      <footer style={{ background: C.dark, color: '#a89e91', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
          <div style={{ minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/images-bens/logos/logo-noir-transparent.png" alt="Ben's" style={{ height: 48, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>{t('footer.desc')}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: '#6b5e52', marginBottom: 12 }}>{t('footer.nav')}</p>
            {NAV.map(n => (
              <Link key={n.path} to={n.path}
                style={{ display: 'block', color: '#a89e91', padding: '4px 0', fontSize: 14, textDecoration: 'none' }}>{n.label}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: '#6b5e52', marginBottom: 12 }}>{t('footer.contact')}</p>
            <p style={{ fontSize: 14 }}>info@lesjusnaturelsbens.com</p>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '32px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p onClick={handleSecretClick} style={{ fontSize: 12, cursor: 'default', userSelect: 'none', margin: 0 }}>
            {t('footer.copyright')}
          </p>
          {secretClicks > 0 && secretClicks < 5 && (
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i <= secretClicks ? C.red : 'rgba(255,255,255,0.15)', transition: 'background 0.2s' }} />
              ))}
            </div>
          )}
        </div>
      </footer>

      {/* CHATBOT */}
      <ChatBot />

      {/* WHATSAPP */}
      <a href="https://wa.me/15145550123?text=Bonjour%20Ben%27s%20!%20J%27aimerais%20avoir%20des%20informations%20sur%20vos%20jus%20naturels."
        target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, width: 56, height: 56, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.2s', animation: 'bounceIn 0.6s ease 1s both' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
