import React, { useState } from 'react';
import styled from 'styled-components';
import CategoryButton from './CategoryButton';
import Button from './Button';
import { mockMenuItems, mockRestaurants } from '../data/mockData'; 

const HistoryWrapper = styled.div`
    width: 100%;
`
const OrderMenu = styled.div`
    display: flex;    
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 40px; // Tăng khoảng cách với danh sách
`
const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px; // Khoảng cách giữa các đơn hàng
`
const OrderItemCard = styled.div`
    display: flex;
    background: #ffffff;
    border: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border-radius: 8px;
    padding: 15px;
    gap: 15px;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
`

const ItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
`

const ItemInfo = styled.div`
    flex-grow: 1; // Lấp đầy không gian
    display: flex;
    flex-direction: column;
`

const RestaurantName = styled.h3`
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 5px 0;
`

const ItemPrice = styled.p`
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 10px 0;
`
const ItemStatus = styled.span<{ $status: 'delivered' | 'cancelled' }>`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${props => (props.$status === 'delivered' ? '#28a745' : '#dc3545')};
`

const ItemActions = styled.div`
    margin-left: auto; // Đẩy qua phải
    display: flex;
    align-items: center;
`
const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    color: #888;
    background: #fcfcfc;
    border: 1px dashed #ddd;
    border-radius: 8px;
`

const OrderHistoryMenu: React.FC = () => {
    const [activeStatus, setActiveStatus] = useState('Đang giao');
    const statuses = ['Đang giao', 'Đã giao', 'Đã huỷ'];

    const deliveredOrders = [ 
        mockMenuItems[0], 
        mockMenuItems[9], 
        mockMenuItems[12], 
        mockMenuItems[15], 
        mockMenuItems[17], 
        mockMenuItems[19]  
    ];

    const cancelledOrders = [ 
        mockMenuItems[21], 
        mockMenuItems[23]  
    ];

    const findRestaurantName = (restaurantId: number) => {
        return mockRestaurants.find(r => r.id === restaurantId)?.name || "Nhà hàng";
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const renderListContent = () => {
        switch (activeStatus) {
            case 'Đang giao':
                return (
                    <EmptyState>
                        Bạn không có đơn hàng nào đang giao.
                    </EmptyState>
                );

            case 'Đã giao':
                return deliveredOrders.map(item => (
                    <OrderItemCard key={item.id}>
                        <ItemImage src={item.imageUrl} alt={item.name} />
                        <ItemInfo>
                            <RestaurantName>{findRestaurantName(item.restaurantId)}</RestaurantName>
                            <ItemPrice>
                                {item.name} (và {Math.floor(Math.random() * 3) + 1} món khác) • {formatCurrency(item.price + 30000)}
                            </ItemPrice>
                            <ItemStatus $status="delivered">Đã giao thành công</ItemStatus>
                        </ItemInfo>
                        <ItemActions>
                            <Button $padding="8px 15px" $fontSize="0.9rem">Đặt lại</Button>
                        </ItemActions>
                    </OrderItemCard>
                ));
            
            case 'Đã huỷ':
                return cancelledOrders.map(item => (
                    <OrderItemCard key={item.id}>
                        <ItemImage src={item.imageUrl} alt={item.name} />
                        <ItemInfo>
                            <RestaurantName>{findRestaurantName(item.restaurantId)}</RestaurantName>
                            <ItemPrice>
                                {item.name} • {formatCurrency(item.price)}
                            </ItemPrice>
                            <ItemStatus $status="cancelled">Đã huỷ</ItemStatus>
                        </ItemInfo>
                        <ItemActions>
                            <Button $padding="8px 15px" $fontSize="0.9rem">Đặt lại</Button>
                        </ItemActions>
                    </OrderItemCard>
                ));

            default:
                return null;
        }
    };

    return (
        <HistoryWrapper>
            {/* 1. PHẦN MENU */}
            <OrderMenu>
                {statuses.map(status => (
                    <CategoryButton
                        key={status}
                        name={status}
                        isActive={activeStatus === status}
                        onClick={() => setActiveStatus(status)}
                    />
                ))}
            </OrderMenu>

            {/* 2. PHẦN DANH SÁCH (Render có điều kiện) */}
            <ListWrapper>
                {renderListContent()}
            </ListWrapper>
        </HistoryWrapper>
    );
}

export default OrderHistoryMenu;