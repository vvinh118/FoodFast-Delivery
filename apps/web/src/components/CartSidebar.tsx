import React from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import CartItemRow from './CartItemRow';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

// ==========================================================
// 1. STYLED COMPONENTS
// ==========================================================
const Overlay = styled.div<{ $isOpen: boolean }>`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5); z-index: 999;
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
    opacity: ${props => (props.$isOpen ? 1 : 0)};
    transition: opacity 0.3s, visibility 0.3s;
`;
const Sidebar = styled.div<{ $isOpen: boolean }>`
    position: fixed; top: 0; right: 0; width: 560px; height: 100%;
    background: white; box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-out;
    display: flex; flex-direction: column;
`;
const Header = styled.div`
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid #eee;
`;
const CloseButton = styled.button`
    background: none; border: none; font-size: 1.8rem; cursor: pointer;
    color: #666; position: absolute; top: 15px; left: 15px; padding: 0;
    z-index: 1001; 
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
    
    > * { 
      flex: 1;
    }
`;
const BasketIcon = styled.img`
    width: 500px;
    height: auto;
    margin-bottom: 20px;
`;

// ==========================================================
// 2. COMPONENT CHÍNH
// ==========================================================
const CartSidebar: React.FC = () => {
    const { 
      isCartOpen, 
      toggleCart, 
      items, 
      totalAmount,
      conflictingItem,
      proceedWithNewBasket,
      cancelNewBasket
    } = useCart();
    
    const navigate = useNavigate();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    };

    const handleCheckout = () => {
      toggleCart(); 
      navigate('/checkout');
    };

    
    // NỘI DUNG 1: Hiển thị xác nhận nếu thêm món từ nhà hàng khác
    if (conflictingItem) {
        const oldRestaurantName = items.length > 0 ? items[0].restaurantName : "nhà hàng cũ";
        const newRestaurantName = conflictingItem.restaurantName;
        
        return (
            <>
                <Overlay $isOpen={isCartOpen} onClick={cancelNewBasket} />
                <Sidebar $isOpen={isCartOpen}>
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
                </Sidebar>
            </>
        );
    }
    
    // NỘI DUNG 2: Hiển thị giỏ hàng bình thường
    const deliveryFee = 20000;
    const finalTotal = totalAmount + deliveryFee;
    const hasItems = items.length > 0;

    return (
        <>
            <Overlay $isOpen={isCartOpen} onClick={toggleCart} />
            <Sidebar $isOpen={isCartOpen}>
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
                                <span>{formatCurrency(deliveryFee)}</span>
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
            </Sidebar>
        </>
    );
};

export default CartSidebar;