import { fetchAll, syncAll }  from '@/lib/api/http-client';
import { SEED_ACTIVITY }      from '@/shared/constants/seed-data';
import type { Activity }      from '../types/dashboard.types';

export const dashboardService = {
  async getActivity(): Promise<Activity[]> {
    return fetchAll<Activity>('activity', SEED_ACTIVITY);
  },
  async saveActivity(activity: Activity[]): Promise<void> {
    return syncAll<Activity>('activity', activity);
  },
};
