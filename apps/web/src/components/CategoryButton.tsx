import styled from 'styled-components';

// STYLED COMPONENT
const StyledButton = styled.button<{ $isActive?: boolean }>`
  padding: 18px 45px;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.95rem;
  
  // Style mặc định
  background-color: #fff;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  box-shadow: 0px 8px 6px -1px rgba(0, 0, 0, 0.1), 0px 5px 4px -1px rgba(0, 0, 0, 0.06);


  &:hover {
    border-color: #f72d57;
    color: #f72d57;
  }

  // Style khi active
  ${props => props.$isActive && `
    background-color: #f72d57;
    border-color: #f72d57;
    color: #fff;
  `}
`;

// TYPE
type CategoryButtonProps = {
  name: string;
  isActive: boolean;
  onClick: () => void;
};

// COMPONENT
export default function CategoryButton({ name, isActive, onClick }: CategoryButtonProps) {
  return (
    <StyledButton onClick={onClick} $isActive={isActive}>
      {name}
    </StyledButton>
  );
}