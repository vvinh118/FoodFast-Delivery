// apps/web/src/components/CategoryCard.tsx

import React from "react";
import styled from "styled-components";

// 1. CHỈ định nghĩa các props cần thiết cho logic bên ngoài (onClick, name, iconUrl)
// Dùng $isActive cho prop styling
interface CategoryCardProps {
  name: string;
  iconUrl: string; 
  $isActive: boolean; // Transient Prop
  onClick: () => void;
}

// 2. Tạo một Interface riêng cho Styled Component (chỉ chứa props styling)
// Styled Component chỉ cần biết về $isActive và onClick (vì onClick là thuộc tính HTML hợp lệ)
interface StyledProps {
    $isActive: boolean;
    onClick: () => void;
}

// Container chính của thẻ danh mục
// Styled Component KHÔNG nhận CategoryCardProps, mà nhận StyledProps
// Điều này ngăn nó tìm kiếm name và iconUrl để truyền xuống thẻ div
const StyledCategoryCard = styled.div<StyledProps>`
  /* Thiết kế thẻ danh mục */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-shrink: 0; 
  width: 90px;
  height: 90px;
  border-radius: 8px;
  cursor: pointer;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: 500;
  
  /* Style Động dựa trên prop $isActive */
  background-color: ${(props) => (props.$isActive ? '#fddce2ff' : '#f5f5f5ff')};
  border: 2px solid ${(props) => (props.$isActive ? '#f72d57' : 'transparent')};
  color: #333;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #EEEEEE;
  }
`;

const CategoryIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 4px;
  border-radius: 50%; 
  object-fit: cover;
`;

const CategoryName = styled.span`
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
`;


// Component chính nhận CategoryCardProps đầy đủ
const CategoryCard: React.FC<CategoryCardProps> = ({ name, iconUrl, $isActive, onClick }) => {
  // 3. Chỉ truyền $isActive và onClick xuống Styled Component
  return (
    // StyledCategoryCard bây giờ CHỈ yêu cầu $isActive và onClick (do định nghĩa StyledProps)
    <StyledCategoryCard $isActive={$isActive} onClick={onClick}>
      <CategoryIcon src={iconUrl} alt={name} />
      <CategoryName>{name}</CategoryName>
    </StyledCategoryCard>
  );
};

export default CategoryCard;