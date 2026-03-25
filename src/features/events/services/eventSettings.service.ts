import { fetchAll, syncAll } from '@/lib/api/http-client';
import type { EventSettings } from '../types/event.types';
import { DEFAULT_EVENT_SETTINGS } from '../types/event.types';

const TABLE = 'event_settings';
const SETTINGS_ID = 'event-settings';

export const eventSettingsService = {
  async get(): Promise<EventSettings> {
    const rows = await fetchAll<EventSettings>(TABLE, [DEFAULT_EVENT_SETTINGS]);
    return rows.find(r => r.id === SETTINGS_ID) ?? DEFAULT_EVENT_SETTINGS;
  },
  async save(settings: EventSettings): Promise<void> {
    return syncAll<EventSettings>(TABLE, [{ ...settings, id: SETTINGS_ID }]);
  },
};
