// Địa chỉ của API server giả (json-server)
const API_URL = 'http://localhost:3001';

/**
 * Xử lý lỗi chung cho fetch
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Kiểm tra xem server trả về JSON hay TEXT
    const contentType = response.headers.get("content-type");
    let errorText = 'Đã có lỗi xảy ra';

    if (contentType && contentType.indexOf("application/json") !== -1) {
      // Nếu là JSON, đọc lỗi JSON
      const error = await response.json();
      errorText = error.message || 'Lỗi từ server (JSON)';
    } else {
      // Nếu là TEXT (như "Not Found"), đọc lỗi TEXT
      errorText = await response.text(); 
    }
    // Ném lỗi (ví dụ: "Not Found")
    throw new Error(errorText); 
  }
  
  // Nếu response OK, trả về JSON
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
 * API Lấy danh sách NHÀ HÀNG (cho Trang Home và RestaurantList)
 */
export const fetchRestaurants = async () => {
  console.log("GỌI API (json-server): Lấy danh sách NHÀ HÀNG");
  const response = await fetch(`${API_URL}/restaurants`);
  return handleResponse(response); 
};

/**
 * API Lấy danh sách CATEGORIES (cho Trang RestaurantList)
 */
export const fetchCategories = async () => {
  console.log("GỌI API (json-server): Lấy danh sách CATEGORIES");
  const response = await fetch(`${API_URL}/categories`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết 1 NHÀ HÀNG BẰNG ID
 * (Dùng cho trang MenuItemList)
 */
export const fetchRestaurantById = async (id: string) => {
  console.log(`GỌI API: Lấy chi tiết nhà hàng ID: ${id}`);
  const response = await fetch(`${API_URL}/restaurants/${id}`);
  return handleResponse(response); 
};

/**
 * API Lấy chi tiết MÓN ĂN của 1 NHÀ HÀNG
 * (Dùng cho trang MenuItemList)
 */
export const fetchMenuByRestaurant = async (restaurantId: string) => {
  console.log(`GỌI API: Lấy menu của nhà hàng ID: ${restaurantId}`);
  
  // json-server hỗ trợ lọc theo thuộc tính
  const response = await fetch(`${API_URL}/menuItems?restaurantId=${restaurantId}`);
  return handleResponse(response); 
};

/**
 * API Đăng ký (Tạo User mới)
 */
export const apiRegister = async (userData: any) => {
  console.log("GỌI API: Đang thử đăng ký với email", userData.email);

  // 1. Kiểm tra xem email đã tồn tại chưa
  const emailCheckResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
  const existingUsers = await emailCheckResponse.json();

  if (existingUsers.length > 0) {
    // Nếu đã có user, ném lỗi
    throw new Error('Email này đã được đăng ký');
  }

  // 2. Nếu email chưa có, tạo user mới
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData), // Gửi data (name, email, password...)
  });

  return handleResponse(response);
};

/**
 * API Gửi Đơn Hàng Mới (Trang Checkout)
 */
export const apiSubmitOrder = async (orderData: any) => {
  console.log("GỌI API: Đang gửi đơn hàng...");

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
  
  // Lọc các đơn hàng có `userId` khớp
  // Sắp xếp theo `createdAt` mới nhất
  const response = await fetch(`${API_URL}/orders?userId=${userId}&_sort=createdAt&_order=desc`);

  return handleResponse(response);
};