import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import { useCart } from '../context/CartContext'; 
import { apiSubmitOrder } from '../services/api';

// Styled components
const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f2f5; 
  padding: 40px;
  box-sizing: border-box;
`;
const PaymentCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 40px 50px;
  max-width: 500px;
  width: 100%;
  text-align: center;
`;
const Title = styled.h2`
  font-size: 1.15rem; 
  font-weight: 600;
  color: #333;
  margin-top: 0;
  margin-bottom: 8px;
`;
const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 25px;
`;
const QRCodeImage = styled.img`
  width: 250px;
  height: 250px;
  margin: 0 auto 30px auto;
  display: block;
  border: 1px solid #eee;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  margin-top: 20px;
  > * { 
    flex: 1; 
  }
`;
const ErrorMessage = styled.p`
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 15px;
    font-weight: 600;
`;

// === COMPONENT ===
const FakePaymentPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // State để giữ orderData
  const [orderData, setOrderData] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy data từ sessionStorage khi trang tải
  useEffect(() => {
    const pendingOrderString = sessionStorage.getItem('pendingOrder');
    if (pendingOrderString) {
      setOrderData(JSON.parse(pendingOrderString));
    } else {
      // Nếu không có đơn hàng (do refresh 2 lần, hoặc vào trực tiếp)
      setError("Không tìm thấy thông tin thanh toán. Vui lòng thử lại từ giỏ hàng.");
    }
  }, []); // Chạy 1 lần

  
  const handleSuccess = async () => {
    setLoading(true);
    setError(null);

    if (!orderData) {
      setError("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.");
      setLoading(false);
      return;
    }

    try {
      // GỌI API ĐỂ LƯU ĐƠN HÀNG
      await apiSubmitOrder(orderData);
      
      alert("Thanh toán thành công!");
      clearCart(); // Xóa giỏ hàng
      sessionStorage.removeItem('pendingOrder'); // Xóa đơn hàng tạm
      navigate('/order-success'); // Đi đến trang thanh toán thành công

    } catch (err: any) {
      setError(err.message || "Lỗi khi lưu đơn hàng.");
      setLoading(false); 
    }
  };

  const handleFailure = () => {
    alert("Thanh toán đã bị hủy.");
    sessionStorage.removeItem('pendingOrder'); // Xóa đơn hàng tạm
    navigate('/checkout'); // Quay lại trang thanh toán
  };

  return (
    <PageWrapper>
      <PaymentCard>
        <Title>Quét mã QR bằng Ví Điện Tử ShopeePay</Title>
        <Subtitle>Mã QR sẽ hết hạn sau 5 phút. Vui lòng hoàn tất thanh toán.</Subtitle>
        
        <QRCodeImage 
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FoodFast-Delivery-Payment" 
          alt="Mã QR Giả lập" 
        />
        
        <p style={{fontSize: "0.9rem", color: "#555", borderTop: '1px solid #eee', paddingTop: '20px'}}>
          Hãy chọn "Hoàn tất thanh toán" sau khi bạn đã thanh toán thành công qua ứng dụng ShopeePay.
        </p>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button 
            onClick={handleFailure} 
            $background="#6c757d" 
            $hoverBackground="#5a6268"
            $padding="12px"
            $fontSize="1rem"
            disabled={loading || !orderData}
          >
            Hủy thanh toán
          </Button>
          <Button 
            onClick={handleSuccess} 
            $background="#D92E2E" 
            $hoverBackground="#B20710"
            $padding="12px"
            $fontSize="1rem"
            disabled={loading || !orderData}
          >
            {loading ? "Đang xử lý..." : "Hoàn tất thanh toán"}
          </Button>
        </ButtonGroup>
      </PaymentCard>
    </PageWrapper>
  );
};

export default FakePaymentPage;