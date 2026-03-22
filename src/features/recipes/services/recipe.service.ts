import { supabase } from '@/lib/supabase/client';
import { syncAll } from '@/lib/api/http-client';
import type { Recipe } from '../types/recipe.types';

export const recipeService = {
  async getAll(): Promise<Recipe[]> {
    try {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('recipes')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch {
      console.error('Failed to fetch recipes:', arguments);
      return [];
    }
  },

  async getById(id: string): Promise<Recipe | null> {
    try {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch {
      console.error('Failed to fetch recipe:', arguments);
      return null;
    }
  },

  async create(recipe: Omit<Recipe, 'id'>): Promise<Recipe | null> {
    try {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch {
      console.error('Failed to create recipe:', arguments);
      return null;
    }
  },

  async update(id: string, updates: Partial<Recipe>): Promise<Recipe | null> {
    try {
      if (!supabase) return null;
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch {
      console.error('Failed to update recipe:', arguments);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      if (!supabase) return false;
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch {
      console.error('Failed to delete recipe:', arguments);
      return false;
    }
  },

  async save(recipes: Recipe[]): Promise<void> {
    return syncAll<Recipe>('recipes', recipes);
  },
};
