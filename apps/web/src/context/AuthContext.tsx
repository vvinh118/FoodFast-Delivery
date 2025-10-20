import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng sau khi đăng nhập/đăng xuất

// 1. Định nghĩa kiểu dữ liệu (Interface) cho Context
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// 2. Tạo Context Object (giá trị mặc định là undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Custom Hook để sử dụng Context (Giúp code sạch hơn)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Ràng buộc: Đảm bảo hook chỉ được dùng trong Provider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. Component Provider chính
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Trạng thái đăng nhập (Giả lập: trong thực tế sẽ dùng token hoặc session)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    setIsLoggedIn(true);
    // Điều hướng về trang chủ sau khi đăng nhập
    navigate('/'); 
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Điều hướng về trang đăng nhập sau khi đăng xuất
    navigate('/login'); 
  };

  const value = {
    isLoggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};