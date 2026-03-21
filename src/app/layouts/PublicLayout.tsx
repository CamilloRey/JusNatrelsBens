import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';
import { ChatBot } from '@/shared/components/ChatBot';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ROUTES } from '@/shared/constants/routes';
import { useData } from '@/app/providers/DataContext';

const WHATSAPP_PHONE = '15145550123';
const WHATSAPP_TEXT =
  "Bonjour Ben's, je voudrais des informations sur vos jus naturels.";

/*
  'Marché Jean-Talon',
  'Épicerie Afro-Antillaise',
  'Marché Atwater',
*/

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const { settings } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretTimer, setSecretTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const ingredientLabel = useMemo(
    () =>
      t('nav.ingredients', {
        defaultValue: i18n.language?.startsWith('en') ? 'Ingredients' : 'Ingredients',
      }),
    [i18n.language, t]
  );

  const NAV = [
    { path: ROUTES.home, label: t('nav.home') },
    { path: ROUTES.about, label: t('nav.about') },
    { path: ROUTES.products, label: t('nav.products') },
    { path: ROUTES.ingredients, label: ingredientLabel },
    { path: ROUTES.recipes, label: t('nav.recipes', 'Recettes') },
    { path: ROUTES.blog, label: t('nav.blog') },
    { path: ROUTES.events, label: t('nav.events') },
    { path: ROUTES.locations, label: t('nav.locations') },
    { path: ROUTES.contact, label: t('nav.contact') },
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
            <img src="/images-bens/logos/logo-principal.png" alt="Ben's" />
            <span className="public-brand-text">Les Jus Naturels Ben’s</span>
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
          <div className="public-footer-brand-col">
            <img
              src="/images-bens/logos/logo-noir-transparent.png"
              alt="Ben's"
              className="public-footer-logo"
            />
            <p className="public-footer-text">
              Des jus naturels et exotiques faits maison pour la santé, la saveur et l’authenticité.
            </p>

          </div>

          <div className="public-footer-card">
            <p className="public-footer-title">{t('footer.nav')}</p>
            {NAV.map((item) => (
              <Link key={item.path} to={item.path} className="public-footer-link">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="public-footer-card">
            <p className="public-footer-title">Contact</p>
            <p className="public-footer-text">{settings.email || 'info@lesjusnaturelsbens.com'}</p>
            <p className="public-footer-text public-footer-contact-item">{settings.phone || '(514) 555-0123'}</p>
            <p className="public-footer-text public-footer-contact-item">
              {settings.address || 'Montréal, Québec'}
            </p>
          </div>
        </div>

        <div className="public-footer-bottom">
          <div className="public-footer-socials">
            <a
              href={settings.instagram || 'https://instagram.com/lesjusnaturelsbens'}
              target="_blank"
              rel="noopener noreferrer"
              className="public-footer-social-btn"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
              </svg>
            </a>
            <a
              href={settings.facebook || 'https://facebook.com/lesjusnaturelsbens'}
              target="_blank"
              rel="noopener noreferrer"
              className="public-footer-social-btn"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>

          <p
            onClick={handleSecretClick}
            className="public-footer-copyright"
          >
            © 2025 Les Jus Naturels Ben’s. Tous droits réservés.
          </p>

          {secretClicks > 0 && secretClicks < 5 && (
            <div className="public-footer-secret-track">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`footer-secret-dot ${i <= secretClicks ? 'footer-secret-dot-active' : ''}`.trim()}
                />
              ))}
            </div>
          )}
        </div>
      </footer>

      <ChatBot />

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Contact us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
