export interface Event {
  id:          string;
  title:       string;
  description: string;
  date:        string;   // "2025-06-14"
  time:        string;   // "10h00 - 17h00"
  location:    string;   // "Marché Jean-Talon"
  address:     string;
  type:        string;   // "Marché", "Dégustation", "Festival", etc.
  active:      boolean;
  img?:        string;
}

export interface EventFormState {
  title:       string;
  description: string;
  date:        string;
  time:        string;
  location:    string;
  address:     string;
  type:        string;
  active:      boolean;
  img:         string;
}
