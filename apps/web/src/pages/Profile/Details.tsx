import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext'; 
import Button from '../../components/Button';
import InputField from '../../components/InputField';

//cột Main
const ColMain = styled.div``
const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`
const Form = styled.form`
    padding: 30px 50px;
`
const SubmitButton = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
`

export default function Details() {
    const { user } = useAuth(); // Lấy user thật từ context
    
    const [name, setName] = useState(user?.name || '');
    const [tel, setTel] = useState(user?.tel || '');
    const [birthday, setBirthday] = useState(user?.birthday || '');
    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //giả lập lưu thành công
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Lưu thành công');
        alert('Lưu thay đổi thành công!');
        return;
    }


    return (
        <ColMain>
            <MainTitle>Thay đổi thông tin</MainTitle>
            <Form onSubmit={handleSubmit}>
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

                <SubmitButton>
                    <Button type='submit'>Lưu thay đổi</Button>
                </SubmitButton>

            </Form>  
        </ColMain>



    )
}
