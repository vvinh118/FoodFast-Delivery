import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import Button from '../components/Button'; 
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaMapMarkerAlt, FaCreditCard, FaTicketAlt } from 'react-icons/fa';


const DELIVERY_FEE = 20000;

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

const Input = styled.input<{ $error?: string }>`
    width: 100%;
    padding: 10px 15px;
    border: 1px solid ${props => props.$error ? '#f72d57' : '#ddd'};
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

// COMPONENT ĐỂ HIỂN THỊ LIST SẢN PHẨM TRONG SUMMARY
const ItemListContainer = styled.div`
    max-height: 200px;
    overflow-y: auto;
    padding-right: 10px;
    margin-bottom: 20px;
`;

const ItemSummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    padding: 10px 0;
    border-bottom: 1px dotted #eee;
    
    &:last-child {
        border-bottom: none;
    }
`;

const Form = styled.form``

interface SummaryRowProps {
    $total?: string; 
}

interface CustomerInfoErrors {
    name?: string;
    phone?: string;
    address?: string;
    general?: string | null;
}

// === 2. CHECKOUT COMPONENT LOGIC VÀ JSX ===

export default function Checkout() {
    // Lấy dữ liệu động từ Cart Context
    const { cartItems, getTotalPrice } = useCart(); 

    // === LOGIC VÀ STATE (CHỈ KHAI BÁO STATE Ở ĐÂY) ===
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0); 
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [validationErrors, setValidationErrors] = useState<CustomerInfoErrors>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});


    const errors: CustomerInfoErrors = {};
        if (!customerInfo.name) {
            errors.name = 'Vui lòng nhập tên người nhận.';
        }
        if (!customerInfo.phone) {
            errors.phone = 'Vui lòng nhập số điện thoại.';
        }
        if (!customerInfo.address) {
            errors.address = 'Vui lòng nhập địa chỉ.';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors({ ...errors, general: 'Vui lòng điền đầy đủ thông tin giao hàng.' });
            return;
        }
    };

    // 1. TÍNH TOÁN TỔNG TIỀN TỪ GIỎ HÀNG (DỮ LIỆU ĐỘNG)
    const totalAmount = getTotalPrice(); 

    // 2. TÍNH TOÁN GIẢM GIÁ
    const finalDiscount = discount > 0 ? totalAmount * discount : 0;
    
    // 3. TÍNH TOÁN CỘNG DỒN
    const finalSubtotal = totalAmount - finalDiscount;
    const finalTotal = finalSubtotal + DELIVERY_FEE;
    // ===================================

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    };

    const handleCouponApply = () => {
        if (coupon.toLowerCase() === 'foodfast') {
            setDiscount(0.1); 
        } else {
            setDiscount(0);
        }
    };
    // ===================================

    return (
        <PageWrapper>
            <Header />

            <Form onSubmit={handleSubmit}>
            <CheckoutContainer>
                {/* CỘT CHÍNH: THÔNG TIN VÀ FORM */}
                <MainContent>
                    
                    {/* SECTION 1: THÔNG TIN GIAO HÀNG */}
                    <SectionCard>
                        <Heading><FaMapMarkerAlt color="#F72D57" /> Thông tin giao hàng</Heading>
                        <InputGroup onSubmit={handleSubmit}>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Tên người nhận</label>
                            <Input 
                                placeholder="Nhập tên" 
                                value={customerInfo.name} 
                                onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} 
                                $error={validationErrors.name ? 'true' : undefined}
                                />
                            {validationErrors.name && <p style={{color: '#F72D57', fontSize: '0.8rem', marginTop: '5px'}}>{validationErrors.name}</p>}
                        </InputGroup>
                        <InputGroup>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Số điện thoại</label>
                            <Input 
                                placeholder="Nhập SĐT" 
                                value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                                $error={validationErrors.phone ? 'true' : undefined}
                                />
                            {validationErrors.name && <p style={{color: '#F72D57', fontSize: '0.8rem', marginTop: '5px'}}>{validationErrors.phone}</p>}
                        </InputGroup>
                        <InputGroup>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Địa chỉ nhận hàng</label>
                            <Input 
                                placeholder="Nhập địa chỉ" 
                                value={customerInfo.address} 
                                onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} 
                                $error={validationErrors.address ? 'true' : undefined}
                                />
                            {validationErrors.name && <p style={{color: '#F72D57', fontSize: '0.8rem', marginTop: '5px'}}>{validationErrors.address}</p>}
                        </InputGroup>
                        {validationErrors.general && <p style={{color: '#F72D57', fontSize: '0.9rem', textAlign: 'center', marginTop: '15px'}}>* {validationErrors.general}</p>}
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
                        
                        {/* 1. HIỂN THỊ CHI TIẾT SẢN PHẨM */}
                        <ItemListContainer>
                            {cartItems.map(item => ( 
                                <ItemSummaryRow key={item.id}>
                                    <span>{item.name} x {item.quantity}</span> 
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                </ItemSummaryRow>
                            ))}
                            {cartItems.length === 0 && <p style={{textAlign: 'center', color: '#999'}}>Giỏ hàng đang trống.</p>}
                        </ItemListContainer>

                        <div style={{ marginTop: '20px' }}>
                            {/* 2. CHI TIẾT TÍNH TOÁN */}
                            <SummaryRow><span>Tạm tính</span><span>{formatCurrency(totalAmount)}</span></SummaryRow>
                            <SummaryRow><span>Phí giao hàng</span><span>{formatCurrency(DELIVERY_FEE)}</span></SummaryRow>
                            {finalDiscount > 0 && <SummaryRow><span>Giảm giá Mã KM</span><span style={{ color: 'green' }}>- {formatCurrency(finalDiscount)}</span></SummaryRow>}

                            {/* 3. TỔNG CỘNG */}
                            <SummaryRow $total="true">
                                <span>TỔNG CỘNG</span>
                                <span style={{ color: '#F72D57', fontSize: '1.4rem' }}>{formatCurrency(finalTotal)}</span>
                            </SummaryRow>
                        </div>
                        
                        {/* NÚT ĐẶT HÀNG */}
                        <Button to="/order-success" $maxWidth='100%' $display='block' $padding='10px' $fontSize='20px' $margin='15px 0 0 0'>
                            Đặt đơn
                        </Button>
                    </SummaryCard>
                </SummarySection>

            </CheckoutContainer>
            </Form>

            <Footer />
        </PageWrapper>
    );
}
