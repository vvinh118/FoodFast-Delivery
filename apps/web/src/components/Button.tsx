import React from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom'; 
import styled from 'styled-components';


// STYLED COMPONENT
const StyledButton = styled.button<ButtonProps>`
  background-color: ${props => props.$background || "#f72d57"};
  border: none;
  color: ${props => props.$color || "white"};
  padding: ${props => props.$padding || "10px 20px"};
  border-radius: ${props => props.$borderRadius || "8px"};
  width: ${props => props.$width || "fit-content"};
  display: ${props => props.$display || "block"};
  font-size: ${props => props.$fontSize || "15px"};
  margin: ${props => props.$margin || "0"};
  box-sizing: border-box;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: ${props => props.$hoverBackground || "#ff5b7a"};
  }
  
  &:disabled {
    background-color: #ccc;
    color: #777;
    cursor: not-allowed;
    box-shadow: none; /* Tắt shadow khi disabled */
  }
`;


const StyledLink = styled(Link)<ButtonProps>`
  background-color: ${props => props.$background || "#f72d57"};
  border: none;
  color: ${props => props.$color || "white"};
  padding: ${props => props.$padding || "10px 20px"};
  border-radius: ${props => props.$borderRadius || "8px"};
  width: ${props => props.$width || "fit-content"};
  display: ${props => props.$display || "block"};
  font-size: ${props => props.$fontSize || "15px"};
  margin: ${props => props.$margin || "0"};
  text-align: center;
  box-sizing: border-box;
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
  $width?: string;
  $display?: string;
  $fontSize?: string;
  $margin?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

// COMPONENT
export default function Button({ 
  to, 
  children, 
  onClick, 
  type = 'button', 
  disabled,
  ...props 
}: ButtonProps) {
  

  if (to && !disabled) {
    return <StyledLink to={to} {...props}>{children}</StyledLink>;
  }
  
  // render một <button>
  return (
    <StyledButton 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
}