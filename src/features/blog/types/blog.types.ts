export interface BlogPost {
  id:        string;
  title:     string;
  category:  string;
  content:   string;
  published: boolean;
  date:      string;
  img?:      string;
  tags?:     string[];
  contentType?: 'article' | 'recette';
}

export interface BlogFormState {
  title:     string;
  category:  string;
  content:   string;
  published: boolean;
  img:       string;
  tags:      string;
  contentType: 'article' | 'recette';
}

export interface BlogSettings {
  id: string; // "blog-settings"
  categories: string[];
  contentTypes: Array<'article' | 'recette'>;
}

export const DEFAULT_BLOG_SETTINGS: BlogSettings = {
  id: 'blog-settings',
  categories: ['Sante', 'Recettes', 'Actualites', 'Conseils', 'Traditions', 'Nutrition'],
  contentTypes: ['article', 'recette'],
};
