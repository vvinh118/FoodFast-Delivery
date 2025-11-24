// packages/core/src/types/product.ts

export interface Restaurant {
  id: string | number;
  name: string;
  address: string;
  rating: number;
  distance: number;
  deliveryTime: number;
  imageUrl: string;
  isPromo: boolean;
  category: string;
  ownerId?: string | number;
  status?: 'active' | 'pending' | 'suspended';
  isAcceptingOrders?: boolean; // Trạng thái đóng/mở cửa của Merchant
  openingTime?: string;
  closingTime?: string;
}

export interface Category {
    id: number;
    name: string;
    iconUrl: string;
}

export interface MenuItem {
    id: string | number;
    restaurantId: string | number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
    isAvailable?: boolean;
}