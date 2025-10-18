// src/context/CartContext.tsx

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho một món hàng trong giỏ
interface CartItem {
    id: number; // ID của món ăn
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface ItemData {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}


// Định nghĩa kiểu dữ liệu cho Cart Context
interface CartContextType {
    cartItems: CartItem[];
    increaseItemQuantity: (item: ItemData) => void;
    decreaseItemQuantity: (itemId: number) => void;
    findItem: (id: number) => CartItem | undefined; // Thêm hàm tìm kiếm
    getTotalItems: () => number;
    getTotalPrice: () => number;

    // quản lý trạng thái mở đóng sidebar
    isCartOpen: boolean; 
    toggleCart: () => void;
}

// Tạo Context (với giá trị mặc định là null)
const CartContext = createContext<CartContextType | null>(null);

// Custom hook để sử dụng Context dễ dàng
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Component Provider để cung cấp trạng thái
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    
    // THÊM: State để kiểm soát Sidebar Giỏ hàng
    const [isCartOpen, setIsCartOpen] = useState(false);

    // THÊM: Hàm chuyển đổi trạng thái mở/đóng
    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Hàm tìm kiếm món ăn
    const findItem = (id: number) => cartItems.find(i => i.id === id);


    // TĂNG SỐ LƯỢNG (hoặc THÊM MỚI nếu lần đầu nhấn '+')
    const increaseItemQuantity = (item: ItemData) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);

            if (existingItem) {
                // Tăng số lượng
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                // THÊM MỚI (Lần đầu nhấn '+' => quantity = 1)
                return [...prevItems, { 
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    imageUrl: item.imageUrl
                }];
            }
        });
    };

    // GIẢM SỐ LƯỢNG (hoặc XÓA nếu quantity về 0)
    const decreaseItemQuantity = (itemId: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === itemId);

            if (!existingItem) return prevItems;

            if (existingItem.quantity > 1) {
                // Giảm số lượng
                return prevItems.map(i =>
                    i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                );
            } else {
                // SỐ LƯỢNG = 1, nhấn (-) => XÓA KHỎI GIỎ HÀNG
                return prevItems.filter(i => i.id !== itemId);
            }
        });
    };

    // Tính tổng số lượng món ăn
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };
    
    // Tính tổng tiền
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            increaseItemQuantity, 
            decreaseItemQuantity,
            findItem,
            getTotalItems, 
            getTotalPrice,
            
            // THÊM: Sidebar State và Functions
            isCartOpen, 
            toggleCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};