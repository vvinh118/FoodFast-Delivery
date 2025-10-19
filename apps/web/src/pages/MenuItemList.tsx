// apps/web/src/pages/MenuItemList.tsx


import styled from 'styled-components';
import { useParams } from 'react-router-dom'; // Dùng để lấy ID quán ăn từ URL
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuItemCard from '../components/MenuItemCard'; // Import component hiển thị món ăn
import { mockRestaurants, mockMenuItems } from '../data/mockData'; // <-- IMPORT mockdata

// ==========================================================
// STYLED COMPONENTS
// ==========================================================

const MenuPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    max-width: 1000px; 
    margin: 0 auto;
    padding: 0 20px;
    flex-grow: 1; /* Đảm bảo content chiếm hết không gian còn lại */
`;

const HeaderSection = styled.div`
    padding: 30px 0 20px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
`;

const RestaurantName = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: #000;
`;

const Breadcrumb = styled.p`
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;
`;

// Container cho lưới Món ăn
const MenuGrid = styled.div`
    display: grid;
    /* Tạo 3-4 cột linh hoạt, mỗi cột có chiều rộng tối thiểu 220px */
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 80px;
`;

// ==========================================================
// COMPONENT CHÍNH
// ==========================================================

const MenuItemList = () => {
    // Lấy ID (dạng string) của quán ăn từ URL
    const { id } = useParams<{ id: string }>(); 
    const restaurantId = parseInt(id || '0', 10); // Chuyển đổi ID sang số nguyên

    // Tìm thông tin quán ăn
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    
    // Lọc danh sách món ăn theo ID
    const menuItems = mockMenuItems.filter(item => item.restaurantId === restaurantId);

    // Xử lý trường hợp không tìm thấy quán ăn
    if (!restaurant) {
        return (
            <MenuPageContainer>
                <Header />
                <ContentWrapper>
                    <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
                        Không tìm thấy quán ăn này!
                    </h1>
                </ContentWrapper>
                <Footer />
            </MenuPageContainer>
        );
    }

    return (
        <MenuPageContainer>
            <Header />
            
            <ContentWrapper>
                <HeaderSection>
                    <Breadcrumb>Trang chủ &gt; Nhà hàng &gt; {restaurant.name}</Breadcrumb>
                    <RestaurantName>{restaurant.name}</RestaurantName>
                    <p style={{ color: '#FFC107', fontWeight: 600 }}>Thực đơn chính</p>
                </HeaderSection>
                
                {/* THAY THẾ DIV BỌC BẰNG MENUGRID */}
                <MenuGrid>
                    {menuItems.length > 0 ? (
                        menuItems.map(item => (
                            <MenuItemCard 
                                key={item.id}
                                name={item.name}
                                id={item.id}
                                price={item.price}
                                imageUrl={item.imageUrl}
                            />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', marginTop: '30px', color: '#999' }}>
                            Quán ăn này hiện chưa có món nào trong thực đơn.
                        </p>
                    )}
                </MenuGrid>
            </ContentWrapper>

            <Footer />
        </MenuPageContainer>
    );
};

export default MenuItemList;