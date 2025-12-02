// apps/web/src/pages/OrderTracking.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaArrowLeft, FaMapMarkerAlt, FaBatteryThreeQuarters, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDroneStore, type Order, type Restaurant, fetchOrderById, fetchRestaurantById } from 'core';
import { useDroneSimulation } from '../hooks/useDroneSimulation'; 

// === ICONS ===
const droneIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/9485/9485815.png',
    iconSize: [45, 45], iconAnchor: [22, 22]
});
const homeIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/8354/8354902.png',
    iconSize: [35, 35], iconAnchor: [17, 35]
});
const storeIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/4392/4392773.png',
    iconSize: [35, 35], iconAnchor: [20, 40]
});

// === STYLED COMPONENTS ===
const Container = styled.div`
    height: calc(100dvh - 60px); 
    display: flex; flex-direction: column; 
    position: relative;
    background: #f5f5f5;
    overflow: hidden; 
`;

const HeaderPanel = styled.div`
    background: white; 
    padding: 12px 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    z-index: 10; 
    display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-shrink: 0;
    @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 10px; padding-bottom: 15px; }
`;

const LeftGroup = styled.div` display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; width: 100%; `;
const BackButton = styled.button`
    background: #f5f5f5; border: none; width: 36px; height: 36px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    transition: 0.2s; color: #555; 
    &:hover { background: #e0e0e0; color: #000; }
`;

const OrderInfo = styled.div`
    flex: 1; min-width: 0;
    h2 { margin: 0; font-size: 1rem; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    p { margin: 2px 0 0 0; font-size: 0.8rem; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px; }
    @media (max-width: 768px) { p { white-space: normal; } }
`;

const StatusBadge = styled.div<{ $status: string }>`
    padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; color: white; white-space: nowrap; text-align: center;
    background: ${props => {
        if(props.$status === 'Delivering') return 'linear-gradient(90deg, #F72D57, #FF5B7A)';
        if(props.$status === 'Delivered') return '#28a745';
        if(props.$status === 'Cancelled') return '#dc3545';
        return '#f0ad4e';
    }};
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    @media (max-width: 768px) { 
        width: auto; align-self: flex-start; margin-left: 46px; max-width: calc(100% - 46px); font-size: 0.8rem;
    }
`;

const MapWrapper = styled.div` flex-grow: 1; position: relative; width: 100%; height: 100%; `;

const DroneStatusCard = styled.div`
    position: absolute; z-index: 999; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(5px);
    padding: 15px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-left: 5px solid #F72D57;
    top: 20px; right: 20px; min-width: 200px;
    @media (max-width: 768px) { top: auto; bottom: 20px; left: 15px; right: 15px; border-left: none; border-top: 4px solid #F72D57; }
    h4 { margin: 0 0 5px 0; color: #333; display: flex; align-items: center; gap: 8px; }
    div { font-size: 0.9rem; color: #555; display: flex; align-items: center; gap: 8px; margin-top: 5px; }
`;

// === MODAL STYLES ===
const fadeIn = keyframes` from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } `;
const Overlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6); z-index: 2000;
    display: flex; justify-content: center; align-items: center; padding: 20px;
`;
const ModalBase = styled.div`
    background: white; width: 100%; max-width: 350px;
    border-radius: 20px; padding: 30px 20px;
    text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    animation: ${fadeIn} 0.3s ease-out;
`;
const ModalIcon = styled.div<{ $color: string }>`
    font-size: 4rem; color: ${props => props.$color}; margin-bottom: 20px;
    filter: drop-shadow(0 5px 15px ${props => props.$color}40);
`;
const ModalTitle = styled.h3` font-size: 1.5rem; color: #333; margin: 0 0 10px 0; font-weight: 800; `;
const ModalDesc = styled.p` color: #666; font-size: 0.95rem; line-height: 1.5; margin-bottom: 25px; `;
const ButtonGroup = styled.div` display: flex; flex-direction: column; gap: 10px; `;
const PrimaryButton = styled.button<{ $bg?: string }>`
    background: ${props => props.$bg || '#f72d57'}; color: white; border: none; padding: 12px; border-radius: 10px;
    font-weight: bold; font-size: 1rem; cursor: pointer; transition: 0.2s;
    &:hover { filter: brightness(0.9); transform: translateY(-2px); }
`;
const SecondaryButton = styled.button`
    background: transparent; color: #777; border: none; padding: 10px; font-weight: 600; cursor: pointer;
    &:hover { color: #333; }
`;

// === COMPONENT ===
const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    
    // States cho Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useDroneSimulation();
    const { drones, initDroneSystem } = useDroneStore();

    useEffect(() => {
        const fetchData = async () => {
            await initDroneSystem();
            if (id) {
                try {
                    const orderData = await fetchOrderById(id);
                    setOrder(orderData as Order);

                    if (orderData.items && orderData.items.length > 0) {
                        const restId = orderData.items[0].restaurantId;
                        const restData = await fetchRestaurantById(restId);
                        setRestaurant(restData);
                    }
                } catch (error) {
                    console.error("Lỗi tải dữ liệu:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId);
    }, [id]);

    // === LOGIC TRIGGER MODAL ===
    useEffect(() => {
        if (order?.status === 'Delivered') {
            setShowSuccessModal(true);
            setShowCancelModal(false);
        } else if (order?.status === 'Cancelled') {
            setShowCancelModal(true);
            setShowSuccessModal(false);
        }
    }, [order?.status]);

    const myDrone = drones.find(d => String(d.currentOrderId) === String(id));

    if (loading) return <div style={{padding: 50, textAlign: 'center', color: '#666'}}>📡 Đang kết nối vệ tinh...</div>;
    if (!order) return <div style={{padding: 30, textAlign: 'center'}}>Không tìm thấy đơn hàng.</div>;

    let centerPos: [number, number] = [10.7769, 106.7009];
    if (myDrone) centerPos = [myDrone.currentLat, myDrone.currentLng];
    else if (restaurant?.location) centerPos = [restaurant.location.lat, restaurant.location.lng];
    else if (order.deliveryLocation) centerPos = [order.deliveryLocation.lat, order.deliveryLocation.lng];

    return (
        <Container>
            <HeaderPanel>
                <LeftGroup>
                    <BackButton onClick={() => navigate('/my-orders')}><FaArrowLeft /></BackButton>
                    <OrderInfo>
                        <h2>#{order.id.toString().substring(0, 8)}</h2>
                        <p><FaMapMarkerAlt color="#F72D57" size={12} style={{flexShrink: 0}}/> {order.userAddress}</p>
                    </OrderInfo>
                </LeftGroup>
                
                <StatusBadge $status={order.status}>
                    {order.status === 'Pending' && 'Chờ xác nhận'}
                    {order.status === 'Preparing' && 'Đang chuẩn bị'}
                    {order.status === 'Ready' && 'Đợi Drone'}
                    {order.status === 'Delivering' && 'Drone đang bay'}
                    {order.status === 'Delivered' && 'Đã giao thành công'}
                    {order.status === 'Cancelled' && 'Đơn đã bị hủy'}
                </StatusBadge>
            </HeaderPanel>

            <MapWrapper>
                {myDrone && order.status !== 'Cancelled' && (
                    <DroneStatusCard>
                        <h4>🚁 {myDrone.model}</h4>
                        <div><FaBatteryThreeQuarters color={myDrone.battery < 20 ? 'red' : 'green'}/> Pin: {myDrone.battery}%</div>
                        <div>Tốc độ: Bay siêu tốc (10s)</div>
                    </DroneStatusCard>
                )}

                <MapContainer center={centerPos} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />

                    {order.deliveryLocation && (
                        <Marker position={[order.deliveryLocation.lat, order.deliveryLocation.lng]} icon={homeIcon}>
                            <Popup><b>Nhà bạn</b></Popup>
                        </Marker>
                    )}

                    {restaurant?.location && (
                        <Marker position={[restaurant.location.lat, restaurant.location.lng]} icon={storeIcon}>
                            <Popup><b>{restaurant.name}</b></Popup>
                        </Marker>
                    )}

                    {myDrone && order.status !== 'Cancelled' && (
                        <>
                            <Marker position={[myDrone.currentLat, myDrone.currentLng]} icon={droneIcon} zIndexOffset={1000}>
                                <Popup>Drone</Popup>
                            </Marker>
                            
                            {myDrone.destination && (
                                <Polyline 
                                    positions={[
                                        [myDrone.currentLat, myDrone.currentLng],
                                        [myDrone.destination.lat, myDrone.destination.lng]
                                    ]}
                                    pathOptions={{ color: '#F72D57', dashArray: '10, 10', weight: 4, opacity: 0.8 }}
                                />
                            )}
                        </>
                    )}
                </MapContainer>
            </MapWrapper>

            {showSuccessModal && (
                <Overlay>
                    <ModalBase>
                        <ModalIcon $color="#28a745"><FaCheckCircle /></ModalIcon>
                        <ModalTitle>Giao Hàng Thành Công!</ModalTitle>
                        <ModalDesc>Drone đã thả hàng an toàn. Chúc bạn ngon miệng!</ModalDesc>
                        <ButtonGroup>
                            <PrimaryButton $bg="#28a745" onClick={() => navigate('/my-orders')}>Đã nhận hàng</PrimaryButton>
                            <SecondaryButton onClick={() => setShowSuccessModal(false)}>Đóng</SecondaryButton>
                        </ButtonGroup>
                    </ModalBase>
                </Overlay>
            )}

            {showCancelModal && (
                <Overlay>
                    <ModalBase>
                        <ModalIcon $color="#dc3545"><FaTimesCircle /></ModalIcon>
                        <ModalTitle>Đơn Hàng Đã Bị Hủy</ModalTitle>
                        <ModalDesc>
                            Rất tiếc, đơn hàng của bạn đã bị từ chối hoặc hủy bởi nhà hàng.<br/>
                            Vui lòng thử đặt quán khác nhé.
                        </ModalDesc>
                        <ButtonGroup>
                            <PrimaryButton $bg="#dc3545" onClick={() => navigate('/restaurants')}>Đặt món khác</PrimaryButton>
                            <SecondaryButton onClick={() => setShowCancelModal(false)}>Đóng</SecondaryButton>
                        </ButtonGroup>
                    </ModalBase>
                </Overlay>
            )}
        </Container>
    );
};

export default OrderTracking;