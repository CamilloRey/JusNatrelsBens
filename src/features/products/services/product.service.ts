import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_PRODUCTS }    from '@/shared/constants/seed-data';
import type { Product }     from '../types/product.types';

export const productService = {
  async getAll(): Promise<Product[]> {
    return fetchAll<Product>('products', SEED_PRODUCTS);
  },
  async save(products: Product[]): Promise<void> {
    return syncAll<Product>('products', products);
  },
};
