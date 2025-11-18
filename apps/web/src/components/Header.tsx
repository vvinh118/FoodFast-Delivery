import styled from "styled-components";
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCartStore, useAuthStore } from 'core';

// STYLED COMPONENTS
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
`;

const NavLink = styled(Link)` 
  color: black;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #F72D57;
  }
`;

const CartContainer = styled.div` 
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    
    svg {
        stroke: #F72D57;
        stroke-width: 40;
        fill: white;
    }

    &:hover svg {
        fill: #ff5b7a;
    }
`;

const CartBadge = styled.div`
    position: absolute;
    top: -8px;
    right: -10px;
    background-color: #F72D57;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    pointer-events: none;
`;

const ProfileIconButton = styled.div`
    color: #F72D57;
    font-size: 30px;    
    transition: color 0.2s;
    cursor: pointer;
    display: flex; 
    align-items: center;

    &:hover {
        color: #ff5b7a;
    }
`;


export default function Header() {
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

    return (
        <HeaderContainer>
            <Logo to="/home">FoodFast Delivery</Logo>

            <Nav>
                <NavLink to="/">Trang chủ</NavLink>
                <NavLink to="/restaurants">Danh Mục</NavLink>
                
                <CartContainer onClick={handleCartClick}> 
                    <FaShoppingCart size={22} /> 
                    
                    {totalItems > 0 && (
                        <CartBadge>
                            {totalItems > 99 ? '99+' : totalItems}
                        </CartBadge>
                    )}
                </CartContainer>
                
                {isLoggedIn ? (
                    <ProfileIconButton onClick={handleProfileClick}>
                        <FaUserCircle />
                    </ProfileIconButton>
                ) : (
                    <Button to="/login">Đăng Nhập</Button>
                )}

            </Nav>
        </HeaderContainer>
    );
}