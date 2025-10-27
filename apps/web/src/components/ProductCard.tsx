import styled from 'styled-components';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb; /* Border nhẹ */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  background-color: white;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px); /* Hiệu ứng nổi lên khi hover */
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px; /* Chiều cao cố định cho ảnh */
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
`;

const CardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  color: #f72d57; /* Màu giá tiền nổi bật */
  font-weight: 700;
  margin-top: auto; /* Đẩy giá và nút xuống dưới cùng */
  margin-bottom: 15px;
`;

const AddToCartButton = styled.button`
  background-color: #f72d57;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e31b45;
  }
`;

export default function ProductCard({ name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <CardContainer>
      <ProductImage src={image} alt={name} />
      <CardContent>
        <ProductName>{name}</ProductName>
        <ProductPrice>${price.toFixed(2)}</ProductPrice>
        <AddToCartButton onClick={onAddToCart}>
          Thêm vào giỏ
        </AddToCartButton>
      </CardContent>
    </CardContainer>
  );
}
