// packages/core/src/types/order.ts
import { Coordinates } from './common';

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string; 
    restaurantId: string | number;
    restaurantName: string;
}

export interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  restaurantId?: string | number; 
}

export interface Order {
  id: string | number;
  userId: string | number;
  userName: string;
  userPhone?: string;
  userAddress?: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  paymentMethod?: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivering' | 'Delivered' | 'Cancelled'; 
  createdAt: string;
  deliveryLocation?: Coordinates;
}