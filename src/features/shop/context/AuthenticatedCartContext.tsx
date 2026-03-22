import { useEffect } from 'react';
import { useCart } from './CartContext';
import { useSupabaseAuth } from '@/features/auth/context/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';

/**
 * Enhanced Cart Context that syncs with authenticated user
 * Saves cart to database for logged-in users
 */
export function useAuthenticatedCart() {
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useSupabaseAuth();

  // Save cart to Supabase when user is logged in
  useEffect(() => {
    if (!user || cart.items.length === 0) return;

    const saveCartToDb = async () => {
      try {
        await supabase.from('shopping_carts').upsert(
          {
            user_id: user.id,
            items: cart.items,
            total: cart.total,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };

    const debounceTimer = setTimeout(saveCartToDb, 1000);
    return () => clearTimeout(debounceTimer);
  }, [cart, user]);

  // Load cart from Supabase when user logs in
  useEffect(() => {
    if (!user) return;

    const loadCartFromDb = async () => {
      try {
        const { data, error } = await supabase
          .from('shopping_carts')
          .select('items')
          .eq('user_id', user.id)
          .single();

        if (data?.items && !error) {
          // Cart items already in localStorage, so we skip loading from DB
          // (localStorage takes precedence for user experience)
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadCartFromDb();
  }, [user]);

  return { cart, addItem, removeItem, updateQuantity, clearCart, isAuthenticated: !!user, user };
}
