import { useState, useCallback } from 'react';

/**
 * CAPTCHA Hook
 * Supports hCaptcha (recommended) or reCAPTCHA v3
 */

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

export function useCaptcha() {
  const [captchaToken, setCaptchaToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * Initialize hCaptcha widget
   */
  const initHCaptcha = useCallback(() => {
    if (!HCAPTCHA_SITE_KEY) {
      console.warn('hCaptcha not configured');
      return;
    }

    // Load hCaptcha script
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /**
   * Get hCaptcha response token
   */
  const getHCaptchaToken = useCallback((): string => {
    if (!(window as any).hcaptcha) {
      console.warn('hCaptcha not loaded');
      return '';
    }
    return (window as any).hcaptcha.getResponse();
  }, []);

  /**
   * Verify hCaptcha token on backend
   */
  const verifyHCaptcha = useCallback(async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          type: 'hcaptcha',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCaptchaToken(token);
      }
      return { success: data.success };
    } catch (error) {
      console.error('Captcha verification error:', error);
      return { success: false, error };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  /**
   * Reset hCaptcha widget
   */
  const resetHCaptcha = useCallback(() => {
    if ((window as any).hcaptcha) {
      (window as any).hcaptcha.reset();
      setCaptchaToken('');
    }
  }, []);

  /**
   * Initialize reCAPTCHA v3
   */
  const initRecaptcha = useCallback(() => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA not configured');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /**
   * Get reCAPTCHA v3 token
   */
  const getRecaptchaToken = useCallback(async (action: string = 'submit') => {
    if (!(window as any).grecaptcha) {
      console.warn('reCAPTCHA not loaded');
      return '';
    }

    try {
      const token = await (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return '';
    }
  }, []);

  /**
   * Verify reCAPTCHA token
   */
  const verifyRecaptcha = useCallback(async (token: string, action: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          type: 'recaptcha',
          action,
        }),
      });

      const data = await response.json();
      if (data.success && data.score > 0.5) {
        // Score > 0.5 = likely human
        setCaptchaToken(token);
      }
      return { success: data.success, score: data.score };
    } catch (error) {
      console.error('Captcha verification error:', error);
      return { success: false, error };
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return {
    captchaToken,
    isVerifying,
    // hCaptcha
    initHCaptcha,
    getHCaptchaToken,
    verifyHCaptcha,
    resetHCaptcha,
    // reCAPTCHA
    initRecaptcha,
    getRecaptchaToken,
    verifyRecaptcha,
    // Config
    hcaptchaSiteKey: HCAPTCHA_SITE_KEY,
    recaptchaSiteKey: RECAPTCHA_SITE_KEY,
  };
}
