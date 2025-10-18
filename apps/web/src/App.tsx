import React from 'react';
import { Routes, Route, Link } from "react-router-dom"; 
import Home from "./pages/Home";
import Product from "./pages/Product"; 
import RestaurantList from "./pages/RestaurantList";
import Login from "./pages/Login"; 
import GlobalStyle from "./GlobalStyles";


function App() {
  return (
  <div>
      <GlobalStyle /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/product/:id" element={<Product />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        
      </Routes>
  </div>
  
);

  
}

export default App;