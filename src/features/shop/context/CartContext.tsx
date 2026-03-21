import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Cart, CartItem } from '../types/shop.types';

interface CartContextType {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'jusnatrels_cart';
const TAX_RATE = 0.14975; // QC: TPS 5% + TVQ 9.975%
const FREE_SHIPPING_THRESHOLD = 10000; // $100 in cents
const BASE_SHIPPING_COST = 995; // $9.95

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    taxRate: TAX_RATE,
    taxes: 0,
    shippingCost: 0,
    total: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  // Calculate cart totals
  const calculateCart = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = Math.round(subtotal * TAX_RATE);
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;
    const total = subtotal + taxes + shippingCost;

    return {
      items,
      subtotal,
      taxRate: TAX_RATE,
      taxes,
      shippingCost,
      total,
    };
  };

  const addItem = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) => item.productId === newItem.productId && item.format === newItem.format
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = prevCart.items.map((item) =>
          item.productId === newItem.productId && item.format === newItem.format
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...prevCart.items, newItem];
      }

      const newCart = calculateCart(updatedItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.productId !== productId);
      const newCart = calculateCart(updatedItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const newCart = calculateCart(updatedItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart(calculateCart([]));
    localStorage.removeItem(STORAGE_KEY);
  };

  const getTotalItems = () => cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
