import React from 'react';
import Footer from "../components/Footer";
import Header from '../components/Header';
import styled from 'styled-components';
import RestaurantCard from '../components/RestaurantCard'; // Import component đã tạo
import CategoryCard from '../components/CategoryCard'; 
import chickenIcon from '../assets/icons/chicken.png';
// Import các icon


// ==========================================================
// MOCK DATA (Dữ liệu giả để hiển thị giao diện)
// ==========================================================

const mockRestaurants = [
  { 
    id: 1, 
    name: "Nem Nướng D'yan - Since 1968", 
    address: "Lẩu & Nướng - Quay", 
    rating: 4.7, 
    distance: 2.9, 
    deliveryTime: 25,
    imageUrl: "https://trumfood.vn/wp-content/uploads/2023/01/nem-nuong-thom-ngon-Trum-Food.jpg",
    isPromo: true 
  },
  { 
    id: 2, 
    name: "3 Râu - Gà Rán Pizza & Trà Sữa", 
    address: "191 Nguyễn Tiểu La", 
    rating: 4.5, 
    distance: 2.2, 
    deliveryTime: 20,
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.4o98zuIor0zIGSloJFZ_DAHaEo?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    isPromo: true 
  },
  { 
    id: 3, 
    name: "Mì Trộn Indomie, Gà Rán", 
    address: "Tráng miệng, Trà sữa", 
    rating: 4.7, 
    distance: 2.3, 
    deliveryTime: 30,
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.g349_sKPS2INyrS8vSgLlQHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    isPromo: false 
  },
  { 
    id: 4, 
    name: "Xôi Mặn - Bánh Bao Trường Sơn", 
    address: "Bánh Mì, Xôi, Thức ăn nhanh", 
    rating: 4.6, 
    distance: 0.8, 
    deliveryTime: 15,
    imageUrl: "https://tse2.mm.bing.net/th/id/OIP.WnQXS6zgCF0nFxumjcgNXgHaFT?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
    isPromo: true 
  },
  { 
      id: 5, 
      name: "Cơm Gà Xối Mỡ - Chú Tư", 
      address: "Món Việt, Cơm trưa văn phòng", 
      rating: 4.8, 
      distance: 3.5, 
      deliveryTime: 35,
      imageUrl: "https://cdn.xanhsm.com/2025/01/735df340-com-ga-sai-gon-1.jpg",
      isPromo: false 
    },
    { 
      id: 6, 
      name: "Trà Sữa Cheese Bông - Hot Trend", 
      address: "Trà sữa, Đồ uống", 
      rating: 4.9, 
      distance: 1.1, 
      deliveryTime: 15,
      imageUrl: "https://tse4.mm.bing.net/th/id/OIP.71cGG9HIkYC_9s-FRLkwTQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      isPromo: true 
    },
    { 
      id: 7, 
      name: "Bún Chả Hà Nội - 120 Năm", 
      address: "Món Bắc, Bún Phở", 
      rating: 4.4, 
      distance: 5.1, 
      deliveryTime: 40,
      imageUrl: "https://th.bing.com/th/id/R.5f68ed218aa0a6e668bb92ce7a0360f2?rik=3RCuYcDLAO4MqQ&pid=ImgRaw&r=0",
      isPromo: false 
    },
    { 
      id: 8, 
      name: "Pizza & Pasta Ý - VV", 
      address: "Pizza, Món Tây", 
      rating: 4.3, 
      distance: 0.5, 
      deliveryTime: 20,
      imageUrl: "https://img1.wsimg.com/isteam/stock/2982",
      isPromo: true 
    },
  // Thêm nhiều món ăn hơn để kiểm tra giao diện lưới
];

// DỮ LIỆU GIẢ CHO DANH MỤC MÓN ĂN
const mockCategories = [
    { name: "Gà", iconUrl: chickenIcon },
    { name: "Cơm", iconUrl: "https://via.placeholder.com/50/00FF00?text=C" },
    { name: "Trà Sữa", iconUrl: "https://via.placeholder.com/50/0000FF?text=T" },
    { name: "Bún", iconUrl: "https://via.placeholder.com/50/FFA500?text=B" },
    { name: "Mì", iconUrl: "https://via.placeholder.com/50/800080?text=M" },
    { name: "Ăn vặt", iconUrl: "https://via.placeholder.com/50/00CED1?text=A" },
    { name: "Đồ chay", iconUrl: "https://via.placeholder.com/50/F08080?text=DC" },
    { name: "Bánh", iconUrl: "https://via.placeholder.com/50/4682B4?text=B" },
    { name: "Lẩu", iconUrl: "https://via.placeholder.com/50/B8860B?text=L" },
    { name: "Kem", iconUrl: "https://via.placeholder.com/50/CD5C5C?text=K" },
];

// ==========================================================
// 2. STYLED COMPONENTS (Định kiểu cho Trang)
// ==========================================================

// Container cho toàn bộ thanh danh mục (có thể bị tràn)
const CategoryBarWrapper = styled.div`
  max-width: 1200px; /* Chiều rộng tối đa giống ContentWrapper */
  margin: 0 auto;
  padding: 20px 0;
  overflow-x: scroll; /* Kích hoạt cuộn ngang */
  white-space: nowrap; /* Ngăn các item xuống dòng */
  -ms-overflow-style: none; /* Ẩn scrollbar trên IE/Edge */
  scrollbar-width: none; /* Ẩn scrollbar trên Firefox */
  
  /* Ẩn scrollbar trên Chrome/Safari/Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Container chứa các card danh mục
const CategoryListContainer = styled.div`
  display: flex;
  gap: 15px; /* Khoảng cách giữa các card */
  padding: 0 20px;
`;

const ListPageContainer = styled.div`
  min-height: 100vh;
  padding-bottom: 50px; /* Để Footer không che mất nội dung */
`;

const ContentWrapper = styled.div`
  /* Căn giữa nội dung và giới hạn chiều rộng trang */
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 20px;
`;

// Container cho Tiêu đề và Context (Giống phần "Ưu đãi ở..." trong ảnh)
const ContextHeader = styled.div`
  padding: 20px 0;
`;

const Breadcrumb = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
`;

const ListTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0;
  color: #333;
`;

// Lưới Quán ăn (Sử dụng CSS Grid để tạo bố cục 4 cột)
const RestaurantGrid = styled.div`
  display: grid;
  /* Tạo 4 cột có kích thước bằng nhau và linh hoạt (1fr) */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 30px; /* Khoảng cách giữa các thẻ */
  margin-top: 20px;
`;


// ==========================================================
// 3. COMPONENT CHÍNH
// ==========================================================

const RestaurantList = () => {
    // B2: STATE QUẢN LÝ DANH MỤC ĐANG HOẠT ĐỘNG
    // Đặt mặc định là danh mục đầu tiên
    const [activeCategory, setActiveCategory] = React.useState(mockCategories[0].name);
  return (
     <ListPageContainer>
        < Header />
      
      {/* B3: KHU VỰC THANH DANH MỤC CUỘN NGANG */}
            <CategoryBarWrapper>
                <CategoryListContainer>
                    {mockCategories.map((category) => (
                        <CategoryCard
                            key={category.name}
                            name={category.name}
                            iconUrl={category.iconUrl}
                            $isActive={activeCategory === category.name}
                            onClick={() => setActiveCategory(category.name)}
                        />
                    ))}
                </CategoryListContainer>
            </CategoryBarWrapper>
            {/* KẾT THÚC KHU VỰC CATEGORY BAR */}



      <ContentWrapper>
        {/* KHU VỰC TIÊU ĐỀ/CONTEXT */}
        <ContextHeader>
          <Breadcrumb>Trang chủ &gt; Nhà hàng</Breadcrumb>
          <ListTitle>
            Món ngon gần bạn (Danh mục: {activeCategory})
          </ListTitle>
        </ContextHeader>
        
        {/* KHU VỰC DANH SÁCH QUÁN ĂN */}
        <RestaurantGrid>
        
          {mockRestaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              address={restaurant.address}
              rating={restaurant.rating}
              distance={restaurant.distance}
              deliveryTime={restaurant.deliveryTime}
              imageUrl={restaurant.imageUrl}
              isPromo={restaurant.isPromo}
            />
          ))}
        </RestaurantGrid>
      </ContentWrapper>

        <Footer />
     </ListPageContainer>
  );
};

export default RestaurantList;