import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 
import { useAuthStore } from 'core';
import { apiLogin } from '../services/api'; 

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

// COMPONENT
export default function Login() {
  const navigate = useNavigate();

  // LẤY STATE VÀ ACTION TỪ STORE
  const loginAction = useAuthStore(state => state.login);
  const setLoading = useAuthStore(state => state.setLoading);
  const setError = useAuthStore(state => state.setError);
  
  // Lấy trạng thái để hiển thị UI
  const authLoading = useAuthStore(state => state.isLoading);
  const authError = useAuthStore(state => state.error);

  // State nội bộ form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation cơ bản
    if (!email.trim() || !password.trim()) {
        setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
        return;
    } 
    
    // Bắt đầu quy trình đăng nhập
    setLoading(true);
    setError(null);

    try {
        // Bước 1: Gọi API
        const response: any = await apiLogin(email, password);
        
        // Bước 2: Kiểm tra và Lưu vào Store
        if (response && response.user) {
            loginAction(response.user); 
            
            // Bước 3: Chuyển hướng
            alert(`Xin chào, ${response.user.name}!`);
            navigate('/home');
        } else {
            throw new Error('Phản hồi từ máy chủ không hợp lệ.');
        }

    } catch (err: any) {
        // Xử lý lỗi
        setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
        setLoading(false);
    }
  }

  return (
    <PageContainer>
        <AuthCard>
            <HeaderLink to="/home">
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
                    onChange={(e) => {
                        setEmail(e.target.value); 
                        if (authError) setError(null);
                    }}
                    disabled={authLoading}
                />
                
                <InputField
                    label="Mật khẩu"
                    id="password"
                    type="password" 
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value); 
                        if (authError) setError(null);
                    }}
                    disabled={authLoading}
                    // Hiển thị lỗi từ Store
                    error={authError} 
                />
                
                <ActionRow>
                    <ForgotPasswordLink to="/forgot-password">Quên mật khẩu?</ForgotPasswordLink>
                    <MainButton type="submit" disabled={authLoading}>
                        {authLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </MainButton>
                </ActionRow>
            </Form>

            <Divider>HOẶC</Divider>

            <SocialButtons>
                <SocialButton type="button">
                    <FcGoogle /> Google
                </SocialButton>
                <SocialButton type="button">
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