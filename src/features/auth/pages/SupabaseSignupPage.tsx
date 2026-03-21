import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { Honeypot, useHoneypot } from '@/components/Honeypot';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';

export default function SupabaseSignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useSupabaseAuth();
  const { validateHoneypot } = useHoneypot();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Check honeypot (bot detection)
    const formData = new FormData(e.currentTarget);
    const { isSpam } = validateHoneypot(formData);
    if (isSpam) {
      // Silently fail for bots - don't tell them they were caught
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    const { error: authError } = await signup(email, password, fullName);

    if (authError) {
      setError(authError.message || 'Erreur lors de la création du compte');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    }
    setIsLoading(false);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px 20px' }}>Chargement...</div>;
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <p style={{ fontSize: 48, margin: '0 0 16px' }}>✓</p>
          <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Compte créé!
          </h1>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
            Vérifiez votre email pour confirmer votre compte.
          </p>
          <p style={{ fontSize: 12, color: C.muted }}>
            Redirection vers la connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: C.light }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              Créer un compte
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
              Accès administrateur
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

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Honeypot fields (hidden from humans, visible to bots) */}
            <Honeypot />

            <div>
              <label style={labelSt}>Nom complet</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                style={inputSt}
              />
            </div>

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
                placeholder="Min. 6 caractères"
              />
            </div>

            <div>
              <label style={labelSt}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, marginBottom: 8 }}>
              Vous avez déjà un compte?
            </p>
            <Link
              to="/auth/login"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.hibiscus,
                textDecoration: 'none',
              }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
