import React, { createContext, useContext, useState, type ReactNode } from 'react';

// === TYPES ===
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  restaurantId: number;
  restaurantName: string;
}

interface ItemData {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  restaurantId: number;
  restaurantName: string;
}

// INTERFACE
interface CartContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
  items: CartItem[];
  increaseItemQuantity: (itemData: ItemData) => void;
  decreaseItemQuantity: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  findItem: (id: number) => CartItem | undefined;
  totalAmount: number;
  totalItems: number;
  clearCart: () => void;
  conflictingItem: ItemData | null;
  proceedWithNewBasket: () => void;
  cancelNewBasket: () => void;
}

// === CONTEXT ===
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// === PROVIDER ===
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [conflictingItem, setConflictingItem] = useState<ItemData | null>(null);

  const toggleCart = () => {
    if (conflictingItem) {
      setIsCartOpen(true);
      return;
    }
    setIsCartOpen(prev => !prev);
  };

  const findItem = (id: number) => items.find(i => i.id === id);

  const increaseItemQuantity = (itemData: ItemData) => {    
    // 1. Giỏ hàng trống
    if (items.length === 0) {
      setItems([{ ...itemData, quantity: 1 }]);
      return;
    }

    // 2. Giỏ hàng có đồ
    const existingRestaurantId = items[0].restaurantId;
    
    // 3. CÙNG nhà hàng
    if (itemData.restaurantId === existingRestaurantId) {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === itemData.id);
        if (existingItem) {
          return currentItems.map(item =>
            item.id === itemData.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...currentItems, { ...itemData, quantity: 1 }];
        }
      });
    } else {
      // 4. KHÁC nhà hàng --> Hiện thông báo xung đột
      setConflictingItem(itemData);
      setIsCartOpen(true);
    }
  };

  const proceedWithNewBasket = () => {
    if (conflictingItem) {
      setItems([{ ...conflictingItem, quantity: 1 }]); 
      setConflictingItem(null); 
    }
  };

  const cancelNewBasket = () => {
    setConflictingItem(null); 
    setIsCartOpen(false); 
  };

  const decreaseItemQuantity = (itemId: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === itemId);
      if (!existingItem) return prevItems;
      if (existingItem.quantity > 1) {
        return prevItems.map(i =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prevItems.filter(i => i.id !== itemId);
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setItems(prevItems => prevItems.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const value = { 
    isCartOpen, 
    toggleCart,
    items,
    increaseItemQuantity, 
    decreaseItemQuantity,
    removeFromCart,
    findItem,
    totalAmount,
    totalItems,
    clearCart,
    conflictingItem,
    proceedWithNewBasket,
    cancelNewBasket,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};