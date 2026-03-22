import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';

export default function SupabaseResetPasswordPage() {
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no session (not coming from reset email)
  useEffect(() => {
    if (session && session.user?.recovery_sent_at) {
      // Valid recovery session
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await (window as any).supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message || 'Erreur lors de la réinitialisation du mot de passe');
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: C.light }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              Nouveau mot de passe
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
              Entrez votre nouveau mot de passe
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

          {success && (
            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: 10,
                padding: 12,
                marginBottom: 20,
                fontSize: 13,
                color: '#16a34a',
              }}
            >
              ✓ Mot de passe réinitialisé avec succès! Redirection...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelSt}>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  required
                  disabled={isLoading}
                  style={inputSt}
                />
              </div>

              <div>
                <label style={labelSt}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
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
                {isLoading ? 'Mise à jour...' : 'Réinitialiser'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
