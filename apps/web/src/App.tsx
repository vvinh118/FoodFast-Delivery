import React from 'react';
import { Routes, Route, Link } from "react-router-dom"; 
import Home from "./pages/Home";
import Product from "./pages/Product"; 
import RestaurantList from "./pages/RestaurantList";
import Login from "./pages/Login"; 
import GlobalStyle from "./GlobalStyles";
import MenuItemList from "./pages/MenuItemList";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from "./pages/OrderSuccess";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    
    <div>
     <CartProvider>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
        <Route path="/" element={<OrderSuccess />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<MenuItemList />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <CartSidebar />
      </AuthProvider>
     </CartProvider>
    </div>


  );

}

export default App;