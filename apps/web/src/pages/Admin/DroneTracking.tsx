import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaArrowLeft, FaMapMarkerAlt, FaBatteryThreeQuarters } from "react-icons/fa";
import { useDroneStore, type Order, type Restaurant, fetchOrderById, fetchRestaurantById } from "core";
import { useDroneSimulation } from "../../hooks/useDroneSimulation";

// === ICONS ===
const droneIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/9485/9485815.png",
  iconSize: [45, 45],
  iconAnchor: [22, 22],
});
const homeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/8354/8354902.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});
const storeIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/4392/4392773.png",
  iconSize: [35, 35],
  iconAnchor: [20, 40],
});

// === STYLED COMPONENTS ===
const Container = styled.div`
  height: calc(100dvh - 60px);
  display: flex;
  flex-direction: column;
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
`;

const HeaderPanel = styled.div`
  background: white;
  padding: 12px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-shrink: 0;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;
const BackButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: 0.2s;
  color: #555;
  &:hover {
    background: #e0e0e0;
    color: #000;
  }
`;

const DroneInfo = styled.div`
  flex: 1;
  min-width: 0;
  h2 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }
  p {
    margin: 2px 0 0 0;
    font-size: 0.8rem;
    color: #777;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const StatusBadge = styled.div`
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  color: white;
  background: linear-gradient(90deg, #f72d57, #ff5b7a);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const MapWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  width: 100%;
  height: 100%;
`;

const DroneStatusCard = styled.div`
  position: absolute;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 5px solid #f72d57;
  top: 20px;
  right: 20px;
  min-width: 200px;
  h4 {
    margin: 0 0 5px 0;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  div {
    font-size: 0.9rem;
    color: #555;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 5px;
  }
`;

export default function DroneTracking() {
  const { droneId, orderId } = useParams<{ droneId: string; orderId?: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useDroneSimulation();
  const { drones, initDroneSystem } = useDroneStore();

  useEffect(() => {
    const fetchData = async () => {
      await initDroneSystem();
      if (orderId) {
        try {
          const orderData = await fetchOrderById(orderId);
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
      } else {
        // no orderId: not an active delivery; still init done
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, [orderId, initDroneSystem]);

  const myDrone = drones.find((d) => d.id === droneId) ?? null;

  if (loading)
    return (
      <div style={{ padding: 50, textAlign: "center", color: "#666" }}>
        📡 Đang kết nối vệ tinh...
      </div>
    );

  if (orderId && !order)
    return <div style={{ padding: 30, textAlign: "center" }}>Không tìm thấy đơn hàng.</div>;

  let centerPos: [number, number] = [10.7769, 106.7009];
  if (myDrone) centerPos = [myDrone.currentLat, myDrone.currentLng];
  else if (restaurant?.location) centerPos = [restaurant.location.lat, restaurant.location.lng];
  else if (order?.deliveryLocation) centerPos = [order.deliveryLocation.lat, order.deliveryLocation.lng];

  return (
    <Container>
      <HeaderPanel>
        <LeftGroup>
          <BackButton onClick={() => navigate("/admin/drones")}>
            <FaArrowLeft />
          </BackButton>
          <DroneInfo>
            <h2>Drone: {myDrone?.model ?? "-"} ({droneId})</h2>
            <p>
              <FaMapMarkerAlt color="#F72D57" size={12} style={{ flexShrink: 0 }} />{" "}
              {order?.userAddress ?? (restaurant?.location ? "Xem vị trí drone" : "Không có dữ liệu địa điểm")}
            </p>
          </DroneInfo>
        </LeftGroup>

        <StatusBadge>
          {myDrone?.status === "delivering" && "Đang giao"}
          {myDrone?.status === "moving_to_store" && "Đang tới quán"}
          {myDrone?.status === "at_store" && "Tại quán"}
          {myDrone?.status === "idle" && "Sẵn sàng"}
          {!myDrone && "Không có drone"}
        </StatusBadge>
      </HeaderPanel>

      <MapWrapper>
        {myDrone && (
          <DroneStatusCard>
            <h4>🚁 {myDrone.model}</h4>
            <div>
              <FaBatteryThreeQuarters color={myDrone.battery < 20 ? "red" : "green"} />
              Pin: {myDrone.battery}%
            </div>
            <div>Tốc độ: Bay mô phỏng (10s)</div>
          </DroneStatusCard>
        )}

        <MapContainer center={centerPos} zoom={15} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />

          {order?.deliveryLocation && (
            <Marker position={[order.deliveryLocation.lat, order.deliveryLocation.lng]} icon={homeIcon}>
              <Popup>
                <b>Nhà khách hàng</b>
              </Popup>
            </Marker>
          )}

          {restaurant?.location && (
            <Marker position={[restaurant.location.lat, restaurant.location.lng]} icon={storeIcon}>
              <Popup>
                <b>{restaurant.name}</b>
              </Popup>
            </Marker>
          )}

          {myDrone && (
            <>
              <Marker position={[myDrone.currentLat, myDrone.currentLng]} icon={droneIcon} zIndexOffset={1000}>
                <Popup>Drone {myDrone.id}</Popup>
              </Marker>

              {myDrone.destination && (
                <Polyline
                  positions={[
                    [myDrone.currentLat, myDrone.currentLng],
                    [myDrone.destination.lat, myDrone.destination.lng],
                  ]}
                  pathOptions={{
                    color: "#F72D57",
                    dashArray: "10, 10",
                    weight: 4,
                    opacity: 0.8,
                  }}
                />
              )}
            </>
          )}
        </MapContainer>
      </MapWrapper>
    </Container>
  );
}