import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Lấy hook
import { FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 

import InputField from '../components/InputField'; 

// Import style
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
} from '../components/AuthStyle';


// === REACT COMPONENT ===
export default function Login() {
  const { login, authLoading, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!email || !password) {
        setLocalError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        return;
    } 
    
    
    // Gọi hàm login từ context
    await login(email, password);
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
                
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Nhập Email của bạn"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setLocalError(null);}}
                    disabled={authLoading}
                />
                
                <InputField
                    label="Mật khẩu"
                    id="password"
                    type="password" 
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setLocalError(null);}}
                    disabled={authLoading}
                    // HIỂN THỊ LỖI TỪ CẢ 2 NGUỒN
                    error={localError || authError} 
                />
                
                <ActionRow>
                    <ForgotPasswordLink to="/forgot-password">Quên mật khẩu?</ForgotPasswordLink>
                    <MainButton type="submit" disabled={authLoading}>
                        {authLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </MainButton>
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