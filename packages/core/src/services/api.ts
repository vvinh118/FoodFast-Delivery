// packages/core/src/services/api.ts
import type { User, Restaurant, Category, MenuItem, Order } from '../types'; 

// Địa chỉ IP LAN (Lưu ý: Cần cập nhật mỗi khi đổi mạng Wifi)
const API_URL = 'http://192.168.1.167:3001';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorText = 'Đã có lỗi xảy ra';

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const error = await response.json();
      errorText = error.message || 'Lỗi từ server (JSON)';
    } else {
      errorText = await response.text(); 
    }
    throw new Error(errorText); 
  }
  return response.json();
};

/**
 * API Đăng nhập
 */
export const apiLogin = async (email: string, password: string) => {
  console.log("GỌI API: Đang thử đăng nhập với", email);
  const response = await fetch(`${API_URL}/users?email=${email}`);
  const users: User[] = await handleResponse(response); // Định nghĩa kiểu trả về
  
  if (users.length > 0 && (users[0] as any).password === password) {
    console.log("API TRẢ VỀ: Thành công");
    return {
      token: 'jwt-token-fake',
      user: users[0]
    };
  } else {
    console.log("API TRẢ VỀ: Thất bại");
    throw new Error('Sai tài khoản hoặc mật khẩu');
  }
};

/**
 * API Lấy danh sách NHÀ HÀNG
 */
export const fetchRestaurants = async (): Promise<Restaurant[]> => {
  console.log("GỌI API: Lấy danh sách NHÀ HÀNG");
  const response = await fetch(`${API_URL}/restaurants`);
  return handleResponse(response); 
};

/**
 * API Lấy danh sách CATEGORIES
 */
export const fetchCategories = async (): Promise<Category[]> => {
  console.log("GỌI API: Lấy danh sách CATEGORIES");
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết 1 NHÀ HÀNG BẰNG ID
 */
export const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
  console.log(`GỌI API: Lấy chi tiết nhà hàng ID: ${id}`);
  const response = await fetch(`${API_URL}/restaurants/${id}`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết MÓN ĂN của 1 NHÀ HÀNG
 */
export const fetchMenuByRestaurant = async (restaurantId: string): Promise<MenuItem[]> => {
  console.log(`GỌI API: Lấy menu của nhà hàng ID: ${restaurantId}`);
  const response = await fetch(`${API_URL}/menuItems?restaurantId=${restaurantId}`);
  return handleResponse(response); 
};

/**
 * API Đăng ký (Tạo User mới)
 */
export const apiRegister = async (userData: any) => {
  console.log("GỌI API: Đang thử đăng ký với email", userData.email);
  // Check trùng email
  const emailCheckResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
  const existingUsers = await emailCheckResponse.json();
  if (existingUsers.length > 0) {
    throw new Error('Email này đã được đăng ký');
  }
  // Tạo mới
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

/**
 * API Gửi Đơn Hàng Mới
 */
export const apiSubmitOrder = async (orderData: any) => {
  console.log("GỌI API: Đang gửi đơn hàng...");
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData), 
  });
  return handleResponse(response);
};

/**
 * API Lấy Lịch sử Đơn hàng
 */
export const fetchMyOrders = async (userId: number | string ): Promise<Order[]> => {
  console.log(`GỌI API: Lấy đơn hàng của user ID: ${userId}`);
  const response = await fetch(`${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`);
  return handleResponse(response);
};