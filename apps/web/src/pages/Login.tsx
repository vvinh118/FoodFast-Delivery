import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 

import InputField from '../components/InputField'; 

// Import style từ file AuthStyles
import {
    PageContainer,
    AuthCard,
    HeaderLink,
    LogoPlaceholder,
    Title,
    Form,
    MainButton,
    ForgotPasswordLink,
    Divider,
    SocialButtons,
    SocialButton,
    SignUpPrompt,
    ActionRow
} from '../data/AuthStyle';


interface AccountMap {
    [key: string]: string;
}

const MOCK_ACCOUNTS: AccountMap = {
  'test@foodfast.vn': '1', 
  'user@demo.com': 'password',
};

// === REACT COMPONENT ===
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
        setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        return;
    } 
    
    if (MOCK_ACCOUNTS[email] && MOCK_ACCOUNTS[email] === password) {
      console.log('Login successful: Redirecting...');
      alert('Đăng nhập thành công!');
      login(email); 
      navigate('/home');
      return;
    }
    else {
      setError('Email hoặc Mật khẩu không chính xác');
      return;
    }
  }


  return (

    <PageContainer>
        <AuthCard>
            <HeaderLink to="/Home">
                <FaArrowLeft />
                Về trang chủ
            </HeaderLink>

            <LogoPlaceholder>
                FoodFast Delivery
            </LogoPlaceholder>

            <Title>Đăng nhập</Title>

            <Form onSubmit={handleSubmit}>
                
                {/* InputField component */}
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Nhập Email của bạn"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setError(null);}}
                />
                
                <InputField
                    label="Mật khẩu"
                    id="password"
                    type="password" 
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setError(null);}}
                    error={error} // Lỗi chung sẽ hiển thị ở đây
                />
                
                <ActionRow>
                    <ForgotPasswordLink to="/forgot-password">Quên mật khẩu?</ForgotPasswordLink>
                    <MainButton type="submit">Đăng nhập</MainButton>
                </ActionRow>
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
        </AuthCard>
    </PageContainer>
  );
}