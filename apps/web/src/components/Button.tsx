import React from "react";
import styled from "styled-components";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  background?: string;
  color?: string;
  hoverBackground?: string;
  borderRadius?: string;
  padding?: string;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.background || "#f72d57"};
  color: ${(props) => props.color || "white"};
  border: none;
  padding: ${(props) => props.padding || "10px 20px"};
  border-radius: ${(props) => props.borderRadius || "8px"};
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
  box-shadow: 0px 8px 6px -1px rgba(0, 0, 0, 0.1), 0px 5px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: ${(props) => props.hoverBackground || "#ff5b7a"};
  }
`;

const Button: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props}>{props.children}</StyledButton>;
};

export default Button;
