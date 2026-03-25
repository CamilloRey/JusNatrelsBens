export interface Product {
  id:              string;
  name:            string;
  category:        string;
  price:           number;
  formats:         string[];
  desc:            string;
  available:       boolean;
  tag:             string;
  img:             string;   // emoji ou URL Supabase Storage
  color:           string;   // couleur accent du produit (gradient fond)
  characteristics?: string[]; // badges qualité sélectionnables
  ingredients?:    string[]; // IDs des ingrédients liés au produit
}

/* ═══════ PARAMÈTRES PRODUITS DYNAMIQUES ═══════ */
export interface ProductCharacteristic {
  icon:  string;
  label: string;
}

export interface ProductSettings {
  id:              string;  // toujours "product-settings"
  categories:      string[];
  formats:         string[];
  tags:            string[];
  characteristics: ProductCharacteristic[];
  colors:          string[];
}

/* Valeurs par défaut (utilisées si BD vide) */
export const DEFAULT_PRODUCT_SETTINGS: ProductSettings = {
  id: 'product-settings',
  categories: ['Jus', 'Tisanes', 'Sirops', 'Poudres', 'Épices', 'Cosmétiques'],
  formats: ['250ml', '354ml', '500ml', '750ml', '1L', '2L'],
  tags: [
    'Pressé à froid',
    '100% Naturel',
    'Bio',
    'Boost Immunité',
    'Sans sucre ajouté',
    'Nouveau',
    'Populaire',
    'En promotion',
  ],
  characteristics: [
    { icon: '🌿', label: 'Sans conservateurs' },
    { icon: '🍃', label: 'Sans sucre ajouté'  },
    { icon: '✓',  label: '100% Naturel'       },
    { icon: '🌱', label: 'Bio'                 },
    { icon: '🇨🇦', label: 'Produit du Québec' },
    { icon: '🧊', label: 'Pressé à froid'     },
    { icon: '🌾', label: 'Sans gluten'        },
    { icon: '🐾', label: 'Végan'              },
    { icon: '⚡', label: 'Boost Énergie'      },
    { icon: '🫀', label: 'Boost Immunité'     },
  ],
  colors: [
    '#c44536','#e07a20','#2b6a4f','#1b4d38',
    '#7c3aed','#0284c7','#be185d','#d97706',
    '#059669','#64748b',
  ],
};

export type ProductCategory = 'Tous' | string;

/* ═══════ CONSTANTES LEGACY (fallback, utilisez productSettings de DataContext) ═══════ */
export const PRODUCT_CATEGORIES = DEFAULT_PRODUCT_SETTINGS.categories;
export const PRODUCT_FORMATS = DEFAULT_PRODUCT_SETTINGS.formats;
export const PRODUCT_TAGS = DEFAULT_PRODUCT_SETTINGS.tags;
export const PRODUCT_CHARACTERISTICS = DEFAULT_PRODUCT_SETTINGS.characteristics;
export const PRODUCT_COLORS = DEFAULT_PRODUCT_SETTINGS.colors;

export interface ProductFormState {
  name:            string;
  category:        string;
  price:           string;
  formats:         string[];   // checkboxes → array directement
  desc:            string;
  tag:             string;
  img:             string;
  available:       boolean;
  color:           string;
  characteristics: string[];
  ingredients:     string[];   // IDs des ingrédients sélectionnés
}
