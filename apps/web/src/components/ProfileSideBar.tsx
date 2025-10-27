import React from 'react';
import styled from 'styled-components';
import { FaUserCircle, FaSignOutAlt, FaCog, FaHistory } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 
import { Link } from 'react-router-dom';
import Button from './Button';

import { Overlay, SidebarFrame, CloseButton } from '../components/SideBarStyle'; 

// ==========================================================
// 1. STYLED COMPONENTS 
// ==========================================================

const ProfileHeader = styled.div`
    padding: 30px 20px 20px 20px;
    border-bottom: 1px solid #eee;
    text-align: center;
    position: relative;
`;

const UserAvatar = styled(FaUserCircle)`
    font-size: 80px;
    color: #F72D57;
    margin-bottom: 15px;
`;

const UserName = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
`
const UserEmail = styled.p`
    font-size: 0.9rem;
    color: #999;
`


const ProfileMainContent = styled.div`
    flex-grow: 1; 
    overflow-y: auto; 
    padding: 20px 30px; 
`;

const NavList =  styled.nav`
    display: flex;
    flex-direction: column;
    gap: 10px; 
`;

const NavItem = styled(Link)`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 16px 20px;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 20px;
    transition: background 0.2s, color 0.2s;

    svg {
        font-size: 18px;
        color: #F72D57;
        transition: color 0.2s;
    }

    &:hover {
        background: #fdf2f4;
        color: #F72D57;
    }
`;

const ProfileFooter = styled.div`
    display: flex;
    justify-content: center;    
    padding: 35px;
    border-top: 1px solid #eee;
    background: #fcfcfc;
`;


// ==========================================================
// 2. COMPONENT CHÍNH
// ==========================================================

const ProfileSidebar: React.FC = () => {
    
    const { isProfileSidebarOpen, toggleProfileSidebar, logout, user } = useAuth();
    const displayUser = user || { name: "Khách", email: "Vui lòng đăng nhập" };

    const handleLogout = () => {
        logout();
        toggleProfileSidebar(); 
    };

    return (
        <>
            <Overlay $isOpen={isProfileSidebarOpen} onClick={toggleProfileSidebar} />
            
            {/* SidebarFrame */}
            <SidebarFrame $isOpen={isProfileSidebarOpen}>
                
                {/* === 1. PHẦN HEADER === */}
                <ProfileHeader>
                    {/* Nút X nằm ở góc */}
                    <CloseButton 
                        onClick={toggleProfileSidebar} 
                        style={{ top: '15px', left: '15px' }} 
                    >
                        &times;
                    </CloseButton>
                    
                    {/* Nội dung Profile */}
                    <UserAvatar />
                    <UserName>{displayUser.name}</UserName>
                    <UserEmail>{displayUser.email}</UserEmail>
                </ProfileHeader>

                {/* === 2. PHẦN NỘI DUNG CHÍNH === */}
                <ProfileMainContent>
                    <NavList>
                        <NavItem to="/userProfile" onClick={toggleProfileSidebar}>
                            <FaUserCircle /> Hồ Sơ Của Tôi
                        </NavItem>
                        <NavItem to="/profile/orders" onClick={toggleProfileSidebar}>
                            <FaHistory /> Đơn Hàng Của Tôi
                        </NavItem>
                        <NavItem to="/profile/settings" onClick={toggleProfileSidebar}>
                            <FaCog /> Hỗ Trợ
                        </NavItem>
                    </NavList>
                </ProfileMainContent> 

                {/* === 3. PHẦN FOOTER === */}
                <ProfileFooter>
                    <Button 
                        onClick={handleLogout}
                        $width='100%' 
                        $display='block' 
                        $padding='15px' 
                        $fontSize='18px'
                    >
                        <FaSignOutAlt style={{ marginRight: '8px' }}/> 
                        Đăng Xuất
                    </Button>
                </ProfileFooter>   
                
            </SidebarFrame>
        </>
    );
};

export default ProfileSidebar;