import React from 'react';
import Footer from "../components/Footer";
import Header from '../components/Header';
import styled from 'styled-components';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCard from '../components/CategoryCard'; 

import { mockRestaurants, mockCategories } from '../data/mockData'; // <-- IMPORT mock data


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
`;

const ContentWrapper = styled.div`
  /* Căn giữa nội dung và giới hạn chiều rộng trang */
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 20px;
  
`;

// Container cho Tiêu đề và Context
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
  margin-bottom: 80px;
`;


// ==========================================================
// 3. COMPONENT CHÍNH
// ==========================================================

const RestaurantList = () => {
    // 1. STATE QUẢN LÝ DANH MỤC ĐANG HOẠT ĐỘNG
    // Đặt mặc định là danh mục đầu tiên
    const [activeCategory, setActiveCategory] = React.useState(mockCategories[0].name);

    // 2. Logic lọc quán ăn theo danh mục
    // Sau này khi có dữ liệu thật, có thể dùng:
    // const filteredRestaurants = mockRestaurants.filter(r => r.category === activeCategory);

    const filteredRestaurants = React.useMemo(() => {
        // KIỂM TRA TRƯỜNG HỢP "TẤT CẢ"
        if (activeCategory === "All") {
            return mockRestaurants; // Trả về toàn bộ danh sách
        }
        
        // TRƯỜNG HỢP LỌC theo danh mục cụ thể
        return mockRestaurants.filter(restaurant => {
            // So sánh category của quán ăn với activeCategory
            return restaurant.category.toLowerCase() === activeCategory.toLowerCase();
        });
    }, [activeCategory]); // Dependency Array: Chỉ chạy lại khi activeCategory thay đổi

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
        
        {/* KHU VỰC DANH SÁCH QUÁN ĂN ĐÃ Lọc theo danh mục*/}
        <RestaurantGrid>
        
          {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map(restaurant => (
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
                        ))
                    ) : (
                        <p>Không tìm thấy quán ăn nào trong danh mục "{activeCategory}".</p>
                    )}
        </RestaurantGrid>
      </ContentWrapper>

        <Footer />
     </ListPageContainer>
  );
};

export default RestaurantList;