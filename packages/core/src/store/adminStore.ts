// packages/core/src/store/adminStore.ts
import { create } from 'zustand';
import { fetchOrders, apiGetUsers, fetchRestaurants } from 'core';
import { Order, User, Restaurant } from '../types';

interface AdminState {
  stats: {
    totalOrdersToday: number;
    totalCustomers: number;
    totalMerchants: number;
    activeDrones: number;
  };
  orders: Order[]; // Toàn bộ đơn
  filteredOrders: Order[]; // Đơn sau khi lọc ngày
  selectedDate: string; // YYYY-MM-DD
  isLoading: boolean;
  
  loadDashboardData: () => Promise<void>;
  filterOrdersByDate: (date: string) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: {
    totalOrdersToday: 0,
    totalCustomers: 0,
    totalMerchants: 0,
    activeDrones: 30, // Hardcode tạm: Hệ thống có 12 Drone
  },
  orders: [],
  filteredOrders: [],
  selectedDate: new Date().toISOString().split('T')[0], // Mặc định hôm nay
  isLoading: false,

  loadDashboardData: async () => {
    set({ isLoading: true });
    try {
      // Gọi song song các API
      const [ordersData, usersData, restaurantsData] = await Promise.all([
        fetchOrders(),
        apiGetUsers(),
        fetchRestaurants()
      ]);

      const customers = (usersData as User[]).filter(u => u.role === 'customer').length;
      const merchants = (restaurantsData as Restaurant[]).length;
      const orders = ordersData as Order[];

      // Tính số đơn hôm nay
      const today = new Date().toISOString().split('T')[0];
      const ordersToday = orders.filter(o => o.createdAt.startsWith(today)).length;

      set({
        stats: {
          totalOrdersToday: ordersToday,
          totalCustomers: customers,
          totalMerchants: merchants,
          activeDrones: 12 
        },
        orders: orders,
        isLoading: false
      });
      
      // Chạy filter lần đầu cho ngày hiện tại
      get().filterOrdersByDate(today);

    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  filterOrdersByDate: (date: string) => {
    const allOrders = get().orders;
    // So sánh chuỗi ngày (giả sử createdAt lưu dạng ISO string hoặc YYYY-MM-DD...)
    const filtered = allOrders.filter(o => o.createdAt.startsWith(date));
    set({ selectedDate: date, filteredOrders: filtered });
  }
}));