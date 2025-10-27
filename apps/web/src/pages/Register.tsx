import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook } from 'react-icons/fa'; 

// 1. Import component InputField mới
import InputField from '../components/InputField';

// 2. Import các style chung từ file AuthStyles
import {
    PageContainer,
    AuthCard,
    HeaderLink,
    LogoPlaceholder,
    Title,
    Form,
    MainButton,
    Divider,
    SocialButtons,
    SocialButton,
    SignUpPrompt
} from '../data/AuthStyle';


// === REACT COMPONENT ===
export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  
  // LOGIC
  const [errors, setErrors] = useState<{ 
    name?: string;
    tel?: string;
    birthday?: string;  
    email?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); 
    let hasError = false;

    // Kiểm tra trống từng field
    if (!name) {
        setErrors(prev => ({ ...prev, name: 'Vui lòng nhập Họ Tên.' }));
        hasError = true;
    }
    if (!tel) {
        setErrors(prev => ({ ...prev, tel: 'Vui lòng nhập SĐT.' }));
        hasError = true;
    }
    if (!birthday) {
        setErrors(prev => ({ ...prev, birthday: 'Vui lòng nhập Ngày Sinh.' }));
        hasError = true;
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
    if (!confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Vui lòng xác nhận Mật khẩu.' }));
        hasError = true;
    } else if (password && password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp.' }));
        hasError = true;
    }

    if (hasError) return; // Nếu có lỗi thì dừng

    // Giả lập Đăng ký thành công
    console.log('Đăng ký thành công với:', { email, password });
    alert('Đăng ký thành công!'); 
    navigate('/login');
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
                
                {/* InputField component và truyền lỗi tương ứng */}
                <InputField
                    label="Họ Tên"
                    id="name"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={name}
                    onChange={(e) => {setName(e.target.value); setErrors(p => ({...p, name: ''}));}}
                    error={errors.name}
                />

                <InputField
                    label="Số Điện Thoại"
                    id="tel"
                    type="text"
                    placeholder="Nhập SĐT của bạn"
                    value={tel}
                    onChange={(e) => {setTel(e.target.value); setErrors(p => ({...p, tel: ''}));}}
                    error={errors.tel}
                />

                <InputField
                    label="Ngày Sinh"
                    id="birthday"
                    type="date"
                    placeholder="Nhập Ngày Sinh của bạn"
                    value={birthday}
                    onChange={(e) => {setBirthday(e.target.value); setErrors(p => ({...p, birthday: ''}));}}
                    error={errors.birthday}
                />

                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Nhập Email của bạn"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); setErrors(p => ({...p, email: ''}));}}
                    error={errors.email}
                />
                
                <InputField
                    label="Mật khẩu"
                    id="password"
                    type="password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setErrors(p => ({...p, password: ''}));}}
                    error={errors.password}
                />
                
                <InputField
                    label="Xác nhận mật khẩu"
                    id="confirm-password"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: ''}));}}
                    error={errors.confirmPassword}
                />
                
                <MainButton type="submit" style={{ marginTop: '10px' }}>Đăng ký</MainButton>

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
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay.</Link>
            </SignUpPrompt>
        </AuthCard>
    </PageContainer>
  );
}