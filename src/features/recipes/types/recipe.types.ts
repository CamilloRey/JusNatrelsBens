export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: 'Smoothie' | 'Jus' | 'Cocktail' | 'Desset' | 'Sauté';
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  prepTime: number; // minutes
  servings: number;
  products: string[]; // product IDs
  ingredients: string[];
  instructions: string[];
  image: string;
  featured: boolean;
  published: boolean;
  tags: string[];
}
