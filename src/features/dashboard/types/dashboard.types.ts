export type ActivityType =
  | 'auth'
  | 'product'
  | 'review'
  | 'blog'
  | 'location'
  | 'settings'
  | 'newsletter'
  | 'info';

export interface Activity {
  id:     string;
  action: string;
  detail: string;
  date:   string;
  type:   ActivityType;
}
