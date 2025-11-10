// src/data/mockData.ts
import chickenIcon from '../assets/icons/chicken.png';
import riceIcon from '../assets/icons/rice.png';
import milkteaIcon from '../assets/icons/milktea.png';
import ramenIcon from '../assets/icons/ramen.png';
import fastfoodIcon from '../assets/icons/fastfood.svg';
import donutIcon from '../assets/icons/donut.png';
import hotpotIcon from '../assets/icons/hotpot.png';
import icecreamIcon from '../assets/icons/ice-cream.png';
import alldmIcon from '../assets/icons/danhmuc.png';



// DỮ LIỆU GIẢ CHO DANH SÁCH QUÁN ĂN (Restaurant Data)
export const mockRestaurants = [
    { 
      id: 1, 
      name: "Nem Nướng D'yan - Since 1968", 
      address: "183 Nguyễn Văn Đậu", 
      rating: 4.7, 
      distance: 2.9, 
      deliveryTime: 25,
      imageUrl: "https://trumfood.vn/wp-content/uploads/2023/01/nem-nuong-thom-ngon-Trum-Food.jpg",
      isPromo: true,
      category: "Lẩu, Nướng"
    },
    { 
      id: 2, 
      name: "3 Râu - Gà Rán Pizza & Trà Sữa", 
      address: "191 Nguyễn Tiểu La", 
      rating: 4.5, 
      distance: 2.2, 
      deliveryTime: 20,
      imageUrl: "https://tse3.mm.bing.net/th/id/OIP.4o98zuIor0zIGSloJFZ_DAHaEo?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      isPromo: true,
      category: "Gà" 
    },
    { 
      id: 3, 
      name: "Mì Trộn Indomie, Gà Rán", 
      address: "155 Lê Văn Sỹ", 
      rating: 4.7, 
      distance: 2.3, 
      deliveryTime: 30,
      imageUrl: "https://tse4.mm.bing.net/th/id/OIP.g349_sKPS2INyrS8vSgLlQHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      isPromo: false,
      category: "Bún, Mì, Phở"
    },
    { 
      id: 4, 
      name: "Xôi Mặn - Bánh Bao Trường Sơn", 
      address: "36 Trường Sơn, P.4, Q.TB", 
      rating: 4.6, 
      distance: 0.8, 
      deliveryTime: 15,
      imageUrl: "https://tse2.mm.bing.net/th/id/OIP.WnQXS6zgCF0nFxumjcgNXgHaFT?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      isPromo: true,
      category: "Thức ăn nhanh"
    },
    { 
        id: 5, 
        name: "Cơm Gà Xối Mỡ - Chú Tư", 
        address: "18 Thành Thái, P.14, Q.10", 
        rating: 4.8, 
        distance: 3.5, 
        deliveryTime: 35,
        imageUrl: "https://cdn.xanhsm.com/2025/01/735df340-com-ga-sai-gon-1.jpg",
        isPromo: false,
        category: "Cơm"
    },
    { 
        id: 6, 
        name: "Trà Sữa Cheese Bông - Hot Trend", 
        address: "212 Lý Thường Kiệt, P.15, Q.11", 
        rating: 4.9, 
        distance: 1.1, 
        deliveryTime: 15,
        imageUrl: "https://tse4.mm.bing.net/th/id/OIP.71cGG9HIkYC_9s-FRLkwTQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        isPromo: true,
        category: "Trà Sữa"
    },
    { 
        id: 7, 
        name: "Bún Chả Hà Nội - 120 Năm", 
        address: "118 Cống Quỳnh, P. Phạm Ngũ Lão, Q.1", 
        rating: 4.4, 
        distance: 5.1, 
        deliveryTime: 40,
        imageUrl: "https://th.bing.com/th/id/R.5f68ed218aa0a6e668bb92ce7a0360f2?rik=3RCuYcDLAO4MqQ&pid=ImgRaw&r=0",
        isPromo: false,
        category: "Bún, Mì, Phở" 
    },
    { 
        id: 8, 
        name: "Pizza & Pasta Ý - VV", 
        address: "339 Lê Văn Sỹ, P.1, Q. TB", 
        rating: 4.3, 
        distance: 0.5, 
        deliveryTime: 20,
        imageUrl: "https://img1.wsimg.com/isteam/stock/2982",
        isPromo: true,
        category: "Thức ăn nhanh" 
    },

    { 
        id: 9,
        name: "Kem Wall's - ST F-MART 24", 
        address: "258 Phan Đình Phùng, P.2, Q. Phú Nhuận", 
        rating: 4.6, 
        distance: 0.5, 
        deliveryTime: 20,
        imageUrl: "https://bizweb.dktcdn.net/100/093/924/files/kem-hop-3-trong-1-triple-delight-vanilla-lemon-chocolate-walls-840ml-2.jpg?v=1619857283204",
        isPromo: true,
        category: "Kem" 
    },

    
    { 
        id: 10,
        name: "Thế Giới Donut", 
        address: "124 Hai Bà Trưng, P.6, Q.3", 
        rating: 4.6, 
        distance: 0.5, 
        deliveryTime: 20,
        imageUrl: "https://tse4.mm.bing.net/th/id/OIP._RHtf6pxnrUkhaWDxrmeKQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        isPromo: true,
        category: "Bánh" 
    },

];


// DỮ LIỆU GIẢ CHO DANH SÁCH MÓN ĂN (Menu Item Data)
export const mockMenuItems = [
    // Quán ID 1: Nem Nướng D'yan
    { id: 101, restaurantId: 1, name: "Nem Nướng Cuốn Bánh Tráng", price: 65000, description: "Combo 2 phần nem nướng đầy đủ rau, dưa, bánh tráng.", imageUrl: "https://toplist.vn/images/800px/nem-nuong-bun-thit-nuong-quan-cua-ma-1143319.jpg" },
    { id: 102, restaurantId: 1, name: "Nem Nướng Lẻ", price: 35000, description: "10 que nem nướng nóng giòn.", imageUrl: "https://i.imgur.com/i9O3L6F.jpeg" },
    { id: 103, restaurantId: 1, name: "Bún Nem Nướng Chả Giò", price: 50000, description: "Bún tươi, nem nướng, chả giò và rau sống.", imageUrl: "https://i.imgur.com/rN2tMhY.jpeg" },
    { id: 104, restaurantId: 1, name: "Gỏi Cuốn Nem Nướng (3 Cuốn)", price: 40000, description: "Gỏi cuốn nhân nem nướng, tôm, thịt.", imageUrl: "https://i.imgur.com/V7gZJ8w.jpeg" },
    { id: 105, restaurantId: 1, name: "Trà Tắc Giải Nhiệt", price: 18000, description: "Trà tắc tươi mát, giải nhiệt.", imageUrl: "https://i.imgur.com/P5kQJ1o.jpeg" },
    { id: 106, restaurantId: 1, name: "Nước Mía Lau", price: 15000, description: "Nước mía tươi ép với lá dứa.", imageUrl: "https://i.imgur.com/c1hJ2gJ.jpeg" },
    { id: 107, restaurantId: 1, name: "Combo Đặc Biệt (2 Nem + 1 Nước)", price: 79000, description: "Nem nướng cuốn bánh tráng kèm nước giải khát.", imageUrl: "https://i.imgur.com/vH1WjYf.jpeg" },
    { id: 108, restaurantId: 1, name: "Phần Rau Thêm", price: 10000, description: "Phần rau sống thêm cho món cuốn.", imageUrl: "https://i.imgur.com/wA0bX2e.jpeg" },
    { id: 109, restaurantId: 1, name: "Bánh Hỏi Nem Nướng", price: 55000, description: "Bánh hỏi ăn kèm nem nướng và rau thơm.", imageUrl: "https://i.imgur.com/tYpZ9uB.jpeg" },


    // Quán ID 2: 3 Râu - Gà Rán Pizza & Trà Sữa
    { id: 201, restaurantId: 13, name: "Combo Gà Rán 2 Miếng + Pepsi", price: 59000, description: "2 miếng gà giòn tan kèm nước.", imageUrl: "https://i.imgur.com/7gK5xQf.jpeg" }, 
    { id: 202, restaurantId: 13, name: "Pizza Hải Sản (Size M)", price: 99000, description: "Pizza hải sản với đế mỏng giòn.", imageUrl: "https://i.imgur.com/8QjZzRj.jpeg" },
    { id: 203, restaurantId: 13, name: "Trà Sữa Khoai Môn", price: 35000, description: "Trà sữa khoai môn béo ngậy.", imageUrl: "https://i.imgur.com/Uo2eG7x.jpeg" },

    // Quán ID 3: Mì Trộn Indomie, Gà Rán
    { id: 301, restaurantId: 3, name: "Mì Trộn Indomie Đặc Biệt", price: 39000, description: "Mì trộn Indomie kèm trứng, chả lụa và rau.", imageUrl: "https://i.imgur.com/sW3Xg1J.jpeg" },
    { id: 302, restaurantId: 3, name: "Mì Xào Giòn Hải Sản", price: 69000, description: "Mì xào giòn sốt hải sản đậm đà.", imageUrl: "https://i.imgur.com/k2H5yRz.jpeg" },
    { id: 303, restaurantId: 3, name: "Coca Cola (Lon)", price: 15000, description: "Coca Cola lon 330ml.", imageUrl: "https://i.imgur.com/P5kQJ1o.jpeg" },

    // Quán ID 4: Xôi Mặn - Bánh Bao Trường Sơn
    { id: 401, restaurantId: 4, name: "Xôi Mặn Thập Cẩm", price: 30000, description: "Xôi mặn kèm chà bông, trứng cút, lạp xưởng.", imageUrl: "https://i.imgur.com/vH1WjYf.jpeg" },
    { id: 402, restaurantId: 4, name: "Bánh Bao Nhân Thịt Trứng", price: 15000, description: "Bánh bao nóng hổi nhân thịt và trứng cút.", imageUrl: "https://i.imgur.com/wA0bX2e.jpeg" },

    // Quán ID 5: Cơm Gà Xối Mỡ - Chú Tư
    { id: 501, restaurantId: 5, name: "Cơm Gà Xối Mỡ Đặc Biệt", price: 45000, description: "Gà xối mỡ giòn rụm, cơm thơm, kèm canh và rau dưa.", imageUrl: "https://i.imgur.com/bK1dF2L.jpeg" },
    { id: 502, restaurantId: 5, name: "Cơm Gà Luộc", price: 40000, description: "Gà ta luộc, cơm và nước chấm gừng.", imageUrl: "https://i.imgur.com/c1hJ2gJ.jpeg" },
    
    // Quán ID 6: Trà Sữa Cheese Bông
    { id: 601, restaurantId: 6, name: "Trà Sữa Kem Trứng Nướng", price: 45000, description: "Trà sữa đậm vị kèm kem trứng nướng béo ngậy.", imageUrl: "https://i.imgur.com/D4sXvG0.jpeg" },
    { id: 602, restaurantId: 6, name: "Trà Đào Cam Sả", price: 39000, description: "Thức uống giải nhiệt với đào và sả.", imageUrl: "https://i.imgur.com/E8wXgJ7.jpeg" },
    
    // Quán ID 7: Bún Chả Hà Nội
    { id: 701, restaurantId: 7, name: "Bún Chả Thường", price: 55000, description: "Bún chả truyền thống Hà Nội.", imageUrl: "https://i.imgur.com/rN2tMhY.jpeg" },
    { id: 702, restaurantId: 7, name: "Nem Cua Bể", price: 20000, description: "Nem cua bể chiên giòn.", imageUrl: "https://i.imgur.com/V7gZJ8w.jpeg" },

    // Quán ID 8: Pizza & Pasta Ý
    { id: 801, restaurantId: 8, name: "Pizza Bò Phô Mai (Size L)", price: 159000, description: "Pizza bò băm và phô mai Mozzarella.", imageUrl: "https://i.imgur.com/tYpZ9uB.jpeg" },
    { id: 802, restaurantId: 8, name: "Mì Ý Carbonara", price: 85000, description: "Mì Ý sốt kem và thịt xông khói.", imageUrl: "https://i.imgur.com/L5kRj6k.jpeg" },
];

// DỮ LIỆU GIẢ CHO DANH MỤC (Category Data)
export const mockCategories = [
    { name: "All", iconUrl: alldmIcon },
    { name: "Gà", iconUrl: chickenIcon },
    { name: "Cơm", iconUrl: riceIcon },
    { name: "Trà Sữa", iconUrl: milkteaIcon },
    { name: "Bún, Mì, Phở", iconUrl: ramenIcon },
    { name: "Thức ăn nhanh", iconUrl: fastfoodIcon },
    { name: "Bánh", iconUrl: donutIcon },
    { name: "Lẩu, Nướng", iconUrl: hotpotIcon },
    { name: "Kem", iconUrl: icecreamIcon },
];

