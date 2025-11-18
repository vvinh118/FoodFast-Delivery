// Địa chỉ của API server giả (json-server)
// const API_URL = 'http://localhost:3001';
const API_URL = 'http://172.20.10.12:3001'; // Thay bằng địa chỉ IP của máy chạy json-server

/**
 * Xử lý lỗi chung cho fetch
 */
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
  console.log("GỌI API (json-server): Đang thử đăng nhập với", email);
  const response = await fetch(`${API_URL}/users?email=${email}`);
  const users = await handleResponse(response);
  if (users.length > 0 && users[0].password === password) {
    console.log("API TRẢ VỀ: Thành công");
    return {
      token: 'jwt-token-from-json-server-123',
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
export const fetchRestaurants = async () => {
  console.log("GỌI API (json-server): Lấy danh sách NHÀ HÀNG");
  const response = await fetch(`${API_URL}/restaurants`);
  return handleResponse(response); 
};

/**
 * API Lấy danh sách CATEGORIES
 */
export const fetchCategories = async () => {
  console.log("GỌI API (json-server): Lấy danh sách CATEGORIES");
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết 1 NHÀ HÀNG BẰNG ID
 */
export const fetchRestaurantById = async (id: string) => {
  console.log(`GỌI API: Lấy chi tiết nhà hàng ID: ${id}`);
  const response = await fetch(`${API_URL}/restaurants/${id}`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết MÓN ĂN của 1 NHÀ HÀNG
 */
export const fetchMenuByRestaurant = async (restaurantId: string) => {
  console.log(`GỌI API: Lấy menu của nhà hàng ID: ${restaurantId}`);
  const response = await fetch(`${API_URL}/menuItems?restaurantId=${restaurantId}`);
  return handleResponse(response); 
};

/**
 * API Đăng ký (Tạo User mới)
 */
export const apiRegister = async (userData: any) => {
  // (Giữ nguyên)
  console.log("GỌI API: Đang thử đăng ký với email", userData.email);
  const emailCheckResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
  const existingUsers = await emailCheckResponse.json();
  if (existingUsers.length > 0) {
    throw new Error('Email này đã được đăng ký');
  }
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

/**
 * API Gửi Đơn Hàng Mới (Trang Checkout)
*/
export const apiSubmitOrder = async (orderData: any) => {
  console.log("GỌI API: Đang gửi đơn hàng (lưu vào db.json)...");
  
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData), // Gửi toàn bộ thông tin đơn hàng
  });

  return handleResponse(response);
};

/**
 * API Lấy Lịch sử Đơn hàng (Trang MyOrders)
 */
export const fetchMyOrders = async (userId: number) => {
  console.log(`GỌI API: Lấy đơn hàng của user ID: ${userId}`);
  const response = await fetch(`${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`);
  return handleResponse(response);
};