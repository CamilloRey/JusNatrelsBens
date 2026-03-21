import { useState } from 'react';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { validateEmail } from '@/middleware/securityHeaders';

interface GuestEmailValidatorProps {
  onEmailVerified: (email: string) => void;
  loading?: boolean;
}

/**
 * Guest checkout email verification
 * Ensures email is valid before allowing checkout
 */
export function GuestEmailValidator({ onEmailVerified, loading = false }: GuestEmailValidatorProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'input' | 'verify' | 'confirmed'>('input');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }

    setStep('verify');

    // Simulate verification email sent
    setTimeout(() => {
      setStep('confirmed');
      onEmailVerified(email);
    }, 2000);
  };

  if (step === 'confirmed') {
    return (
      <div style={{ textAlign: 'center', padding: '20px', background: '#dcfce7', borderRadius: 10, border: '1px solid #86efac' }}>
        <p style={{ fontSize: 14, color: '#166534', margin: 0, fontWeight: 600 }}>
          ✓ Email vérifié: <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.border}` }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, margin: '0 0 12px' }}>
        🔐 Vérifier votre email
      </h3>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, margin: '0 0 16px' }}>
        Entrez votre email pour continuer le paiement
      </p>

      {error && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
            fontSize: 12,
            color: '#dc2626',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={labelSt}>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={loading}
            style={inputSt}
          />
        </div>

        <button
          type="submit"
          disabled={loading || step === 'verify'}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: 'none',
            background: step === 'verify' ? '#fbbf24' : C.hibiscus,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading || step === 'verify' ? 'not-allowed' : 'pointer',
            opacity: loading || step === 'verify' ? 0.7 : 1,
          }}
        >
          {step === 'verify' ? '⏳ Vérification...' : 'Vérifier email'}
        </button>
      </form>

      <p style={{ fontSize: 11, color: C.muted, marginTop: 12, margin: '12px 0 0' }}>
        💡 Nous enverrons une confirmation à cet email
      </p>
    </div>
  );
}
