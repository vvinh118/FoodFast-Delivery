// packages/core/src/types/product.ts

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  distance: number;
  deliveryTime: number;
  imageUrl: string;
  isPromo: boolean;
  category: string;
}

export interface Category {
    id: number;
    name: string;
    iconUrl: string;
}

export interface MenuItem {
    id: number;
    restaurantId: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
}