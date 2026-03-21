import { useState, useCallback } from 'react';
import { RateLimiter } from '@/middleware/securityHeaders';

const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 min
const signupLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

export function useRateLimit() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const checkLoginLimit = useCallback((email: string) => {
    const key = `login_${email}`;
    const allowed = loginLimiter.isAllowed(key);

    if (!allowed) {
      setIsRateLimited(true);
      // Show countdown
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRateLimited(false);
            loginLimiter.reset(key);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setRemainingTime(15 * 60); // 15 minutes
      return false;
    }

    return true;
  }, []);

  const checkSignupLimit = useCallback((email: string) => {
    const key = `signup_${email}`;
    const allowed = signupLimiter.isAllowed(key);

    if (!allowed) {
      setIsRateLimited(true);
      setRemainingTime(60 * 60); // 1 hour
      return false;
    }

    return true;
  }, []);

  const checkCheckoutLimit = useCallback((email: string) => {
    // Max 10 checkout attempts per hour per email
    const key = `checkout_${email}`;
    const limiter = new RateLimiter(10, 60 * 60 * 1000);
    return limiter.isAllowed(key);
  }, []);

  return {
    isRateLimited,
    remainingTime,
    checkLoginLimit,
    checkSignupLimit,
    checkCheckoutLimit,
  };
}
