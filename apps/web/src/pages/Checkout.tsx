import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import Button from '../components/Button'; 
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCreditCard, FaTicketAlt } from 'react-icons/fa';

// === DỮ LIỆU MẪU GIỎ HÀNG (Sẽ được thay thế bằng API/Context) ===
const sampleCart = [
    { id: 1, name: 'Nem Nướng Cuộn Bánh Tráng', price: 65000, qty: 1 },
    { id: 2, name: 'Nem Nướng Lá Lốt', price: 35000, qty: 1 },
    { id: 3, name: 'Combo Đồ Uống', price: 40000, qty: 2 },
];
const DELIVERY_FEE = 20000;
const INITIAL_SUBTOTAL = sampleCart.reduce((sum, item) => sum + item.price * item.qty, 0);

// === 1. STYLED COMPONENTS (PHỤC HỒI) ===
const PageWrapper = styled.div`
    background-color: #f9fafb;
    min-height: 100vh;
`;

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;

  @media (max-width: 1024px) {
    flex-direction: column;
    margin: 20px auto;
  }
`;

const MainContent = styled.div`
  flex: 3; 
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SummarySection = styled.div`
  flex: 2; 
  height: fit-content;
  position: sticky; 
  top: 20px;
`;

const SectionCard = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Heading = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const InputGroup = styled.div`
    margin-bottom: 15px;
`;

const InputWrapper = styled.div`
    position: relative;
    align-items: center;
    margin-bottom: 10px
`;

const Input = styled.input`
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    &:focus {
        border-color: #F72D57;
        outline: none;
    }
`;

// === SUMMARY COMPONENTS ===
const SummaryCard = styled(SectionCard)`
    padding: 30px;
`;

const SummaryTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
`;

// INTERFACE CHO SUMMARY ROW
interface SummaryRowProps {
    $total?: string; 
}

const SummaryRow = styled.div<SummaryRowProps>`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 1rem;
    color: #555;
    border-top: ${props => props.$total ? '2px solid #ddd' : 'none'};
    margin-top: ${props => props.$total ? '15px' : '0'};
    font-weight: ${props => props.$total ? '700' : '400'};
    color: ${props => props.$total ? '#333' : '#555'};
`;

const OrderButton = styled(Button)`
    width: 100%;
    margin-top: 20px;
    font-size: 1.1rem;
    padding: 15px;
`;

// === 2. CHECKOUT COMPONENT LOGIC VÀ JSX ===

export default function Checkout() {
    // === LOGIC VÀ STATE (PHỤC HỒI) ===
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0); 
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const finalDiscount = discount > 0 ? INITIAL_SUBTOTAL * discount : 0;
    const finalSubtotal = INITIAL_SUBTOTAL - finalDiscount;
    const finalTotal = finalSubtotal + DELIVERY_FEE;

    const handleCouponApply = () => {
        if (coupon.toLowerCase() === 'foodfast') {
            setDiscount(0.1); 
            alert('Áp dụng mã giảm giá 10% thành công!');
        } else {
            setDiscount(0);
            alert('Mã giảm giá không hợp lệ.');
        }
    };
    // ===================================

    return (
        <PageWrapper>
            <Header />

            <CheckoutContainer>
                {/* CỘT CHÍNH: THÔNG TIN VÀ FORM */}
                <MainContent>
                    
                    {/* SECTION 1: THÔNG TIN GIAO HÀNG */}
                    <SectionCard>
                        <Heading><FaMapMarkerAlt color="#F72D57" /> Thông tin giao hàng</Heading>
                        <InputGroup>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Tên người nhận</label>
                            <Input placeholder="Nhập tên" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                        </InputGroup>
                        <InputGroup>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Số điện thoại</label>
                            <Input placeholder="Nhập SĐT" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                        </InputGroup>
                        <InputGroup>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Địa chỉ nhận hàng</label>
                            <Input placeholder="Nhập địa chỉ" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                        </InputGroup>
                    </SectionCard>

                    {/* SECTION 2: MÃ KHUYẾN MÃI */}
                    <SectionCard>
                        <Heading><FaTicketAlt color="#F72D57" /> Mã khuyến mãi</Heading>
                        <InputWrapper style={{ display: 'flex', gap: '10px' }}>
                            <Input placeholder="Nhập mã giảm giá" value={coupon} onChange={e => setCoupon(e.target.value)} />
                            <Button onClick={handleCouponApply}>Áp dụng</Button>
                        </InputWrapper>
                    </SectionCard>

                    {/* SECTION 3: PHƯƠNG THỨC THANH TOÁN */}
                    <SectionCard>
                        <Heading><FaCreditCard color="#F72D57" /> Phương thức Thanh toán</Heading>
                        <InputWrapper>
                            <label style={{ display: 'block', marginBottom: '20px' }}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="cod" 
                                    checked={paymentMethod === 'cod'} 
                                    onChange={() => setPaymentMethod('cod')} 
                                    style={{ marginRight: '8px' }}
                                />
                                Thanh toán khi nhận hàng (COD)
                            </label>
                            <label style={{ display: 'block', marginBottom: '10px' }}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="card" 
                                    checked={paymentMethod === 'card'} 
                                    onChange={() => setPaymentMethod('card')} 
                                    style={{ marginRight: '8px' }}
                                />
                                Thanh toán bằng thẻ / Ví điện tử
                            </label>
                        </InputWrapper>
                        {paymentMethod === 'card' && <p style={{ color: '#F72D57', fontSize: '0.9rem' }}>Bạn sẽ được chuyển hướng đến cổng thanh toán.</p>}
                    </SectionCard>

                </MainContent>

                {/* CỘT TÓM TẮT ĐƠN HÀNG */}
                <SummarySection>
                    <SummaryCard>
                        <SummaryTitle>Tóm tắt đơn hàng</SummaryTitle>
                        
                        {/* 1. CHI TIẾT SẢN PHẨM (Mẫu) */}
                        <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                            {sampleCart.map(item => (
                                <SummaryRow key={item.id} style={{ borderBottom: '1px dotted #eee' }}>
                                    <span>{item.name} x {item.qty}</span>
                                    <span>{(item.price * item.qty).toLocaleString('vi-VN')} đ</span>
                                </SummaryRow>
                            ))}
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            {/* 2. CHI TIẾT TÍNH TOÁN */}
                            <SummaryRow><span>Tạm tính</span><span>{INITIAL_SUBTOTAL.toLocaleString('vi-VN')} đ</span></SummaryRow>
                            <SummaryRow><span>Phí giao hàng</span><span>{DELIVERY_FEE.toLocaleString('vi-VN')} đ</span></SummaryRow>
                            {finalDiscount > 0 && <SummaryRow><span>Mã khuyến mãi</span><span style={{ color: 'green' }}>- {finalDiscount.toLocaleString('vi-VN')} đ</span></SummaryRow>}

                            {/* 3. TỔNG CỘNG */}
                            <SummaryRow $total="true">
                                <span>TỔNG CỘNG</span>
                                <span style={{ color: '#F72D57', fontSize: '1.4rem' }}>{finalTotal.toLocaleString('vi-VN')} đ</span>
                            </SummaryRow>
                        </div>
                        
                        {/* NÚT ĐẶT HÀNG CUỐI CÙNG */}
                        <OrderButton $padding="15px 20px" type="submit">Đặt đơn</OrderButton>
                    </SummaryCard>
                </SummarySection>

            </CheckoutContainer>

            <Footer />
        </PageWrapper>
    );
}
