export interface BlogPost {
  id:        string;
  title:     string;
  category:  string;
  content:   string;
  published: boolean;
  date:      string;
  img?:      string;
}

export interface BlogFormState {
  title:     string;
  category:  string;
  content:   string;
  published: boolean;
  img:       string;
}
