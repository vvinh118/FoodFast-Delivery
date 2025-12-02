// packages/core/src/constants/mockLocation.ts

export interface MockLocation {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
}

export const MOCK_LOCATIONS: MockLocation[] = [
    // === QUẬN 1 (Trung tâm) ===
    { id: 'q1_1', name: 'Dinh Độc Lập', address: '135 Nam Kỳ Khởi Nghĩa, P. Bến Thành, Q.1', lat: 10.7769, lng: 106.6953 },
    { id: 'q1_2', name: 'Chợ Bến Thành', address: 'Đường Lê Lợi, P. Bến Thành, Q.1', lat: 10.7725, lng: 106.6980 },
    { id: 'q1_3', name: 'Bitexco Financial Tower', address: '2 Hải Triều, Q.1', lat: 10.7716, lng: 106.7044 },
    { id: 'q1_4', name: 'Nhà thờ Đức Bà', address: '01 Công xã Paris, P. Bến Nghé, Q.1', lat: 10.7798, lng: 106.6990 },
    { id: 'q1_5', name: 'Phố đi bộ Nguyễn Huệ', address: 'Nguyễn Huệ, P. Bến Nghé, Q.1', lat: 10.7744, lng: 106.7035 },
    { id: 'q1_6', name: 'Saigon Centre (Takashimaya)', address: '65 Lê Lợi, Q.1', lat: 10.7736, lng: 106.7008 },
    { id: 'q1_7', name: 'Thảo Cầm Viên', address: '2 Nguyễn Bỉnh Khiêm, P. Bến Nghé, Q.1', lat: 10.7876, lng: 106.7053 },
    { id: 'q1_8', name: 'Vincom Center', address: '72 Lê Thánh Tôn, P. Bến Nghé, Q.1', lat: 10.7781, lng: 106.7016 },
    { id: 'q1_9', name: 'Phố Tây Bùi Viện', address: 'P. Phạm Ngũ Lão, Q.1', lat: 10.7674, lng: 106.6939 },
    
    // === QUẬN 3 ===
    { id: 'q3_1', name: 'Hồ Con Rùa', address: 'Công trường Quốc Tế, P.6, Q.3', lat: 10.7828, lng: 106.6959 },
    { id: 'q3_2', name: 'Bảo tàng Chứng tích Chiến tranh', address: '28 Võ Văn Tần, Q.3', lat: 10.7795, lng: 106.6922 },
    { id: 'q3_3', name: 'Bệnh viện Da Liễu', address: '2 Nguyễn Thông, Q.3', lat: 10.7791, lng: 106.6853 },

    // === QUẬN 5 (Chợ Lớn) ===
    { id: 'q5_1', name: 'Bệnh viện Đại học Y Dược', address: '215 Hồng Bàng, Q.5', lat: 10.7554, lng: 106.6646 },
    { id: 'q5_2', name: 'Parkson Hùng Vương', address: '126 Hồng Bàng, Q.5', lat: 10.7578, lng: 106.6631 },
    { id: 'q5_3', name: 'The Garden Mall', address: '190 Hồng Bàng, Q.5', lat: 10.7547, lng: 106.6619 },

    // === QUẬN 10 ===
    { id: 'q10_1', name: 'Đại học Bách Khoa TP.HCM', address: '268 Lý Thường Kiệt, P. 14, Q.10', lat: 10.7721, lng: 106.6579 },
    { id: 'q10_2', name: 'Vạn Hạnh Mall', address: '11 Sư Vạn Hạnh, Q.10', lat: 10.7709, lng: 106.6698 },
    { id: 'q10_3', name: 'Bệnh viện Nhi Đồng 1', address: '341 Sư Vạn Hạnh, Q.10', lat: 10.7685, lng: 106.6713 },
    { id: 'q10_4', name: 'Big C Miền Đông', address: '268 Tô Hiến Thành, Q.10', lat: 10.7788, lng: 106.6667 },

    // === KHÁC ===
    { id: 'bt_1', name: 'Landmark 81', address: '720A Điện Biên Phủ, Bình Thạnh', lat: 10.7958, lng: 106.7219 },
    { id: 'tb_1', name: 'Sân bay Tân Sơn Nhất', address: 'Đường Trường Sơn, Tân Bình', lat: 10.8185, lng: 106.6588 },
];