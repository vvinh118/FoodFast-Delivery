import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiMerchantLogin, useMerchantStore } from 'core';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

// === STYLED COMPONENTS ===
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #2c3e50; /* Màu nền tối cho chuyên nghiệp */
`;

const LoginBox = styled.div`
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
`;

const LogoTitle = styled.h1`
    color: #f72d57;
    margin-bottom: 10px;
    font-size: 1.8rem;
`;

const SubTitle = styled.p`
    color: #666;
    margin-bottom: 30px;
    font-size: 0.9rem;
`;

const ErrorMsg = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-bottom: 15px;
`;

// === COMPONENT ===
const MerchantLogin: React.FC = () => {
    const navigate = useNavigate();
    const loginMerchant = useMerchantStore(state => state.loginMerchant); // Lấy hàm từ store

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Gọi API đăng nhập
            const merchantData = await apiMerchantLogin(email, password);
            
            // 2. Lưu vào Store
            loginMerchant(merchantData);

            // 3. Chuyển hướng vào Dashboard
            alert(`Chào mừng ${merchantData.name} trở lại!`);
            navigate('/merchant/dashboard');

        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <LoginBox>
                <LogoTitle>FoodFast Merchant</LogoTitle>
                <SubTitle>Cổng thông tin dành cho Đối tác Nhà hàng</SubTitle>

                <form onSubmit={handleLogin}>
                    <InputField
                        label="Email quản trị"
                        id="email"
                        type="email"
                        placeholder="admin@restaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <InputField
                        label="Mật khẩu"
                        id="password"
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <Button 
                        type="submit" 
                        $width="100%" 
                        $fontSize="16px"
                        style={{ marginTop: '20px' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập Dashboard'}
                    </Button>
                </form>
            </LoginBox>
        </Container>
    );
};

export default MerchantLogin;