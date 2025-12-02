// apps/web/src/components/merchant/MerchantOrders.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import OrderCard from '../../components/merchant/OrderCard'; 
import { fetchOrders, updateOrderStatus, useMerchantStore, fetchRestaurantById, type Restaurant, type Order } from 'core'; 
import { useDroneStore } from 'core'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDroneSimulation } from '../../hooks/useDroneSimulation'; 

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
const DeliveringOverlay = styled.div`
    position: absolute; top:0; left:0; right:0; bottom:0;
    background: rgba(255,255,255,0.8);
    display: flex; justify-content: center; align-items: center;
    font-weight: bold; color: #f72d57; z-index: 10; border-radius: 8px; flex-direction: column; gap: 10px;
`;

const MerchantOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { merchant } = useMerchantStore();
    
    const [restaurantInfo, setRestaurantInfo] = useState<Restaurant | null>(null);
    const prevPendingCountRef = useRef(0);

    const { drones, assignDroneToOrder, startDeliveryToCustomer, initDroneSystem } = useDroneStore();

    useDroneSimulation(); 

    const loadOrders = async (isFirstLoad = false) => {
        if (!merchant?.restaurantId) return;
        try {
            if (isFirstLoad) setLoading(true);
            const allOrders = await fetchOrders();
            const myOrders = allOrders.filter((order: any) => 
                order.items.some((item: any) => String(item.restaurantId) === String(merchant.restaurantId))
            );
            
            const currentPendingCount = myOrders.filter((o: any) => o.status === 'Pending').length;
            if (!isFirstLoad && currentPendingCount > prevPendingCountRef.current) {
                toast.success("🔔 Có đơn hàng mới!");
            }
            prevPendingCountRef.current = currentPendingCount;
            setOrders(myOrders.reverse() as Order[]);
        } catch (err) { console.error(err); } 
        finally { if (isFirstLoad) setLoading(false); }
    };

    useEffect(() => {
        loadOrders(true);
        initDroneSystem(); 
        
        if (merchant?.restaurantId) {
            fetchRestaurantById(merchant.restaurantId).then(data => setRestaurantInfo(data));
        }

        const intervalId = setInterval(() => {
            loadOrders(false);
            initDroneSystem();
        }, 3000);

        return () => clearInterval(intervalId);
    }, [merchant?.restaurantId]);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setOrders(prev => prev.map(o => String(o.id) === orderId ? { ...o, status: newStatus as any } : o));
        try { await updateOrderStatus(orderId, newStatus); } catch (err) { alert("Lỗi kết nối!"); }
    };

    const handleAcceptOrder = (order: Order) => {
        if (!restaurantInfo?.location) {
            alert("Lỗi: Quán chưa có tọa độ. Vui lòng vào Cài đặt cửa hàng để cập nhật vị trí trên bản đồ.");
            return;
        }
        handleUpdateStatus(String(order.id), 'Preparing');
        const customerLoc = order.deliveryLocation || { lat: 10.7769, lng: 106.7009 };
        assignDroneToOrder(String(order.id), restaurantInfo.location, customerLoc);
        toast.info("🚁 Đã điều phối Drone đến lấy hàng!");
    };

    const handleHandoverToDrone = async (order: Order) => {
        const drone = drones.find(d => d.currentOrderId === String(order.id));
        if (drone && drone.status === 'at_store') {
            await handleUpdateStatus(String(order.id), 'Delivering');
            if (order.deliveryLocation) {
                 startDeliveryToCustomer(drone.id, order.deliveryLocation); 
                 toast.success("📦 Drone đã nhận hàng và đang bay đi giao!");
            } else {
                alert("Đơn hàng này thiếu tọa độ giao, Drone không thể bay!");
            }
        }
    };

    const pendingOrders = useMemo(() => orders.filter(o => o.status === 'Pending'), [orders]);
    const preparingOrders = useMemo(() => orders.filter(o => o.status === 'Preparing'), [orders]);
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
                    <OrderColumn>
                        <ColumnTitle>Mới ({pendingOrders.length})</ColumnTitle>
                        <ColumnContent>
                            {pendingOrders.map(order => (
                                <OrderCard 
                                    key={order.id} order={order}
                                    onUpdateStatus={() => handleAcceptOrder(order)} 
                                    onReject={(id) => handleUpdateStatus(id, 'Cancelled')}
                                    customButtonText="Chấp nhận & Gọi Drone"
                                />
                            ))}
                        </ColumnContent>
                    </OrderColumn>
                    
                    <OrderColumn>
                        <ColumnTitle>Đang nấu ({preparingOrders.length})</ColumnTitle>
                        <ColumnContent>
                            {preparingOrders.map(order => {
                                const drone = drones.find(d => d.currentOrderId === String(order.id));
                                const isDroneArrived = drone?.status === 'at_store';
                                const isDroneMoving = drone?.status === 'moving_to_store';

                                return (
                                    <div key={order.id}>
                                        <div style={{fontSize: '0.8rem', color: isDroneArrived ? 'green' : '#f39c12', marginBottom: 5, fontWeight: 'bold'}}>
                                            {isDroneArrived ? "✅ Drone đã đến cửa hàng" : 
                                             isDroneMoving ? "🚀 Drone đang bay đến quán..." : "⏳ Đang tìm Drone..."}
                                        </div>
                                        <OrderCard 
                                            order={order}
                                            customButtonText={isDroneArrived ? "Giao cho Drone" : "Đợi Drone..."}
                                            isActionDisabled={!isDroneArrived}
                                            onUpdateStatus={() => isDroneArrived && handleHandoverToDrone(order)} 
                                        />
                                    </div>
                                )
                            })}
                        </ColumnContent>
                    </OrderColumn>

                    <OrderColumn>
                        <ColumnTitle>Đang giao ({shippingOrders.length})</ColumnTitle>
                        <ColumnContent>
                            {shippingOrders.map(order => (
                                <div key={order.id} style={{position: 'relative'}}>
                                    <DeliveringOverlay>
                                        <span>🚁 Drone đang bay đến khách...</span>
                                        <span style={{fontSize:'0.8rem', color:'#555'}}>Mã đơn: #{order.id}</span>
                                    </DeliveringOverlay>
                                    <OrderCard order={order} onUpdateStatus={() => {}} />
                                </div>
                            ))}
                        </ColumnContent>
                    </OrderColumn>
                </KanbanBoard>
            )}
        </div>
    );
};

export default MerchantOrders;