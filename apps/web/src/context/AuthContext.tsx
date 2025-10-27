import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Định nghĩa kiểu dữ liệu (Interface) cho Context
interface AuthContextType {
  isLoggedIn: boolean;
  user: any; // Thêm user (bạn nên thay 'any' bằng kiểu User cụ thể)
  login: (userData: any) => void; // Sửa lại để nhận userData
  logout: () => void;
  isProfileSidebarOpen: boolean;
  toggleProfileSidebar: () => void;
}

// 2. Tạo Context Object
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. Component Provider chính
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null); // Thêm state cho user
  const navigate = useNavigate();
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  const login = (userData: any) => { 
    setIsLoggedIn(true);
    setUser(userData); // Lưu thông tin user
    
    // Giả lập thông tin user nếu đăng nhập mà không có data
    if (!userData) {
      setUser({ name: "Võ Minh Thư", email: "test@foodfast.vn" });
    }

    navigate('/'); 
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); // Xóa thông tin user
    navigate('/login'); 
  };

  const toggleProfileSidebar = () => {
        setIsProfileSidebarOpen(prev => !prev);
    };

  const value = {
    isLoggedIn,
    user, 
    login,
    logout,
    isProfileSidebarOpen,
    toggleProfileSidebar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};