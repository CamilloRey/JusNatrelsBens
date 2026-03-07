import { fetchAll, syncAll }  from '@/lib/api/http-client';
import { SEED_SUBSCRIBERS }   from '@/shared/constants/seed-data';
import type { Subscriber }    from '../types/subscriber.types';

export const subscriberService = {
  async getAll(): Promise<Subscriber[]> {
    return fetchAll<Subscriber>('subscribers', SEED_SUBSCRIBERS);
  },
  async save(subscribers: Subscriber[]): Promise<void> {
    return syncAll<Subscriber>('subscribers', subscribers);
  },
};
