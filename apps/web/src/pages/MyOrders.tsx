import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OrderHistoryMenu from '../components/OrderHistoryMenu';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/api';

// === TYPES ===
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
export interface Order {
  id: number;
  userId: number;
  userName: string;
  items: OrderItem[];
  total: number;
  status: string; // 'Pending', 'Delivered', 'Cancelled'
  createdAt: string;
}

// === STYLED ===
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

// === COMPONENT ===
const MyOrders: React.FC = () => {
    const { user, isLoggedIn } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Gọi API bằng useEffect
    useEffect(() => {
      if (!isLoggedIn || !user) {
        setError("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
        setLoading(false);
        return;
      }

      const loadOrders = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchMyOrders(user.id);
          setOrders(data as Order[]);
        } catch (err: any) {
          setError(err.message || "Không thể tải lịch sử đơn hàng.");
        } finally {
          setLoading(false);
        }
      };

      loadOrders();
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