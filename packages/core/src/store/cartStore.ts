import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// TYPES
import { CartItem } from '../types'; 

// Dữ liệu món ăn đầu vào (chưa có quantity)
export interface ItemData {
  id: string | number;
  name: string;
  price: number;
  imageUrl?: string;
  restaurantId: string | number;
  restaurantName: string;
}

interface CartState {
  // --- STATE ---
  items: CartItem[];
  isCartOpen: boolean;
  conflictingItem: ItemData | null; // Món ăn gây xung đột nhà hàng
  totalAmount: number;
  totalItems: number;

  // --- ACTIONS ---
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  addToCart: (item: ItemData) => void;       // Tương đương increaseItemQuantity
  decreaseQuantity: (itemId: string | number) => void; // Tương đương decreaseItemQuantity
  removeFromCart: (itemId: string | number) => void;
  clearCart: () => void;
  
  // Xử lý xung đột
  proceedWithNewBasket: () => void;
  cancelNewBasket: () => void;
}

// --- HÀM HELPER TÍNH TỔNG ---
const calculateTotals = (items: CartItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalAmount, totalItems };
};

// --- ZUSTAND STORE ---
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial State
      items: [],
      isCartOpen: false,
      conflictingItem: null,
      totalAmount: 0,
      totalItems: 0,

      // Actions
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: (itemData: ItemData) => {
        const state = get();
        const currentItems = state.items;

        // 1. Giỏ hàng trống -> Thêm luôn
        if (currentItems.length === 0) {
            const newItems = [{ ...itemData, quantity: 1 }];
            set({ items: newItems, ...calculateTotals(newItems) });
            return;
        }

        // 2. Kiểm tra trùng nhà hàng
        const existingRestaurantId = currentItems[0].restaurantId;

        if (itemData.restaurantId === existingRestaurantId) {
            // CÙNG nhà hàng -> Cộng dồn số lượng
            const existingItem = currentItems.find((i) => i.id === itemData.id);
            let newItems;

            if (existingItem) {
                newItems = currentItems.map((i) =>
                    i.id === itemData.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                newItems = [...currentItems, { ...itemData, quantity: 1 }];
            }

            set({ items: newItems, ...calculateTotals(newItems) });

        } else {
            // KHÁC nhà hàng -> Báo xung đột, mở giỏ hàng
            set({ conflictingItem: itemData, isCartOpen: true });
        }
      },

      decreaseQuantity: (itemId: string | number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === itemId);

        if (!existingItem) return;

        let newItems;
        if (existingItem.quantity > 1) {
             newItems = currentItems.map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        } else {
             newItems = currentItems.filter((i) => i.id !== itemId);
        }

        set({ items: newItems, ...calculateTotals(newItems) });
      },

      removeFromCart: (itemId: string | number) => {
        const newItems = get().items.filter((i) => i.id !== itemId);
        set({ items: newItems, ...calculateTotals(newItems) });
      },

      clearCart: () => {
        set({ items: [], totalAmount: 0, totalItems: 0 });
      },

      proceedWithNewBasket: () => {
        const conflictItem = get().conflictingItem;
        if (conflictItem) {
            const newItems = [{ ...conflictItem, quantity: 1 }];
            set({ 
                items: newItems, 
                conflictingItem: null, 
                ...calculateTotals(newItems) 
            });
        }
      },

      cancelNewBasket: () => {
        set({ conflictingItem: null, isCartOpen: false });
      },
    }),
    {
      name: 'foodfast-cart-storage', // Tên key trong LocalStorage
      // Cấu hình Storage: Mặc định dùng localStorage (cho Web).
      // Khi sang Mobile, cấu hình lại dòng này sau.
      storage: createJSONStorage(() => localStorage), 
    }
  )
);