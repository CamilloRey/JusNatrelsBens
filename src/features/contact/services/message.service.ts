import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_MESSAGES }    from '@/shared/constants/seed-data';
import type { Message }     from '../types/message.types';

export const messageService = {
  async getAll(): Promise<Message[]> {
    return fetchAll<Message>('messages', SEED_MESSAGES);
  },
  async save(messages: Message[]): Promise<void> {
    return syncAll<Message>('messages', messages);
  },
};
