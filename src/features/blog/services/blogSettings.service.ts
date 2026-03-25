import { fetchAll, syncAll } from '@/lib/api/http-client';
import type { BlogSettings } from '../types/blog.types';
import { DEFAULT_BLOG_SETTINGS } from '../types/blog.types';

const TABLE = 'blog_settings';
const SETTINGS_ID = 'blog-settings';

export const blogSettingsService = {
  async get(): Promise<BlogSettings> {
    const rows = await fetchAll<BlogSettings>(TABLE, [DEFAULT_BLOG_SETTINGS]);
    return rows.find(r => r.id === SETTINGS_ID) ?? DEFAULT_BLOG_SETTINGS;
  },
  async save(settings: BlogSettings): Promise<void> {
    return syncAll<BlogSettings>(TABLE, [{ ...settings, id: SETTINGS_ID }]);
  },
};
