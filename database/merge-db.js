const fs = require('fs');
const path = require('path');

// 1. CẤU HÌNH ĐƯỜNG DẪN
const sourceFolder = path.join(__dirname, '');

// File đích db.json muốn tạo ra
const targetFile = path.join(__dirname, 'db.json'); 

console.log("Đang tiến hành gộp dữ liệu...");

try {
    // 2. ĐỌC DỮ LIỆU TỪ CÁC FILE CON
    const combinedData = {
        users: require(path.join(sourceFolder, 'users.json')),
        restaurants: require(path.join(sourceFolder, 'restaurants.json')),
        categories: require(path.join(sourceFolder, 'categories.json')),
        menuItems: require(path.join(sourceFolder, 'menuItems.json')),
        orders: require(path.join(sourceFolder, 'orders.json')),
    };

    // 3. KIỂM TRA THƯ MỤC ĐÍCH
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)){
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 4. GHI RA FILE db.json
    fs.writeFileSync(targetFile, JSON.stringify(combinedData, null, 2));

    console.log("THÀNH CÔNG! Đã tạo file tại:", targetFile);
    console.log("Bây giờ có thể chạy API với khả năng lưu dữ liệu.");

} catch (error) {
    console.error("LỖI: Không tìm thấy file nguồn hoặc sai đường dẫn.");
    console.error("Chi tiết:", error.message);
}