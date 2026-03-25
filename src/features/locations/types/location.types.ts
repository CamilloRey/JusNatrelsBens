export interface Location {
  id:           string;
  name:         string;
  address:      string;
  type:         string;
  active:       boolean;
  region?:      'Montreal' | 'Rive Sud' | 'Rive Nord';
  phone?:       string;
  hours?:       string;     // e.g. "Lun–Ven 9h–19h\nSam–Dim 10h–17h"
  neighborhood?: string;
  coords?:      [number, number]; // [lat, lng]
}

export interface LocationSettings {
  id: string; // "location-settings"
  types: string[];
  regions: Array<'Montreal' | 'Rive Sud' | 'Rive Nord'>;
}

export const DEFAULT_LOCATION_SETTINGS: LocationSettings = {
  id: 'location-settings',
  types: ['Atelier Signature', 'Partenaire Local', 'Marché', 'Épicerie', 'Café', 'Boutique bio', 'Studio bien-être', 'Restaurant', 'En ligne', 'Autre'],
  regions: ['Montreal', 'Rive Sud', 'Rive Nord'],
};
