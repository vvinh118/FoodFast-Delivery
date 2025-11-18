// packages/core/src/utils/index.ts

// 1. Hàm format tiền tệ (dùng cho CartItemRow và Checkout.tsx)
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(amount);
};

// 2. Các hàm Validate ( dùng cho Register.tsx)
export const Validators = {
    isValidPhone: (phone: string): boolean => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    },
    
    isValidEmail: (email: string): boolean => {
        // Regex đơn giản cho email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidBirthday: (birthday: string): string | null => {
         // Trả về null nếu hợp lệ, trả về chuỗi lỗi nếu sai
        if (!birthday) return 'Vui lòng nhập Ngày Sinh.';
        const year = parseInt(birthday.split('-')[0], 10);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear - 5) return 'Năm sinh không hợp lệ.';
        return null;
    }
};