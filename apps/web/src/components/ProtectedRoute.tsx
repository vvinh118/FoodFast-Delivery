import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from 'core';

interface ProtectedRouteProps {
  allowedRole: 'admin' | 'merchant' | 'customer';
  redirectPath: string;
}

const ProtectedRoute = ({ allowedRole, redirectPath }: ProtectedRouteProps) => {
  const user = useAuthStore(state => state.user);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  // 1. Chưa đăng nhập -> Về trang login
  if (!isLoggedIn || !user) {
    return <Navigate to={redirectPath} replace />;
  }

  // 2. Đăng nhập rồi nhưng sai quyền (Ví dụ khách hàng cố vào trang admin)
  if (user.role !== allowedRole) {
    return (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
            <h1>403 - Forbidden</h1>
            <p>Bạn không có quyền truy cập trang này.</p>
        </div>
    );
  }

  // 3. Đúng quyền -> Cho vào
  return <Outlet />;
};

export default ProtectedRoute;