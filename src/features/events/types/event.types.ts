export interface Event {
  id:          string;
  title:       string;
  description: string;
  date:        string;   // "2025-06-14"
  time:        string;   // "10h00 - 17h00"
  location:    string;   // "Marche Jean-Talon"
  address:     string;
  type:        string;   // "Marche", "Degustation", "Festival", etc.
  active:      boolean;
  img?:        string;
  attendanceEnabled?: boolean;
  maxAttendees?: number;
  attendanceRequests?: AttendanceRequest[];
}

export interface AttendanceRequest {
  id:        string;
  name:      string;
  email:     string;
  phone?:    string;
  message?:  string;
  status:    'pending' | 'approved' | 'declined';
  createdAt: string;
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
  attendanceEnabled: boolean;
  maxAttendees: number;
}

export interface EventSettings {
  id: string; // "event-settings"
  types: string[];
}

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  id: 'event-settings',
  types: ['Marche', 'Festival', 'Degustation', 'Atelier', 'Autre'],
};
