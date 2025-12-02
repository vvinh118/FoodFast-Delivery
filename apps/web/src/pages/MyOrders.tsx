import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OrderHistoryMenu from '../components/OrderHistoryMenu';
import { useAuthStore, type Order, fetchMyOrders } from 'core';

// Styled components
const Container = styled.div``;
const MainTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    justify-content: center;
    margin: 50px 0 50px 0;
`;
const Content = styled.div`
    display: flex; 
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 50px 50px 50px;
    min-height: 30vh; // Thêm chiều cao tối thiểu
`;

// COMPONENT
const MyOrders: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!isLoggedIn || !user) {
        setError("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
        setLoading(false);
        return;
      }

      const loadOrders = async (isBackground = false) => {
        try {
          // Chỉ hiện loading xoay xoay ở lần đầu
          if (!isBackground) setLoading(true);
          setError(null);
          
          const data = await fetchMyOrders(user.id);
          setOrders(data as Order[]);
        } catch (err: any) {
          console.error(err);
          if (!isBackground) setError(err.message || "Không thể tải lịch sử đơn hàng.");
        } finally {
          if (!isBackground) setLoading(false);
        }
      };

      loadOrders();

      const intervalId = setInterval(() => {
          loadOrders(true);
      }, 5000);
      return () => clearInterval(intervalId);

    }, [user, isLoggedIn]); // Chạy lại nếu user thay đổi


    const renderContent = () => {
      if (loading) {
        return <h3 style={{ textAlign: 'center' }}>Đang tải lịch sử đơn hàng...</h3>;
      }
      if (error) {
        return <h3 style={{ textAlign: 'center', color: 'red' }}>{error}</h3>;
      }
      return <OrderHistoryMenu allOrders={orders} />;
    };

    return (
        <Container>
            <MainTitle>Đơn hàng của tôi</MainTitle>
            <Content>
                {renderContent()}
            </Content>
        </Container>
    );
};

export default MyOrders;