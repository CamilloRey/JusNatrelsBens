import { fetchAll, syncAll }  from '@/lib/api/http-client';
import { SEED_LOCATIONS }     from '@/shared/constants/seed-data';
import type { Location }      from '../types/location.types';

export const locationService = {
  async getAll(): Promise<Location[]> {
    return fetchAll<Location>('locations', SEED_LOCATIONS);
  },
  async save(locations: Location[]): Promise<void> {
    return syncAll<Location>('locations', locations);
  },
};
