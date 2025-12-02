// packages/core/src/store/adminStore.ts
import { create } from 'zustand';
// Cập nhật import: Thêm fetchDrones và đổi fetchRestaurants thành apiGetAllRestaurants
import { fetchOrders, apiGetUsers, apiGetAllRestaurants, fetchDrones } from '../services/api';
import { Order, User, Restaurant, Drone } from '../types';

interface AdminState {
  stats: {
    totalOrdersToday: number;
    totalCustomers: number;
    totalMerchants: number;
    activeDrones: number;
  };
  orders: Order[];
  filteredOrders: Order[];
  selectedDate: string;
  isLoading: boolean;
  
  loadDashboardData: (isBackground?: boolean) => Promise<void>; 
  filterOrdersByDate: (date: string) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: {
    totalOrdersToday: 0,
    totalCustomers: 0,
    totalMerchants: 0,
    activeDrones: 0,
  },
  orders: [],
  filteredOrders: [],
  selectedDate: new Date().toISOString().split('T')[0],
  isLoading: false,

  loadDashboardData: async (isBackground = false) => {
    if (!isBackground) set({ isLoading: true });
    try {
      // 1. Gọi song song 4 API (Thêm fetchDrones)
      const [ordersData, usersData, restaurantsData, dronesData] = await Promise.all([
        fetchOrders(),
        apiGetUsers(),
        apiGetAllRestaurants(), // Dùng hàm này để đếm cả quán chưa duyệt/bị khóa
        fetchDrones()           // Lấy dữ liệu Drone thực tế
      ]);

      // 2. Tính toán số liệu
      const customers = (usersData as User[]).filter(u => u.role === 'customer').length;
      const merchants = (restaurantsData as Restaurant[]).length;
      const orders = ordersData as Order[];

      // Tính số Drone đang sẵn sàng (idle)
      const readyDrones = (dronesData as Drone[]).filter(d => d.status === 'idle').length;

      // Tính số đơn hôm nay
      const today = new Date().toISOString().split('T')[0];
      const ordersToday = orders.filter(o => o.createdAt.startsWith(today)).length;

      // 3. Cập nhật Store
      set({
        stats: {
          totalOrdersToday: ordersToday,
          totalCustomers: customers,
          totalMerchants: merchants,
          activeDrones: readyDrones // Số liệu thật từ DB
        },
        orders: orders,
        // Cập nhật luôn filteredOrders cho ngày hiện tại để bảng hiện data ngay
        filteredOrders: orders.filter(o => o.createdAt.startsWith(today)),
        isLoading: false
      });
      
    } catch (error) {
      console.error("Lỗi tải Dashboard Admin:", error);
      set({ isLoading: false });
    }
  },

  filterOrdersByDate: (date: string) => {
    const allOrders = get().orders;
    const filtered = allOrders.filter(o => o.createdAt.startsWith(date));
    set({ selectedDate: date, filteredOrders: filtered });
  }
}));