import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import OrderHistoryMenu from '../../components/OrderHistoryMenu';
import { useAuthStore, type Order, fetchMyOrders } from 'core';


// STYLED COMPONENTS
const ColMain = styled.div``;
const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`;
const OrderContainer = styled.div`
    margin: 50px 0 50px;
    min-height: 30vh; // Thêm chiều cao tối thiểu
`;

// COMPONENT
const OrderHistory: React.FC = () => {
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
        <ColMain>
            <MainTitle>Lịch sử đơn hàng</MainTitle>
            <OrderContainer>
                {renderContent()}
            </OrderContainer>
        </ColMain>
    );
}

export default OrderHistory;