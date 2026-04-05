import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { API_BASE_URL } from '../api/config';
import type { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  totalAmount: number;
  addToCart: (bookId: number, itemQuantity?: number) => Promise<void>;
  updateQuantity: (bookId: number, itemQuantity: number) => Promise<void>;
  removeFromCart: (bookId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

interface CartApiResponse {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const cartApiUrl = `${API_BASE_URL}/api/Cart`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const syncCart = (response: CartApiResponse) => {
    setCart(response.items);
    setItemCount(response.itemCount);
    setTotalAmount(response.totalAmount);
  };

  const refreshCart = async () => {
    const response = await fetch(cartApiUrl, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Unable to load cart: ${response.status}`);
    }

    const data: CartApiResponse = await response.json();
    syncCart(data);
  };

  useEffect(() => {
    refreshCart().catch((error) => {
      console.error('Unable to load cart', error);
    });
  }, []);

  const postCart = async (url: string, body?: unknown) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Cart request failed: ${response.status}`);
    }

    const data: CartApiResponse = await response.json();
    syncCart(data);
  };

  const addToCart = async (bookId: number, itemQuantity = 1) => {
    await postCart(`${cartApiUrl}/Add`, { bookId, itemQuantity });
  };

  const updateQuantity = async (bookId: number, itemQuantity: number) => {
    await postCart(`${cartApiUrl}/UpdateQuantity`, { bookId, itemQuantity });
  };

  const removeFromCart = async (bookId: number) => {
    await postCart(`${cartApiUrl}/Remove/${bookId}`);
  };

  const clearCart = async () => {
    await postCart(`${cartApiUrl}/Clear`);
  };

  const value = useMemo(
    () => ({
      cart,
      itemCount,
      totalAmount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart,
    }),
    [cart, itemCount, totalAmount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};