import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 
import { apiLogin, useAuthStore } from 'core';

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

interface LoginProps {
    mode?: 'customer' | 'admin' | 'merchant';
}

// COMPONENT
export default function Login({ mode = 'customer' }: LoginProps) {
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

  // lấy tiêu đề trang theo mode
  const getPageTitle = () => {
      if (mode === 'admin') return 'Quản trị hệ thống';
      if (mode === 'merchant') return 'Cổng đối tác nhà hàng';
      return 'Đăng nhập';
  };

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
        const response: any = await apiLogin(email, password);
        
        // Kiểm tra phân quyền
        if (response && response.user) {
            const userRole = response.user.role || 'customer';

            // nếu đang ở trang Admin nhưng user không phải admin
            if (mode === 'admin' && userRole !== 'admin') {
                throw new Error('Tài khoản này không có quyền quản trị!');
            }

            // Nếu đang ở trang Merchant nhưng user không phải merchant
            if (mode === 'merchant' && userRole !== 'merchant') {
                throw new Error('Tài khoản này không phải là đối tác bán hàng!');
            }

            // === ĐĂNG NHẬP THÀNH CÔNG ===
            loginAction(response.user); 
            
            // Chuyển hướng về đúng trang Dashboard
            if (mode === 'admin') {
                navigate('/admin/dashboard');
            } else if (mode === 'merchant') {
                navigate('/merchant/dashboard'); // chưa có trang merchant
            } else {
                alert(`Xin chào, ${response.user.name}!`);
                navigate('/home');
            }

        } else {
            throw new Error('Phản hồi từ máy chủ không hợp lệ.');
        }

    } catch (err: any) {
        setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
        setLoading(false);
    }
  }

  return (
    <PageContainer>
        <AuthCard>
            {mode === 'customer' && (
                <HeaderLink to="/home">
                    <FaArrowLeft />
                    Về trang chủ
                </HeaderLink>
            )}

            <LogoPlaceholder>
                FoodFast Delivery
            </LogoPlaceholder>

            <Title>{getPageTitle()}</Title>

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
                    error={authError} 
                />
                
                <ActionRow>
                    {mode === 'customer' && (
                        <ForgotPasswordLink to="/forgot-password">Quên mật khẩu?</ForgotPasswordLink>
                    )}
                    <MainButton type="submit" disabled={authLoading}>
                        {authLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </MainButton>
                </ActionRow>
            </Form>
            
            {/* chỉ hiện cho khách hàng */}
            {mode === 'customer' && (
                <>
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
                </>
            )}

            {/* chỉ hiện cho merchant hoặc admin */}
            {mode !== 'customer' && (
                <SignUpPrompt style={{ marginTop: '20px' }}>
                    <Link to="/">← Quay về trang chủ</Link>
                </SignUpPrompt>
            )}
            
        </AuthCard>
    </PageContainer>
  );
}