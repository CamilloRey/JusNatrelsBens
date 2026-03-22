import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';

export default function SupabaseForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Veuillez entrer votre adresse e-mail');
      return;
    }

    setIsLoading(true);

    const { error: authError } = await resetPassword(email);
    if (authError) {
      setError(authError.message || 'Erreur lors de la demande de réinitialisation');
    } else {
      setSuccess(true);
      setEmail('');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: C.light }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              Réinitialiser le mot de passe
            </h1>
            <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
              Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
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
              ✓ Un lien de réinitialisation a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelSt}>Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={isLoading || success}
                style={inputSt}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                border: 'none',
                background: C.hibiscus,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: isLoading || success ? 'not-allowed' : 'pointer',
                opacity: isLoading || success ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <Link
              to="/auth/login"
              style={{
                fontSize: 13,
                color: C.hibiscus,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
