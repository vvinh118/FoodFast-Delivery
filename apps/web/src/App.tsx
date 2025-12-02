import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Home from "./pages/Home";
import RestaurantList from "./pages/RestaurantList";
import Login from "./pages/Login"; 
import GlobalStyle from "./GlobalStyles";
import MenuItemList from "./pages/MenuItemList";
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from "./pages/OrderSuccess";
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
import MerchantLayout from './components/merchant/MerchantLayout';
import MerchantDashboard from './components/merchant/MerchantDashboard';
import MerchantMenu from './components/merchant/MerchantMenu';
import MerchantSettings from './components/merchant/MerchantSettings';
import MerchantLogin from './components/merchant/MerchantLogin';
import MerchantOrders from "./components/merchant/MerchantOrders";
import MerchantHistory from "./components/merchant/MerchantHistory";
import MerchantWallet from "./components/merchant/MerchantWallet";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import MerchantManagement from "./pages/Admin/MerchantManagement";
import UserManagement from "./pages/Admin/UserManagement";
import AdminLayout from "./components/Layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DroneManagement from "./pages/Admin/DroneManagement";
import DroneTracking from "./pages/Admin/DroneTracking";

import OrderTracking from "./pages/OrderTracking";

function App() {
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
          {/* CUSTOMER */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id" element={<MenuItemList />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/support" element={<Support />} />
            <Route path="/tracking/:id" element={<OrderTracking />} />
            
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

          <Route path="/merchant" element={<MerchantLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />          
            <Route path="dashboard" element={<MerchantDashboard />} />
            <Route path="orders" element={<MerchantOrders />} />
            <Route path="history" element={<MerchantHistory />} />
            <Route path="menu" element={<MerchantMenu />} />
            <Route path="wallet" element={<MerchantWallet />} />
            <Route path="settings" element={<MerchantSettings />} />
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/merchant/login" element={<MerchantLogin />} />


          {/* ADMIN */}
          <Route path="/admin/login" element={<Login mode="admin" />} />
          <Route element={<ProtectedRoute allowedRole="admin" redirectPath="/admin/login" />}>
              <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="merchants" element={<MerchantManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="drones" element={<DroneManagement />} />
                  <Route path="drone-tracking/:droneId/:orderId?" element={<DroneTracking />} />
              </Route>
          </Route>

        </Routes>
    </div>
  );
}

export default App;