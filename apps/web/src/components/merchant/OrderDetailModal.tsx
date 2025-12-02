import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaMoneyBillWave, FaMotorcycle } from 'react-icons/fa';
import { type Order, formatCurrency } from 'core';

// styled components
const Overlay = styled.div` position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.2s ease-out; `;
const ModalContainer = styled.div` background: white; width: 600px; max-width: 90%; max-height: 90vh; border-radius: 12px; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; `;
const ModalHeader = styled.div` padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; h2 { margin: 0; font-size: 1.4rem; color: #333; } `;
const CloseButton = styled.button` background: none; border: none; font-size: 1.2rem; color: #999; cursor: pointer; &:hover { color: #333; } `;
const ModalBody = styled.div` padding: 20px; `;
const InfoGroup = styled.div` margin-bottom: 20px; `;
const Label = styled.h4` margin: 0 0 10px 0; color: #555; font-size: 0.95rem; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; `;
const InfoRow = styled.div` display: flex; align-items: center; gap: 10px; margin-bottom: 8px; color: #333; font-size: 0.95rem; svg { color: #888; width: 16px; } `;
const ItemsTable = styled.table` width: 100%; border-collapse: collapse; margin-top: 10px; th { text-align: left; color: #777; font-weight: 500; padding: 8px; border-bottom: 1px solid #eee; font-size: 0.85rem; } td { padding: 10px 8px; border-bottom: 1px solid #f9f9f9; font-size: 0.95rem; } .price { text-align: right; font-weight: 600; } `;
const TotalSection = styled.div` margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; `;
const TotalRow = styled.div<{ $highlight?: boolean }>` display: flex; justify-content: space-between; width: 100%; max-width: 300px; font-size: ${props => props.$highlight ? '1.2rem' : '0.95rem'}; font-weight: ${props => props.$highlight ? '700' : '400'}; color: ${props => props.$highlight ? '#f72d57' : '#555'}; `;
const StatusBadge = styled.span` padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; background: #eee; color: #555; `;

interface Props {
    order: Order;
    onClose: () => void;
}

const OrderDetailModal: React.FC<Props> = ({ order, onClose }) => {
    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <h2>Đơn hàng #{String(order.id).substring(0, 6)}</h2>
                    <CloseButton onClick={onClose}><FaTimes /></CloseButton>
                </ModalHeader>

                <ModalBody>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
                        <StatusBadge>Trạng thái: {order.status}</StatusBadge>
                        <span style={{color:'#888', fontSize:'0.9rem'}}>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                        <InfoGroup>
                            <Label>Khách hàng</Label>
                            <InfoRow><FaUser /> <strong>{order.userName}</strong></InfoRow>
                            <InfoRow><FaPhone /> {order.userPhone}</InfoRow>
                            <InfoRow style={{alignItems:'flex-start'}}>
                                <FaMapMarkerAlt style={{marginTop:3}} /> 
                                <span style={{lineHeight: 1.4}}>{order.userAddress}</span>
                            </InfoRow>
                        </InfoGroup>

                        <InfoGroup>
                            <Label>Thanh toán</Label>
                            <InfoRow><FaMoneyBillWave /> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận (COD)' : 'Đã thanh toán Online'}</InfoRow>
                            {order.deliveryLocation && (
                                <InfoRow>
                                    <FaMotorcycle /> 
                                    <span>Tọa độ giao hàng: <br/><code>{order.deliveryLocation.lat.toFixed(4)}, {order.deliveryLocation.lng.toFixed(4)}</code></span>
                                </InfoRow>
                            )}
                        </InfoGroup>
                    </div>

                    <InfoGroup>
                        <Label>Danh sách món</Label>
                        <ItemsTable>
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
                        </ItemsTable>
                    </InfoGroup>

                    <TotalSection>
                        <TotalRow $highlight>
                            <span>THỰC THU:</span>
                            <span>{formatCurrency(order.total)}</span>
                        </TotalRow>
                    </TotalSection>
                </ModalBody>
            </ModalContainer>
        </Overlay>
    );
};

export default OrderDetailModal;