import {
  validateEmail,
  validatePassword,
  validatePostalCode,
  validatePhone,
  sanitizeInput,
} from '@/middleware/securityHeaders';

export function useSecurityValidation() {
  const validateLoginForm = (email: string, password: string) => {
    const errors: { email?: string; password?: string } = {};

    if (!validateEmail(email)) {
      errors.email = 'Email invalide';
    }

    if (!password || password.length < 6) {
      errors.password = 'Mot de passe invalide';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateSignupForm = (email: string, password: string, fullName: string) => {
    const errors: { email?: string; password?: string; fullName?: string } = {};

    if (!validateEmail(email)) {
      errors.email = 'Email invalide';
    }

    if (!validatePassword(password)) {
      errors.password = 'Mot de passe: min 8 chars, 1 majuscule, 1 chiffre';
    }

    if (!fullName || fullName.trim().length < 2) {
      errors.fullName = 'Nom complet requis';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateCheckoutForm = (data: {
    email: string;
    name: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    phone?: string;
  }) => {
    const errors: Record<string, string> = {};

    if (!validateEmail(data.email)) {
      errors.email = 'Email invalide';
    }

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Nom requis';
    }

    if (!data.street || data.street.trim().length < 5) {
      errors.street = 'Adresse requise';
    }

    if (!data.city || data.city.trim().length < 2) {
      errors.city = 'Ville requise';
    }

    if (!data.province || data.province.trim().length < 2) {
      errors.province = 'Province requise';
    }

    if (!validatePostalCode(data.postalCode)) {
      errors.postalCode = 'Code postal invalide (ex: H1A 0A1)';
    }

    if (data.phone && !validatePhone(data.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const sanitizeCheckoutData = (data: any) => {
    return {
      email: data.email.toLowerCase().trim(),
      name: sanitizeInput(data.name),
      street: sanitizeInput(data.street),
      city: sanitizeInput(data.city),
      province: sanitizeInput(data.province),
      postalCode: sanitizeInput(data.postalCode.toUpperCase()),
      phone: data.phone ? sanitizeInput(data.phone) : '',
      country: 'Canada',
    };
  };

  return {
    validateLoginForm,
    validateSignupForm,
    validateCheckoutForm,
    sanitizeCheckoutData,
  };
}
