import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaArrowLeft } from 'react-icons/fa';
// import { FcGoogle } from 'react-icons/fc'; 
// import { FaFacebook } from 'react-icons/fa'; 

import InputField from '../components/InputField';
import {
    PageContainer,
    AuthCard,
    HeaderLink,
    LogoPlaceholder,
    Title,
    Form,
    MainButton,
    SignUpPrompt
} from '../components/AuthStyle';
import { apiRegister } from '../services/api';

import { Validators } from 'core';

// COMPONENT
export default function Register() {
  const navigate = useNavigate();
  
  // State cho form
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State cho lỗi
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);


  // Hàm handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 
    setApiError(null);
    let hasError = false;

    // (Validation)

    if (!name) {
        setErrors(prev => ({ ...prev, name: 'Vui lòng nhập Họ Tên.' }));
        hasError = true;
    }

    // Kiểm tra SĐT
if (!tel) {
    setErrors(prev => ({ ...prev, tel: 'Vui lòng nhập SĐT.' }));
    hasError = true;
} else if (!Validators.isValidPhone(tel)) { // Gọi hàm từ Core
    setErrors(prev => ({ ...prev, tel: 'SĐT không hợp lệ (phải là 10 số).' }));
    hasError = true;
}

    // Kiểm tra Ngày Sinh
    if (!birthday) {
        setErrors(prev => ({ ...prev, birthday: 'Vui lòng nhập Ngày Sinh.' }));
        hasError = true;
    } else {
        const yearPart = birthday.split('-')[0]; // Lấy phần YYYY từ "YYYY-MM-DD"
        const year = parseInt(yearPart, 10);
        const currentYear = new Date().getFullYear();

        if (yearPart.length > 4) {
            setErrors(prev => ({ ...prev, birthday: 'Năm sinh chỉ được 4 chữ số.' }));
            hasError = true;
        } else if (year < 1900 || year > currentYear - 5) { // Phải ít nhất 5 tuổi
            setErrors(prev => ({ ...prev, birthday: 'Năm sinh không hợp lệ.' }));
            hasError = true;
        }
    }

    if (!email) {
        setErrors(prev => ({ ...prev, email: 'Vui lòng nhập Email.' }));
        hasError = true;
    }
    
    if (!password) {
        setErrors(prev => ({ ...prev, password: 'Vui lòng nhập Mật khẩu.' }));
        hasError = true;
    } else if (password.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 6 ký tự.' }));
        hasError = true;
    }
    
    if (password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp.' }));
        hasError = true;
    }

    if (hasError) return; // Nếu có lỗi validation thì dừng

    // Gọi Api đăng ký
    setLoading(true);
    try {
      const newUser = { name, tel, birthday, email, password };
      await apiRegister(newUser);
      alert('Đăng ký thành công! Vui lòng đăng nhập.'); 
      navigate('/login');

    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
        <AuthCard>
            <HeaderLink to="/login"> 
                <FaArrowLeft />
                Về trang đăng nhập
            </HeaderLink>

            <LogoPlaceholder>
                FoodFast Delivery
            </LogoPlaceholder>

            <Title>Đăng ký</Title>

            <Form onSubmit={handleSubmit}>
                
                {/* Render các InputField */}
                <InputField
                    label="Họ Tên"
                    id="name"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={name}
                    onChange={(e) => {setName(e.target.value); setErrors(p => ({...p, name: ''}));}}
                    error={errors.name}
                    disabled={loading} 
                />

                <InputField
                    label="Số Điện Thoại"
                    id="tel"
                    type="tel"
                    placeholder="Nhập SĐT của bạn"
                    value={tel}
                    onChange={(e) => {setTel(e.target.value); setErrors(p => ({...p, tel: ''}));}}
                    error={errors.tel}
                    disabled={loading}
                />

                <InputField
                    label="Ngày Sinh"
                    id="birthday"
                    type="date"
                    placeholder="Nhập Ngày Sinh của bạn"
                    value={birthday}
                    onChange={(e) => {setBirthday(e.target.value); setErrors(p => ({...p, birthday: ''}));}}
                    error={errors.birthday}
                    disabled={loading}
                />

                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Nhập Email của bạn"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setErrors(p => ({...p, email: ''}));}}
                    error={errors.email || (apiError?.includes('Email') ? apiError : null)}
                    disabled={loading}
                />
                
                <InputField
                    label="Mật khẩu"
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setErrors(p => ({...p, password: ''}));}}
                    error={errors.password}
                    disabled={loading}
                />
                
                <InputField
                    label="Xác nhận mật khẩu"
                    id="confirm-password"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: ''}));}}
                    error={errors.confirmPassword}
                    disabled={loading}
                />
                
                {apiError && !apiError.includes('Email') && (
                  <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>
                    {apiError}
                  </p>
                )}

                <MainButton type="submit" style={{ marginTop: '10px' }} disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </MainButton>

            </Form>

            <SignUpPrompt>
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay.</Link>
            </SignUpPrompt>
        </AuthCard>
    </PageContainer>
  );
}
