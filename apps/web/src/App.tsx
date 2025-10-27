import React from 'react';
import { Routes, Route, Link } from "react-router-dom"; 
import Home from "./pages/Home";
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
import ProfileSidebar from './components/ProfileSideBar';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    
    <div>
     <CartProvider>
      <AuthProvider>
        <GlobalStyle />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<MenuItemList />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/userProfile" element={<UserProfile />} />
      </Routes>
      <CartSidebar />
      <ProfileSidebar />
      </AuthProvider>
     </CartProvider>
    </div>


  );

}

export default App;