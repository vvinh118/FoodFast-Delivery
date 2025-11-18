import { useEffect } from "react";
import { Routes, Route } from "react-router-dom"; 
import Home from "./pages/Home";
import RestaurantList from "./pages/RestaurantList";
import Login from "./pages/Login"; 
import GlobalStyle from "./GlobalStyles";
import MenuItemList from "./pages/MenuItemList";
import CartSidebar from "./components/CartSidebar";
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from "./pages/OrderSuccess";
import ProfileSidebar from './components/ProfileSideBar';
import UserProfile from './pages/UserProfile';
import GeneralInfo from './pages/Profile/GeneralInfo';
import Details from './pages/Profile/Details';
import RewardPoint from './pages/Profile/RewardPoint';
import OrderHistory from './pages/Profile/OrderHistory';
import MainLayout from './components/MainLayout';
import MyOrders from './pages/MyOrders';
import FakePaymentPage from './pages/FakePaymentPage';
import Support from './pages/Support';
import { useAuthStore, useCartStore } from 'core';
import ScrollToTop from "./components/ScrollToTop";

function App() {
  // Tự động xóa giỏ hàng khi khởi động mà ko thấy đã đăng nhập
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const clearCart = useCartStore(state => state.clearCart);
  useEffect(() => {
    if (!isLoggedIn) {
      clearCart();
    }
  }, [isLoggedIn, clearCart]);

  return (
    <div>
        <ScrollToTop />
        <GlobalStyle />
        
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<MenuItemList />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/support" element={<Support />} />
            
            <Route path="/userProfile" element={<UserProfile />}>
                <Route index element={<GeneralInfo />} /> 
                <Route path="details" element={<Details />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="reward-point" element={<RewardPoint />} />
            </Route>
          </Route>
            
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/fake-payment-gateway" element={<FakePaymentPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>

      <CartSidebar />
      <ProfileSidebar />
    </div>
  );
}

export default App;