import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCard from '../components/CategoryCard'; 
import type { Restaurant, Category} from 'core';
import { fetchRestaurants, fetchCategories  } from 'core';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// === STYLED COMPONENTS ===

const ListPageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const ContentWrapper = styled.div`
  max-width: 1200px; 
  margin: 0 auto;
  padding: 0 20px;
  min-height: 60vh; 
`;

// --- CATEGORY BAR ---
const CategoryBarWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
  overflow-x: auto; /* Cho phép cuộn ngang */
  white-space: nowrap;
  -webkit-overflow-scrolling: touch; /* Mượt mà trên iOS */
  
  /* Ẩn thanh cuộn nhưng vẫn cuộn được */
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryListContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 0 20px; /* Padding để không bị cắt bóng đổ ở 2 đầu */
`;

// --- HEADER & BREADCRUMB ---
const ContextHeader = styled.div`
  padding: 30px 0 20px;
`;

const Breadcrumb = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
`;

const ListTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// --- RESTAURANT GRID (RESPONSIVE) ---
const RestaurantGrid = styled.div`
  display: grid;
  /* Tự động chia cột: Tối thiểu 280px, nếu không đủ chỗ thì rớt dòng */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
  gap: 30px;
  margin-top: 20px;
  margin-bottom: 60px;

  /* Mobile: Giảm khoảng cách để tiết kiệm diện tích */
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1 cột duy nhất trên điện thoại nhỏ */
    gap: 20px;
  }
`;

// --- PAGINATION CONTROLS (PHÂN TRANG) ---
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 80px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.$active ? '#000000ff' : '#ddd'};
  background-color: ${props => props.$active ? '#000000ff' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? '#d61c43' : '#f9f9f9'};
    border-color: #f72d57;
    color: ${props => props.$active ? 'white' : '#f72d57'};
  }

  &:disabled {
    background-color: #f0f0f0;
    border-color: #eee;
    color: #ccc;
    cursor: not-allowed;
  }
`;
const PageInfo = styled.span`
  color: #666;
  font-size: 0.9rem;
`;


// === COMPONENT CHÍNH ===

const RestaurantList = () => {
    // State dữ liệu
    const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State điều hướng
    const [activeCategory, setActiveCategory] = useState("All");
    
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // 1. Fetch Dữ liệu
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [categoriesData, restaurantsData] = await Promise.all([
                    fetchCategories(),
                    fetchRestaurants()
                ]);
                
                setAllCategories(categoriesData as Category[]);
                
                // Lọc nhà hàng đang mở cửa
                const openRestaurants = (restaurantsData as Restaurant[]).filter(r => r.isAcceptingOrders !== false);
                setAllRestaurants(openRestaurants);
                
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
    }, []); 

    // 2. Reset về trang 1 khi đổi danh mục
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);


    // 3. Logic Lọc & Phân trang
    const filteredRestaurants = useMemo(() => {
        if (activeCategory === "All") {
            return allRestaurants;
        }
        return allRestaurants.filter(restaurant => 
            restaurant.category.toLowerCase() === activeCategory.toLowerCase()
        );
    }, [activeCategory, allRestaurants]);

    // Tính toán dữ liệu cho trang hiện tại
    const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentRestaurants = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
     <ListPageContainer>

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
            {/* 2. TIÊU ĐỀ */}
            <ContextHeader>
                <Breadcrumb>Trang chủ &gt; Nhà hàng</Breadcrumb>
                <ListTitle>
                    Món ngon gần bạn <span style={{color: '#f72d57', fontWeight: 'normal'}}>(Danh mục: {activeCategory})</span>
                </ListTitle>
                <p style={{color: '#666', marginTop: '5px'}}>
                    Tìm thấy {filteredRestaurants.length} kết quả
                </p>
            </ContextHeader>
            
      
            {loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>Đang tải danh sách nhà hàng...</h2>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <h2>{error}</h2>
                </div>
            )}

            {!loading && !error && (
                <>
                    <RestaurantGrid>
                        {currentRestaurants.length > 0 ? (
                            currentRestaurants.map(restaurant => (
                                <RestaurantCard 
                                    key={restaurant.id}
                                    {...restaurant} 
                                />
                            ))
                        ) : (
                            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888'}}>
                                <p>Không tìm thấy quán ăn nào trong danh mục "{activeCategory}".</p>
                            </div>
                        )}
                    </RestaurantGrid>

                    {filteredRestaurants.length > ITEMS_PER_PAGE && (
                        <PaginationContainer>
                            <PageButton 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </PageButton>

{Array.from({ length: totalPages }, (_, index) => (
                                <PageButton 
                                    key={index + 1}
                                    $active={currentPage === index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </PageButton>
                            ))}

                            <PageButton 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight />
                            </PageButton>
                        </PaginationContainer>
                    )}
                </>
            )}

        </ContentWrapper>
     </ListPageContainer>
  );
};

export default RestaurantList;