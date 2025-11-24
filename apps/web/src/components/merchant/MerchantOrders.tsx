// 1. Thêm 'useRef' vào dòng import từ 'react'
import React, { useState, useMemo, useEffect, useRef } from 'react';

import styled from 'styled-components';
import OrderCard, { type Order } from '../../components/merchant/OrderCard'; 
import { fetchOrders, updateOrderStatus, useMerchantStore } from 'core'; 

// 2. Thêm dòng import cho 'toast' và CSS của nó
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// === STYLED COMPONENTS ===
const Header = styled.div` margin-bottom: 30px; `;
const Title = styled.h1` font-size: 2rem; font-weight: 700; color: #333; margin: 0 0 5px 0; `;
const Subtitle = styled.p` font-size: 1rem; color: #666; margin: 0; `;
const KanbanBoard = styled.div`
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px;
    @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;
const OrderColumn = styled.div`
    background-color: #f0f2f5; border-radius: 10px; padding: 15px; display: flex; flex-direction: column;
`;
const ColumnTitle = styled.h2`
    font-size: 1.1rem; font-weight: 600; text-transform: uppercase; color: #555;
    margin: 0 0 15px 5px; padding-bottom: 10px; border-bottom: 2px solid #ddd;
`;
const ColumnContent = styled.div`
    display: flex; flex-direction: column; gap: 15px; flex-grow: 1; min-height: 200px;
`;

// Overlay chặn thao tác khi Drone đang giao
const DeliveringOverlay = styled.div`
    position: absolute; top:0; left:0; right:0; bottom:0;
    background: rgba(255,255,255,0.6);
    display: flex; justify-content: center; align-items: center;
    font-weight: bold; color: #f72d57;
    z-index: 10; border-radius: 8px;
`;

const MerchantOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    // State để theo dõi đơn nào đang được Drone giao (để hiện loading/chặn thao tác)
    const [deliveringIds, setDeliveringIds] = useState<string[]>([]);
    
    const { merchant } = useMerchantStore();
    const currentRestaurantId = merchant?.restaurantId;

    // Ref để lưu số lượng đơn chờ cũ (dùng để so sánh)
    const prevPendingCountRef = useRef(0); 

    // ... (Phần loadOrders cũ chuyển thành hàm tái sử dụng) ...
    const loadOrders = async (isFirstLoad = false) => {
        if (!currentRestaurantId) return;
        try {
            if (isFirstLoad) setLoading(true);
            const allOrders = await fetchOrders();
            const myOrders = allOrders.filter((order: any) => 
                order.items.some((item: any) => String(item.restaurantId) === String(currentRestaurantId))
            );
            
            // === LOGIC PHÁT HIỆN ĐƠN MỚI ===
            // Đếm số đơn Pending hiện tại
            const currentPendingCount = myOrders.filter((o: any) => o.status === 'Pending').length;
            
            // Debug: Mở F12 -> Console để xem dòng này có chạy mỗi 5 giây không
            // console.log(`Polling: Mới ${currentPendingCount} - Cũ ${prevPendingCountRef.current}`);

            if (!isFirstLoad && currentPendingCount > prevPendingCountRef.current) {
                // PLAY SOUND (Tùy chọn: Nếu muốn có tiếng ting ting)
                // const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
                // audio.play().catch(e => console.log("Audio blocked"));

                toast.success(
                    <div>
                        <h4>🔔 Có đơn hàng mới!</h4>
                        <p>Bạn vừa nhận được đơn hàng mới. Kiểm tra ngay!</p>
                    </div>, 
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored"
                    }
                );
            }
                // Có thể thêm âm thanh ở đây: new Audio('/sound/ding.mp3').play();
            

            // Cập nhật ref
            prevPendingCountRef.current = currentPendingCount;
            
            setOrders(myOrders.reverse());
        } catch (err) { console.error(err); } 
        finally { if (isFirstLoad) setLoading(false); }
    };

    // === EFFECT POLLING (Chạy mỗi 5 giây) ===
    useEffect(() => {
        // 1. Load lần đầu ngay lập tức
        loadOrders(true);

        // 2. Thiết lập interval
        const intervalId = setInterval(() => {
            loadOrders(false); // Load ngầm (không hiện loading spinner)
        }, 5000); // 5000ms = 5 giây

        // 3. Dọn dẹp khi component unmount
        return () => clearInterval(intervalId);
    }, [currentRestaurantId]);

    // Hàm update status cơ bản
    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        try { 
            await updateOrderStatus(orderId, newStatus); 
        } catch (err) { 
            console.error(err);
            // Revert nếu lỗi (cần logic phức tạp hơn ở đây nếu muốn hoàn hảo, tạm thời alert)
            alert("Lỗi kết nối!"); 
        }
    };

    // LOGIC MỚI: DRONE DELIVERY FLOW
    const handleDroneDelivery = async (orderId: string, orderCode: string) => {
        // 1. Chuyển sang Delivering & Thêm vào danh sách đang giao
        setDeliveringIds(prev => [...prev, orderId]);
        await handleUpdateStatus(orderId, 'Delivering');

        // 2. Delay 5 giây (Mô phỏng Drone đang bay)
        setTimeout(async () => {
            // 3. Tự động chuyển sang Delivered
            await handleUpdateStatus(orderId, 'Delivered');
            
            // 4. Xóa khỏi danh sách đang giao
            setDeliveringIds(prev => prev.filter(id => id !== orderId));
            
            // 5. Thông báo thành công
            alert(`✅ Đơn hàng #${orderCode.substring(0,6)} đã được Drone giao thành công!`);
        }, 5000);
    };

    // Phân loại đơn hàng
    const pendingOrders = useMemo(() => orders.filter(o => o.status === 'Pending'), [orders]);
    const preparingOrders = useMemo(() => orders.filter(o => o.status === 'Preparing'), [orders]);
    // Cột 3: Ready (Chờ Drone) và Delivering (Drone đang bay)
    const shippingOrders = useMemo(() => orders.filter(o => o.status === 'Ready' || o.status === 'Delivering'), [orders]);

    if (!merchant) return <p>Vui lòng đăng nhập.</p>;

    return (
        <div>
            <Header>
                <Title>Quản lý Đơn hàng</Title>
                <Subtitle>Theo dõi và xử lý các đơn hàng đang hoạt động.</Subtitle>
            </Header>

            {loading ? <p>Đang tải...</p> : (
                <KanbanBoard>
                    {/* Cột 1: Mới */}
                    <OrderColumn>
                        <ColumnTitle>Mới ({pendingOrders.length})</ColumnTitle>
                        <ColumnContent>
                            {pendingOrders.map(order => (
                                <OrderCard 
                                    key={order.id} order={order}
                                    onUpdateStatus={(id) => handleUpdateStatus(id, 'Preparing')} 
                                    onReject={(id) => handleUpdateStatus(id, 'Cancelled')}
                                />
                            ))}
                        </ColumnContent>
                    </OrderColumn>
                    
                    {/* Cột 2: Đang nấu */}
                    <OrderColumn>
                        <ColumnTitle>Đang nấu ({preparingOrders.length})</ColumnTitle>
                        <ColumnContent>
                            {preparingOrders.map(order => (
                                <OrderCard 
                                    key={order.id} order={order}
                                    onUpdateStatus={(id) => handleUpdateStatus(id, 'Ready')} 
                                />
                            ))}
                        </ColumnContent>
                    </OrderColumn>

                    {/* Cột 3: Giao hàng (Drone) */}
                    <OrderColumn>
                        <ColumnTitle>Chờ giao ({shippingOrders.length})</ColumnTitle>
                        <ColumnContent>
                            {shippingOrders.map(order => {
                                const isDelivering = deliveringIds.includes(order.id) || order.status === 'Delivering';
                                return (
                                    <div key={order.id} style={{position: 'relative'}}>
                                        {/* Nếu đang giao thì hiện overlay chặn thao tác */}
                                        {isDelivering && (
                                            <DeliveringOverlay>
                                                Drone đang giao hàng...
                                            </DeliveringOverlay>
                                        )}
                                        
                                        <OrderCard 
                                            order={order}
                                            // Override text nút bấm dựa trên trạng thái
                                            customButtonText={order.status === 'Ready' ? 'Drone đã lấy hàng' : 'Đang giao...'}
                                            onUpdateStatus={(id) => {
                                                if (order.status === 'Ready') {
                                                    handleDroneDelivery(id, order.id);
                                                }
                                            }} 
                                        />
                                    </div>
                                );
                            })}
                        </ColumnContent>
                    </OrderColumn>
                </KanbanBoard>
            )}
        </div>
    );
};

export default MerchantOrders;