import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom'; 
import styled from 'styled-components';

// === STYLED COMPONENTS ===

const StyledButton = styled.button<ButtonProps>`
  background-color: ${props => props.$background || "#f72d57"};
  border: none;
  color: ${props => props.$color || "white"};
  padding: ${props => props.$padding || "10px 20px"};
  border-radius: ${props => props.$borderRadius || "8px"};
  max-width: ${props => props.$maxWidth || "fit-content"};
  display: ${props => props.$display || "block"};
  font-size: ${props => props.$fontSize || "20px"};
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: ${props => props.$hoverBackground || "#ff5b7a"};
  }
`;


const StyledLink = styled(Link)<ButtonProps>`
  background-color: ${props => props.$background || "#f72d57"};
  border: none;
  color: ${props => props.$color || "white"};
  padding: ${props => props.$padding || "10px 20px"};
  border-radius: ${props => props.$borderRadius || "8px"};
  max-width: ${props => props.$maxWidth || "fit-content"};
  display: ${props => props.$display || "block"};
  font-size: ${props => props.$fontSize || "20px"};
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06);
  text-decoration: none;

  &:hover {
    background-color: ${props => props.$hoverBackground || "#ff5b7a"};
  }
`;


interface ButtonProps extends Omit<LinkProps, 'to'> { 
  to?: LinkProps['to']; 
  children: React.ReactNode;
  onClick?: () => void;
  $background?: string;
  $hoverBackground?: string;
  $padding?: string;
  $borderRadius?: string;
  $color?: string;
  $maxWidth?: string;
  $display?: string;
  $fontSize?: string;
}

// === COMPONENT CHÍNH ===
export default function Button({ to, children, onClick, ...props }: ButtonProps) {
  if (to) {
    return <StyledLink to={to} {...props}>{children}</StyledLink>;
  }
  
  return <StyledButton onClick={onClick} {...props}>{children}</StyledButton>;
}
