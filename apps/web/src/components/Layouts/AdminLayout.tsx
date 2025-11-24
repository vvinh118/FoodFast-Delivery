import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from 'core';
import { FaChartPie, FaStore, FaSignOutAlt } from 'react-icons/fa';


const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f8;
`;

const Sidebar = styled.div`
  width: 260px;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* Không cho co lại */
`;

const SidebarTitle = styled.h2`
  text-align: center;
  margin: 30px 0;
  font-size: 1.5rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Dùng NavLink để tự động có class 'active' khi đang ở trang đó
const SidebarItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #bdc3c7;
  text-decoration: none;
  padding: 15px 25px;
  border-left: 4px solid transparent;
  transition: all 0.2s;
  font-size: 1rem;
  
  &:hover {
    background-color: #34495e;
    color: white;
  }
  
  /* Style khi đang chọn (Active) */
  &.active {
    background-color: #34495e;
    color: #F72D57; /* Màu thương hiệu */
    border-left-color: #F72D57;
    font-weight: 600;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto; /* Cho phép cuộn nếu nội dung dài */
`;

const LogoutButton = styled.button`
    margin-top: auto; /* Đẩy nút xuống đáy */
    margin-bottom: 20px;
    background: transparent;
    color: #e74c3c;
    border: 1px solid #e74c3c;
    padding: 12px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-weight: bold;
    transition: all 0.2s;

    &:hover {
        background: #e74c3c;
        color: white;
    }
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
        <SidebarTitle>Admin Portal</SidebarTitle>
        
        <SidebarItem to="/admin/dashboard" end>
            <FaChartPie /> Tổng quan
        </SidebarItem>
        
        <SidebarItem to="/admin/merchants">
            <FaStore /> Quản lý Đối tác
        </SidebarItem>

        <SidebarItem to="/admin/users">
            <FaStore /> Quản lý Khách hàng
        </SidebarItem>
        
        <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Đăng xuất
        </LogoutButton>
      </Sidebar>
      
      <Content>
        <Outlet /> 
      </Content>
    </AdminContainer>
  );
}