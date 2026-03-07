/** Formate une date ISO en français : "15 janvier 2025" */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-CA', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return iso;
  }
}

/** Formate un nombre en devise (CAD par défaut). */
export function formatCurrency(amount: number, currency = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency }).format(amount);
}

/** Retourne les initiales d'un nom (max 2 lettres). */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Tronque un texte à `max` caractères avec "…". */
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}
