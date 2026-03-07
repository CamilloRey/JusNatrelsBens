export type ActivityType = 'auth' | 'product' | 'review' | 'blog' | 'location' | 'info';

export interface Activity {
  id:     string;
  action: string;
  detail: string;
  date:   string;
  type:   ActivityType;
}
