import { Outlet, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from 'core';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 15px 10px;
  border-bottom: 1px solid #34495e;
  &:hover { background-color: #34495e; }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f4f6f8;
`;

const LogoutButton = styled.button`
    margin-top: auto;
    background: #c0392b;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
`;

export default function AdminLayout() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/admin/login');
  }

  return (
    <AdminContainer>
      <Sidebar>
        <h2>Admin Portal</h2>
        <SidebarItem to="/admin/dashboard">Dashboard</SidebarItem>
        <SidebarItem to="/admin/merchants">Quản lý Đối tác</SidebarItem>
        
        <LogoutButton onClick={handleLogout}>Đăng xuất</LogoutButton>
      </Sidebar>
      <Content>
        <Outlet /> {/* Nơi nội dung thay đổi sẽ hiển thị */}
      </Content>
    </AdminContainer>
  );
}