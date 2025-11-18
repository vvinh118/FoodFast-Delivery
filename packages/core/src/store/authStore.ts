import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCartStore } from './cartStore';

// Định nghĩa kiểu dữ liệu User
export interface User {
  id: number;
  name: string;
  email: string;
  token?: string;
  tel?: string;
  address?: string;
  birthday?: string;
}

interface AuthState {
  // STATE
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  isProfileSidebarOpen: boolean;

  // ACTIONS
  login: (userData: User) => void; // Hàm này chỉ nhận dữ liệu User đã thành công
  logout: () => void;
  toggleProfileSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      isProfileSidebarOpen: false,

      // 1. Hàm Login: lưu User vào Store
      login: (userData: User) => {
        set({ 
            user: userData, 
            isLoggedIn: true, 
            error: null,
            isLoading: false 
        });
      },

      // 2. Hàm Logout: Xóa User + xóa giỏ hàng
      logout: () => {
        // Xóa thông tin Auth
        set({ 
            user: null, 
            isLoggedIn: false, 
            isProfileSidebarOpen: false,
            error: null 
        });
        
        useCartStore.getState().clearCart(); 
      },

      toggleProfileSidebar: () => set((state) => ({ isProfileSidebarOpen: !state.isProfileSidebarOpen })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (err) => set({ error: err }),
    }),
    {
      name: 'foodfast-auth-storage',
      // Web dùng localStorage. Mobile sẽ dùng AsyncStorage
      storage: createJSONStorage(() => localStorage), 
    }
  )
);