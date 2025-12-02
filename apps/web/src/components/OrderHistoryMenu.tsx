import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CategoryButton from './CategoryButton';
import { formatCurrency, type Order } from 'core';

// STYLED COMPONENTS
const HistoryWrapper = styled.div` width: 100%; `;
const OrderMenu = styled.div` display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-bottom: 40px; `;
const ListWrapper = styled.div` display: flex; flex-direction: column; gap: 20px; `;

const OrderItemCard = styled.div<{ $clickable?: boolean }>`
    display: flex; 
    background: #ffffff; 
    border: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
    border-radius: 8px; 
    padding: 15px; 
    gap: 15px;
    transition: all 0.2s; 
    
    /* Chỉ hiện bàn tay và hiệu ứng nổi nếu được phép click */
    cursor: ${props => props.$clickable ? 'pointer' : 'default'};
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border-color: ${props => props.$clickable ? '#F72D57' : '#eee'};
        transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
    }
`;

const ItemImage = styled.img` width: 80px; height: 80px; object-fit: cover; border-radius: 6px; `;
const ItemInfo = styled.div` flex-grow: 1; display: flex; flex-direction: column; `;
const RestaurantName = styled.h3` font-size: 1.1rem; font-weight: 700; color: #333; margin: 0 0 5px 0; `;
const ItemPrice = styled.p` font-size: 0.9rem; color: #555; margin: 0 0 10px 0; `;
const ItemStatus = styled.span<{ $status: string }>`
    font-size: 0.9rem; font-weight: 600;
    color: ${props => (props.$status === 'Delivered' ? '#28a745' : props.$status === 'Cancelled' ? '#dc3545' : '#007bff')};
`;
const EmptyState = styled.div` text-align: center; padding: 40px; color: #888; background: #fcfcfc; border: 1px dashed #ddd; border-radius: 8px; `;

interface OrderHistoryProps {
  allOrders: Order[];
}

const OrderHistoryMenu: React.FC<OrderHistoryProps> = ({ allOrders }) => {
    const [activeTab, setActiveTab] = useState('PROCESSING'); 
    const navigate = useNavigate();

    const tabs = [
      { key: 'PROCESSING', label: 'Đang xử lý' },
      { key: 'Delivered', label: 'Đã giao' },
      { key: 'Cancelled', label: 'Đã huỷ' },
    ];

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Pending': return 'Chờ xác nhận';
            case 'Preparing': return 'Đang chuẩn bị';
            case 'Ready': return 'Chờ giao hàng';
            case 'Delivering': return 'Đang giao hàng';
            case 'Delivered': return 'Giao thành công';
            case 'Cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const filteredOrders = useMemo(() => {
        return allOrders.filter(order => {
            if (activeTab === 'PROCESSING') {
                return ['Pending', 'Preparing', 'Ready', 'Delivering'].includes(order.status);
            }
            return order.status === activeTab;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [allOrders, activeTab]);

    const renderListContent = () => {
      if (filteredOrders.length === 0) {
        return <EmptyState>Bạn không có đơn hàng nào trong mục này.</EmptyState>;
      }

      return filteredOrders.map(order => {
        const firstItem = order.items[0]; 
        
        // LOGIC KIỂM TRA: Chỉ cho click nếu đang ở tab 'PROCESSING'
        const isClickable = activeTab === 'PROCESSING';

        return (
          <OrderItemCard 
            key={order.id}
            $clickable={isClickable}
            onClick={() => {
                // Chỉ chuyển trang nếu là đơn đang xử lý
                if (isClickable) {
                    navigate(`/tracking/${order.id}`);
                }
            }}
          >
              <ItemImage src={firstItem.imageUrl || '/default-image.png'} alt={firstItem.name} />
              <ItemInfo>
                  <RestaurantName>Đơn hàng #{order.id}</RestaurantName> 
                  <ItemPrice>
                      {firstItem.name}
                      {order.items.length > 1 && ` (và ${order.items.length - 1} món khác)`}
                      {' • '}
                      <span style={{fontWeight: 700}}>{formatCurrency(order.total)}</span>
                  </ItemPrice>
                  
                  <ItemStatus $status={order.status}>
                      {getStatusLabel(order.status)}
                      {isClickable && <span style={{fontSize: '0.8rem', color: '#999', fontWeight: 'normal', marginLeft: 10}}>(Bấm để theo dõi)</span>}
                  </ItemStatus>
              </ItemInfo>
          </OrderItemCard>
        );
      });
    };

    return (
        <HistoryWrapper>
            <OrderMenu>
                {tabs.map(tab => (
                    <CategoryButton
                        key={tab.key}
                        name={tab.label}
                        isActive={activeTab === tab.key}
                        onClick={() => setActiveTab(tab.key)}
                    />
                ))}
            </OrderMenu>
            <ListWrapper>
                {renderListContent()}
            </ListWrapper>
        </HistoryWrapper>
    );
}

export default OrderHistoryMenu;