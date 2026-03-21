/**
 * Honeypot Component
 * Hidden fields to catch bot submissions
 * Robots fill these, humans don't see them
 */

export function Honeypot() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden',
      }}
    >
      {/* These are hidden from humans but visible to bots */}
      <input
        type="text"
        name="website"
        placeholder="Your website"
        tabIndex={-1}
        autoComplete="off"
      />
      <input
        type="text"
        name="phone_number"
        placeholder="Phone number"
        tabIndex={-1}
        autoComplete="off"
      />
      <input
        type="checkbox"
        name="subscribe_newsletter"
        tabIndex={-1}
      />
    </div>
  );
}

/**
 * Validate honeypot fields
 * Returns true if spam (honeypot filled)
 */
export function isHoneypotFilled(formData: FormData): boolean {
  const website = formData.get('website') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const subscribeNewsletter = formData.get('subscribe_newsletter') as string;

  // If any honeypot field is filled → spam
  return !!(website || phoneNumber || subscribeNewsletter);
}

/**
 * Hook to validate honeypot
 */
export function useHoneypot() {
  const validateHoneypot = (formData: FormData): { isSpam: boolean } => {
    const isSpam = isHoneypotFilled(formData);

    if (isSpam) {
      console.warn('⚠️ Honeypot triggered - bot detected');
      // Log to monitoring
      // await monitoring.logSecurity('bot_honeypot_triggered', null, 'warning');
    }

    return { isSpam };
  };

  return { validateHoneypot };
}
