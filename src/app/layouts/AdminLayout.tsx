import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { Icon } from '@/shared/ui/Icon';
import { ROUTES } from '@/shared/constants/routes';

const MENU = [
  { route: ROUTES.admin.dashboard, label: 'Tableau de bord', icon: 'chart' },
  { route: ROUTES.admin.messages, label: 'Messages', icon: 'mail' },
  { route: ROUTES.admin.products, label: 'Catalogue', icon: 'grid' },
  { route: ROUTES.admin.ingredients, label: 'Ingredients', icon: 'shop' },
  { route: ROUTES.admin.blog, label: 'Blogue', icon: 'edit' },
  { route: ROUTES.admin.events, label: 'Evenements', icon: 'map' },
  { route: ROUTES.admin.reviews, label: 'Avis clients', icon: 'star' },
  { route: ROUTES.admin.locations, label: 'Points de vente', icon: 'map' },
  { route: ROUTES.admin.stock, label: 'Stock', icon: 'grid' },
  { route: ROUTES.admin.finance, label: 'Finances', icon: 'chart' },
  { route: ROUTES.admin.reports, label: 'Rapports', icon: 'download' },
  { route: ROUTES.admin.subscribers, label: 'Infolettres', icon: 'send' },
  { route: ROUTES.admin.settings, label: 'Gestion Admin', icon: 'settings' },
  { route: ROUTES.admin.data, label: 'Donnees', icon: 'download' },
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
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', minHeight: '100vh', background: '#f5f0ea' }}>
      <aside style={{ width: sidebarOpen ? 240 : 0, background: C.dark, overflow: 'hidden', transition: 'width 0.3s', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', minWidth: 240 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <Icon type="shield" size={22} color="#f0e6d3" />
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#f0e6d3', margin: 0 }}>Ben's Admin</p>
              <p style={{ fontSize: 11, color: '#6b5e52', margin: 0 }}>Panneau de gestion</p>
            </div>
          </div>

          {MENU.map((menuItem) => (
            <NavLink
              key={menuItem.route}
              to={menuItem.route}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '11px 14px',
                border: 'none',
                borderRadius: 10,
                background: isActive ? 'rgba(196,69,54,0.2)' : 'transparent',
                color: isActive ? '#f0e6d3' : '#8a7968',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                marginBottom: 4,
                textAlign: 'left',
                textDecoration: 'none',
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon type={menuItem.icon} size={18} color={isActive ? C.red : '#6b5e52'} />
                  {menuItem.label}
                  {menuItem.route === ROUTES.admin.messages && unreadCount > 0 && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        background: '#dc2626',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 24, paddingTop: 20 }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '11px 14px',
                border: 'none',
                borderRadius: 10,
                background: 'transparent',
                color: '#6b5e52',
                cursor: 'pointer',
                fontSize: 14,
                textAlign: 'left',
              }}
            >
              <Icon type="back" size={18} color="#6b5e52" /> Retour au site
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <header style={{ padding: '16px 28px', background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen((open) => !open)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Icon type="menu" color={C.dark} />
            </button>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.dark, margin: 0 }}>
              Administration
            </h1>
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>Bienvenue, Admin</div>
        </header>

        <div style={{ padding: 28 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
