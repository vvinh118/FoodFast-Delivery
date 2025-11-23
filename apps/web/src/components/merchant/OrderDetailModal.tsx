import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import type { Order } from '../merchant/MerchantHistory' 

// === STYLED COMPONENTS ===
const Overlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 1000;
    display: flex; justify-content: center; align-items: center;
    animation: fadeIn 0.2s ease-out;
`;

const ModalContainer = styled.div`
    background: white;
    width: 600px;
    max-width: 90%;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ModalHeader = styled.div`
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;

    h2 { margin: 0; font-size: 1.2rem; color: #333; }
    span { font-size: 0.9rem; color: #666; }
`;

const CloseButton = styled.button`
    background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #666;
    &:hover { color: #333; }
`;

const ModalBody = styled.div`
    padding: 20px;
    overflow-y: auto;
`;

const Section = styled.div`
    margin-bottom: 25px;
    
    h3 { 
        font-size: 1rem; 
        color: #333; 
        margin-bottom: 10px; 
        border-left: 4px solid #f72d57; 
        padding-left: 10px; 
    }
`;

const InfoRow = styled.div`
    display: flex; margin-bottom: 8px; font-size: 0.95rem;
    svg { margin-right: 10px; color: #888; width: 16px; }
    span.label { font-weight: 600; width: 120px; color: #555; }
    span.value { color: #333; flex: 1; }
`;

const ItemTable = styled.table`
    width: 100%; border-collapse: collapse; margin-top: 10px;
    th { text-align: left; padding: 10px; background: #f1f1f1; font-size: 0.85rem; color: #555; }
    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    td.price { text-align: right; font-weight: 600; }
`;

const StatusBadge = styled.span<{ $status: string }>`
    padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: white;
    background-color: ${props => 
        props.$status === 'Delivered' ? '#28a745' : 
        props.$status === 'Cancelled' ? '#dc3545' : 
        props.$status === 'Pending' ? '#ffc107' : '#17a2b8'};
`;

const FinancialSection = styled.div`
    background-color: #fdfdfd;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
`;

const FinancialRow = styled.div<{ $isTotal?: boolean; $isDeduction?: boolean }>`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: ${props => props.$isTotal ? '1.1rem' : '0.95rem'};
    font-weight: ${props => props.$isTotal ? '700' : 'normal'};
    color: ${props => props.$isDeduction ? '#dc3545' : props.$isTotal ? '#28a745' : '#333'};
    
    padding-top: ${props => props.$isTotal ? '10px' : '0'};
    border-top: ${props => props.$isTotal ? '1px dashed #ddd' : 'none'};
`;

// === HELPER ===
const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`;
};

// === PROPS ===
interface OrderDetailModalProps {
    order: Order;
    onClose: () => void;
}

// === COMPONENT ===
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    // Phí ship cố định
    const SHIPPING_FEE = 20000;
    
    // Tổng khách trả 
    const totalPayment = order.total;

    // Doanh thu từ món ăn
    const itemRevenue = totalPayment - SHIPPING_FEE;

    // Phí sàn (20% của doanh thu món)
    const commissionRate = 0.2; 
    const commissionFee = itemRevenue > 0 ? itemRevenue * commissionRate : 0;
    
    // Thực nhận về ví
    const netIncome = itemRevenue - commissionFee;

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <div>
                        <h2>Đơn hàng #{order.id.substring(0, 6)}</h2>
                        <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                </ModalHeader>

                <ModalBody>
                    {/* Thông tin khách hàng */}
                    <Section>
                        <h3>Thông tin khách hàng</h3>
                        <InfoRow> 
                            <FaUser /> <span className="label">Họ tên:</span> 
                            <span className="value">{order.userName}</span> 
                        </InfoRow>
                        <InfoRow> 
                            <FaPhone /> <span className="label">SĐT:</span> 
                            <span className="value">{order.userPhone}</span> 
                        </InfoRow>
                        <InfoRow> 
                            <FaMapMarkerAlt /> <span className="label">Địa chỉ:</span> 
                            <span className="value">{order.userAddress}</span> 
                        </InfoRow>
                    </Section>

                    {/* Chi tiết đơn hàng */}
                    <Section>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h3>Chi tiết đơn hàng</h3>
                            <StatusBadge $status={order.status}>{order.status}</StatusBadge>
                        </div>
                        
                        <ItemTable>
                            <thead>
                                <tr>
                                    <th>Món ăn</th>
                                    <th style={{width: '50px', textAlign: 'center'}}>SL</th>
                                    <th style={{textAlign: 'right'}}>Đơn giá</th>
                                    <th style={{textAlign: 'right'}}>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.name}</td>
                                        <td style={{textAlign: 'center'}}>x{item.quantity}</td>
                                        <td className="price">{formatCurrency(item.price)}</td>
                                        <td className="price">{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </ItemTable>

                        {/* PHẦN KINH TẾ */}
                        <FinancialSection>
                            <FinancialRow>
                                <span>Tổng thanh toán (Khách trả):</span>
                                <span>{formatCurrency(totalPayment)}</span>
                            </FinancialRow>

                            <FinancialRow $isDeduction>
                                <span>Trừ Phí Ship (Cố định):</span>
                                <span>-{formatCurrency(SHIPPING_FEE)}</span>
                            </FinancialRow>

                            <div style={{borderBottom: '1px solid #eee', margin: '5px 0'}}></div>

                            <FinancialRow>
                                <span>Doanh thu món ăn:</span>
                                <span>{formatCurrency(itemRevenue)}</span>
                            </FinancialRow>
                            
                            <FinancialRow $isDeduction>
                                <span>Chiết khấu sàn (20%):</span>
                                <span>-{formatCurrency(commissionFee)}</span>
                            </FinancialRow>

                            <FinancialRow $isTotal>
                                <span>Thực nhận về ví (Sẽ cộng sau):</span>
                                <span>{formatCurrency(netIncome)}</span>
                            </FinancialRow>
                            
                        </FinancialSection>
                    </Section>
                </ModalBody>
            </ModalContainer>
        </Overlay>
    );
};

export default OrderDetailModal;