// src/pages/profile/Details.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from 'core';
import Button from '../../components/Button';
import InputField from '../../components/InputField';


// STYLED COMPONENTS
const ColMain = styled.div``

const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`

const MainForm = styled.form`
    padding: 30px 50px;
`


const ChangePasswordForm = styled.div`
    margin-top: 30px;
    border-top: 1px solid #f0f0f0;
    padding-top: 20px;
    
    /* Hiệu ứng mờ dần khi xuất hiện */
    animation: fadeIn 0.5s ease;
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`

const SubmitButton = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
`

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end; 
    gap: 10px;
    margin-top: 20px;
`

const CancelButton = styled(Button)`
    background-color: #777;
    &:hover {
        background-color: #555;
    }
`


// COMPONENT
export default function Details() {
    const user = useAuthStore(state => state.user);
    
    // State cho thông tin
    const [name, setName] = useState(user?.name || '');
    const [tel, setTel] = useState(user?.tel || '');
    const [birthday, setBirthday] = useState(user?.birthday || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    
    // State cho mật khẩu
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State ẩn/hiện form
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Lưu thay đổi (thông tin + mật khẩu nếu có)');
        alert('Lưu thay đổi thành công!');
        setIsFormVisible(false); 
        return;
    }


    return (
        <ColMain>
            <MainTitle>Thay đổi thông tin</MainTitle>
            
            <MainForm onSubmit={handleSubmit}>
                <InputField
                    label="Họ Tên"
                    id="name"
                    type="text"
                    placeholder='Họ và tên'
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}
                />
                <InputField
                    label="Số điện thoại"
                    id="tel"
                    type="text"
                    placeholder='Số điện thoại'
                    value={tel}
                    onChange={(e) => {setTel(e.target.value)}}
                />
                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <InputField
                    label="Ngày Sinh"
                    id="birthday"
                    type="date"
                    placeholder='Ngày Sinh'
                    value={birthday}
                    onChange={(e) => {setBirthday(e.target.value)}}
                />
                <InputField
                    label="Địa Chỉ"
                    id="address"
                    type="text"
                    placeholder='Địa Chỉ'
                    value={address}
                    onChange={(e) => {setAddress(e.target.value)}}
                />

                
                {
                    !isFormVisible ? (
                        <SubmitButton style={{ marginTop: '20px' }}>
                            <Button 
                                type="button"
                                $color='#9d9b9b'
                                $background='ffff'
                                onClick={() => setIsFormVisible(true)}
                            >
                                Tôi muốn thay đổi mật khẩu
                            </Button>
                        </SubmitButton>
                    ) : (

                        <ChangePasswordForm>
                            <InputField
                                label="Mật khẩu cũ"
                                id="password"
                                type="password"
                                placeholder="••••••"
                                value={oldPassword}
                                onChange={(e) => {setOldPassword(e.target.value)}}
                            />

                            <InputField
                                label="Mật khẩu mới"
                                id="new-password"
                                type="password"
                                placeholder="••••••"
                                value={newPassword}
                                onChange={(e) => {setNewPassword(e.target.value)}}
                            />
                            
                            <InputField
                                label="Xác nhận mật khẩu mới"
                                id="confirm-password"
                                type="password"
                                placeholder="••••••"
                                value={confirmPassword}
                                onChange={(e) => {setConfirmPassword(e.target.value)}}
                            />
                            
                            <ButtonRow>
                                <CancelButton 
                                    type="button" 
                                    onClick={() => setIsFormVisible(false)}
                                >
                                    Hủy
                                </CancelButton>
                            </ButtonRow>
                        </ChangePasswordForm>
                    )
                }
                
                <SubmitButton>
                    <Button type='submit'>Lưu thay đổi</Button>
                </SubmitButton>

            </MainForm>  
        </ColMain>
    )
}