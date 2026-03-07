import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_FINANCE }      from '@/shared/constants/seed-data';
import type { Transaction }  from '../types/finance.types';

export const financeService = {
  async getAll(): Promise<Transaction[]> {
    return fetchAll<Transaction>('finance', SEED_FINANCE);
  },
  async save(transactions: Transaction[]): Promise<void> {
    return syncAll<Transaction>('finance', transactions);
  },
};
