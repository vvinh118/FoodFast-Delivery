import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext'; 
import { FaUserCircle } from 'react-icons/fa';
import Button from '../../components/Button';

//cột Main
const ColMain = styled.div`
    flex-grow: 1; 
    background-color: #fff;
    padding: 30px 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`
const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`
const UserAvatar = styled(FaUserCircle)`
    font-size: 80px;
    color: #504849;
    margin-bottom: 15px;
`

const AvaWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40px auto;
`
const MessContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
`
const MessTitle = styled.h2`
    margin: 0;
`
const MessText = styled.p`
    margin:0;
`

const BoxInfo = styled.div`
    display: flex;
    justify-content: space-between;
    border: 2px solid silver;
    border-radius: 10px;
    padding: 20px;
    margin: 50px 30px;
`
const InfoMem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`
const StatusMemGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`
const StatusMemTitle = styled.h4`
    margin: 0;
`
const StatusMemText = styled.p`
    margin: 0;
`
const CardGroup = styled.div`
    display: flex;
    
`
const GiftCardGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-left: 1px solid #222;
    padding: 0 20px;
`
const GiftCardTitle = styled.h4`
    margin: 0;
`
const GiftCardText = styled.p`
    margin: 0;
`
const VoucherGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-left: 1px solid #222;
    padding: 0 20px;
`
const VoucherTitle = styled.h4`
    margin: 0;
`
const VoucherText = styled.p`
    margin: 0;
`
const CouponGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-left: 1px solid #222;
    padding: 0 20px;
`
const CouponTitle = styled.h4`
    margin: 0;
`
const CouponText = styled.p`
    margin: 0;
`

const GeneralInfo: React.FC = () => {
    const { user } = useAuth(); // Lấy user thật từ context
    // Dùng user thật, nếu không có thì dùng placeholder
    const displayUser = user || { name: "..." };

    return (
    
<ColMain>
                <MainTitle>Thông tin chung</MainTitle>
                <AvaWrapper>
                <UserAvatar />
                    <Button $padding='5px 10px' $background='#9d9b9b'>Thay đổi</Button>
                </AvaWrapper>
                <MessContainer>
                    <MessTitle>
                        Xin chào {displayUser.name},
                    </MessTitle> 
                    <MessText>
                        Với trang này, bạn sẽ quản lý được tất cả thông tin tài khoản của mình.
                    </MessText>
                </MessContainer>  
                <BoxInfo>
                    <InfoMem>
                    <StatusMemGroup>
                        <StatusMemTitle>Hạng thành viên:</StatusMemTitle>
                        <StatusMemText>Member</StatusMemText>
                    </StatusMemGroup>
                    <StatusMemGroup>
                        <StatusMemTitle>Tổng chi tiêu:</StatusMemTitle>
                        <StatusMemText>0</StatusMemText>
                    </StatusMemGroup>
                    <StatusMemGroup>
                        <StatusMemTitle>Điểm thưởng:</StatusMemTitle>
                        <StatusMemText>0</StatusMemText>
                    </StatusMemGroup>
                    </InfoMem>
                    <CardGroup>
                        <GiftCardGroup>
                            <GiftCardTitle>Thẻ quà tặng</GiftCardTitle>
                            <GiftCardText>0</GiftCardText>
                            <Button $padding='3px 20px'>Xem</Button>
                        </GiftCardGroup>
                        <VoucherGroup>
                            <VoucherTitle>Voucher</VoucherTitle>
                            <VoucherText>0</VoucherText>
                            <Button $padding='3px 20px'>Xem</Button>
                        </VoucherGroup>
                        <CouponGroup>
                            <CouponTitle>Coupon</CouponTitle>
                            <CouponText>0</CouponText>
                            <Button $padding='3px 20px'>Xem</Button>
                        </CouponGroup>
                    </CardGroup>
                </BoxInfo> 
            </ColMain>

            );
};

export default GeneralInfo;