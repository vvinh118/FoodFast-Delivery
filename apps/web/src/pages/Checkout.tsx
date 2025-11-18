import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import Button from '../components/Button'; 
import { apiSubmitOrder } from '../services/api'; 
import { FaMapMarkerAlt, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore, APP_CONSTANTS, formatCurrency } from 'core';

const { DELIVERY_FEE } = APP_CONSTANTS;

// Styled components
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
    transition: border-color 0.2s, background-color 0.2s;
    &:focus {
        border-color: #F72D57;
        outline: none;
    }
    &:disabled {
        background-color: #f0f0f0;
        color: #999;
        cursor: not-allowed;
    }
`;
const SummaryCard = styled(SectionCard)`
    padding: 30px;
`;
const SummaryTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
`;
const SummaryRow = styled.div<{ $total?: string }>`
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
const Form = styled.form``;
interface CustomerInfoErrors {
    name?: string;
    phone?: string;
    address?: string;
}

// COMPONENT
export default function Checkout() {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    // const { items: cartItems, totalAmount, clearCart } = useCart(); 
    const cartItems = useCartStore(state => state.items);
    const totalAmount = useCartStore(state => state.totalAmount);
    const clearCart = useCartStore(state => state.clearCart);


    // STATES
    const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });
    useEffect(() => {
      if (isLoggedIn && user) {
        setCustomerInfo({
          name: user.name || '',
          phone: user.tel || '',
          address: '' 
        });
      }
    }, [isLoggedIn, user]); 
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0); 
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [validationErrors, setValidationErrors] = useState<CustomerInfoErrors>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    
    // HANDLE SUBMIT ĐƠN HÀNg
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setValidationErrors({});
        setApiError(null);

        // Kiểm tra user có tồn tại
        // Nếu không có user, dừng hàm ngay lập tức để TypeScript không báo lỗi user.id
        if (!isLoggedIn || !user) { 
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            navigate('/login');
            return; 
        }
        
        // Validation thông tin người nhận
        const errors: CustomerInfoErrors = {};
        if (!customerInfo.name.trim()) { errors.name = 'Vui lòng nhập tên người nhận.'; }
        if (!customerInfo.phone.trim()) { errors.phone = 'Vui lòng nhập số điện thoại.'; }
        if (!customerInfo.address.trim()) { errors.address = 'Vui lòng nhập địa chỉ.'; }
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        const finalDiscountValue = discount > 0 ? totalAmount * discount : 0;
        const finalTotal = (totalAmount - finalDiscountValue) + DELIVERY_FEE;
        
        setLoading(true);

        // TẠO OBJECT ĐƠN HÀNG
        const orderData = {
          userId: user.id,
          userName: customerInfo.name,
          userPhone: customerInfo.phone,
          userAddress: customerInfo.address,
          items: cartItems,
          total: finalTotal,
          subtotal: totalAmount,
          deliveryFee: DELIVERY_FEE,
          discount: finalDiscountValue,
          paymentMethod: paymentMethod, 
          status: 'Pending', 
          createdAt: new Date().toISOString(),
        };

        try {
          if (paymentMethod === 'cod') {
            // LUỒNG 1: Thanh toán COD (Lưu ngay)
            await apiSubmitOrder(orderData); 
            alert('Đặt hàng thành công!');
            clearCart();
            navigate('/order-success');

          } else if (paymentMethod === 'card') {
            // LUỒNG 2: Thanh toán CARD
            // KHÔNG LƯU API. Chỉ lưu vào bộ nhớ tạm và chuyển trang.
            sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
            navigate('/fake-payment-gateway');
          }
        } catch (err: any) {
          setApiError(err.message || "Không thể đặt hàng. Vui lòng thử lại.");
          setLoading(false);
        }
    };


    const finalDiscount = discount > 0 ? totalAmount * discount : 0;
    const finalSubtotal = totalAmount - finalDiscount;
    const finalTotal = finalSubtotal + DELIVERY_FEE;
    const handleCouponApply = () => {
        if (coupon.toLowerCase() === 'foodfast10') {
            alert('Áp dụng mã khuyến mãi thành công!');
            setDiscount(0.1); 
        } else {
            alert('Mã giảm giá không hợp lệ!');
            setDiscount(0);
        }
    };
    
    return (
        <PageWrapper>
            <Header />
            <Form onSubmit={handleSubmit}>
            <CheckoutContainer>
                <MainContent>
                    <SectionCard>
                        <Heading><FaMapMarkerAlt color="#F72D57" /> Thông tin giao hàng</Heading>
                        <InputGroup>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Tên người nhận</label>
                            <Input 
                                placeholder="Nhập tên" 
                                value={customerInfo.name}
                                onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                                $error={validationErrors.name ? 'true' : undefined}
                                disabled={loading}
                            />
                            {validationErrors.name && <p style={{color: '#F72D57', fontSize: '0.8rem', marginTop: '5px'}}>{validationErrors.name}</p>}
                        </InputGroup>
                        <InputGroup>
                            <label style={{ marginBottom: '5px', display: 'block' }}>Số điện thoại</label>
                            <Input 
                                placeholder="Nhập SĐT" 
                                value={customerInfo.phone} 
                                onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                                $error={validationErrors.phone ? 'true' : undefined}
                                disabled={loading}
                            />
                            {validationErrors.phone && <p style={{color: '#F72D57', fontSize: '0.8rem', marginTop: '5px'}}>{validationErrors.phone}</p>}
                        </InputGroup>
                        <InputGroup>
                            <label style={{ marginBottom: '5px', display: 'block' }}>Địa chỉ nhận hàng</label>
                            <Input 
                                placeholder="Nhập địa chỉ" 
                                value={customerInfo.address} 
                                onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} 
                                $error={validationErrors.address ? 'true' : undefined}
                                disabled={loading}
                            />
                            {validationErrors.address && <p style={{color: '#F72D57', fontSize: '0.8rem', marginTop: '5px'}}>{validationErrors.address}</p>}
                        </InputGroup>
                       </SectionCard>
                    <SectionCard>
                        <Heading><FaTicketAlt color="#F72D57" /> Mã khuyến mãi</Heading>
                        <InputWrapper style={{ display: 'flex', gap: '10px' }}>
                            <Input 
                                placeholder="Nhập mã giảm giá" 
                                value={coupon} 
                                onChange={e => setCoupon(e.target.value)} 
                                disabled={loading}
                            />
                            <Button 
                                type='button' 
                                onClick={handleCouponApply} 
                                disabled={loading}
                            >
                                Áp dụng
                            </Button>
                        </InputWrapper>
                    </SectionCard>
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                                Thanh toán bằng thẻ / Ví điện tử
                            </label>
                        </InputWrapper>
                    </SectionCard>
                </MainContent>
                
                <SummarySection>
                    <SummaryCard>
                        <SummaryTitle>Tóm tắt đơn hàng</SummaryTitle>
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
                            <SummaryRow><span>Tạm tính</span><span>{formatCurrency(totalAmount)}</span></SummaryRow>
                            <SummaryRow><span>Phí giao hàng</span><span>{formatCurrency(DELIVERY_FEE)}</span></SummaryRow>
                            {finalDiscount > 0 && <SummaryRow><span>Giảm giá Mã KM</span><span style={{ color: 'green' }}>- {formatCurrency(finalDiscount)}</span></SummaryRow>}
                            <SummaryRow $total="true">
                                <span>TỔNG CỘNG</span>
                                <span style={{ color: '#F72D57', fontSize: '1.4rem' }}>{formatCurrency(finalTotal)}</span>
                            </SummaryRow>
                        </div>
                        {apiError && (
                            <p style={{color: '#F72D57', fontSize: '0.9rem', textAlign: 'center', marginTop: '15px'}}>
                                * {apiError}
                            </p>
                        )}
                        <Button 
                            type="submit"
                            $fontSize='20px'
                            $width='100%'
                            $margin='20px 0 20px 0'
                            disabled={loading || cartItems.length === 0}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt đơn'}
                        </Button>
                    </SummaryCard>
                </SummarySection>
            </CheckoutContainer>
            </Form>

            <Footer />
        </PageWrapper>
    );
}