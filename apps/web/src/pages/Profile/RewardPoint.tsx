import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext'; 
import Button from '../../components/Button';
import InputField from '../../components/InputField';

const ColMain = styled.div``
const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`
const PointGroup = styled.div``
const PointInfo = styled.h3`
    display: flex;
    justify-content: center;
    padding: 50px;
`
const VoucherGroup = styled.div`
    padding: 30px;   
    border: 2px solid #e5e5e5;
    margin: 50px; 
`
const VoucherTitle = styled.h2`
    border-bottom: 1px solid #e5e5e5;
`
const VoucherForm = styled.form``
const SubmitButton = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
`


const RewardPoint: React.FC = () => {
    const [seri, setSeri] = useState(' ');
    const [pin, setPin] = useState(' ');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Nhập thành công');
        alert('Voucher không hợp lệ!');
        return;
    }

    return (

        <ColMain>
            <MainTitle>Điểm thưởng</MainTitle>
            <PointGroup>
                <PointInfo>Bạn hiện chưa có điểm thưởng nào.</PointInfo>
            </PointGroup>
            <VoucherGroup>
                <VoucherTitle>Thêm Voucher</VoucherTitle>
                <VoucherForm onSubmit={handleSubmit}>
                    <InputField
                        label='Serial Number'
                        id='serial'
                        type='text'
                        placeholder='Nhập số seri của voucher'
                        value={seri}
                        onChange={(e) => {setSeri(e.target.value)}} 
                        />

                    <InputField
                        label='PIN'
                        id='pin'
                        type='text'
                        placeholder=''
                        value={pin}
                        onChange={(e) => {setPin(e.target.value)}} 
                        />
            
                    <SubmitButton>
                        <Button type='submit'>Thêm Voucher</Button>
                    </SubmitButton>
                </VoucherForm>
            </VoucherGroup>

        </ColMain>
    )

};

export default RewardPoint;
