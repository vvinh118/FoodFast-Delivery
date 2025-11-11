import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../services/api'; 

interface AuthContextType {
  isLoggedIn: boolean;
  user: any; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isProfileSidebarOpen: boolean;
  toggleProfileSidebar: () => void;
  authLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Component Provider chính
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null); 
  const navigate = useNavigate();
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = async (email: string, password: string) => { 
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response: any = await apiLogin(email, password); 
      
      // Nếu thành công (API không ném lỗi)
      setIsLoggedIn(true);
      setUser(response.user); // Lưu user từ API trả về
      navigate('/'); // Điều hướng về trang chủ

    } catch (err: any) {
      // Nếu thất bại (API ném lỗi "Sai tài khoản...")
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); 
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
    authLoading,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};