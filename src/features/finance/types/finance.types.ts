export interface Transaction {
  id:          string;
  type:        'revenu' | 'depense';
  amount:      number;
  category:    string;
  description: string;
  date:        string;     // "2025-06-14"
  location:    string;     // point de vente ou fournisseur
}

export interface TransactionFormState {
  type:        'revenu' | 'depense';
  amount:      string;
  category:    string;
  description: string;
  date:        string;
  location:    string;
}

export const REVENUE_CATEGORIES = ['Vente marché', 'Vente épicerie', 'Vente en ligne', 'Dégustation', 'Autre revenu'];
export const EXPENSE_CATEGORIES  = ['Ingrédients', 'Emballage', 'Transport', 'Permis / Taxes', 'Marketing', 'Équipement', 'Autre dépense'];
