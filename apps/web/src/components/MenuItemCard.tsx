import React from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import QuantityController from './QuantityController';

interface MenuItemCardProps {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    restaurantId: number; 
    restaurantName: string;
}

// .Styled components
const ItemContainer = styled.div`
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
    height: auto; 
    &:hover { transform: translateY(-3px); }
`;
const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-top: 100%; 
    overflow: hidden;
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
    padding: 10px;
    display: flex;
    flex-direction: column;
    min-height: 80px;
    background: white;
    position: relative;
`;
const ItemName = styled.h4`
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;
const ItemPrice = styled.p`
    font-size: 1rem;
    font-weight: 700;
    color: #FFC107;
    margin-top: auto; 
    margin-bottom: 0;
`;
const AddButton = styled.button`
    background-color: #F72D57;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 1.5rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: absolute; 
    bottom: 10px;
    right: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

// === COMPONENT CHÍNH ===
const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
    name, 
    price, 
    imageUrl, 
    id,
    restaurantId,
    restaurantName
}) => {
    const { increaseItemQuantity, findItem } = useCart(); 
    const cartItem = findItem(id);
    const isInCart = cartItem && cartItem.quantity > 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm món ăn vào giỏ');
            navigate('/login');
            return;
        }
        e.stopPropagation();
        
        increaseItemQuantity({ 
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
                <ItemName>{name}</ItemName>
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 5px 0' }}>
                    Chúc quý khách ngon miệng
                </p>
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