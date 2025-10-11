import React from "react";
import { useParams } from "react-router-dom";

function Product() {
  const { id } = useParams();

  // [Giả lập] dữ liệu sản phẩm (bạn có thể load từ API sau)
  const product = {
    id,
    name: "Tai nghe Bluetooth",
    price: 590000,
    description: "Tai nghe chất lượng cao, âm thanh rõ ràng.",
    img: "https://i.ytimg.com/vi/ng3vo1RmeyQ/maxresdefault.jpg",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <img src={product.img} alt={product.name} style={{ width: "400px" }} />
      <p>{product.description}</p>
      <p><strong>Giá:</strong> {product.price.toLocaleString()}₫</p>
    </div>
  );
}

export default Product;
