import styled from 'styled-components';
import { Link } from 'react-router-dom';

// KHÔNG liên quan đến InputField
// tái sử dụng ở Login và Register

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

export const AuthCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 450px;
  width: 100%;
  text-align: center;
`;

export const HeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 25px;
  align-self: flex-start; 
`;

export const LogoPlaceholder = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #f72d57;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  margin-top: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
`;

export const MainButton = styled.button`
  background-color: #f72d57;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e31b45;
  }
`;

export const ForgotPasswordLink = styled(Link)`
  color: #f72d57;
  text-decoration: none;
  font-size: 14px;
  align-self: flex-end;
  margin-bottom: 15px; 
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  color: #aaa;
  font-size: 14px;

  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #eee;
  }

  &::before {
    margin-right: 15px;
  }

  &::after {
    margin-left: 15px;
  }
`;

export const SocialButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
`;

export const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  svg {
    margin-right: 8px;
    font-size: 18px;
  }
`;

export const SignUpPrompt = styled.p`
  font-size: 14px;
  color: #777;

  a {
    color: #f72d57;
    font-weight: 600;
    text-decoration: none;
  }
`;

export const ActionRow = styled.div`
    display: flex;
    flex-direction: column;
`;