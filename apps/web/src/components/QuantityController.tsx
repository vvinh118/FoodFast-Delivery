// src/components/QuantityController.tsx

import React from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';

// Styled Component đã được tối ưu cho giao diện GrabFood
const ControllerWrapper = styled.div`
    display: flex;
    align-items: center;
    background-color: white; 
    border: 1px solid #00AA13; /* Viền xanh */
    border-radius: 20px;
    height: 30px;
    width: 90px; /* Độ rộng nhỏ gọn */
    position: absolute;
    bottom: 10px;
    right: 10px;
`;

const Button = styled.button`
    background: none;
    border: none;
    color: #00AA13;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    width: 30px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
    user-select: none; /* Ngăn chặn highlight khi click nhanh */
`;

const QuantityDisplay = styled.span`
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    width: 30px;
    text-align: center;
`;

interface QuantityControllerProps {
    itemId: number;
    name: string;
    price: number;
    quantity: number;
}

const QuantityController: React.FC<QuantityControllerProps> = ({ itemId, name, price, quantity }) => {
    // Lấy hai hàm tăng/giảm từ context
    const { increaseItemQuantity, decreaseItemQuantity } = useCart();

    const handleIncrease = () => {
        // Tăng số lượng (gửi đầy đủ data)
        increaseItemQuantity({ id: itemId, name, price });
    };

    const handleDecrease = () => {
        // Giảm số lượng (chỉ cần id)
        decreaseItemQuantity(itemId);
    };

    return (
        // Ngăn chặn sự kiện click lan ra CardContainer
        <ControllerWrapper onClick={(e) => e.stopPropagation()}> 
            <Button onClick={handleDecrease}>
                &minus;
            </Button>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <Button onClick={handleIncrease}>
                +
            </Button>
        </ControllerWrapper>
    );
};

export default QuantityController;