// src/pages/ShoppingCart.tsx

import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext'; 
import CartItemRow from '../components/CartItemRow'; // Component mới

// ==========================================================
// 1. STYLED COMPONENTS
// ==========================================================

const CartPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    max-width: 1000px; 
    margin: 0 auto;
    padding: 20px;
    flex-grow: 1;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
    border-bottom: 2px solid #FFC107;
    padding-bottom: 10px;
`;

const CartSummary = styled.div`
    background: #fff;
    border: 1px solid #eee;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    padding: 5px 0;

    &.total {
        font-size: 1.2rem;
        font-weight: 700;
        color: #00AA13; /* Màu xanh lá cây cho tổng tiền */
        border-top: 1px dashed #ddd;
        margin-top: 10px;
        padding-top: 10px;
    }
`;

const CheckoutButton = styled.button`
    width: 100%;
    padding: 15px;
    background-color: #00AA13;
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #008c0e;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

// ==========================================================
// 2. COMPONENT CHÍNH
// ==========================================================

const ShoppingCart: React.FC = () => {
    const { cartItems, getTotalPrice } = useCart();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    };

    const handleCheckout = () => {
        alert("Đang chuyển đến trang thanh toán. Tổng tiền: " + formatCurrency(getTotalPrice()));
        // Logic điều hướng đến trang thanh toán thực tế sẽ ở đây
    };

    const hasItems = cartItems.length > 0;

    return (
        <CartPageContainer>
            <Header />
            <ContentWrapper>
                <Title>Giỏ hàng của bạn</Title>

                {!hasItems ? (
                    <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
                        Giỏ hàng của bạn hiện đang trống. Hãy quay lại trang chủ và thêm món!
                    </p>
                ) : (
                    <>
                        {/* DANH SÁCH MÓN ĂN */}
                        <div>
                            {cartItems.map(item => (
                                <CartItemRow 
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>

                        {/* TÓM TẮT ĐƠN HÀNG */}
                        <CartSummary>
                            <SummaryRow>
                                <span>Tạm tính</span>
                                <span>{formatCurrency(getTotalPrice())}</span>
                            </SummaryRow>
                            <SummaryRow>
                                <span>Phí giao hàng</span>
                                <span>{formatCurrency(20000)}</span> {/* Ví dụ phí giao hàng */}
                            </SummaryRow>
                            <SummaryRow className="total">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(getTotalPrice() + 20000)}</span>
                            </SummaryRow>
                        </CartSummary>

                        <CheckoutButton onClick={handleCheckout}>
                            Thanh toán ({formatCurrency(getTotalPrice() + 20000)})
                        </CheckoutButton>
                    </>
                )}
            </ContentWrapper>
            <Footer />
        </CartPageContainer>
    );
};

export default ShoppingCart;