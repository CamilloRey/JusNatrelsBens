import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface MFAState {
  sessionId: string | null;
  factorId: string | null;
  challengeId: string | null;
  code: string;
}

/**
 * Multi-Factor Authentication Hook
 * Supports TOTP (Time-based One-Time Password)
 */
export function useMFA() {
  const [mfaState, setMfaState] = useState<MFAState>({
    sessionId: null,
    factorId: null,
    challengeId: null,
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Enroll user in MFA
   * Generates QR code for authenticator app
   */
  const enrollMFA = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: mfaError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (mfaError) {
        setError(mfaError.message);
        return { error: mfaError };
      }

      // Return QR code URL for user to scan
      return {
        secret: data?.totp?.secret,
        qrCode: data?.totp?.qr_code,
      };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify MFA enrollment with code from authenticator
   */
  const verifyEnrollment = async (code: string, factorId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: mfaError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

      if (mfaError) {
        setError(mfaError.message);
        return { error: mfaError };
      }

      return { success: true, session: data.session };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get MFA factors for current user
   */
  const getMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return { error };
      return { factors: data?.factors || [] };
    } catch (err) {
      return { error: err };
    }
  };

  /**
   * Disable/Unenroll from MFA
   */
  const disableMFA = async (factorId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { error: mfaError } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (mfaError) {
        setError(mfaError.message);
        return { error: mfaError };
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Challenge MFA during login
   */
  const challengeMFA = async (factorId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: mfaError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (mfaError) {
        setError(mfaError.message);
        return { error: mfaError };
      }

      setMfaState((prev) => ({
        ...prev,
        challengeId: data.challenge.id,
        factorId,
      }));

      return { challengeId: data.challenge.id };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify MFA challenge during login
   */
  const verifyChallengeCode = async (code: string) => {
    if (!mfaState.challengeId || !mfaState.factorId) {
      setError('Invalid challenge state');
      return { error: 'Invalid challenge state' };
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: mfaError } = await supabase.auth.mfa.verify({
        factorId: mfaState.factorId,
        challengeId: mfaState.challengeId,
        code,
      });

      if (mfaError) {
        setError(mfaError.message);
        return { error: mfaError };
      }

      return { success: true, session: data.session };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enrollMFA,
    verifyEnrollment,
    getMFAFactors,
    disableMFA,
    challengeMFA,
    verifyChallengeCode,
    isLoading,
    error,
    mfaState,
  };
}
