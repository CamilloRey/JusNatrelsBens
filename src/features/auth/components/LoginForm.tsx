import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import { useData } from '@/app/providers/DataContext';
import { C } from '@/shared/constants/colors';
import { ROUTES } from '@/shared/constants/routes';
import { Icon } from '@/shared/ui/Icon';

export function LoginForm() {
  const { login } = useAuth();
  const { settings, logActivity } = useData();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(false);

  const handleSubmit = () => {
    const ok = login(password, settings.password);
    if (ok) {
      logActivity('Connexion', 'Connexion au panneau admin', 'auth');
      navigate(ROUTES.admin.dashboard);
    } else {
      setError(true);
      logActivity('Tentative échouée', 'Tentative de connexion avec mauvais mot de passe', 'auth');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: `linear-gradient(135deg, ${C.dark} 0%, #2d1117 100%)` }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '48px 40px', maxWidth: 380, width: '90%', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#f0e6d3', fontSize: 24, margin: '0 0 8px' }}>Panneau Admin</h2>
        <p style={{ color: '#8a7968', fontSize: 14, marginBottom: 24 }}>Les Jus Naturels Ben's</p>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>Mot de passe incorrect.</p>
          </div>
        )}

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: error ? '1px solid rgba(220,38,38,0.5)' : '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#f0e6d3', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
        />
        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: C.red, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          <Icon type="lock" size={16} color="#fff" /> Connexion
        </button>

        <button
          onClick={() => navigate(ROUTES.home)}
          style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', marginTop: 16, fontSize: 13 }}
        >
          ← Retour au site
        </button>
        <p style={{ color: '#6b5e52', fontSize: 12, marginTop: 8 }}>Accès réservé à l'administratrice</p>
      </div>
    </div>
  );
}
