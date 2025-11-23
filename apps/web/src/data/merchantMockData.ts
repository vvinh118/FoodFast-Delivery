// Định nghĩa kiểu dữ liệu
export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    status: 'PENDING' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'REJECTED';
    items: OrderItem[];
    totalPrice: number;
    createdAt: string;
}

// Dữ liệu mẫu
export const mockOrders: Order[] = [
    {
        id: "A123",
        customerName: "Nguyễn Văn A",
        status: "PENDING",
        items: [
            { id: "m1", name: "Cơm Gà Xối Mỡ", quantity: 2, price: 45000 },
            { id: "m2", name: "Pepsi Lon", quantity: 1, price: 15000 },
        ],
        totalPrice: 105000,
        createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 phút trước
    },
    {
        id: "B456",
        customerName: "Trần Thị B",
        status: "PENDING",
        items: [
            { id: "m3", name: "Bún Chả Hà Nội", quantity: 1, price: 55000 },
        ],
        totalPrice: 55000,
        createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 phút trước
    },
    {
        id: "C789",
        customerName: "Lê Văn C",
        status: "PREPARING",
        items: [
            { id: "m4", name: "Pizza Hải Sản (Size M)", quantity: 1, price: 99000 },
            { id: "m5", name: "Khoai tây chiên", quantity: 1, price: 25000 },
        ],
        totalPrice: 124000,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 phút trước
    },
    {
        id: "D101",
        customerName: "Phạm Thị D",
        status: "READY_FOR_PICKUP",
        items: [
            { id: "m6", name: "Trà Sữa Kem Trứng Nướng", quantity: 2, price: 45000 },
        ],
        totalPrice: 90000,
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 phút trước
    }
];