import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import RestaurantList from "./pages/RestaurantList";


function App() {
  return (
    <div>
    

      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/product" element={<Product />} />
        {/* <Route path="/restaurants" element={<RestaurantList />} /> */}
      </Routes>
    </div>
  );
}

export default App;
