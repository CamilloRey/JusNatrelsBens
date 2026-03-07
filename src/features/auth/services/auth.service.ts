import { fetchSettings, syncSettings } from '@/lib/api/http-client';
import { SEED_SETTINGS }               from '@/shared/constants/seed-data';
import type { Settings }               from '../types/auth.types';

export const authService = {
  async getSettings(): Promise<Settings> {
    return fetchSettings<Settings>(SEED_SETTINGS);
  },
  async saveSettings(settings: Settings): Promise<void> {
    return syncSettings(settings);
  },
};
