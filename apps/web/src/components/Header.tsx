import styled from "styled-components";
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useCartStore, useAuthStore } from 'core'; 
import React, { useState } from "react"; 

// ==================================================
// 1. STYLED COMPONENTS 
// ==================================================
const HeaderContainer = styled.header` 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffff;
  padding: 15px 40px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 99; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`

const Logo = styled(Link)` 
  font-size: 25px;
  font-weight: bold;
  color: #F72D57;
  text-decoration: none;
`

const Nav = styled.nav` 
  display: flex;
  align-items: center;
  gap: 40px;
  font-size: large;

  @media (max-width: 768px) {
    gap: 20px; /* Giảm khoảng cách trên mobile */
  }
`

const NavLink = styled(Link)` 
  color: black;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #F72D57;
  }
`

// ==================================================
// 2. STYLED COMPONENTS CHO RESPONSIVE
// ==================================================

// SỬA: Đổi tên thành 'DesktopLinks' (Chỉ chứa link text)
const DesktopLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 40px; 

    @media (max-width: 768px) {
        display: none; /* Ẩn text links */
    }
`

// Icon Giỏ hàng (Luôn hiển thị)
const CartContainer = styled.div`
    position: relative;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    &:hover { color: #F72D57; }
`

const CartBadge = styled.div`
    position: absolute;
    top: -8px;
    right: -10px;
    background: #F72D57;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
`

// Icon Profile 
const ProfileIconButton = styled.div`
    color: #F72D57;
    font-size: 30px;  
    transition: color 0.2s;
    cursor: pointer; 
    display: flex; 
    align-items: center;

    &:hover { color: #ff5b7a; }
`

// Sẽ bị ẩn trên mobile
const DesktopAuth = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        display: none;
    }
`

// Icon Menu (3 gạch)
const MenuIcon = styled.div`
    display: none; /* Ẩn trên desktop */
    font-size: 24px;
    color: #F72D57;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex; /* Hiện trên mobile */
        align-items: center;
    }
`

// Menu full-screen cho mobile
const MobileMenu = styled.nav<{ $isOpen: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.98); 
    backdrop-filter: blur(5px);
    z-index: 100; 
    transition: transform 0.3s ease-in-out;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};

    & > ${NavLink} {
        font-size: 1.8rem; 
        color: #F72D57;
        font-weight: 700;
    }
    .mobile-icon-link {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 1.5rem;
        color: #333;
        text-decoration: none;
        font-weight: 500;
        svg { color: #F72D57; }
    }
`

// Nút đóng (X)
const CloseIcon = styled.div`
    position: absolute;
    top: 20px; 
    right: 20px; 
    font-size: 30px;
    color: #333;
    cursor: pointer;
`


// ==================================================
// 3. COMPONENT CHÍNH 
// ==================================================

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const toggleProfileSidebar = useAuthStore(state => state.toggleProfileSidebar);
    const totalItems = useCartStore(state => state.totalItems);
    const toggleCart = useCartStore(state => state.toggleCart);
    const handleCartClick = () => { toggleCart(); };
    const handleProfileClick = () => { toggleProfileSidebar(); };
    const handleMobileLinkClick = () => { toggleMobileMenu(); };

    return (
        <> 
            <HeaderContainer>
                <Logo to="/home">FoodFast Delivery</Logo>

                <Nav>
                    {/* 1. link text (ẩn trên mobile) */}
                    <DesktopLinks>
                        <NavLink to="/">Trang chủ</NavLink>
                        <NavLink to="/restaurants">Danh Mục</NavLink>
                    </DesktopLinks>

                    {/* 2. Giỏ hàng (luôn hiển thị) */}
                    <CartContainer onClick={handleCartClick}> 
                        <FaShoppingCart size={22} /> 
                        {totalItems > 0 && (
                            <CartBadge>
                                {totalItems > 99 ? '99+' : totalItems}
                            </CartBadge>
                        )}
                    </CartContainer>

                    {/* 3. Nút Đăng nhập/Icon Profile (ẩn trên mobile) */}
                    <DesktopAuth>
                        {isLoggedIn ? (
                            <ProfileIconButton onClick={handleProfileClick}>
                                <FaUserCircle />
                            </ProfileIconButton>
                        ) : (
                            <Button to="/login">Đăng Nhập</Button>
                        )}
                    </DesktopAuth>

                    {/* 4. Icon Menu (chỉ hiện trên mobile) */}
                    <MenuIcon onClick={toggleMobileMenu}>
                        <FaBars />
                    </MenuIcon>
                </Nav>
            </HeaderContainer>


            {/* Menu Mobile */}
            <MobileMenu $isOpen={isMobileMenuOpen}>
                <CloseIcon onClick={toggleMobileMenu}>
                    <FaTimes />
                </CloseIcon>

                <NavLink to="/" onClick={handleMobileLinkClick}>
                    Trang chủ
                </NavLink>
                <NavLink to="/restaurants" onClick={handleMobileLinkClick}>
                    Danh Mục
                </NavLink>

                <hr style={{width: '80%', border: 'none', borderBottom: '1px solid #eee'}} />
                
                {isLoggedIn ? (
                    <a href="#" className="mobile-icon-link" onClick={(e) => {
                        e.preventDefault(); 
                        handleProfileClick();
                        handleMobileLinkClick();
                    }}>
                        <FaUserCircle /> Tài khoản
                    </a>
                ) : (
                    <Link to="/login" className="mobile-icon-link" onClick={handleMobileLinkClick}>
                        <FaUserCircle /> Đăng Nhập
                    </Link>
                )}
            </MobileMenu>
        </>
    );
}