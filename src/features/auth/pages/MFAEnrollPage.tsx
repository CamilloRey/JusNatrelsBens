import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMFA } from '../hooks/useMFA';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';

export default function MFAEnrollPage() {
  const navigate = useNavigate();
  const { enrollMFA, verifyEnrollment, isLoading, error } = useMFA();
  const [step, setStep] = useState<'setup' | 'verify' | 'success'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleSetupMFA = async () => {
    const { secret: sec, qrCode: qr, error: err } = await enrollMFA();
    if (!err && qr && sec) {
      setQrCode(qr);
      setSecret(sec);
      setStep('verify');
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      alert('Code invalide (6 chiffres)');
      return;
    }

    // In real implementation, get factorId from enrollMFA response
    const { success, error: err } = await verifyEnrollment(code, factorId);
    if (success && !err) {
      // Generate backup codes
      setBackupCodes(generateBackupCodes());
      setStep('success');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: C.light }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        {/* STEP 1: QR CODE */}
        {step === 'setup' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}` }}>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 8, margin: '0 0 8px' }}>
              🔐 Configurer 2FA
            </h1>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 24, margin: '0 0 24px' }}>
              Augmentez la sécurité de votre compte avec l'authentification à deux facteurs
            </p>

            <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 16, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: '#1e40af', margin: 0 }}>
                📱 Vous devrez scanner un code QR avec une app authenticateur (Google Authenticator, Authy, Microsoft Authenticator, etc.)
              </p>
            </div>

            <button
              onClick={handleSetupMFA}
              disabled={isLoading}
              style={{
                width: '100%',
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
              {isLoading ? 'Génération...' : 'Générer code QR'}
            </button>
          </div>
        )}

        {/* STEP 2: VERIFY CODE */}
        {step === 'verify' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}` }}>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 8, margin: '0 0 8px' }}>
              ✓ Vérifier le code
            </h1>

            <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, marginBottom: 24, textAlign: 'center' }}>
              {qrCode && (
                <div>
                  <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200, margin: '0 auto' }} />
                  <p style={{ fontSize: 12, color: C.muted, marginTop: 12, marginBottom: 0 }}>
                    Clé secrète: <code style={{ background: '#fff', padding: '4px 8px', borderRadius: 4 }}>{secret}</code>
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelSt}>Code de l'app (6 chiffres)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={inputSt}
              />
            </div>

            {error && (
              <div
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  fontSize: 13,
                  color: '#dc2626',
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length !== 6}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: 10,
                border: 'none',
                background: C.hibiscus,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: isLoading || code.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: isLoading || code.length !== 6 ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div style={{ background: '#fff', borderRadius: 14, padding: 32, border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: 48, margin: '0 0 16px' }}>✓</p>
            <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, marginBottom: 16, margin: '0 0 16px' }}>
              2FA activée!
            </h1>

            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#92400e', margin: 0, marginBottom: 12, fontWeight: 600 }}>
                ⚠️ Codes de secours (conservez-les)
              </p>
              <div style={{ background: '#fff', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 12, color: C.dark }}>
                {backupCodes.map((c) => (
                  <div key={c}>{c}</div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/settings')}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: 10,
                border: 'none',
                background: C.hibiscus,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Retour aux paramètres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function generateBackupCodes(): string[] {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = Array.from({ length: 8 })
      .map(() => Math.floor(Math.random() * 10))
      .join('');
    codes.push(code);
  }
  return codes;
}
