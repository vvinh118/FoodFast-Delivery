import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';

import { fetchRestaurantById, fetchMenuByRestaurant } from '../services/api';

// === TYPES ===
interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  distance: number;
  deliveryTime: number;
  imageUrl: string;
  isPromo: boolean;
  category: string;
}

interface MenuItem {
    id: number;
    restaurantId: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
}

// === STYLED COMPONENTS ===
const MenuPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    max-width: 1000px; 
    margin: 0 auto;
    padding: 0 20px;
    flex-grow: 1; 
    min-height: 60vh; /* Đảm bảo Spinner/Lỗi hiển thị đẹp */
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

const MenuGrid = styled.div`
    display: grid;
    /* Cố định 3 cột và dùng grid-gap để tạo khoảng cách */
    grid-template-columns: repeat(3, 1fr); 
    gap: 20px; /* Khoảng cách giữa các món */
    margin-top: 20px;
    margin-bottom: 80px;

    /* Responsive: Nếu màn hình nhỏ hơn 768px, chỉ hiển thị 2 cột */
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    /* Responsive: Nếu màn hình nhỏ hơn 480px, chỉ hiển thị 1 cột */
    @media (max-width: 480px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;


const MenuItemList = () => {
    // lấy ID (dạng string) của quán ăn từ URL
    const { id } = useParams<{ id: string }>(); 

    // state cho API
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // dùng useEffect để gọi API
    useEffect(() => {
        if (!id) {
            setError("Không tìm thấy ID nhà hàng.");
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // gọi 2 API song song
                const [restaurantData, menuData] = await Promise.all([
                    fetchRestaurantById(id),    // Gọi API lấy thông tin nhà hàng
                    fetchMenuByRestaurant(id) // Gọi API lấy menu
                ]);
                
                setRestaurant(restaurantData as Restaurant);
                setMenuItems(menuData as MenuItem[]);

            } catch (err: any) {
                setError(err.message || 'Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]); // Chạy lại nếu ID trên URL thay đổi

    
    // 1. Trạng thái Đang Tải
    if (loading) {
        return (
            <MenuPageContainer>
                <ContentWrapper>
                    <h2 style={{ textAlign: 'center', marginTop: '50px' }}>
                        Đang tải thực đơn...
                    </h2>
                </ContentWrapper>
            </MenuPageContainer>
        );
    }
    
    // 2. Trạng thái Lỗi
    if (error || !restaurant) {
        return (
            <MenuPageContainer>
                <ContentWrapper>
                    <h1 style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                        {error || "Không tìm thấy quán ăn này!"}
                    </h1>
                </ContentWrapper>
            </MenuPageContainer>
        );
    }

    // 3. trạng thái thành Công
    return (
        <MenuPageContainer>
            <ContentWrapper>
                <HeaderSection>
                    <Breadcrumb>Trang chủ &gt; Nhà hàng &gt; {restaurant.name}</Breadcrumb>
                    <RestaurantName>{restaurant.name}</RestaurantName>
                    <p style={{ color: '#FFC107', fontWeight: 600 }}>Thực đơn chính</p>
                </HeaderSection>
                
                <MenuGrid>
                    {menuItems.length > 0 ? (
                        menuItems.map(item => (
                            <MenuItemCard 
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                imageUrl={item.imageUrl}
                                restaurantId={restaurant.id} 
                                restaurantName={restaurant.name}
                            />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', gridColumn: '1 / -1', marginTop: '30px', color: '#999' }}>
                            Quán ăn này hiện chưa có món nào trong thực đơn.
                        </p>
                    )}
                </MenuGrid>
            </ContentWrapper>
        </MenuPageContainer>
    );
};

export default MenuItemList;