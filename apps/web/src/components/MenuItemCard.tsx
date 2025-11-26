import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import QuantityController from './QuantityController';
import { useCartStore, useAuthStore, formatCurrency } from 'core';

interface MenuItemCardProps {
    id: string | number;
    name: string;
    price: number;
    imageUrl: string;
    restaurantId: string | number;
    restaurantName: string;
    isAvailable?: boolean;
    description?: string; 
}

const ItemContainer = styled.div<{ $disabled?: boolean }>`
    width: 100%;
    height: 160px; /* Desktop */
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
    
    display: flex;           
    flex-direction: row; 
    
    cursor: ${props => props.$disabled ? 'default' : 'pointer'};
    transition: all 0.2s;
    opacity: ${props => props.$disabled ? 0.6 : 1};
    
    &:hover { 
        transform: ${props => props.$disabled ? 'none' : 'translateY(-3px)'}; 
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 640px) {
        height: 110px; 
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    width: 160px; /* Desktop */
    height: 100%; 
    flex-shrink: 0; 
    background-color: #f0f0f0;

    @media (max-width: 640px) {
        width: 110px; 
    }
`;

const ItemImage = styled.img`
    width: 100%; height: 100%; object-fit: cover; display: block;
`;

const SoldOutOverlay = styled.div`
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex; justify-content: center; align-items: center;
    color: white; font-weight: bold; font-size: 1rem;
    text-align: center; text-transform: uppercase; letter-spacing: 1px;
    backdrop-filter: blur(2px); z-index: 2;
    
    @media (max-width: 640px) { font-size: 0.8rem; }
`;

const InfoWrapper = styled.div`
    padding: 15px;
    display: flex; flex-direction: column; flex-grow: 1; 
    justify-content: space-between; overflow: hidden; 

    @media (max-width: 640px) { padding: 10px; }
`;

const ItemName = styled.h4`
    font-size: 1rem; font-weight: 700; color: #333;
    margin: 0 0 6px 0; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; text-overflow: ellipsis;

    @media (max-width: 640px) { font-size: 0.9rem; margin-bottom: 4px; }
`;

const ItemDesc = styled.p`
    font-size: 0.85rem; color: #777; margin: 0; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; text-overflow: ellipsis;

    @media (max-width: 640px) { font-size: 0.75rem; -webkit-line-clamp: 1; }
`;

const FooterRow = styled.div`
    display: flex; justify-content: space-between; align-items: flex-end; 
    margin-top: 5px; 
`;

const ItemPrice = styled.span`
    font-size: 1.1rem; font-weight: 700; color: #333; 
    line-height: 1; padding-bottom: 5px; 

    @media (max-width: 640px) { font-size: 0.95rem; padding-bottom: 3px; }
`;

const ActionWrapper = styled.div`
    height: 32px; display: flex; align-items: center; justify-content: flex-end;
    @media (max-width: 640px) { height: 28px; }
`;

const AddButton = styled.button<{ $disabled?: boolean }>`
    background-color: ${props => props.$disabled ? '#ccc' : '#F72D57'};
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px; 
    height: 32px;
    
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; font-weight: 400; line-height: 1; padding-bottom: 3px;

    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.$disabled ? '#ccc' : '#d41b40'};
        transform: scale(1.05);
    }

    @media (max-width: 640px) {
        width: 28px; height: 28px; font-size: 1.2rem; padding-bottom: 2px;
    }
`;

// COMPONENT
const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
    name, price, imageUrl, id, restaurantId, restaurantName, 
    isAvailable = true, description 
}) => {
    const cartItem = useCartStore(state => state.items.find(i => i.id === id));
    const addToCart = useCartStore(state => state.addToCart);
    const isInCart = cartItem && cartItem.quantity > 0;
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const navigate = useNavigate();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAvailable) return;
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm món ăn vào giỏ');
            navigate('/login');
            return;
        }
        addToCart({ 
            id: id, name: name, price: price, imageUrl: imageUrl,
            restaurantId: restaurantId, restaurantName: restaurantName
        });
    };

    return (
        <ItemContainer $disabled={!isAvailable}>
            <ImageWrapper>
                <ItemImage src={imageUrl} alt={name} />
                {!isAvailable && <SoldOutOverlay>HẾT MÓN</SoldOutOverlay>}
            </ImageWrapper>
            
            <InfoWrapper>
                <div>
                    <ItemName title={name}>{name}</ItemName>
                    <ItemDesc title={description}>
                        {description || "Món ngon hấp dẫn, hương vị đậm đà."}
                    </ItemDesc>
                </div>
                
                <FooterRow>
                    <ItemPrice>{formatCurrency(price)}</ItemPrice>
                    
                    <ActionWrapper>
                        {!isAvailable ? (
                            <AddButton disabled $disabled={true} onClick={(e) => e.stopPropagation()}>
                                {/* Dùng text + */}
                                +
                            </AddButton>
                        ) : (
                            isInCart && cartItem ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <QuantityController
                                        itemId={id} name={name} price={price}
                                        quantity={cartItem.quantity} imageUrl={imageUrl}
                                        restaurantId={restaurantId} restaurantName={restaurantName}
                                    />
                                </div>
                            ) : (
                                <AddButton onClick={handleAddToCart}>
                                    +
                                </AddButton>
                            )
                        )}
                    </ActionWrapper>
                </FooterRow>
            </InfoWrapper>
        </ItemContainer>
    );
};

export default MenuItemCard;