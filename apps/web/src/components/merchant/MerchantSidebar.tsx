import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaThLarge, FaClipboardList, FaUtensils, FaHistory, FaCog, FaSignOutAlt, FaWallet } from 'react-icons/fa';
import { useAuthStore } from 'core'; 

const SidebarContainer = styled.aside`
    flex-basis: 260px;
    flex-shrink: 0;
    background-color: #ffffff;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: sticky;
    top: 0;
    z-index: 10;
`;

const LogoWrapper = styled.div`
    padding: 30px 25px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f72d57;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
`;

const NavMenu = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    flex-grow: 1;
`;

const StyledNavLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 25px;
    margin: 5px 15px;
    text-decoration: none;
    color: #555;
    font-weight: 500;
    border-radius: 8px;
    transition: background-color 0.2s, color 0.2s;

    svg {
        font-size: 1.1rem;
    }

    &:hover {
        background-color: #fdf2f4;
        color: #f72d57;
    }

    &.active {
        background-color: #f72d57;
        color: white;
    }
`;

const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 25px;
    margin: 20px 15px;
    background: #fcfcfc;
    border: 1px solid #eee;
    border-radius: 8px;
    width: calc(100% - 30px);
    font-size: 1rem;
    font-weight: 500;
    color: #555;
    cursor: pointer;

    &:hover {
        background-color: #eee;
    }
`;

const MerchantSidebar: React.FC = () => {
    const logout = useAuthStore(state => state.logout);

    return (
        <SidebarContainer>
            <LogoWrapper>
                FoodFast Merchant
            </LogoWrapper>
            <NavMenu>
                <StyledNavLink to="/merchant/dashboard">
                    <FaThLarge /> Dashboard
                </StyledNavLink>
                <StyledNavLink to="/merchant/orders">
                    <FaClipboardList /> Quản lý Đơn hàng
                </StyledNavLink>
                <StyledNavLink to="/merchant/menu">
                    <FaUtensils /> Quản lý Thực đơn
                </StyledNavLink>
                <StyledNavLink to="/merchant/history">
                    <FaHistory /> Lịch sử Đơn hàng
                </StyledNavLink>
                <StyledNavLink to="/merchant/wallet">
                    <FaWallet /> Ví tiền
                </StyledNavLink>
                <StyledNavLink to="/merchant/settings">
                    <FaCog /> Cài đặt Cửa hàng
                </StyledNavLink>
            </NavMenu>
            <LogoutButton onClick={logout}>
                <FaSignOutAlt /> Đăng xuất
            </LogoutButton>
        </SidebarContainer>
    );
};

export default MerchantSidebar;