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
