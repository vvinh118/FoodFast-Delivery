import React from 'react';
import { Routes, Route, Link } from "react-router-dom"; 
import Home from "./pages/Home";
import Product from "./pages/Product"; 
import RestaurantList from "./pages/RestaurantList";
import Login from "./pages/Login"; 
import GlobalStyle from "./GlobalStyles";
import MenuItemList from "./pages/MenuItemList";
import ShoppingCart from "./pages/ShoppingCart";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

function App() {
  return (
    <CartProvider>
    <div>
      <GlobalStyle /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<MenuItemList />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </div>

    <CartSidebar /> {/* Thêm CartSidebar vào App */}  
    </CartProvider>
  );

}

export default App;