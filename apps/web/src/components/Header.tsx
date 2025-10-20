import styled from "styled-components";
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from '../context/CartContext'; // Import hook giỏ hàng
import { useAuth } from '../context/AuthContext';


// khung header
const HeaderContainer = styled.header` 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffff;
  padding: 15px 40px;
  color: white;
//box-shadow: 0px 7px 7px -1px rgba(0, 0, 0, 0.06), 0px 1px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Logo = styled.h1` //logo FOODFAST DELIVERY
  font-size: 25px;
  //font-weight: bold;
  color: #F72D57;
`;

const Nav = styled.nav` //Trang chủ, Danh Mục
  display: flex;
  align-items: center;
  gap: 40px;
  font-size: large;
`;

const NavLink = styled(Link)` //link điều hướng
  color: black;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #F72D57;
  }
`;

// Container mới cho Giỏ hàng (Thay thế CartLink cũ)
const CartContainer = styled.div` 
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    
    /* Style cho Icon Giỏ hàng (dùng fill thay vì stroke như mẫu cũ để FaShoppingCart hiển thị đúng màu) */
    svg {
        stroke: #F72D57;
        stroke-width: 40;
        fill: white;
    }

    &:hover svg {
        fill: #ff5b7a; /* Màu hover nhẹ hơn */
    }
`;

// Badge (Số lượng món)
const CartBadge = styled.div`
    position: absolute;
    top: -8px;
    right: -10px;
    background-color: #F72D57; /* Màu đỏ hồng */
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    pointer-events: none; /* Đảm bảo click xuyên qua badge */
`;

// Icon Profile
const ProfileIconLink = styled(Link)`
    color: #F72D57;
    font-size: 30px;  
    transition: color 0.2s;
    &:hover {
        color: #ff5b7a;
    }
`;


export default function Header() {
    const { isLoggedIn } = useAuth();

    const { getTotalItems, toggleCart } = useCart();
    const totalItems = getTotalItems();

    const handleCartClick = () => {
        toggleCart(); // gọi hàm này để mở sidebar giỏ hàng
    };

    return (
        <HeaderContainer>
            <Logo>FoodFast Delivery</Logo>

            <Nav>
                <NavLink to="/">Trang chủ</NavLink>
                <NavLink to="/restaurants">Danh Mục</NavLink>
                
                <CartContainer onClick={handleCartClick}> 
                    <FaShoppingCart size={22} /> 
                    
                    {/* HIỂN THỊ BADGE */}
                    {totalItems > 0 && (
                        <CartBadge>
                            {totalItems > 99 ? '99+' : totalItems}
                        </CartBadge>
                    )}
                </CartContainer>
                
                {isLoggedIn ? (
                    // A. ĐÃ ĐĂNG NHẬP: HIỂN THỊ ICON PROFILE
                    <ProfileIconLink to="/profile">
                        <FaUserCircle />
                    </ProfileIconLink>
                ) : (
                    // B. CHƯA ĐĂNG NHẬP: Hiển thị nút Đăng Nhập
                    <Button to="/login">Đăng Nhập</Button>
                )}

            </Nav>
        </HeaderContainer>
    );
}
