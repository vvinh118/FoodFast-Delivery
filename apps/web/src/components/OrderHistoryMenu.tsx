import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import CategoryButton from './CategoryButton';
import Button from './Button';
// Import Type 'Order'
import { type Order } from '../pages/MyOrders';

// === STYLED ===
const HistoryWrapper = styled.div`
    width: 100%;
`;
const OrderMenu = styled.div`
    display: flex;    
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 40px;
`;
const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
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
`;
const ItemImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
`;
const ItemInfo = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
`;
const RestaurantName = styled.h3`
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 5px 0;
`;
const ItemPrice = styled.p`
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 10px 0;
`;
const ItemStatus = styled.span<{ $status: string }>`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${props => 
        (props.$status === 'Delivered' ? '#28a745' :
         props.$status === 'Cancelled' ? '#dc3545' :
         '#007bff')}; // Đang giao (Pending)
`;
const ItemActions = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`;
const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    color: #888;
    background: #fcfcfc;
    border: 1px dashed #ddd;
    border-radius: 8px;
`;


interface OrderHistoryProps {
  allOrders: Order[];
}

// === COMPONENT ===
const OrderHistoryMenu: React.FC<OrderHistoryProps> = ({ allOrders }) => {
    const [activeStatus, setActiveStatus] = useState('Pending');
    const statuses = [
      { key: 'Pending', label: 'Đang xử lý' },
      { key: 'Delivered', label: 'Đã giao' },
      { key: 'Cancelled', label: 'Đã huỷ' },
    ];

    const filteredOrders = useMemo(() => {
        const filtered = allOrders.filter(order => order.status === activeStatus);
        return filtered.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

}, [allOrders, activeStatus]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Render danh sách từ 'filteredOrders'
    const renderListContent = () => {
      if (filteredOrders.length === 0) {
        return (
          <EmptyState>
            Bạn không có đơn hàng nào trong mục này.
          </EmptyState>
        );
      }

      return filteredOrders.map(order => {
        // Lấy món ăn đầu tiên để làm ảnh đại diện
        const firstItem = order.items[0]; 
        
        return (
          <OrderItemCard key={order.id}>
              {/* Lấy ảnh của món đầu tiên */}
              <ItemImage src={firstItem.imageUrl || '/default-image.png'} alt={firstItem.name} />
              <ItemInfo>
                  <RestaurantName>Đơn hàng #{order.id}</RestaurantName> 
                  <ItemPrice>
                      {/* Hiển thị món đầu tiên và số lượng các món khác */}
                      {firstItem.name}
                      {order.items.length > 1 && ` (và ${order.items.length - 1} món khác)`}
                      {' • '}
                      <span style={{fontWeight: 700}}>{formatCurrency(order.total)}</span>
                  </ItemPrice>
                  <ItemStatus $status={order.status}>
                      {/* Hiển thị trạng thái từ API */}
                      {statuses.find(s => s.key === order.status)?.label || order.status}
                  </ItemStatus>
              </ItemInfo>
              {/* <ItemActions>
                {order.status !== 'Pending' && (
                  <Button $padding="8px 15px" $fontSize="0.9rem">
                    Đặt lại
                  </Button>
                )}
              </ItemActions> */}
          </OrderItemCard>
        );
      });
    };

    return (
        <HistoryWrapper>
            <OrderMenu>
                {statuses.map(status => (
                    <CategoryButton
                        key={status.key}
                        name={status.label}
                        isActive={activeStatus === status.key}
                        onClick={() => setActiveStatus(status.key)}
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