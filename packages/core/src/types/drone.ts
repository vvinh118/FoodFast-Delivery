// packages/core/src/types/drone.ts
import { Coordinates } from './common';


export interface DroneHub {
    id: string;
    name: string;
    location: Coordinates;
    capacity: number;
}

export interface Drone {
    id: string;
    hubId: string;
    model: string;
    battery: number;
    status: 'idle' | 'moving_to_store' | 'at_store' | 'delivering' | 'returning' | 'charging';
    currentLat: number;
    currentLng: number;
    currentOrderId?: string | null;
    destination?: Coordinates;
    origin?: Coordinates;
}