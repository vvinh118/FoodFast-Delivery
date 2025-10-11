import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#333",
        color: "white",
        padding: "10px 20px",
      }}
    >
      <h3>FoodFast Delivery</h3>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Trang chủ</Link>
        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>Giỏ hàng</Link>
      </nav>
    </header>
  );
}

export default Header;
