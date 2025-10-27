// src/components/CartSidebar.tsx

import React from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import CartItemRow from './CartItemRow';
import Button from './Button';

// ==========================================================
// 1. STYLED COMPONENTS
// ==========================================================

const Overlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
    opacity: ${props => (props.$isOpen ? 1 : 0)};
    transition: opacity 0.3s, visibility 0.3s;
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    
    width: 560px; 
    
    height: 100%;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-out;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid #eee;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #666;
    position: absolute; 
    top: 15px;
    left: 15px;
    padding: 0;
    z-index: 1001; 
`;

const HeaderTitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end; 
    margin-bottom: 10px;
    padding-left: 20px; 
`;

const InfoTime = styled.span`
    font-size: 0.85rem;
    color: #666;
    display: flex;
    align-items: center;

    svg {
        margin-right: 5px;
    }
`;

const MainTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 700;
    margin: 10px 0 20px 0;
    color: #333;
    padding-left: 20px;
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
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    margin-bottom: 5px;
`;

const FinalTotal = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 35px 0;
`;



// ==========================================================
// 2. COMPONENT CHÍNH
// ==========================================================

const CartSidebar: React.FC = () => {
    const { isCartOpen, toggleCart, cartItems, getTotalPrice } = useCart();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    };

    const totalAmount = getTotalPrice();
    const deliveryFee = 20000; // Phí giao hàng ví dụ
    const finalTotal = totalAmount + deliveryFee;

    const hasItems = cartItems.length > 0;

    return (
        <>
            <Overlay $isOpen={isCartOpen} onClick={toggleCart} />
            <Sidebar $isOpen={isCartOpen}>
                {/* HEADER */}
                <Header>
                    <CloseButton onClick={toggleCart}>&times;</CloseButton>
                    <HeaderTitleRow>
                        <InfoTime>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
                                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Thời gian giao: 20 phút (Cách bạn 1,2 km)
                        </InfoTime>
                    </HeaderTitleRow>
                    
                    <MainTitle>Giỏ đồ ăn</MainTitle>
                </Header>

                {/* NỘI DUNG CHÍNH (DANH SÁCH MÓN ĂN) */}
                <MainContent>
                    {!hasItems ? (
                        <p style={{ textAlign: 'center', marginTop: '50px', color: '#999', fontSize: '0.9rem' }}>
                            Giỏ hàng của bạn đang trống.
                        </p>
                    ) : (
                        <div>
                            {cartItems.map(item => (
                                <CartItemRow 
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>
                    )}
                </MainContent>

                {/* FOOTER (TỔNG TIỀN VÀ NÚT THANH TOÁN) */}
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

                            <Button to="/checkout" $width='100%' $display='block' $padding='15px' $fontSize='20px' >
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