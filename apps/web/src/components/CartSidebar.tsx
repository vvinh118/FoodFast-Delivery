import React from 'react';
import styled from 'styled-components';
import CartItemRow from './CartItemRow';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useCartStore, APP_CONSTANTS, formatCurrency } from 'core';

import { 
  Overlay, 
  SidebarFrame,
  CloseButton 
} from '../components/SideBarStyle'; 

const { DELIVERY_FEE } = APP_CONSTANTS;


// STYLED COMPONENTS
const Header = styled.div`
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid #eee;
    position: relative; 
`;
const HeaderTitleRow = styled.div`
    display: flex; align-items: center; justify-content: flex-end; 
    margin-bottom: 10px; padding-left: 20px; 
`;
const InfoTime = styled.span`
    font-size: 0.85rem; color: #666; display: flex; align-items: center;
    svg { margin-right: 5px; }
`;
const MainTitle = styled.h3`
    font-size: 1.1rem; font-weight: 700; margin: 10px 0 20px 0;
    color: #333; padding-left: 20px;
`;
const MainContent = styled.div`
    flex-grow: 1;
    overflow-y: auto;
    padding: 0 20px;
`;
const SummaryTotal = styled.div`
    padding: 35px;
    border-top: 1px solid #eee;
    background: #fcfcfc;
`;
const SummaryRow = styled.div`
    display: flex; justify-content: space-between;
    font-size: 0.95rem; margin-bottom: 5px;
`;
const FinalTotal = styled.div`
    display: flex; justify-content: space-between;
    font-size: 1.2rem; font-weight: 700; margin: 35px 0;
`;

const ConflictWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 30px;
    text-align: center;
`;
const ConflictTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 15px;
`;
const ConflictText = styled.p`
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 30px;
`;
const ConflictActions = styled.div`
    display: flex;
    width: 100%;
    gap: 15px;
    > * { flex: 1; }
`;
const BasketIcon = styled.img`
    width: 400px;
    height: auto;
    margin-bottom: 20px;
`;
const RestaurantTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  margin: 20px 0 10px 0; // Thêm khoảng cách
`;

// COMPONENT
const CartSidebar: React.FC = () => {
    const isCartOpen = useCartStore(state => state.isCartOpen);
    const toggleCart = useCartStore(state => state.toggleCart);
    const items = useCartStore(state => state.items);
    const totalAmount = useCartStore(state => state.totalAmount);
    const conflictingItem = useCartStore(state => state.conflictingItem);

    const proceedWithNewBasket = useCartStore(state => state.proceedWithNewBasket);
    const cancelNewBasket = useCartStore(state => state.cancelNewBasket);
    
    const navigate = useNavigate();

    const handleCheckout = () => {
      toggleCart(); 
      navigate('/checkout');
    };

    
    // Hiển thị xác nhận nếu thêm món từ nhà hàng khác
    if (conflictingItem) {
        const oldRestaurantName = items.length > 0 ? items[0].restaurantName : "nhà hàng cũ";
        const newRestaurantName = conflictingItem.restaurantName;
        
        return (
            <>
                <Overlay $isOpen={isCartOpen} onClick={cancelNewBasket} />
                <SidebarFrame $isOpen={isCartOpen}>
                    <CloseButton onClick={cancelNewBasket}>&times;</CloseButton>
                    <ConflictWrapper>
                        <BasketIcon src="/icons/new-basket.svg" alt="Basket Conflict" />
                        <ConflictTitle>Tạo giỏ hàng mới?</ConflictTitle>
                        <ConflictText>
                            Thêm món ăn từ <strong>{newRestaurantName}</strong> sẽ xóa giỏ hàng 
                            của <strong>{oldRestaurantName}</strong> hiện tại.
                        </ConflictText>
                        <ConflictActions>
                            <Button 
                                onClick={cancelNewBasket}
                                $background="#eee" 
                                $color="#333" 
                                $hoverBackground="#ddd"
                                $padding="12px"
                            >
                                Hủy
                            </Button>
                            <Button 
                                onClick={proceedWithNewBasket}
                                $padding="12px"
                            >
                                Tiếp tục
                            </Button>
                        </ConflictActions>
                    </ConflictWrapper>
                </SidebarFrame>
            </>
        );
    }
    
    // Hiển thị giỏ hàng bình thường
    const finalTotal = totalAmount + DELIVERY_FEE;
    const hasItems = items.length > 0;

    return (
        <>
            <Overlay $isOpen={isCartOpen} onClick={toggleCart} />
            <SidebarFrame $isOpen={isCartOpen}>
                <Header>
                    <CloseButton onClick={toggleCart}>&times;</CloseButton>
                    <HeaderTitleRow>
                        <InfoTime>
                            Thời gian giao: 20 phút (Cách bạn 1,2 km)
                        </InfoTime>
                    </HeaderTitleRow>
                    <MainTitle>Giỏ đồ ăn</MainTitle>
                </Header>

                <MainContent>
                    {!hasItems ? (
                        <p style={{ textAlign: 'center', marginTop: '50px', color: '#999', fontSize: '0.9rem' }}>
                            Giỏ hàng của bạn đang trống.
                        </p>
                    ) : (
                        <div>
                            {/* Tên nhà hàng */}
                            <RestaurantTitle>{items[0].restaurantName}</RestaurantTitle>

                            {/* Map qua các món ăn */}
                            {items.map(item => (
                                <CartItemRow 
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>
                    )}
                </MainContent>

                <SummaryTotal>
                    {hasItems && (
                        <>
                            <SummaryRow>
                                <span>Tổng</span>
                                <span>{formatCurrency(totalAmount)}</span>
                            </SummaryRow>
                            <SummaryRow style={{ color: '#666' }}>
                                <span>Phí giao hàng tạm tính</span>
                                <span>{formatCurrency(DELIVERY_FEE)}</span>
                            </SummaryRow>
                            <FinalTotal>
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </FinalTotal>
                            <Button 
                                onClick={handleCheckout} 
                                $width='100%' 
                                $fontSize='20px'
                            >
                                Xem lại đơn hàng
                            </Button>
                        </>
                    )}
                </SummaryTotal>
            </SidebarFrame>
        </>
    );
};

export default CartSidebar;