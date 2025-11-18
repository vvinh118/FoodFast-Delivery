import styled from 'styled-components';
import Button from '../components/Button'; 
import { NavLink, Outlet } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaThLarge, FaUser, FaHistory, FaGift } from 'react-icons/fa';
import { useAuthStore } from 'core';


// ==================================================
// STYLED COMPONENTS (ĐÃ THÊM MEDIA QUERIES)
// ==================================================
const PageWrapper = styled.div`
    background-color: #f9f9f9;
`
const MainContainer = styled.div`
    display: flex;
    max-width: 1280px;
    margin: 30px auto;
    gap: 30px;
    min-height: 80vh;

    /* SỬA: Chuyển sang layout dọc trên mobile */
    @media (max-width: 768px) {
        flex-direction: column;
        margin: 10px; /* Giảm margin 2 bên */
        gap: 15px; /* Giảm khoảng cách */
    }
`
const ColMenu = styled.div`
    flex-basis: 300px;
    flex-shrink: 0;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-self: flex-start; /* Giữ component này co lại theo nội dung */

    /* SỬA: Gỡ bỏ chiều rộng cố định trên mobile */
    @media (max-width: 768px) {
        flex-basis: auto; /* Reset lại */
        width: 100%; /* Chiếm 100% chiều rộng */
        align-self: stretch; /* Kéo dãn theo container */
    }
`
const HeaderMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0 30px;

    /* SỬA: Giảm margin trên mobile */
    @media (max-width: 768px) {
        margin: 20px 0 15px;
    }
`
const UserAvatar = styled(FaUserCircle)`
    font-size: 80px;
    color: #504849;
`
const UserName = styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-top: auto;
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
    text-transform: uppercase;
    background-color: #f7f7f7;
    transition: background-color 0.2s, color 0.2s;

    svg {
        font-size: 16px;
        color: #f72d57;
        transition: color 0.2s;
    }
    
    &:hover {
        background-color: #eee;
    }

    &.active {
        background-color: #f72d57;
        color: white;
        
        /* SỬA: Xóa style '::before' bị lỗi (do thiếu định nghĩa) */
        
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

    /* SỬA: Giảm margin trên mobile */
    @media (max-width: 768px) {
        margin: 25px;
    }
`
const ColMain = styled.div`
    flex-grow: 1;
    background-color: #fff;
    padding: 30px 40px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

    /* SỬA: Giảm padding trên mobile */
    @media (max-width: 768px) {
        padding: 20px 15px;
    }
`

// COMPONENT CHÍNH
export default function UserProfile () {
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    
    const displayUser = user || { name: "..." };

    return (
    <PageWrapper>
        <MainContainer>
            {/* ColMenu và ColMain sẽ tự động xếp chồng trên mobile */}
            <ColMenu>
                <HeaderMenu>
                    <UserAvatar />
                    <UserName>{displayUser.name}</UserName>
                    <NavTitle>Member</NavTitle>
                </HeaderMenu>
                
                <NavMenu>
                    {/* SỬA: Xóa 'end' ở các link con để 'Thông tin chung' active đúng */}
                    <MenuLink to="/userProfile" end> 
                        <FaThLarge /> Thông tin chung
                        </MenuLink>
                    <MenuLink to="/userProfile/details">
                        <FaUser /> Chi tiết thông tin
                        </MenuLink>
                    <MenuLink to="/userProfile/orders">
                        <FaHistory /> Lịch sử đơn hàng
                        </MenuLink>
                    <MenuLink to="/userProfile/reward-point"> 
                        <FaGift /> Điểm thưởng
                        </MenuLink>
                </NavMenu>
                <LogoutContainer>
                    <Button onClick={logout}>
                        <FaSignOutAlt style={{ marginRight: '8px' }}/>
                        Đăng Xuất
                    </Button>
                </LogoutContainer>
            </ColMenu>
            
            <ColMain>
                <Outlet />
            </ColMain>          
        </MainContainer>
    </PageWrapper>
);
}