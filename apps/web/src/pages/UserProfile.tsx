import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import Button from '../components/Button'; 
import { useAuth } from '../context/AuthContext'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaThLarge, FaUser, FaHistory, FaLock, FaGift, FaTicketAlt, FaCreditCard, FaReceipt } from 'react-icons/fa';

// === STYLED COMPONENTS ===
const PageWrapper = styled.div`
    background-color: #f9f9f9;
`
const MainContainer = styled.div`
    display: flex;
    max-width: 1280px;
    margin: 30px auto;
    gap: 30px;
    min-height: 80vh;
`
//cột Menu
const ColMenu = styled.div`
    flex-basis: 300px; // Chiều rộng cố định
    flex-shrink: 0; // Không co lại
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const HeaderMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
`
const UserAvatar = styled(FaUserCircle)`
    font-size: 80px;
    color: #504849;
    margin-bottom: 15px;
`
const UserName = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
`
const NavTitle = styled.h3`
    display: flex;
    justify-content: center;
    font-weight: normal;
    margin: 0;
    color: #8c8c99;
`
const NavMenu = styled.nav`
    display:flex;
    flex-direction:column;
    border-bottom: 1px solid #eee;

`
const MenuLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px 25px;
    text-decoration: none;
    color: #333;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase; // Viết hoa
    border-bottom: 1px solid #f0f0f0;
    background-color: #f7f7f7; // Màu xám nhạt
    transition: background-color 0.2s, color 0.2s;

    svg {
        font-size: 16px;
        color: #f72d57;
        transition: color 0.2s;
    }
    
    &:hover {
        background-color: #eee;
    }

    // Link được active (trùng với URL)
    &.active {
        background-color: #f72d57; // Màu đỏ
        color: white;
        
        &::before {
            border-left-color: #f72d57; // Đổi màu mũi tên
        }
        
        svg {
            color: white;
        }
    }
`

const LogoutContainer = styled.div`
    display: flex;
    justify-content: center;    
    margin: 50px;
    background: #fcfcfc;
`
//cột Main
const ColMain = styled.div`
    flex-grow: 1; // Lấp đầy không gian còn lại
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


export default function UserProfile () {
    const { user, logout } = useAuth();
    const displayUser = user || { name: "Võ Minh Thư" };

    return (
    <PageWrapper>
        <Header />

        <MainContainer>
            <ColMenu>
                <HeaderMenu>
                    <UserAvatar />
                    <UserName>{displayUser.name}</UserName>
                    <NavTitle>Member</NavTitle>
                </HeaderMenu>
                
                <NavMenu>
                    <MenuLink to="/userProfile" end>
                        <FaThLarge /> Thông tin chung
                        </MenuLink>
                    <MenuLink to="/userProfile/details" end>
                        <FaUser /> Chi tiết thông tin
                        </MenuLink>
                    <MenuLink to="/userProfile/orders" end>
                        <FaHistory /> Lịch sử đơn hàng
                        </MenuLink>
                    <MenuLink to="/userProfile/vouchers" end> 
                        <FaGift /> Điểm thưởng
                        </MenuLink>
                </NavMenu>
                <LogoutContainer>
                    <Button>
                        <FaSignOutAlt style={{ marginRight: '8px' }}/>
                        Đăng Xuất
                    </Button>
                </LogoutContainer>
            </ColMenu>
            
            <ColMain>
                <MainTitle>Thông tin chung</MainTitle>
                <AvaWrapper>
                <UserAvatar />
                    <Button $padding='5px 10px' $background='#9d9b9b'>Thay đổi</Button>
                </AvaWrapper>
                <MessContainer>
                    <MessTitle>
                        Xin chào Võ Minh Thư,
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
        </MainContainer>

        <Footer /> 

    </PageWrapper>

);

}