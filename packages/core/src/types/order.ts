// packages/core/src/types/order.ts

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string; 
    restaurantId: number;
    restaurantName: string;
}

export interface OrderItem {
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
  status: string; // 'Pending' | 'Delivered' | 'Cancelled'
  createdAt: string;
}

