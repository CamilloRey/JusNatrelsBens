import { fetchAll, syncAll } from '@/lib/api/http-client';
import type { LocationSettings } from '../types/location.types';
import { DEFAULT_LOCATION_SETTINGS } from '../types/location.types';

const TABLE = 'location_settings';
const SETTINGS_ID = 'location-settings';

export const locationSettingsService = {
  async get(): Promise<LocationSettings> {
    const rows = await fetchAll<LocationSettings>(TABLE, [DEFAULT_LOCATION_SETTINGS]);
    return rows.find(r => r.id === SETTINGS_ID) ?? DEFAULT_LOCATION_SETTINGS;
  },
  async save(settings: LocationSettings): Promise<void> {
    return syncAll<LocationSettings>(TABLE, [{ ...settings, id: SETTINGS_ID }]);
  },
};
