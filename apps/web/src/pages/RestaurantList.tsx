import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCard from '../components/CategoryCard'; 
import type { Restaurant, Category} from 'core';
import { fetchRestaurants, fetchCategories  } from 'core';

// Styled Components
const CategoryBarWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  overflow-x: scroll;
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryListContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 0 20px;
`;

const ListPageContainer = styled.div`
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 20px;
  /* Thêm: Chiều cao tối thiểu để Spinner hiển thị đẹp */
  min-height: 60vh; 
`;

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

const RestaurantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 30px;
  margin-top: 20px;
  margin-bottom: 80px;
`;

// Component chính

const RestaurantList = () => {
    // State cho API, Loading, Error
    const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeCategory, setActiveCategory] = useState("All");


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                

                const [categoriesData, restaurantsData] = await Promise.all([
                    fetchCategories(),
                    fetchRestaurants()
                ]);
                
                // Lưu dữ liệu thật vào state
                setAllCategories(categoriesData as Category[]);
                setAllRestaurants(restaurantsData as Restaurant[]);
                
                // Mặc định chọn category đầu tiên ("All")
                if (categoriesData && (categoriesData as Category[]).length > 0) {
                     setActiveCategory((categoriesData as Category[])[0].name);
                }

            } catch (err: any) {
                setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []); // [] = Chạy 1 lần duy nhất khi trang tải


    // Lọc nhà hàng theo category
    const filteredRestaurants = useMemo(() => {
        if (activeCategory === "All") {
            return allRestaurants;
        }
        
        return allRestaurants.filter(restaurant => { 
            return restaurant.category.toLowerCase() === activeCategory.toLowerCase();
        });
    }, [activeCategory, allRestaurants]);

  return (
     <ListPageContainer>

     {/* KHU VỰC THANH DANH MỤC */}
        <CategoryBarWrapper>
            <CategoryListContainer>
                {!loading && !error && allCategories.map((category) => (
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



     <ContentWrapper>
        {/* KHU VỰC TIÊU ĐỀ */}
        <ContextHeader>
          <Breadcrumb>Trang chủ &gt; Nhà hàng</Breadcrumb>
          <ListTitle>
            Món ngon gần bạn (Danh mục: {activeCategory})
          </ListTitle>
        </ContextHeader>
        
        {/* Xử lý Loading / Error */}

        {/* trạng thái đang tải */}
        {loading && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                {/* <LoadingSpinner /> */}
                <h2>Đang tải danh sách nhà hàng...</h2>
            </div>
        )}

        {/* Trạng thái lỗi */}
        {error && (
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <h2>{error}</h2>
            </div>
        )}

        {/* Trạng thái thành công */}
        {!loading && !error && (
            <RestaurantGrid>
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                        <RestaurantCard 
                            key={restaurant.id}
                            {...restaurant} 
                        />
                    ))
                ) : (
                    <p>Không tìm thấy quán ăn nào trong danh mục "{activeCategory}".</p>
                )}
            </RestaurantGrid>
        )}

     </ContentWrapper>

     </ListPageContainer>
  );
};

export default RestaurantList;