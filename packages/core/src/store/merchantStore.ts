import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Định nghĩa kiểu dữ liệu Merchant
interface Merchant {
    id: string;
    email: string;
    name: string;
    restaurantId: string;
    walletBalance: number;
}

interface MerchantState {
    merchant: Merchant | null;
    isMerchantLoggedIn: boolean;
    loginMerchant: (merchantData: Merchant) => void;
    logoutMerchant: () => void;
    updateBalance: (newBalance: number) => void; 
}

export const useMerchantStore = create<MerchantState>()(
    persist(
        (set) => ({
            merchant: null,
            isMerchantLoggedIn: false,

            loginMerchant: (merchantData) => set({ 
                merchant: merchantData, 
                isMerchantLoggedIn: true 
            }),

            logoutMerchant: () => set({ 
                merchant: null, 
                isMerchantLoggedIn: false 
            }),
            
            // LOGIC CẬP NHẬT SỐ DƯ
            updateBalance: (newBalance) => set((state) => ({
                merchant: state.merchant ? { ...state.merchant, walletBalance: newBalance } : null
            })),
        }),
        {
            name: 'merchant-storage',
        }
    )
);