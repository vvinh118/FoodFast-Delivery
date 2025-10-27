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
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`
const HeaderMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
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
`
const NavMenu = styled.nav`
    display:flex;
    flex-direction:column;
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
    padding: 50px;
    border-top: 1px solid #eee;
    background: #fcfcfc;
`
//cột Main
const ColMain = styled.div`
    flex-grow: 1; // Lấp đầy không gian còn lại
    background-color: #fff;
    padding: 30px 40px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`
const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`
const MainText = styled.p``
const AvaWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px auto;
`
const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid silver;
    border-radius: 10px;
    padding-left: 20px;
`
const InfoGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`
const InfoTitle = styled.h4``
const InfoText = styled.p``


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
                </HeaderMenu>
                <NavTitle>Member</NavTitle>
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
                <MainText>
                    Xin chào Võ Minh Thư,
                    <br/> Với trang này, bạn sẽ quản lý được tất cả thông tin tài khoản của mình.
                </MainText>   
                <InfoWrapper>
                    <InfoGroup>
                        <InfoTitle>Hạng thành viên:</InfoTitle>
                        <InfoText>Member</InfoText>
                    </InfoGroup>
                    <InfoGroup>
                        <InfoTitle>Tổng chi tiêu:</InfoTitle>
                        <InfoText>0</InfoText>
                    </InfoGroup>
                    <InfoGroup>
                        <InfoTitle>Điểm thưởng:</InfoTitle>
                        <InfoText>0</InfoText>
                    </InfoGroup>
                </InfoWrapper> 
            </ColMain>
        </MainContainer>

        <Footer /> 

    </PageWrapper>

);

}