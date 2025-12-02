// apps/web/src/components/merchant/OrderCard.tsx
import React from 'react';
import styled from 'styled-components';
import { FaUser, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { formatCurrency, type Order } from 'core';

// === STYLED COMPONENTS ===
const CardWrapper = styled.div<{ $borderColor: string }>`
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 15px;
    border-top: 4px solid ${props => props.$borderColor};
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
`;

const CardHeader = styled.div`
    border-bottom: 1px dashed #eee;
    padding-bottom: 10px;
    margin-bottom: 10px;

    h4 { margin: 0 0 5px 0; font-size: 1.1rem; color: #333; display: flex; align-items: center; gap: 8px; }
    p { margin: 0; font-size: 0.85rem; color: #777; display: flex; align-items: center; gap: 8px; }
`;

const ContactInfo = styled.div`
    font-size: 0.9rem; color: #666; display: flex; flex-direction: column; gap: 4px; margin-top: 5px;
    div { display: flex; align-items: center; gap: 6px; }
`;

const CardBody = styled.div`
    margin-bottom: 15px;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
`;

const ItemRow = styled.div`
    display: flex; justify-content: space-between; font-size: 0.95rem; margin-bottom: 6px;
    .item-name { font-weight: 500; color: #444; }
    .item-qty { font-weight: 700; color: #f72d57; margin-right: 5px; }
`;

const PriceSummary = styled.div`
    margin-top: 12px;
    border-top: 1px solid #ddd;
    padding-top: 8px;
    text-align: right;

    .subtotal {
        font-size: 1.1rem;
        font-weight: 700;
        color: #f72d57;
        display: flex;
        justify-content: space-between;
    }
    
    .customer-pays {
        font-size: 0.85rem;
        color: #888;
        margin-top: 2px;
    }
`;

const CardFooter = styled.div`
    display: flex; gap: 10px; margin-top: 10px;
`;

const ActionButton = styled.button<{ $primary?: boolean; $danger?: boolean; disabled?: boolean }>`
    flex-grow: 1; padding: 10px; border: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem;
    transition: all 0.2s;
    
    /* Nếu disabled: Màu xám. Nếu không: Màu theo loại */
    background-color: ${props => 
        props.disabled ? '#cccccc' : 
        (props.$primary ? '#f72d57' : props.$danger ? '#fff' : '#e0e0e0')
    };
    
    color: ${props => 
        props.disabled ? '#666666' : 
        (props.$primary ? 'white' : props.$danger ? '#dc3545' : '#333')
    };
    
    border: ${props => props.$danger && !props.disabled ? '1px solid #dc3545' : 'none'};
    
    /* Con trỏ chuột */
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    
    &:hover { 
        opacity: ${props => props.disabled ? 1 : 0.9}; 
        transform: ${props => props.disabled ? 'none' : 'scale(1.02)'}; 
    }
`;

// === HELPERS ===
const getTimeAgo = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return 'Hôm qua';
};

// === COMPONENT ===
interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: string) => void;
    onReject?: (orderId: string) => void;
    customButtonText?: string;
    isActionDisabled?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus, onReject, customButtonText, isActionDisabled }) => {
    const { id, userName, userAddress, status, items, total, createdAt } = order;

    const itemTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let borderColor = '#ccc'; 
    let actions = null;

    if (status === 'Pending') {
        borderColor = '#f0ad4e';
        actions = (
            <>
                {onReject && <ActionButton $danger onClick={() => onReject(String(id))}>Từ chối</ActionButton>}
                <ActionButton $primary onClick={() => onUpdateStatus(String(id))}>{customButtonText || 'Chấp nhận'}</ActionButton>
            </>
        );
    } else if (status === 'Preparing') {
        borderColor = '#337ab7';
        actions = (
            <ActionButton 
                $primary 
                disabled={isActionDisabled} 
                onClick={() => !isActionDisabled && onUpdateStatus(String(id))}
            >
                {customButtonText || 'Sẵn sàng giao'}
            </ActionButton>
        );
    } else if (status === 'Ready') {
        borderColor = '#5cb85c';
        actions = <ActionButton $primary onClick={() => onUpdateStatus(String(id))}>{customButtonText || 'Drone đã lấy'}</ActionButton>;
    } else if (status === 'Delivering') {
        borderColor = '#f72d57';
    }

    return (
        <CardWrapper $borderColor={borderColor}>
            <CardHeader>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h4><FaUser /> {userName}</h4>
                    <p><FaClock /> {getTimeAgo(createdAt)}</p>
                </div>
                <ContactInfo>
                    <div><FaMapMarkerAlt size={12} /> {userAddress}</div>
                </ContactInfo>
            </CardHeader>
            
            <CardBody>
                {items.map((item, index) => (
                    <ItemRow key={`${item.id}-${index}`}>
                        <div>
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.name}</span>
                        </div>
                    </ItemRow>
                ))}
                
                <PriceSummary>
                    <div className="subtotal">
                        <span>Tiền món:</span>
                        <span>{formatCurrency(itemTotal)}</span>
                    </div>
                    <div className="customer-pays">
                        (Khách trả: {formatCurrency(total)})
                    </div>
                </PriceSummary>
            </CardBody>
            
            {actions && <CardFooter>{actions}</CardFooter>}
        </CardWrapper>
    );
};

export default OrderCard;