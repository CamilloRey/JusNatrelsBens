export interface Product {
  id:        string;
  name:      string;
  category:  string;
  price:     number;
  formats:   string[];
  desc:      string;
  available: boolean;
  tag:       string;
  img:       string; // emoji ou URL Supabase Storage
  color:     string;
}

export type ProductCategory = 'Tous' | 'Jus' | 'Tisanes' | 'Épices' | 'Cosmétiques';

export interface ProductFormState {
  name:      string;
  category:  string;
  price:     string;
  formats:   string;
  desc:      string;
  tag:       string;
  img:       string;
  available: boolean;
}
