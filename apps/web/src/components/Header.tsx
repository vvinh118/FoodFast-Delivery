import styled from "styled-components";
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
// (Hãy đảm bảo đường dẫn 'core' này là đúng)
import { useCartStore, useAuthStore } from 'core'; 
import React, { useState } from "react"; 

// ==================================================
// 1. STYLED COMPONENTS (Đầy đủ)
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
  
  /* Thêm media query để giảm padding trên mobile */
  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Logo = styled(Link)` 
  font-size: 25px;
  font-weight: bold;
  color: #F72D57;
  text-decoration: none;
`;

const Nav = styled.nav` 
  display: flex;
  align-items: center;
  gap: 40px;
  font-size: large;

  @media (max-width: 768px) {
    gap: 20px; /* Giảm khoảng cách trên mobile */
  }
`;

const NavLink = styled(Link)` 
  color: black;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #F72D57;
  }
`;

// ==================================================
// 2. STYLED COMPONENTS MỚI CHO RESPONSIVE
// ==================================================

// Component này giờ CHỈ bọc các link ẨN trên mobile
const DesktopNav = styled.div`
    display: flex;
    align-items: center;
    gap: 40px; 

    @media (max-width: 768px) {
        display: none; /* Ẩn text links và profile icon */
    }
`;

// Icon Giỏ hàng (Luôn hiển thị)
const CartContainer = styled.div`
    position: relative;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    
    /* Luôn hiển thị */

    &:hover { color: #F72D57; }
`;

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
`;

// Icon Profile (Sẽ bị ẩn trên mobile)
const ProfileIconButton = styled.div`
    color: #F72D57;
    font-size: 30px;  
    transition: color 0.2s;
    cursor: pointer; 
    display: flex; 
    align-items: center;

    &:hover { color: #ff5b7a; }
`;


// Icon hamburger (3 gạch)
const HamburgerIcon = styled.div`
    display: none; /* Ẩn trên desktop */
    font-size: 24px;
    color: #F72D57;
    cursor: pointer;

    @media (max-width: 768px) {
        display: flex; /* Hiện trên mobile */
        align-items: center;
    }
`;

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

    /* Style cho các link CHỮ */
    & > ${NavLink} {
        font-size: 1.8rem; 
        color: #F72D57;
        font-weight: 700;
    }

    /* Style cho các link ICON */
    .mobile-icon-link {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 1.5rem;
        color: #333;
        text-decoration: none;
        font-weight: 500;

        svg {
            color: #F72D57;
        }
    }
`;

// Nút đóng (X)
const CloseIcon = styled.div`
    position: absolute;
    top: 20px; 
    right: 20px; 
    font-size: 30px;
    color: #333;
    cursor: pointer;
`;


// ==================================================
// 3. COMPONENT CHÍNH (Đã cập nhật JSX)
// ==================================================

export default function Header() {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const toggleProfileSidebar = useAuthStore(state => state.toggleProfileSidebar);

    const totalItems = useCartStore(state => state.totalItems);
    const toggleCart = useCartStore(state => state.toggleCart);
    
    const handleCartClick = () => {
        toggleCart(); 
    };

    const handleProfileClick = () => {
        toggleProfileSidebar(); 
    };

    // Hàm này đóng menu mobile KHI bấm vào 1 link
    const handleMobileLinkClick = () => {
        toggleMobileMenu();
    };

    return (
        <> 
            <HeaderContainer>
                <Logo to="/home">FoodFast Delivery</Logo>

                <Nav>
                    {/* DesktopNav giờ chỉ chứa các mục bị ẩn */}
                    <DesktopNav>
                        <NavLink to="/">Trang chủ</NavLink>
                        <NavLink to="/restaurants">Danh Mục</NavLink>
                        
                        {isLoggedIn ? (
                            <ProfileIconButton onClick={handleProfileClick}>
                                <FaUserCircle />
                            </ProfileIconButton>
                        ) : (
                            <Button to="/login">Đăng Nhập</Button>
                        )}
                    </DesktopNav>

                    {/* CartContainer nằm ngoài và luôn hiển thị */}
                    <CartContainer onClick={handleCartClick}> 
                        <FaShoppingCart size={22} /> 
                        {totalItems > 0 && (
                            <CartBadge>
                                {totalItems > 99 ? '99+' : totalItems}
                            </CartBadge>
                        )}
                    </CartContainer>

                    {/* Icon Hamburger (chỉ hiện trên mobile) */}
                    <HamburgerIcon onClick={toggleMobileMenu}>
                        <FaBars />
                    </HamburgerIcon>
                </Nav>
            </HeaderContainer>


            {/* Menu Mobile (Đã xóa link giỏ hàng) */}
            <MobileMenu $isOpen={isMobileMenuOpen}>
                <CloseIcon onClick={toggleMobileMenu}>
                    <FaTimes />
                </CloseIcon>

                {/* Các link trang */}
                <NavLink to="/" onClick={handleMobileLinkClick}>
                    Trang chủ
                </NavLink>
                <NavLink to="/restaurants" onClick={handleMobileLinkClick}>
                    Danh Mục
                </NavLink>

                <hr style={{width: '80%', border: 'none', borderBottom: '1px solid #eee'}} />
                
                {/* Link Tài khoản/Đăng nhập (vẫn giữ lại) */}
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
                
                {/* ĐÃ XÓA LINK GIỎ HÀNG KHỎI ĐÂY */}
                
            </MobileMenu>
        </>
    );
}