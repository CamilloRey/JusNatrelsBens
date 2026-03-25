import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';
import { ChatBot } from '@/shared/components/ChatBot';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ROUTES } from '@/shared/constants/routes';
import { useData } from '@/app/providers/DataContext';
import { useCart } from '@/features/shop/context/CartContext';
import { ToastContainer } from '@/features/shop/components/ToastContainer';

const WHATSAPP_PHONE = '15145550123';
const WHATSAPP_TEXT =
  "Bonjour Ben's, je voudrais des informations sur vos jus naturels.";

/*
  'Marché Jean-Talon',
  'Épicerie Afro-Antillaise',
  'Marché Atwater',
*/

export default function PublicLayout() {
const { t } = useTranslation();
const { settings } = useData();
const { cart } = useCart();
const cartCount = cart.items.length;
const [mobileOpen, setMobileOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);
const [secretClicks, setSecretClicks] = useState(0);
const [secretTimer, setSecretTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
const location = useLocation();
const navigate = useNavigate();

  const NAV = [
    { path: ROUTES.home,      label: 'Accueil' },
    { path: ROUTES.about,     label: 'Histoire' },
    { path: ROUTES.products,  label: 'Produits' },
    { path: ROUTES.blog,      label: 'Blogue' },
    { path: ROUTES.events,    label: 'Événements' },
    { path: ROUTES.locations, label: 'Nous Trouver' },
    { path: ROUTES.contact,   label: 'Contact' },
  ];

  const whatsappLink =
    `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (secretTimer) clearTimeout(secretTimer);
    };
  }, [secretTimer]);

  const handleSecretClick = () => {
    const nextCount = secretClicks + 1;
    setSecretClicks(nextCount);

    if (secretTimer) clearTimeout(secretTimer);

    if (nextCount >= 5) {
      setSecretClicks(0);
      navigate(ROUTES.login);
      return;
    }

    const timer = setTimeout(() => setSecretClicks(0), 2000);
    setSecretTimer(timer);
  };

  const isNavActive = (path: string) => {
    if (path === ROUTES.home) return location.pathname === ROUTES.home;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="public-shell">
      <header className={`public-header ${scrolled ? 'public-header-scrolled' : ''}`.trim()}>
        <div className="public-nav-wrap">
          <Link to={ROUTES.home} className="public-brand" aria-label="Ben's home">
            <span className="public-brand-text">Les Jus Naturels</span>
          </Link>

          <nav className="public-desktop-nav" aria-label="Main navigation">
            {NAV.map((item, index) => {
              const active = isNavActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`public-nav-link ${active ? 'public-nav-link-active' : ''}`.trim()}
                  style={{ animationDelay: `${90 + index * 35}ms` }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="public-tools">
            <LanguageSwitcher />
            <div style={{ position: 'relative' }}>
              <Link to={ROUTES.cart} className="public-cart-btn" aria-label="Panier">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
                </svg>
              </Link>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  background: '#E07A20',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  border: '2px solid #ffffff',
                  animation: 'cartBadgeBounce 0.6s ease-out',
                }}>
                  <style>{`
                    @keyframes cartBadgeBounce {
                      0% {
                        transform: scale(0.3);
                        opacity: 0;
                      }
                      50% {
                        transform: scale(1.15);
                      }
                      100% {
                        transform: scale(1);
                        opacity: 1;
                      }
                    }
                  `}</style>
                  {cartCount}
                </span>
              )}
            </div>
            <button
              type="button"
              className="mobile-toggle"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Icon type={mobileOpen ? 'x' : 'menu'} color={C.dark} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-panel mobile-panel-open">
            {NAV.map((item, index) => {
              const active = isNavActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${active ? 'mobile-nav-link-active' : ''}`.trim()}
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-grid">
          {/* Column 1: Brand + Social */}
          <div className="public-footer-brand-col">
            <span className="public-footer-brand-name">Les Jus Naturels Ben's</span>
            <p className="public-footer-text">
              Élixirs de bien-être artisanaux, nés entre l'Afrique et le Québec — pour nourrir votre corps et éveiller vos sens.
            </p>
            <div className="public-footer-socials">
              <a href={settings.instagram || 'https://instagram.com/lesjusnaturelsbens'} target="_blank" rel="noopener noreferrer" className="public-footer-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" /></svg>
              </a>
              <a href={settings.facebook || 'https://facebook.com/lesjusnaturelsbens'} target="_blank" rel="noopener noreferrer" className="public-footer-social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="public-footer-social-btn public-footer-social-whatsapp" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="public-footer-card">
            <p className="public-footer-title">Navigation</p>
            <Link to={ROUTES.home} className="public-footer-link">Accueil</Link>
            <Link to={ROUTES.products} className="public-footer-link">Nos produits</Link>
            <Link to={ROUTES.about} className="public-footer-link">Notre histoire</Link>
            <Link to={ROUTES.blog} className="public-footer-link">Blogue & Recettes</Link>
            <Link to={ROUTES.events} className="public-footer-link">Événements</Link>
            <Link to={ROUTES.locations} className="public-footer-link">Points de vente</Link>
          </div>

          {/* Column 3: Contact */}
          <div className="public-footer-card">
            <p className="public-footer-title">Contact</p>
            <div className="public-footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#E07A20" className="public-footer-contact-icon"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span className="public-footer-text">{settings.address || 'Montréal, Québec'}</span>
            </div>
            <div className="public-footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#E07A20" className="public-footer-contact-icon"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span className="public-footer-text">{settings.email || 'info@lesjusnaturelsbens.com'}</span>
            </div>
            <div className="public-footer-contact-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#E07A20" className="public-footer-contact-icon"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <span className="public-footer-text">{settings.phone || '(514) 555-0123'}</span>
            </div>
            <Link to={ROUTES.contact} className="public-footer-link" style={{ marginTop: 8 }}>→ Nous écrire</Link>
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #E07A20 30%, #E07A20 70%, transparent)', margin: '0 0 24px', opacity: 0.45 }} />
        
        <div className="public-footer-bottom">
          <p onClick={handleSecretClick} className="public-footer-copyright">
            © {new Date().getFullYear()} Les Jus Naturels Ben's · Artisanal & Naturel · Montréal
          </p>
          {secretClicks > 0 && secretClicks < 5 && (
            <div className="public-footer-secret-track">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`footer-secret-dot ${i <= secretClicks ? 'footer-secret-dot-active' : ''}`.trim()} />
              ))}
            </div>
          )}
        </div>
      </footer>

      <ChatBot />
      <ToastContainer />

    </div>
  );
}
