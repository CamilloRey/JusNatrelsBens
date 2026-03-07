export interface Settings {
  businessName: string;
  email:        string;
  phone:        string;
  address:      string;
  description:  string;
  facebook:     string;
  instagram:    string;
  tiktok:       string;
  website:      string;
  password:     string;
  heroTitle:    string;
  heroSubtitle: string;
  currency:     string;
  taxRate:      number;
  deliveryNote: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  login: (password: string, adminPassword: string) => boolean;
  logout: () => void;
}
