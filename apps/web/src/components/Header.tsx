import Button from "../components/Button";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";

// khung header
const HeaderContainer = styled.header` 
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffff;
  padding: 15px 40px;
  color: white;
box-shadow: 0px 7px 7px -1px rgba(0, 0, 0, 0.06), 0px 1px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Logo = styled.h1` //logo FOODFAST DELIVERY
  font-size: 25px;
  font-weight: bold;
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

const CartLink = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;

  svg {
    stroke: #F72D57;
    stroke-width: 40;
    fill: white;
  }

  &:hover svg {
    stroke: #ff5b7a;
  }
`;


export default function Header() {
  return (
    <HeaderContainer>
      <Logo>FoodFast Delivery</Logo>

      <Nav>
        <NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/">Danh Mục</NavLink>
        <CartLink to="/"> 
          <FaShoppingCart size={22} /> 
        </CartLink>
        <Button>Đăng Nhập</Button>
      </Nav>
    
    </HeaderContainer>
  );
}
