export interface StockMovement {
  id:          string;
  productId:   string;
  productName: string;
  type:        'entree' | 'sortie';
  quantity:    number;
  unit:        string;     // 'bouteilles', 'litres', etc.
  location:    string;     // 'Marché Jean-Talon', 'Entrepôt', etc.
  note:        string;
  date:        string;     // ISO datetime
}

export interface StockFormState {
  productId:   string;
  productName: string;
  type:        'entree' | 'sortie';
  quantity:    string;
  unit:        string;
  location:    string;
  note:        string;
  date:        string;
}
