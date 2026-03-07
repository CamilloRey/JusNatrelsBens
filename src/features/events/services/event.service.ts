import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_EVENTS }       from '@/shared/constants/seed-data';
import type { Event }        from '../types/event.types';

export const eventService = {
  async getAll(): Promise<Event[]> {
    return fetchAll<Event>('events', SEED_EVENTS);
  },
  async save(events: Event[]): Promise<void> {
    return syncAll<Event>('events', events);
  },
};
