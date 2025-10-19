import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import RestaurantList from "./pages/RestaurantList";
import MenuItemList from "./pages/MenuItemList";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

function App() {
  return (
    <CartProvider>
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
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
