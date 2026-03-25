import { fetchAll, syncAll } from '@/lib/api/http-client';
import type { ProductSettings } from '../types/product.types';
import { DEFAULT_PRODUCT_SETTINGS } from '../types/product.types';

const TABLE = 'product_settings';
const SETTINGS_ID = 'product-settings';

export const productSettingsService = {
  async get(): Promise<ProductSettings> {
    const rows = await fetchAll<ProductSettings>(TABLE, [DEFAULT_PRODUCT_SETTINGS]);
    return rows.find(r => r.id === SETTINGS_ID) ?? DEFAULT_PRODUCT_SETTINGS;
  },

  async save(settings: ProductSettings): Promise<void> {
    return syncAll<ProductSettings>(TABLE, [{ ...settings, id: SETTINGS_ID }]);
  },
};
