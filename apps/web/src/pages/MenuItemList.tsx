import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import type { Restaurant, MenuItem } from 'core';
import { fetchRestaurantById, fetchMenuByRestaurant } from 'core';


const MenuPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f9f9f9;
    width: 100%;
    overflow-x: hidden; 
`;

const ContentWrapper = styled.div`
    max-width: 1200px; 
    width: 100%; 
    margin: 0 auto; 
    padding: 0 20px;
    
    flex-grow: 1; 
    min-height: 60vh; 
    
    display: flex;
    flex-direction: column;
    align-items: flex-start; 

    @media (max-width: 640px) {
        padding: 0 10px; 
        box-sizing: border-box; 
    }
`;

const HeaderSection = styled.div`
    width: 100%; 
    padding: 30px 0 20px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    
    text-align: left; 
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    justify-content: flex-start;

    @media (max-width: 768px) {
        text-align: center;
        align-items: center;
        padding: 20px 0 10px; 
    }
`;

const RestaurantName = styled.h1`
    font-size: 2.2rem;
    font-weight: 700;
    color: #333;
    margin: 10px 0;
    line-height: 1.2;
    
    @media (max-width: 640px) {
        font-size: 1.8rem;
    }
`;

const Breadcrumb = styled.p`
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 5px;
`;

const MenuLabel = styled.p`
    color: #FFC107;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0;
    position: relative;
    display: inline-block;
    padding-bottom: 8px; 
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%; 
        height: 3px;
        background-color: #FFC107;
        border-radius: 2px;
        left: 0;
    }
`;

const MenuGrid = styled.div`
    width: 100%; 
    display: grid;
    /* trên pc: 3 cột */
    grid-template-columns: repeat(3, 1fr); 
    gap: 30px; 
    margin-top: 20px;
    margin-bottom: 80px;

    /* Tablet: 2 cột */
    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    /* Mobile: 1 cột */
    @media (max-width: 640px) {
        grid-template-columns: 1fr;
        gap: 15px;
        max-width: 100%;
    }
`;

const MenuItemList = () => {
    const { id } = useParams<{ id: string }>(); 

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                const [restaurantData, menuData] = await Promise.all([
                    fetchRestaurantById(id),    
                    fetchMenuByRestaurant(id) 
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
    }, [id]); 

    if (loading) {
        return (
            <MenuPageContainer>
                <ContentWrapper>
                    <h2 style={{ textAlign: 'center', marginTop: '50px', width: '100%' }}>Đang tải thực đơn...</h2>
                </ContentWrapper>
            </MenuPageContainer>
        );
    }
    
    if (error || !restaurant) {
        return (
            <MenuPageContainer>
                <ContentWrapper>
                    <h1 style={{ textAlign: 'center', marginTop: '50px', color: 'red', width: '100%' }}>
                        {error || "Không tìm thấy quán ăn này!"}
                    </h1>
                </ContentWrapper>
            </MenuPageContainer>
        );
    }

    return (
        <MenuPageContainer>
            <ContentWrapper>
                <HeaderSection>
                    <Breadcrumb>Trang chủ &gt; Nhà hàng &gt; {restaurant.name}</Breadcrumb>
                    <RestaurantName>{restaurant.name}</RestaurantName>
                    <MenuLabel>Thực đơn chính</MenuLabel>
                </HeaderSection>
                
                <MenuGrid>
                    {menuItems.length > 0 ? (
                        menuItems.map(item => (
                            <MenuItemCard 
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                imageUrl={item.imageUrl}
                                restaurantId={restaurant.id} 
                                restaurantName={restaurant.name}
                                isAvailable={item.isAvailable !== false}
                            />
                        ))
                    ) : (
                        <p style={{ 
                            textAlign: 'center', 
                            gridColumn: '1 / -1', 
                            marginTop: '30px', 
                            color: '#999',
                            width: '100%' 
                        }}>
                            Quán ăn này hiện chưa có món nào trong thực đơn.
                        </p>
                    )}
                </MenuGrid>
            </ContentWrapper>
        </MenuPageContainer>
    );
};

export default MenuItemList;