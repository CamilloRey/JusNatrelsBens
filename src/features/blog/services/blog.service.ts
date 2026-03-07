import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_BLOGS }       from '@/shared/constants/seed-data';
import type { BlogPost }    from '../types/blog.types';

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    return fetchAll<BlogPost>('blogs', SEED_BLOGS);
  },
  async save(blogs: BlogPost[]): Promise<void> {
    return syncAll<BlogPost>('blogs', blogs);
  },
};
