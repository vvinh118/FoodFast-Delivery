import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer'; 
import Button from '../components/Button'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiSubmitOrder } from '../services/api'; 
import { FaMapMarkerAlt, FaCreditCard, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const DELIVERY_FEE = 20000;

// === 1. STYLED COMPONENTS ===
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
    
    /* Thêm style khi bị disabled */
    &:disabled {
        background-color: #f0f0f0;
        color: #999;
        cursor: not-allowed;
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

// === CHECKOUT COMPONENT LOGIC ===

export default function Checkout() {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth(); // Lấy user & isLoggedIn
    const { items: cartItems, totalAmount, clearCart } = useCart(); 

    // === LOGIC VÀ STATE ===
    const [customerInfo, setCustomerInfo] = useState({ 
      name: '', 
      phone: '',
      address: ''
    });

    // Tự động điền thông tin user khi component tải
    useEffect(() => {
      if (isLoggedIn && user) {
        setCustomerInfo({
          name: user.name || '',
          phone: user.tel || '',
          address: '' // Để trống địa chỉ
        });
      }
    }, [isLoggedIn, user]); // Chạy lại khi user đăng nhập

    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0); 
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [validationErrors, setValidationErrors] = useState<CustomerInfoErrors>({});

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setValidationErrors({});
        setApiError(null);

        if (!isLoggedIn) {
            alert("Bạn cần đăng nhập để đặt hàng.");
            navigate('/login');
            return;
        }

        // KIỂM TRA VALIDATION
        const errors: CustomerInfoErrors = {};
        if (!customerInfo.name.trim()) { errors.name = 'Vui lòng nhập tên người nhận.'; }
        if (!customerInfo.phone.trim()) { errors.phone = 'Vui lòng nhập số điện thoại.'; }
        if (!customerInfo.address.trim()) { errors.address = 'Vui lòng nhập địa chỉ.'; }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        
        // (Tính toán lại tổng tiền lần cuối)
        const finalDiscountValue = discount > 0 ? totalAmount * discount : 0;
        const finalTotal = (totalAmount - finalDiscountValue) + DELIVERY_FEE;
        
        // Gọi API
        setLoading(true);

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
          status: 'Pending', // Trạng thái ban đầu
          createdAt: new Date().toISOString(),
        };

        try {
          await apiSubmitOrder(orderData); // Gửi đơn hàng

          alert('Đặt hàng thành công!');
          clearCart();
          navigate('/order-success');

        } catch (err: any) {
          setApiError(err.message || "Không thể đặt hàng. Vui lòng thử lại.");
        } finally {
          setLoading(false);
        }
    };

    // Logic tính toán tổng tiền
    const finalDiscount = discount > 0 ? totalAmount * discount : 0;
    const finalSubtotal = totalAmount - finalDiscount;
    const finalTotal = finalSubtotal + DELIVERY_FEE;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount);
    };

    const handleCouponApply = () => {
        if (coupon.toLowerCase() === 'foodfast10') {
            alert('Áp dụng mã khuyến mãi thành công!');
            setDiscount(0.1); 
        } else {
            alert('Mã giảm giá không hợp lệ!');
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

                    {/* SECTION 2: MÃ KHUYẾN MÃI */}
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
                
                {/* CỘT TÓM TẮT ĐƠN HÀNG */}
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
                        
                        {/* NÚT ĐẶT HÀNG */}
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