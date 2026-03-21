import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';
import { ROUTES } from '@/shared/constants/routes';

const SECTIONS = [
  {
    title: 'General',
    items: [
      { route: ROUTES.admin.dashboard, label: 'Tableau de bord', icon: 'chart' },
      { route: '/admin/business', label: 'Business', icon: 'chart' },
      { route: ROUTES.admin.messages, label: 'Messages', icon: 'mail' },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { route: ROUTES.admin.products, label: 'Produits', icon: 'grid' },
      { route: ROUTES.admin.ingredients, label: 'Ingredients', icon: 'shop' },
      { route: '/admin/recipes', label: 'Recettes', icon: 'grid' },
      { route: ROUTES.admin.blog, label: 'Blogue', icon: 'edit' },
    ],
  },
  {
    title: 'Evenements & Clients',
    items: [
      { route: ROUTES.admin.events, label: 'Evenements', icon: 'calendar' },
      { route: ROUTES.admin.reviews, label: 'Avis clients', icon: 'star' },
      { route: ROUTES.admin.locations, label: 'Points de vente', icon: 'map' },
    ],
  },
  {
    title: 'Commerce',
    items: [
      { route: ROUTES.admin.stock, label: 'Stock', icon: 'grid' },
      { route: ROUTES.admin.finance, label: 'Finances', icon: 'chart' },
      { route: '/admin/orders', label: 'Commandes', icon: 'download' },
      { route: '/admin/payments', label: 'Paiements', icon: 'chart' },
    ],
  },
  {
    title: 'Systeme',
    items: [
      { route: ROUTES.admin.reports, label: 'Rapports', icon: 'download' },
      { route: ROUTES.admin.subscribers, label: 'Infolettre', icon: 'send' },
      { route: '/admin/square', label: 'Config. Square', icon: 'settings' },
      { route: ROUTES.admin.settings, label: 'Administration', icon: 'settings' },
      { route: ROUTES.admin.data, label: 'Donnees', icon: 'download' },
    ],
  },
] as const;

export default function AdminLayout() {
  const { logout } = useAuth();
  const { messages } = useData();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const unreadCount = messages.filter((message) => !message.read).length;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', minHeight: '100vh', background: '#f8f6f3' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 250 : 0,
        background: `linear-gradient(180deg, ${C.dark} 0%, #2c1f18 100%)`,
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
      }}>
        <div style={{ padding: '24px 18px', minWidth: 250 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '0 4px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.hibiscus}, ${C.gold})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon type="shield" size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: '#f0e6d3', margin: 0 }}>Ben's Admin</p>
              <p style={{ fontSize: 10, color: '#6b5e52', margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Gestion</p>
            </div>
          </div>

          {/* Navigation sections */}
          {SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: '#6b5e52',
                textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '0 8px', margin: '0 0 6px',
              }}>
                {section.title}
              </p>
              {section.items.map((menuItem) => (
                <NavLink
                  key={menuItem.route}
                  to={menuItem.route}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '9px 12px',
                    border: 'none',
                    borderRadius: 8,
                    background: isActive ? `${C.hibiscus}30` : 'transparent',
                    color: isActive ? '#f0e6d3' : '#8a7968',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    marginBottom: 2,
                    textAlign: 'left' as const,
                    textDecoration: 'none',
                    position: 'relative' as const,
                    transition: 'all 0.15s',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div style={{
                          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                          width: 3, height: 18, borderRadius: 2, background: C.gold,
                        }} />
                      )}
                      <Icon type={menuItem.icon} size={16} color={isActive ? C.gold : '#6b5e52'} />
                      {menuItem.label}
                      {menuItem.route === ROUTES.admin.messages && unreadCount > 0 && (
                        <span style={{
                          marginLeft: 'auto', minWidth: 18, height: 18, borderRadius: 9,
                          background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Footer actions */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 12, paddingTop: 16 }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 12px', border: 'none',
                borderRadius: 8, background: 'transparent', color: '#6b5e52',
                cursor: 'pointer', fontSize: 13, textAlign: 'left',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0e6d3'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b5e52'; }}
            >
              <Icon type="back" size={16} color="#6b5e52" /> Retour au site
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{
          padding: '14px 28px',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(open => !open)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
              <Icon type="menu" color={C.dark} />
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.dark, margin: 0, letterSpacing: '-0.02em' }}>
              Administration
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.hibiscus}, ${C.gold})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700,
            }}>
              B
            </div>
          </div>
        </header>

        <div style={{ padding: 28 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
