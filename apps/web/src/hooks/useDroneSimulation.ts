import { useEffect, useRef } from 'react';
import { useDroneStore, updateOrderStatus } from 'core';

export const useDroneSimulation = () => {
    const { updateDronePosition, droneArrivedAtStore, finishDelivery } = useDroneStore();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // CẤU HÌNH: LUÔN BAY TRONG 10 GIÂY
    const FLIGHT_DURATION_MS = 10000; 
    const UPDATE_INTERVAL_MS = 50;   
    const TOTAL_STEPS = FLIGHT_DURATION_MS / UPDATE_INTERVAL_MS;

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const currentDrones = useDroneStore.getState().drones;

            currentDrones.forEach(async (drone) => {
                // Chỉ xử lý 2 trạng thái bay đi: Đến quán hoặc Giao khách
                const isFlying = ['moving_to_store', 'delivering'].includes(drone.status);

                if (isFlying && drone.destination && drone.origin) {
                    
                    const target = drone.destination;
                    const start = drone.origin;

                    const totalLatDiff = target.lat - start.lat;
                    const totalLngDiff = target.lng - start.lng;
                    const stepLat = totalLatDiff / TOTAL_STEPS;
                    const stepLng = totalLngDiff / TOTAL_STEPS;

                    const remainingLat = target.lat - drone.currentLat;
                    const remainingLng = target.lng - drone.currentLng;
                    const distRemain = Math.sqrt(remainingLat**2 + remainingLng**2);
                    const distStep = Math.sqrt(stepLat**2 + stepLng**2);

                    if (distRemain > distStep) {
                        // --- ĐANG BAY ---
                        const newLat = drone.currentLat + stepLat;
                        const newLng = drone.currentLng + stepLng;
                        updateDronePosition(drone.id, newLat, newLng);
                    } else {
                        // --- ĐÃ TỚI NƠI ---
                        
                        // 1. Đến Quán
                        if (drone.status === 'moving_to_store') {
                            console.log(`🏁 Drone ${drone.id} đến Quán.`);
                            await droneArrivedAtStore(drone.id); 
                        } 
                        // 2. Đến Khách (Giao xong)
                        else if (drone.status === 'delivering') {
                            console.log(`🎁 Drone ${drone.id} giao xong -> Reset về Hub.`);
                            
                            if (drone.currentOrderId) {
                                try {
                                    await updateOrderStatus(drone.currentOrderId, 'Delivered');
                                } catch (e) { console.error(e); }
                            }
                            
                            await finishDelivery(drone.id); 
                        }
                    }
                }
            });
        }, UPDATE_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);
};