import { useState, useEffect } from 'react';
import { C } from '@/shared/constants/colors';
import { CSS, inputSt, labelSt } from '@/shared/constants/styles';
import { Icon } from '@/shared/ui/Icon';
import type { SquareSettings } from '../types/payment.types';

export default function AdminSquareSettingsPage() {
  const [settings, setSettings] = useState<SquareSettings>({
    id: '1',
    squareApplicationId: '',
    squareAccessToken: '',
    squareLocationId: '',
    isConnected: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load settings on mount (from localStorage for demo)
  useEffect(() => {
    const saved = localStorage.getItem('squareSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In production, this would POST to your backend
      localStorage.setItem('squareSettings', JSON.stringify(settings));
      setTestResult({ success: true, message: 'Paramètres sauvegardés avec succès!' });
    } catch (error) {
      setTestResult({ success: false, message: 'Erreur lors de la sauvegarde' });
    }
    setIsSaving(false);
  };

  const handleTest = async () => {
    setTestResult(null);
    try {
      // Test connection to Square API
      const response = await fetch('/api/square/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: settings.squareApplicationId,
          locationId: settings.squareLocationId,
        }),
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: '✓ Connexion à Square réussie!',
        });
        setSettings((s) => ({ ...s, isConnected: true, connectedAt: new Date().toISOString() }));
      } else {
        setTestResult({
          success: false,
          message: 'Erreur: Vérifiez vos identifiants Square',
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Erreur de connexion: ${String(error)}`,
      });
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 32 }}>💳</span>
          <h1 style={{ ...CSS.heading, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Configuration Square
          </h1>
        </div>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
          Connectez votre compte Square pour accepter les paiements en ligne et en personne
        </p>
      </div>

      {/* STATUS CARD */}
      <div
        style={{
          background: settings.isConnected ? '#dcfce7' : '#fef3c7',
          border: `2px solid ${settings.isConnected ? '#86efac' : '#fcd34d'}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{settings.isConnected ? '✓' : '⚠️'}</span>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: settings.isConnected ? '#166534' : '#92400e',
                margin: 0,
              }}
            >
              {settings.isConnected ? 'Connecté à Square' : 'Non connecté'}
            </p>
            {settings.connectedAt && (
              <p style={{ fontSize: 12, color: 'inherit', margin: '2px 0 0' }}>
                Connecté le {new Date(settings.connectedAt).toLocaleString('fr-CA')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* TEST RESULT */}
      {testResult && (
        <div
          style={{
            background: testResult.success ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${testResult.success ? '#86efac' : '#fca5a5'}`,
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
            fontSize: 13,
            color: testResult.success ? '#166534' : '#dc2626',
          }}
        >
          {testResult.message}
        </div>
      )}

      {/* SETTINGS FORM */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          padding: 24,
          border: `1px solid ${C.border}`,
          marginBottom: 24,
        }}
      >
        <h2 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, marginBottom: 20, margin: '0 0 20px 0' }}>
          Identifiants Square
        </h2>

        {/* Application ID */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelSt}>Application ID *</label>
          <input
            type="text"
            value={settings.squareApplicationId}
            onChange={(e) =>
              setSettings((s) => ({ ...s, squareApplicationId: e.target.value }))
            }
            placeholder="Ex: sq0abc123..."
            style={inputSt}
          />
          <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>
            Trouvez-le dans vos paramètres Square Developers
          </p>
        </div>

        {/* Access Token */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelSt}>Access Token *</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type={showToken ? 'text' : 'password'}
              value={settings.squareAccessToken}
              onChange={(e) =>
                setSettings((s) => ({ ...s, squareAccessToken: e.target.value }))
              }
              placeholder="Votre token d'accès Square"
              style={{ ...inputSt, flex: 1 }}
            />
            <button
              onClick={() => setShowToken(!showToken)}
              style={{
                background: C.light,
                border: 'none',
                borderRadius: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                color: C.muted,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {showToken ? '👁‍🗨' : '👁'}
            </button>
          </div>
          <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>
            ⚠️ Ne partagez pas ce token! Gardez-le sécurisé
          </p>
        </div>

        {/* Location ID */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelSt}>Location ID *</label>
          <input
            type="text"
            value={settings.squareLocationId}
            onChange={(e) =>
              setSettings((s) => ({ ...s, squareLocationId: e.target.value }))
            }
            placeholder="Ex: L123ABC..."
            style={inputSt}
          />
          <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>
            L'identifiant de votre point de vente Square
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleTest}
            disabled={isSaving || !settings.squareApplicationId || !settings.squareLocationId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: '#fff',
              color: C.dark,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              opacity:
                !settings.squareApplicationId || !settings.squareLocationId ? 0.5 : 1,
            }}
          >
            <Icon type="refresh" size={16} color={C.dark} /> Tester la connexion
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 10,
              border: 'none',
              background: C.hibiscus,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            <Icon type="check" size={16} color="#fff" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* FEATURES CARD */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          padding: 24,
          border: `1px solid ${C.border}`,
        }}
      >
        <h2 style={{ ...CSS.heading, fontSize: 18, fontWeight: 700, marginBottom: 16, margin: '0 0 16px 0' }}>
          Fonctionnalités Square
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              icon: '💳',
              title: 'Paiements par carte',
              desc: 'Acceptez les cartes de crédit et de débit',
            },
            {
              icon: '📱',
              title: 'Portefeuille numérique',
              desc: 'Apple Pay, Google Pay, et autres',
            },
            {
              icon: '📊',
              title: 'Rapports en temps réel',
              desc: 'Suivez toutes vos transactions',
            },
            {
              icon: '🔒',
              title: 'Paiements sécurisés',
              desc: 'Norme PCI DSS et chiffrement SSL',
            },
            {
              icon: '🧾',
              title: 'Reçus automatiques',
              desc: 'Envoyez des reçus par email',
            },
            {
              icon: '💰',
              title: 'Remboursements',
              desc: 'Traitez les remboursements facilement',
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                background: C.light,
                borderRadius: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>{feature.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, margin: 0 }}>
                  {feature.title}
                </p>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* HELP LINK */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: '#f0f9ff',
            borderRadius: 10,
            border: '1px solid #bfdbfe',
          }}
        >
          <p style={{ fontSize: 13, color: '#1e40af', margin: 0 }}>
            📖 <strong>Besoin d'aide?</strong> Consultez la{' '}
            <a
              href="https://developer.squareup.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              documentation Square
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
