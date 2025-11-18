import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import QuantityController from './QuantityController';
import { useCartStore, useAuthStore, formatCurrency } from 'core';

interface MenuItemCardProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    restaurantId: number; 
    restaurantName: string;
}

// STYLED COMPONENTS
const ItemContainer = styled.div`
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;           
    flex-direction: column;
    height: 100%;
    background-color: white;
    
    &:hover { transform: translateY(-3px); }
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-top: 100%; 
    overflow: hidden;
    flex-shrink: 0;
    background-color: #f0f0f0;
`;

const ItemImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const InfoWrapper = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    position: relative;
    min-height: 90px;
`;

const ItemName = styled.h4`
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    
    min-height: 2.4em; 
    line-height: 1.2em;
`;

const ItemPrice = styled.p`
    font-size: 1rem;
    font-weight: 700;
    color: #FFC107;
    margin: 0;
`;

const AddButton = styled.button`
    background-color: #F72D57;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.4rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    position: absolute; 
    bottom: 10px;
    right: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s;

    &:hover {
        background-color: #d41b40;
    }
`;

// COMPONENT
const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
    name, 
    price, 
    imageUrl, 
    id,
    restaurantId,
    restaurantName
}) => {
    const cartItem = useCartStore(state => state.items.find(i => i.id === id));
    const addToCart = useCartStore(state => state.addToCart);

    const isInCart = cartItem && cartItem.quantity > 0;

    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const navigate = useNavigate();

    const handleAddToCart = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm món ăn vào giỏ');
            navigate('/login');
            return;
        }
        e.stopPropagation();

        addToCart({ 
            id: id, 
            name: name, 
            price: price, 
            imageUrl: imageUrl,
            restaurantId: restaurantId,
            restaurantName: restaurantName
        });
    };

    return (
        <ItemContainer>
            <ImageWrapper>
                <ItemImage src={imageUrl} alt={name} />
            </ImageWrapper>
            <InfoWrapper>
                <div style={{ paddingRight: '30px' }}> {/* Tránh tên đè lên nút Add nếu quá dài */}
                    <ItemName title={name}>{name}</ItemName>
                </div>
                
                <ItemPrice>{formatCurrency(price)}</ItemPrice>
                
                {isInCart && cartItem ? (
                    <QuantityController
                        itemId={id}
                        name={name}
                        price={price}
                        quantity={cartItem.quantity}
                        imageUrl={imageUrl}
                        restaurantId={restaurantId}
                        restaurantName={restaurantName}
                    />
                ) : (
                    <AddButton onClick={handleAddToCart}>
                        +
                    </AddButton>
                )}
            </InfoWrapper>
        </ItemContainer>
    );
};

export default MenuItemCard;