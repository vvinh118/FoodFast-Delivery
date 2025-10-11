import React from "react";
import ProductCard from "../components/ProductCard";

const products = [
  { id: 1, name: "Tai nghe Bluetooth", price: 590000, img: "https://i.ytimg.com/vi/ng3vo1RmeyQ/maxresdefault.jpg" },
  { id: 2, name: "Chuột không dây", price: 299000, img: "https://i.ytimg.com/vi/ng3vo1RmeyQ/maxresdefault.jpg" },
];

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách sản phẩm</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;
