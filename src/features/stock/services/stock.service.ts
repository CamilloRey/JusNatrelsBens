import { fetchAll, syncAll }  from '@/lib/api/http-client';
import { SEED_STOCK }         from '@/shared/constants/seed-data';
import type { StockMovement } from '../types/stock.types';

export const stockService = {
  async getAll(): Promise<StockMovement[]> {
    return fetchAll<StockMovement>('stock', SEED_STOCK);
  },
  async save(movements: StockMovement[]): Promise<void> {
    return syncAll<StockMovement>('stock', movements);
  },
};
