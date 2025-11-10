import React from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';

// === TYPES ===
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string; 
    restaurantId: number;
    restaurantName: string;
}

interface CartItemRowProps {
    item: CartItem;
}

// ... (Styled components) ...
const ItemRow = styled.div`
    display: flex;
    padding: 15px 0;
    border-bottom: 1px dashed #eee;
    align-items: center;
    gap: 10px;
`;
const QuantityControllerWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 60px;
    flex-shrink: 0;
`;
const ControlButton = styled.button`
    background: none;
    border: 1px solid #f72d57;
    color: #f72d57;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.9rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin: 0 2px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const QuantityDisplay = styled.span`
    font-size: 0.9rem;
    color: #333;
    font-weight: 600;
    padding: 0 2px;
`;
const ItemInfo = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 10px;
`;
const ItemImage = styled.img`
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
`;
const ItemName = styled.span`
    font-weight: 500;
    color: #333;
    font-size: 0.95rem;
    line-height: 1.3;
`;
const PriceDetails = styled.div`
    display: flex;
    flex-direction: column; 
    align-items: flex-end;
    white-space: nowrap; 
    flex-shrink: 0; 
    margin-left: auto; 
`;
const CurrentPrice = styled.span`
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
`;

// === COMPONENT CHÍNH ===
const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
    const { increaseItemQuantity, decreaseItemQuantity } = useCart();
    
    const handleIncrease = () => {
        increaseItemQuantity(item);
    };

    const handleDecrease = () => {
        decreaseItemQuantity(item.id);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    };
    
    const itemTotalPrice = item.price * item.quantity;

    return (
        <ItemRow>
            {/* Bộ điều khiển số lượng */}
            <QuantityControllerWrapper>
                <ControlButton onClick={handleDecrease}>&minus;</ControlButton>
                <QuantityDisplay>{item.quantity}</QuantityDisplay>
                <ControlButton onClick={handleIncrease}>+</ControlButton>
            </QuantityControllerWrapper>
            
            {/* Hình ảnh và Tên món ăn */}
            <ItemInfo>
                {item.imageUrl && <ItemImage src={item.imageUrl} alt={item.name} />}
                <ItemName>{item.name}</ItemName>
            </ItemInfo>

            {/* Giá tiền */}
            <PriceDetails>
                <CurrentPrice>{formatCurrency(itemTotalPrice)}</CurrentPrice>
            </PriceDetails>
        </ItemRow>
    );
};

export default CartItemRow;