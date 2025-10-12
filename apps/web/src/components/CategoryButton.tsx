import React from 'react';
import styled from 'styled-components';
// Import các icons cần thiết
import { FaPizzaSlice, FaHamburger, FaLeaf, FaConciergeBell } from "react-icons/fa";

// Data icons (có thể đặt ở file riêng nếu bạn muốn)
const categoryIcons: { [key: string]: React.ElementType } = {
  Pizzas: FaPizzaSlice,
  Burgers: FaHamburger,
  Salads: FaLeaf,
  Combos: FaConciergeBell,
};

// Styled Component cho nút
const StyledButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 20px 55px;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  // Style mặc định
  background-color: #fff;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  box-shadow: 0px 8px 6px -1px rgba(0, 0, 0, 0.1), 0px 5px 4px -1px rgba(0, 0, 0, 0.06);
  svg {
    color: #f72d57;
    font-size: 1.15rem;
  }

  &:hover {
    border-color: #f72d57;
    color: #f72d57;
  }

  // Style khi active
  ${props => props.$isActive && `
    background-color: #f72d57;
    border-color: #f72d57;
    color: #fff;
    svg {
      color: #fff;
    }
  `}
`;

// Component React CategoryButton
type CategoryButtonProps = {
  name: string;
  isActive: boolean;
  onClick: () => void;
};

export default function CategoryButton({ name, isActive, onClick }: CategoryButtonProps) {
  const IconComponent = categoryIcons[name];

  return (
    <StyledButton onClick={onClick} $isActive={isActive}>
      {IconComponent && <IconComponent />}
      {name}
    </StyledButton>
  );
}