import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// === STYLED COMPONENTS ===

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ $error?: boolean; $isPassword?: boolean }>`
  width: 100%;
  box-sizing: border-box; 
  padding: 12px 15px;
  padding-right: ${props => props.$isPassword ? '45px' : '15px'};
  border: 1px solid ${props => props.$error ? '#f72d57' : '#ddd'};
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #f72d57;
    outline: none;
    box-shadow: 0 0 0 1px #f72d57;
  }
  
  &:disabled {
    background-color: #f0f0f0;
    color: #999;
    cursor: not-allowed;
  }
`;

const TogglePassword = styled.span`
  position: absolute;
  right: 15px;
  cursor: pointer;
  color: #999;
`;

const ErrorMessage = styled.p`
  color: #f72d57;
  font-size: 13px;
  margin-top: 5px;
`;

// === INTERFACE ===

interface InputFieldProps {
    label: string;
    id: string;
    type: 'text' | 'email' | 'password' | 'tel' | 'date';
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | null; 
    name?: string; 
    disabled?: boolean;
}

// === REACT COMPONENT ===
const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    id, 
    type, 
    placeholder, 
    value, 
    onChange, 
    error,
    name,
    disabled
}) => {
  
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <InputGroup>
        <Label htmlFor={id}>{label}</Label>
        <InputWrapper>
            <Input 
                id={id} 
                name={name || id}
                type={currentType} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                $error={!!error}
                $isPassword={isPassword}
                disabled={disabled}
            />
            {isPassword && (
                <TogglePassword onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </TogglePassword>
            )}
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputGroup>
  );
};

export default InputField;