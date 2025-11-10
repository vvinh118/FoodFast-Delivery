// apps/web/src/components/CategoryCard.tsx

import React from "react";
import styled from "styled-components";


interface CategoryCardProps {
  name: string;
  iconUrl: string; 
  $isActive: boolean;
  onClick: () => void;
}


interface StyledProps {
    $isActive: boolean;
    onClick: () => void;
}


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


// Component chính
const CategoryCard: React.FC<CategoryCardProps> = ({ name, iconUrl, $isActive, onClick }) => {
  return (
    <StyledCategoryCard $isActive={$isActive} onClick={onClick}>
      <CategoryIcon src={iconUrl} alt={name} />
      <CategoryName>{name}</CategoryName>
    </StyledCategoryCard>
  );
};

export default CategoryCard;