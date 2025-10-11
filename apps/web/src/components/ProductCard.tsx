import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductProps {
  product: {
    id: number;
    name: string;
    price: number;
    img: string;
  };
}

function ProductCard({ product }: ProductProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        width: "200px",
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.img}
        alt={product.name}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h4>{product.name}</h4>
      <p>{product.price.toLocaleString()}₫</p>
    </div>
  );
}

export default ProductCard;
