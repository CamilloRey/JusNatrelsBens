import { fetchAll, syncAll } from '@/lib/api/http-client';
import { SEED_INGREDIENTS } from '@/shared/constants/seed-data';
import type { Ingredient } from '../types/ingredient.types';

export const ingredientService = {
  async getAll(): Promise<Ingredient[]> {
    return fetchAll<Ingredient>('ingredients', SEED_INGREDIENTS);
  },
  async save(ingredients: Ingredient[]): Promise<void> {
    return syncAll<Ingredient>('ingredients', ingredients);
  },
};
