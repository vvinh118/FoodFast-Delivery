import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Dùng để điều hướng trang

// Bạn có thể import các icon (ví dụ: Star, Pin, Clock) từ một thư viện icon
// import { Star, MapPin, Clock } from 'lucide-react'; 
// (Giả sử bạn đang dùng lucide-react hoặc tương tự)

// Định nghĩa kiểu dữ liệu (Props) cho component
interface RestaurantCardProps {
  // Dữ liệu mẫu (sẽ được lấy từ API thực tế)
  id: number;
  name: string;
  address: string;
  rating: number;
  distance: number;
  deliveryTime: number;
  imageUrl: string;
  isPromo: boolean;
}

// ==========================================================
// 2. STYLED COMPONENTS (CSS-IN-JS)
// ==========================================================

// Container chính của thẻ quán ăn
const CardContainer = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px); /* Hiệu ứng nổi lên khi di chuột */
  }
`;

// Container ảnh (chứa ảnh và thẻ promo tag)
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  /* Tỉ lệ 3:2. Điều chỉnh nếu cần */
  padding-top: 66.66%; 
  overflow: hidden;
`;

const RestaurantImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Thẻ Promo (Ví dụ: "Promo" hoặc "Miễn phí ship")
const PromoTag = styled.span`
  position: absolute;
  top: 10px;
  left: 0;
  background-color: #F72D57; 
  color: white;
  padding: 4px 8px;
  border-radius: 0 4px 4px 0;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 10;
`;

// Container chứa thông tin chi tiết (tên, rating, khoảng cách)
const InfoWrapper = styled.div`
  padding: 12px 12px 16px;
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 4px;
  color: #333;
`;

const AddressText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  color: #666;

  /* Style cho icon và text chi tiết */
  span {
    display: flex;
    align-items: center;
  }
`;

// ==========================================================
// 3. COMPONENT CHÍNH
// ==========================================================

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  address,
  rating,
  distance,
  deliveryTime,
  imageUrl,
  isPromo,
  // Thêm các props khác
}) => {
  const navigate = useNavigate(); // Khởi tạo hook navigate

  // Hàm xử lý khi click vào thẻ
  const handleClick = () => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <CardContainer onClick={handleClick}>
      <ImageWrapper>
        {isPromo && <PromoTag>Promo</PromoTag>}
        <RestaurantImage src={imageUrl} alt={name} />
      </ImageWrapper>

      <InfoWrapper>
        <RestaurantName>{name}</RestaurantName>
        <AddressText>{address}</AddressText>
        
        <DetailsRow>
          {/* Đánh giá (Rating) */}
          <span>
            {/* {Icon (Star)} */}
            {rating}
          </span>
          {/* Khoảng cách */}
          <span>
            {/* {Icon (MapPin)} */}
            {distance} km
          </span>
          {/* Thời gian giao hàng */}
          <span>
            {/* {Icon (Clock)} */}
            {deliveryTime} phút
          </span>
        </DetailsRow>
      </InfoWrapper>
    </CardContainer>
  );
};

export default RestaurantCard;