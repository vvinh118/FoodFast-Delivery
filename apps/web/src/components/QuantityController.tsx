import React from 'react';
import styled from 'styled-components';
import { useCartStore } from 'core';

// Styled components
const ControllerWrapper = styled.div`
    display: flex;
    align-items: center;
    background-color: white; 
    border: 1px solid #F72D57;
    border-radius: 20px;
    height: 30px;
    width: 90px;
    justify-content: space-between;
    overflow: hidden;
`;

const Button = styled.button`
    background: none;
    border: none;
    color: #F72D57;
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
    user-select: none;
    
    &:hover {
        background-color: #fff0f3;
    }
`;

const QuantityDisplay = styled.span`
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    flex-grow: 1;
    text-align: center;
`;

// TYPES
interface QuantityControllerProps {
    itemId: string | number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    restaurantId: string | number;
    restaurantName: string;
}

const QuantityController: React.FC<QuantityControllerProps> = ({ 
    itemId, 
    name, 
    price, 
    quantity,
    imageUrl,
    restaurantId,
    restaurantName
}) => {
    const addToCart = useCartStore(state => state.addToCart);
    const decreaseQuantity = useCartStore(state => state.decreaseQuantity);

    const handleIncrease = () => {
        addToCart({ 
            id: itemId, 
            name, 
            price, 
            imageUrl,
            restaurantId, 
            restaurantName 
        });
    };

    const handleDecrease = () => {
        decreaseQuantity(itemId);
    };

    return (
        <ControllerWrapper onClick={(e) => e.stopPropagation()}> 
            <Button onClick={handleDecrease}>&minus;</Button>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <Button onClick={handleIncrease}>+</Button>
        </ControllerWrapper>
    );
};

export default QuantityController;