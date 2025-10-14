import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; 
import Home from "../pages/Home.tsx"
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 

// === STYLED COMPONENTS ===

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 450px;
  width: 100%;
  text-align: center;
`;

const HeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 25px;
  align-self: flex-start; 
`;

const LogoPlaceholder = styled.div`
  width: 60px;
  height: 60px;
  background-color: #f72d57;
  border-radius: 12px;
  margin: 0 auto 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: white;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #777;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
`;

const InputGroup = styled.div`
  margin-bottom: 10px;
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

const Input = styled.input<{ $error?: string }>`
  width: 100%;
  box-sizing: border-box; 
  padding: 12px 15px;
  padding-right: 45px; /* Để chừa chỗ cho icon */
  border: 1px solid ${props => props.$error ? '#f72d57' : '#ddd'};
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    border-color: #f72d57;
    outline: none;
    box-shadow: 0 0 0 1px #f72d57;
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

const MainButton = styled.button`
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

const ForgotPasswordLink = styled(Link)`
  color: #f72d57;
  text-decoration: none;
  font-size: 14px;
  align-self: flex-start;
  /* margin-bottom: 15px; Bỏ margin-bottom nếu ActionRow đã có margin */
`;

const Divider = styled.div`
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

const SocialButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
`;

const SocialButton = styled.button`
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

const SignUpPrompt = styled.p`
  font-size: 14px;
  color: #777;

  a {
    color: #f72d57;
    font-weight: 600;
    text-decoration: none;
  }
`;

const ActionRow = styled.div`
    display: flex;
    flex-direction: column;
`;

// === REACT COMPONENT ===
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
    } else {
        setError('Mật khẩu không chính xác!'); // Giả lập lỗi
        console.log('Đăng nhập với:', { email, password });
    }
  };

  return (
    <LoginPageContainer>
        <LoginCard>
            <HeaderLink to="/Home">
                <FaArrowLeft />
                Về trang chủ
            </HeaderLink>

            <LogoPlaceholder>
                F
            </LogoPlaceholder>

            <Title>Đăng nhập</Title>
            <Subtitle>Đăng nhập vào tài khoản FOODFAST của bạn</Subtitle>

            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="Nhập Email của bạn"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value); setError(null);}}
                    />
                </InputGroup>

                <InputGroup>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <InputWrapper>
                        <Input 
                            id="password" 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="••••••"
                            $error={error ? 'true' : undefined} 
                            value={password}
                            onChange={(e) => {setPassword(e.target.value); setError(null);}}
                        />
                        <TogglePassword onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </TogglePassword>
                    </InputWrapper>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </InputGroup>
                
                <ActionRow>
                    <ForgotPasswordLink to="/forgot-password">Quên mật khẩu?</ForgotPasswordLink>
                    <MainButton type="submit">Đăng nhập</MainButton>
                </ActionRow>
                {/* KẾT THÚC SỬA BỐ CỤC */}
            </Form>

            <Divider>HOẶC</Divider>

            <SocialButtons>
                <SocialButton>
                    <FcGoogle /> Google
                </SocialButton>
                <SocialButton>
                    <FaFacebook color="#1877F2" /> Facebook
                </SocialButton>
            </SocialButtons>

            <SignUpPrompt>
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay.</Link>
            </SignUpPrompt>
        </LoginCard>
    </LoginPageContainer>
  );
}
