import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';

export default function SupabaseLoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } = await login(email, password);
    if (authError) {
      setError(authError.message || 'Erreur de connexion');
    } else {
      navigate('/admin/dashboard');
    }
    setIsLoading(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 20px' }}>Chargement...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: C.light }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              Connexion Admin
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
              Accédez au tableau de bord
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                padding: 12,
                marginBottom: 20,
                fontSize: 13,
                color: '#dc2626',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelSt}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                style={inputSt}
              />
            </div>

            <div>
              <label style={labelSt}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                style={inputSt}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                border: 'none',
                background: C.hibiscus,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link
                to="/auth/forgot-password"
                style={{
                  fontSize: 12,
                  color: C.hibiscus,
                  textDecoration: 'none',
                }}
              >
                Mot de passe oublié?
              </Link>
            </div>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, marginBottom: 8 }}>
              Première connexion?
            </p>
            <Link
              to="/auth/signup"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.hibiscus,
                textDecoration: 'none',
              }}
            >
              Créer un compte admin
            </Link>
          </div>
        </div>

        <div
          style={{
            background: '#f0f9ff',
            borderRadius: 10,
            padding: 16,
            marginTop: 20,
            fontSize: 12,
            color: '#1e40af',
          }}
        >
          🔐 <strong>Sécurisé par Supabase Auth</strong>
          <br />
          Vos données sont chiffrées et protégées.
        </div>
      </div>
    </div>
  );
}
