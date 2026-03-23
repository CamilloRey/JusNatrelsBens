import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '@/lib/supabase-auth';

const COLORS = {
  primary: '#032416',
  primaryContainer: '#1a3a2a',
  secondary: '#7b5804',
  surface: '#fef9ef',
  surfaceContainer: '#f2ede3',
  onSurface: '#1d1c16',
  onSurfaceVariant: '#424843',
};

const FONT_HEADLINE = "'Noto Serif', serif";
const FONT_BODY = "'Plus Jakarta Sans', sans-serif";

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={COLORS.onSurfaceVariant}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={COLORS.onSurfaceVariant}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LeafIcon({ size = 24, color = COLORS.primary }: { size?: number; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2a7 7 0 0 0-6.95 7.93L9 15s.5-5.5 8-7z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Email et mot de passe requis');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Veuillez entrer un email valide');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn({ email, password });

      if (!result.success) {
        const errorMessage =
          result.error instanceof Error ? result.error.message : String(result.error);
        setError(errorMessage || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate('/account');
      }, 500);
    } catch (err) {
      setError('Erreur inattendue. Veuillez réessayer.');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT_BODY,
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 1rem',
      }}
    >
      {/* Decorative background: top-left botanical leaf */}
      <div
        style={{
          position: 'fixed',
          top: '-80px',
          left: '-80px',
          opacity: 0.10,
          transform: 'rotate(-30deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <LeafIcon size={320} color={COLORS.primary} />
      </div>

      {/* Decorative background: bottom-right fruit pattern */}
      <div
        style={{
          position: 'fixed',
          bottom: '-100px',
          right: '-100px',
          opacity: 0.05,
          transform: 'rotate(20deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <LeafIcon size={400} color={COLORS.secondary} />
      </div>

      {/* Grain overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '28rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span
            style={{
              fontFamily: FONT_HEADLINE,
              fontStyle: 'italic',
              fontWeight: 700,
              fontSize: '1.875rem',
              color: COLORS.primary,
              letterSpacing: '-0.01em',
            }}
          >
            {"Les Jus Naturels Ben\u2019s"}
          </span>
        </div>

        {/* Login card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '2.5rem',
            padding: '2.5rem 3.5rem',
            boxShadow: '0 20px 60px rgba(3,36,22,0.12), 0 4px 16px rgba(3,36,22,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative eco leaf top-right inside card */}
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              right: '-24px',
              opacity: 0.05,
              pointerEvents: 'none',
            }}
          >
            <LeafIcon size={120} color={COLORS.primary} />
          </div>

          {/* Card heading */}
          <h1
            style={{
              fontFamily: FONT_HEADLINE,
              fontSize: '1.875rem',
              fontWeight: 700,
              color: COLORS.primary,
              textAlign: 'center',
              marginTop: 0,
              marginBottom: '0.5rem',
            }}
          >
            Connexion
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: COLORS.onSurfaceVariant,
              textAlign: 'center',
              marginTop: 0,
              marginBottom: '2.5rem',
            }}
          >
            {"Entrez dans l\u2019atelier des saveurs naturelles"}
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email field */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: COLORS.onSurface,
                  marginBottom: '0.375rem',
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <MailIcon />
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  disabled={loading}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: COLORS.surfaceContainer,
                    border: '1.5px solid transparent',
                    borderRadius: '0.75rem',
                    padding: '1rem 1rem 1rem 2.75rem',
                    fontSize: '0.9375rem',
                    color: COLORS.onSurface,
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: FONT_BODY,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primaryContainer;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.primaryContainer}22`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.375rem',
                }}
              >
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.onSurface,
                  }}
                >
                  Mot de passe
                </label>
                <Link
                  to="/auth/forgot-password"
                  style={{
                    fontSize: '0.8125rem',
                    color: COLORS.secondary,
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {"Mot de passe oublié\u00a0?"}
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                  disabled={loading}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    background: COLORS.surfaceContainer,
                    border: '1.5px solid transparent',
                    borderRadius: '0.75rem',
                    padding: '1rem 1rem 1rem 2.75rem',
                    fontSize: '0.9375rem',
                    color: COLORS.onSurface,
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: FONT_BODY,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = COLORS.primaryContainer;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.primaryContainer}22`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? COLORS.onSurfaceVariant : COLORS.primaryContainer,
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: FONT_BODY,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '1.5rem',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 16px rgba(26,58,42,0.25)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,58,42,0.35)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,58,42,0.25)';
              }}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Sign-up link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <span
              style={{
                fontSize: '0.9rem',
                color: COLORS.onSurfaceVariant,
              }}
            >
              {"Nouveau dans l\u2019Atelier\u00a0? "}
            </span>
            <Link
              to="/auth/signup"
              style={{
                fontSize: '0.9rem',
                color: COLORS.primary,
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: `1.5px solid ${COLORS.primary}`,
                paddingBottom: '1px',
              }}
            >
              {"Créer un compte \u2192"}
            </Link>
          </div>
        </div>

        {/* Below-card decorative divider */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <LeafIcon size={16} color={COLORS.primary} />
          <span
            style={{
              fontSize: '0.8125rem',
              color: COLORS.onSurfaceVariant,
              letterSpacing: '0.08em',
              fontStyle: 'italic',
            }}
          >
            {"\u2014 Artisanal \u0026 Pur \u2014"}
          </span>
          <LeafIcon size={16} color={COLORS.primary} />
          <LeafIcon size={16} color={COLORS.primary} />
        </div>

      </div>
    </div>
  );
}
