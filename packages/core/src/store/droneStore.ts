import { create } from 'zustand';
import { fetchDrones, fetchDroneHubs, updateDrone } from '../services/api';
import { Drone, DroneHub, Coordinates } from '../types';

interface DroneState {
    hubs: DroneHub[];
    drones: Drone[];
    selectedDrone: Drone | null;
    isLoading: boolean;
    
    // Actions
    initDroneSystem: () => Promise<void>;
    setDrones: (drones: Drone[]) => void;
    updateDronePosition: (id: string, lat: number, lng: number) => void;
    updateDroneStatus: (id: string, status: Drone['status']) => void;
    selectDrone: (drone: Drone | null) => void;

    // LOGIC ĐIỀU PHỐI
    assignDroneToOrder: (orderId: string, restaurantLocation: Coordinates, customerLocation: Coordinates) => Promise<void>;
    droneArrivedAtStore: (droneId: string) => Promise<void>;
    startDeliveryToCustomer: (droneId: string, customerLocation: Coordinates) => Promise<void>;
    finishDelivery: (droneId: string) => Promise<void>;
}

const calculateDistance = (coord1: Coordinates, coord2: Coordinates) => {
    const R = 6371; 
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const useDroneStore = create<DroneState>((set, get) => ({
    hubs: [],
    drones: [],
    selectedDrone: null,
    isLoading: false,

    initDroneSystem: async () => {
        set({ isLoading: true });
        try {
            const [hubsData, dronesData] = await Promise.all([
                fetchDroneHubs(),
                fetchDrones()
            ]);
            set({ hubs: hubsData });
            get().setDrones(dronesData); 
            set({ isLoading: false });
        } catch (error) {
            console.error("Lỗi tải Drone:", error);
            set({ isLoading: false });
        }
    },

    setDrones: (serverDrones) => set(state => {
        if (state.drones.length === 0) return { drones: serverDrones };

        const mergedDrones = serverDrones.map(serverDrone => {
            const localDrone = state.drones.find(d => d.id === serverDrone.id);
            // Chỉ giữ local khi đang bay đi (moving hoặc delivering)
            if (localDrone && 
               ['moving_to_store', 'delivering'].includes(localDrone.status) &&
               serverDrone.status === localDrone.status 
            ) {
                return {
                    ...serverDrone, 
                    currentLat: localDrone.currentLat, 
                    currentLng: localDrone.currentLng, 
                    destination: localDrone.destination || serverDrone.destination,
                    origin: localDrone.origin || serverDrone.origin
                };
            }
            return serverDrone;
        });

        return { drones: mergedDrones };
    }),
    
    updateDronePosition: (id, lat, lng) => set(state => ({
        drones: state.drones.map(d => d.id === id ? { ...d, currentLat: lat, currentLng: lng } : d)
    })),

    updateDroneStatus: (id, status) => set(state => ({
        drones: state.drones.map(d => d.id === id ? { ...d, status: status } : d)
    })),

    selectDrone: (drone) => set({ selectedDrone: drone }),

    // 1. GIAI ĐOẠN 1: TÌM DRONE & BAY ĐẾN QUÁN
    assignDroneToOrder: async (orderId, restaurantLocation, customerLocation) => {
        const { hubs, drones } = get();
        let nearestHub = hubs[0];
        let minDistance = Infinity;
        hubs.forEach(hub => {
            const dist = calculateDistance(hub.location, restaurantLocation);
            if (dist < minDistance) { minDistance = dist; nearestHub = hub; }
        });

        const availableDrone = drones.find(d => d.hubId === nearestHub.id && d.status === 'idle');

        if (availableDrone) {
            console.log(`🚁 Drone ${availableDrone.id} nhận đơn, bay từ vị trí hiện tại đến quán.`);
            
            const updateData = {
                status: 'moving_to_store' as const,
                currentOrderId: orderId,
                origin: { lat: availableDrone.currentLat, lng: availableDrone.currentLng },
                destination: restaurantLocation 
            };

            set(state => ({
                drones: state.drones.map(d => d.id === availableDrone.id ? { ...d, ...updateData } : d)
            }));
            await updateDrone(availableDrone.id, updateData); 
        } else {
            alert("⚠️ Không có Drone rảnh!");
        }
    },

    // 2. GIAI ĐOẠN 2: DRONE ĐÃ ĐẾN QUÁN
    droneArrivedAtStore: async (droneId) => {
        const drone = get().drones.find(d => d.id === droneId);
        if (!drone) return;
        
        const finalLoc = drone.destination ? { currentLat: drone.destination.lat, currentLng: drone.destination.lng } : {};

        const updateData = {
            status: 'at_store' as const,
            ...finalLoc,
            origin: undefined, destination: undefined 
        };

        set(state => ({ drones: state.drones.map(d => d.id === droneId ? { ...d, ...updateData } : d) }));
        await updateDrone(droneId, updateData); 
    },

    // 3. GIAI ĐOẠN 3: BAY ĐI GIAO KHÁCH
    startDeliveryToCustomer: async (droneId, customerLocation) => {
        const drone = get().drones.find(d => d.id === droneId);
        if(!drone) return;

        const updateData = {
            status: 'delivering' as const,
            origin: { lat: drone.currentLat, lng: drone.currentLng },
            destination: customerLocation 
        };

        set(state => ({ drones: state.drones.map(d => d.id === droneId ? { ...d, ...updateData } : d) }));
        await updateDrone(droneId, updateData); 
    },

    // 4. GIAI ĐOẠN 4: GIAO XONG -> RESET VỀ HUB NGAY LẬP TỨC (TELEPORT)
    finishDelivery: async (droneId) => {
        const drone = get().drones.find(d => d.id === droneId);
        const { hubs } = get();
        if(!drone) return;

        // Tìm Hub chủ quản
        const myHub = hubs.find(h => h.id === drone.hubId);
        if (!myHub) return; 

        console.log(`✅ Giao xong. Reset Drone ${droneId} về trạm ${myHub.name} ngay.`);

        const updateData = {
            status: 'idle' as const,      // Về trạng thái rảnh ngay
            currentOrderId: null,
            // Teleport về tọa độ Hub
            currentLat: myHub.location.lat, 
            currentLng: myHub.location.lng,
            origin: undefined,
            destination: undefined
        };

        // Cập nhật State và DB ngay lập tức
        set(state => ({ drones: state.drones.map(d => d.id === droneId ? { ...d, ...updateData } : d) }));
        await updateDrone(droneId, updateData); 
    }
}));