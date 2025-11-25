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
}

// === STYLED COMPONENTS ===

const ItemContainer = styled.div<{ $disabled?: boolean }>`
    width: 100%;
    height: 100%; 
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: ${props => props.$disabled ? 'default' : 'pointer'};
    transition: transform 0.2s;
    
    display: flex;           
    flex-direction: column; /* Xếp dọc: Ảnh -> Thông tin */
    background-color: white;
    
    opacity: ${props => props.$disabled ? 0.7 : 1};
    
    &:hover { 
        transform: ${props => props.$disabled ? 'none' : 'translateY(-3px)'}; 
    }
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

const SoldOutOverlay = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    backdrop-filter: blur(2px);
    z-index: 2;
`;

const InfoWrapper = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    
    flex-grow: 1; 
    justify-content: space-between; 
    position: relative;
`;

const ItemName = styled.h4`
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;

    /* Cắt dòng nếu tên quá dài (tối đa 2 dòng) */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    
    line-height: 1.3em;
    /* Cố định chiều cao tên món (2 dòng) để các thẻ thẳng hàng ngay từ phần tên */
    height: 2.6em; 
`;

const ItemPrice = styled.p`
    font-size: 1rem;
    font-weight: 700;
    color: #FFC107;
    margin: 0;
`;

const AddButton = styled.button<{ $disabled?: boolean }>`
    background-color: ${props => props.$disabled ? '#ccc' : '#F72D57'};
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
    
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};

    /* Đặt vị trí tuyệt đối ở góc dưới phải của InfoWrapper */
    position: absolute; 
    bottom: 10px;
    right: 10px;
    
    box-shadow: ${props => props.$disabled ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.2)'};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.$disabled ? '#ccc' : '#d41b40'};
    }
`;

// COMPONENT
const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
    name, 
    price, 
    imageUrl, 
    id,
    restaurantId,
    restaurantName,
    isAvailable = true 
}) => {
    const cartItem = useCartStore(state => state.items.find(i => i.id === id));
    const addToCart = useCartStore(state => state.addToCart);

    const isInCart = cartItem && cartItem.quantity > 0;

    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const navigate = useNavigate();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAvailable) {
            return; 
        }

        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm món ăn vào giỏ');
            navigate('/login');
            return;
        }

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
        <ItemContainer $disabled={!isAvailable}>
            <ImageWrapper>
                <ItemImage src={imageUrl} alt={name} />
                {!isAvailable && <SoldOutOverlay>HẾT MÓN</SoldOutOverlay>}
            </ImageWrapper>
            
            <InfoWrapper>
                <div style={{ paddingRight: '30px' }}> 
                    <ItemName title={name}>{name}</ItemName>
                </div>
                
                <ItemPrice>{formatCurrency(price)}</ItemPrice>
                
                {!isAvailable ? (
                    <AddButton disabled $disabled={true} onClick={(e) => e.stopPropagation()}>
                        <span style={{fontSize: '0.6rem', fontWeight: 'bold'}}>HẾT</span>
                    </AddButton>
                ) : (
                    isInCart && cartItem ? (
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
                    )
                )}
            </InfoWrapper>
        </ItemContainer>
    );
};

export default MenuItemCard;