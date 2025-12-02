import Button from '../components/Button';
import styled, { keyframes } from 'styled-components';
import { FaHome } from 'react-icons/fa';
import Lottie from 'lottie-react'; 
import checkmarkAnimation from '../assets/animations/checkmark animation.json';


// Animation cho chữ 
const slideUp = keyframes`
  from { 
    transform: translateY(20px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
`;

// === STYLED COMPONENTS ===

const SuccessPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 40px;
`;

const SuccessCard = styled.div`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 50px;
  max-width: 550px;
  width: 100%;
  text-align: center;
`;

// Container Animation
const LottieWrapper = styled.div`
  width: 300px;   /* TĂNG CHIỀU RỘNG */
  height: 250px;  /* TĂNG CHIỀU CAO */
  margin: 0 auto 25px auto;
`;

const SuccessMessage = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  /* === THÊM ANIMATION CHO DÒNG CHỮ CHÍNH === */
  animation: ${slideUp} 0.6s ease-out 0.2s forwards; /* 0.2s delay */
  opacity: 0; /* Bắt đầu ẩn đi */
`;

const SubText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  /* === THÊM ANIMATION CHO DÒNG CHỮ PHỤ === */
  animation: ${slideUp} 0.6s ease-out 0.4s forwards; /* 0.4s delay */
  opacity: 0; /* Bắt đầu ẩn đi */
`;


// COMPONENT

export default function OrderSuccess() {
  const orderId = "FFT09876"; 

  return (
    <SuccessPageContainer>
      <SuccessCard>
    
        <LottieWrapper>
            <Lottie 
                animationData={checkmarkAnimation} 
                loop={false} 
                autoplay={true} 
                
            />
        </LottieWrapper>
        
        <SuccessMessage>Đặt đơn thành công!</SuccessMessage>
        
        <SubText>
          Mã đơn hàng của bạn là: <strong>{orderId}</strong>. Đơn hàng sẽ được giao trong vòng 25 phút.
        </SubText>
        
        <SubText style={{ marginTop: '-20px' }}>
            Chúng tôi đã gửi email xác nhận đơn hàng đến bạn. 
        </SubText>
        <SubText>
            Cảm ơn đã tin tưởng FoodFast!
        </SubText>
        
            <Button to="/my-orders" $width='100%' $margin='30px 0 30px 0'>
                <FaHome /> Xem Đơn Hàng
            </Button>


      </SuccessCard>
    </SuccessPageContainer>
  );
}