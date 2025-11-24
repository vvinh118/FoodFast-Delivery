// packages/core/src/services/api.ts
import type { User, Restaurant, Category, MenuItem, Order } from '../types'; 

const API_URL = 'http://localhost:3001';

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
  const users: User[] = await handleResponse(response);
  
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
  const response = await fetch(`${API_URL}/restaurants?status=active`);
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
export const fetchRestaurantById = async (id: string | number): Promise<Restaurant> => {
  console.log(`GỌI API: Lấy chi tiết nhà hàng ID: ${id}`);
  const response = await fetch(`${API_URL}/restaurants/${id}`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết MÓN ĂN của 1 NHÀ HÀNG
 */
export const fetchMenuByRestaurant = async (restaurantId: string | number): Promise<MenuItem[]> => {
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
export const fetchMyOrders = async (userId: string | number ): Promise<Order[]> => {
  console.log(`GỌI API: Lấy đơn hàng của user ID: ${userId}`);
  const response = await fetch(`${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`);
  return handleResponse(response);
};

// ==========================================================
// API DÀNH RIÊNG CHO MERCHANT (LOGIC MỚI)
// ==========================================================

/**
 * API Đăng nhập cho Merchant
 */
export const apiMerchantLogin = async (email: string, password: string) => {
  console.log("GỌI API: Merchant đăng nhập với", email);
  
  // BƯỚC 1: Tìm trong bảng users
  const userResponse = await fetch(`${API_URL}/users?email=${email}&role=merchant`);
  const users: User[] = await handleResponse(userResponse);

  if (users.length === 0) throw new Error('Tài khoản không tồn tại hoặc không phải Merchant.');
  const user = users[0];

  // BƯỚC 2: Kiểm tra mật khẩu
  if ((user as any).password !== password) throw new Error('Sai mật khẩu.');

  // BƯỚC 3: Tìm nhà hàng liên kết
  const restResponse = await fetch(`${API_URL}/restaurants?ownerId=${user.id}`);
  const restaurants: Restaurant[] = await handleResponse(restResponse);

  if (restaurants.length === 0) {
    throw new Error('Tài khoản này chưa được liên kết với nhà hàng nào.');
  }

  const restaurant = restaurants[0];

  console.log("API: Merchant đăng nhập thành công, quản lý quán:", restaurant.name);

  // Trả về object Merchant đã được cấu trúc lại cho Store
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    restaurantId: restaurant.id, 
    walletBalance: (user as any).walletBalance || 0
  };
};

/**
 * API Lấy TOÀN BỘ danh sách đơn hàng
 */
export const fetchOrders = async () => {
  const response = await fetch(`${API_URL}/orders?_sort=createdAt&_order=desc`);
  return handleResponse(response);
};

/**
 * API Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  console.log(`GỌI API: Cập nhật đơn hàng ${orderId} sang trạng thái: ${newStatus}`);
  
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      status: newStatus 
    }),
  });
  
  return handleResponse(response);
};

// ==========================================================
// API QUẢN LÝ THỰC ĐƠN (MENU)
// ==========================================================

/**
 * Lấy danh sách món ăn của nhà hàng
 */
export const fetchMerchantMenu = async (restaurantId: string | number) => {
  console.log(`GỌI API: Lấy menu của quán ID ${restaurantId}`);
  const response = await fetch(`${API_URL}/menuItems?restaurantId=${restaurantId}`);
  return handleResponse(response);
};

/**
 * Thêm món ăn mới
 */
export const addMenuItem = async (itemData: any) => {
  console.log("GỌI API: Thêm món mới", itemData);
  const response = await fetch(`${API_URL}/menuItems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  return handleResponse(response);
};

/**
 * Cập nhật món ăn (Sửa tên, giá, ảnh, trạng thái còn hàng/hết hàng)
 */
export const updateMenuItem = async (id: string | number, updates: any) => {
  console.log(`GỌI API: Cập nhật món ID ${id}`, updates);
  const response = await fetch(`${API_URL}/menuItems/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

/**
 * Xóa món ăn
 */
export const deleteMenuItem = async (id: string | number) => {
  console.log(`GỌI API: Xóa món ID ${id}`);
  const response = await fetch(`${API_URL}/menuItems/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

/**
 * API Cập nhật thông tin nhà hàng
 * (Dùng cho trang Cài đặt Cửa hàng)
 */
export const updateRestaurant = async (restaurantId: string | number, data: any) => {
  console.log(`GỌI API: Cập nhật quán ID ${restaurantId}`, data);
  const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * API Lấy chi tiết nhà hàng (Để hiển thị trong Settings)
 */
export const fetchRestaurantDetail = async (restaurantId: string | number) => {
    console.log(`GỌI API: Lấy thông tin quán ID ${restaurantId}`);
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}`);
    return handleResponse(response);
};

/**
 * API Cập nhật số dư ví của Merchant
 */
export const updateMerchantWallet = async (id: string | number, newBalance: number) => {
  console.log(`GỌI API: Cập nhật ví merchant (User ID: ${id}) thành ${newBalance}`);
  
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletBalance: newBalance }),
  });
  return handleResponse(response);
};





// ==========================================================
// API DÀNH CHO ADMIN
// ==========================================================

/**
 * API (Admin): Lấy danh sách Users (để lọc ra merchant)
 */
export const apiGetUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return handleResponse(response);
};

/**
 * API (Admin): Cập nhật thông tin Nhà hàng (Duyệt/Khóa)
 */
export const apiUpdateRestaurant = async (id: string | number, data: any) => {
  console.log(`GỌI API: Cập nhật nhà hàng ID: ${id}`, data);
  const response = await fetch(`${API_URL}/restaurants/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * API (Admin): Tạo Nhà hàng mới
 */
export const apiCreateRestaurant = async (data: any) => {
    const response = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
};

