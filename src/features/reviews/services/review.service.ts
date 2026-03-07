import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_REVIEWS }     from '@/shared/constants/seed-data';
import type { Review }      from '../types/review.types';

export const reviewService = {
  async getAll(): Promise<Review[]> {
    return fetchAll<Review>('reviews', SEED_REVIEWS);
  },
  async save(reviews: Review[]): Promise<void> {
    return syncAll<Review>('reviews', reviews);
  },
};
