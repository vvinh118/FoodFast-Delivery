import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";

const HeaderContainer = styled.header` //header bự
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffff;
  padding: 15px 40px;
  color: white;
`;

const Logo = styled.h1` //logo FOODFAST DELIVERY
  font-size: 25px;
  font-weight: bold;
  color: #F72D57;
`;

const Nav = styled.nav` //Trang chủ, Danh Mục
  display: flex;
  align-items: center;
  gap: 20px;
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

const CartLink = styled(Link)` //icon giỏ hàng
  color: #F72D57;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #ff5b7a;
  }
`;

const SignUpButton = styled.button` //nút đăng ký
  background-color: #ff2f5a;
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #ff5b7a;
  }
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Logo>FoodFast Delivery</Logo>

      <Nav>
        <NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/products">Danh Mục</NavLink>
        <CartLink to="/cart">
          <FaShoppingCart size={22} />
        </CartLink>
        <Link to="/signup">
          <SignUpButton>Đăng Nhập</SignUpButton>
        </Link>
      </Nav>
    </HeaderContainer>
  );
}
