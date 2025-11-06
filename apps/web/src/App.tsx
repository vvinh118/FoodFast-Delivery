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
import GeneralInfo from './pages/Profile.tsx/GeneralInfo';
import Details from './pages/Profile.tsx/Details';

// (Tạo các file placeholder này trong 'src/pages/profile/' cho các link khác)
const AccountDetails = () => <h2 style={{color: 'blue'}}>TRANG CHI TIẾT TÀI KHOẢN</h2>;
const OrderHistory = () => <h2 style={{color: 'green'}}>TRANG LỊCH SỬ ĐƠN HÀNG</h2>;
const Points = () => <h2 style={{color: 'orange'}}>TRANG ĐIỂM THƯỞNG</h2>;

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
        <Route path="/userProfile" element={<UserProfile />}>
            
            {/* Trang con MẶC ĐỊNH (khi URL là /userProfile) */}
            <Route index element={<GeneralInfo />} /> 
            
            {/* Các trang con khác */}
            <Route path="details" element={<Details />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="points" element={<Points />} />
            {/* Thêm các route cho "Điểm thưởng" v.v... */}
            </Route>
      </Routes>
      <CartSidebar />
      <ProfileSidebar />
      </AuthProvider>
     </CartProvider>
    </div>


  );

}

export default App;