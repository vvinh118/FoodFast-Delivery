import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import RestaurantCard from '../components/RestaurantCard';
import CategoryButton from '../components/CategoryButton';
import HomeHeroImg from '../assets/img/HomeHeroImg.png' 
import HomePromoImg from '../assets/img/HomePromoImg.png'
import HomeDeliImg from '../assets/img/HomeDeliImg.png'
import HomePayImg from '../assets/img/HomePayImg.png'
import styled from "styled-components";
import { fetchRestaurants } from '../services/api';
import type { Restaurant } from 'core';


// ==========================================================
// STYLED COMPONENTS (ĐÃ THÊM MEDIA QUERIES)
// ==========================================================

//toàn trang
const HomeContainer = styled.div` 
  background-color: #f9f9f9;
` 
//Hero Section
const HeroSection = styled.section` 
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 40px;


  @media (max-width: 768px) {
    flex-direction: column-reverse; /* Đưa ảnh lên trên, text xuống dưới */
    padding: 20px;
  }
`
const HeroWrapper = styled.div`
    background-color: white;
    box-shadow: 0 30px 60px rgba(247, 45, 87, 0.15);
    margin: 50px 0 40px 0;
    z-index: 10;
    position: relative;
    border-radius: 60%;
    padding: 50px;


    @media (max-width: 768px) {
        margin: 20px;
        padding: 30px;
        border-radius: 20px;
    }
`;
const HeroTextWrap = styled.section`
  display: flex;
  align-content:center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 20px;


  @media (max-width: 768px) {
    padding-right: 0;
    text-align: center;
  }
`
const HeroHeading = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #3F3F3F;

  /* SỬA: Giảm size chữ */
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
` 
const HeroImg = styled.img`
  max-width: 400px; 
  height: auto;

  /* SỬA: Giảm kích thước ảnh */
  @media (max-width: 768px) {
    max-width: 300px; 
    margin-bottom: 20px;
  }
`

//Category Section
const CategorySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 30px;
  margin: 80px 100px 0 100px;

  /* SỬA: Giảm margin */
  @media (max-width: 768px) {
    margin: 40px 20px 0 20px;
  }
`
const CategoryHeading = styled.h1`
  font-size: 80px;
  letter-spacing: 4px;
  color: #3F3F3F;
  margin-bottom: 30px;
  font-family: 'MilestoneScript', cursive;
  font-weight: normal;


  @media (max-width: 768px) {
    font-size: 50px;
    text-align: center;
    line-height: 1.2;
  }
`

const HighlightedText = styled.span<{ $color: string }>`
    color: ${props => props.$color};
    font-family: 'MilestoneScript', cursive; 
    font-weight: normal; 
`

const CategoryButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;

`


const RestaurantSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative; 
  min-height: 300px; 

  @media (max-width: 768px) {
    padding: 20px 0; /* Cho phép slider chạy full-width */
  }
`

const RestaurantGrid = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 20px;
  padding-bottom: 20px; 
  
  /* SỬA: Thêm padding 2 bên cho mobile */
  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
    /* Ẩn thanh cuộn trên mobile (nhưng vẫn cuộn được) */
    &::-webkit-scrollbar { display: none; }
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE */
  }

  & > * {
    flex: 0 0 280px;
    max-width: 300px;
  }
  
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #f72d57; border-radius: 10px; border: 2px solid #f1f1f1; }
  &::-webkit-scrollbar-thumb:hover { background: #e31b45; }
`

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f72d57;
    color: white;
  }

  /* SỬA: Ẩn nút bấm trên mobile */
  @media (max-width: 768px) {
    display: none;
  }
`
const PrevButton = styled(NavButton)` left: 0; `;
const NextButton = styled(NavButton)` right: 0; `;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;

  /* SỬA: Ẩn dấu chấm trên mobile */
  @media (max-width: 768px) {
    display: none;
  }
`

const Dot = styled.div<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#f72d57' : '#ccc'};
  cursor: pointer;
  transition: background-color 0.3s;
`


//Promo Section
const PromoSection = styled.section`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 30px;
  background-color: #F72D57;
  border-style: solid;
  border-color: #ffff;
  border-width: 50px 0;
  margin: 70px 0 70px 0;

  /* SỬA: Chuyển layout dọc, giảm padding/margin/border */
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px 20px;
    margin: 40px 0;
    border-width: 20px 0;
  }
`
const PromoTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;

  /* SỬA: Căn giữa, text nằm dưới ảnh */
  @media (max-width: 768px) {
    text-align: center;
    order: 2; /* Đặt text ở dưới */
  }
`
const PromoHeading = styled.h1`
  font-size: 2rem;
  margin: 15px 0 15px 0;
  color: white;
  font-size: 65px;
  letter-spacing: 4px;
  font-family: 'MilestoneScript', cursive;
  font-weight: normal;

  /* SỬA: Giảm size chữ */
  @media (max-width: 768px) {
    font-size: 40px;
  }
`
const PromoText = styled.p`
  font-size: 1.1rem;
  color: #ede0e0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
const PromoImg = styled.img`
  max-width: 500px;
  height: auto;

  /* SỬA: Giảm size, text nằm trên */
  @media (max-width: 768px) {
    max-width: 300px;
    order: 1; /* Đặt ảnh ở trên */
    margin-bottom: 20px;
  }
`

//Payment Section
const PaymentSection = styled.section`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 80px 50px;

  /* SỬA: Chuyển layout dọc, giảm margin */
  @media (max-width: 768px) {
    flex-direction: column-reverse; /* Text lên trên */
    margin: 40px 20px;
  }
`
const PayTextWrap = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  /* SỬA: Căn giữa */
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`
const PayHeading = styled.h1`
  font-family: 'MilestoneScript', cursive; 
  font-weight: normal; 
  font-size: 65px;
  letter-spacing: 4px;
  color: #3F3F3F;

  /* SỬA: Giảm size */
  @media (max-width: 768px) {
    font-size: 40px;
  }
`
const PayText = styled.p``
const PayImg = styled.img`
  max-width: 450px;

  /* SỬA: Giảm size */
  @media (max-width: 768px) {
    max-width: 300px;
    margin-bottom: 20px;
  }
`

//Deli Section
const DeliSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 80px 50px;

  /* SỬA: Chuyển layout dọc, giảm margin */
  @media (max-width: 768px) {
    flex-direction: column; /* Ảnh lên trên */
    margin: 40px 20px;
  }
`
const DeliTextWrap = styled.div`
  max-width: 700px;

  /* SỬA: Căn giữa */
  @media (max-width: 768px) {
    text-align: center;
    align-items: center;
  }
`
const DeliImg = styled.img`
  max-width: 450px;

  /* SỬA: Giảm size */
  @media (max-width: 768px) {
    max-width: 300px;
    margin-bottom: 20px;
  }
`
const DeliHeading = styled.h1`
  font-family: 'MilestoneScript', cursive; 
  font-weight: normal; 
  font-size: 65px;
  letter-spacing: 4px;
  color: #3F3F3F;

  /* SỬA: Giảm size */
  @media (max-width: 768px) {
    font-size: 40px;
  }
`
const DeliText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #333;
`


// danh sách danh mục nổi bật tượng trưng
const symbolicCategories = ["Gà", "Cơm", "Trà Sữa", "Bánh", "Kem"];


// ==========================================================
// COMPONENT CHÍNH
// ==========================================================
export default function Home() {
    // ... (Toàn bộ logic state, useEffect, useMemo... của bạn giữ nguyên)
    const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = React.useState<string>(symbolicCategories[0]); 
    const [activeIndex, setActiveIndex] = React.useState(0);
    const scrollRef = React.useRef<HTMLDivElement>(null); 
    const ITEM_WIDTH = 300; 
    const ITEMS_PER_PAGE = 3; 
    const filteredRestaurants = React.useMemo(() => {
        return allRestaurants.filter(
            restaurant => restaurant.category === activeCategory
        );
    }, [activeCategory, allRestaurants]); 
    const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE); 
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const restaurantsData = await fetchRestaurants();
                setAllRestaurants(restaurantsData as Restaurant[]);
            } catch (err) {
                setError('Không thể tải dữ liệu trang chủ. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []); 
    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        setActiveIndex(0); 
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
        }
    };
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
          const scrollAmount = ITEM_WIDTH * ITEMS_PER_PAGE;
          let newIndex = activeIndex;
          if (direction === 'left') {
            scrollRef.current.scrollLeft -= scrollAmount;
            newIndex = Math.max(0, activeIndex - 1);
          } else {
            scrollRef.current.scrollLeft += scrollAmount;
            newIndex = Math.min(totalPages - 1, activeIndex + 1);
          }
          setActiveIndex(newIndex);
        }
    };
    const jumpToPage = (index: number) => {
        if (scrollRef.current) {
            const scrollAmount = ITEM_WIDTH * ITEMS_PER_PAGE * index;
            scrollRef.current.scrollLeft = scrollAmount;
            setActiveIndex(index);
        }
    };


    return (
        <HomeContainer>

            {/* Hero Section */}
            <HeroWrapper>
            <HeroSection>
                <HeroTextWrap>
                    <HeroHeading>
                        Nhanh như chớp, ngon bất ngờ!
                    </HeroHeading>
                    <Button to='/restaurants' $fontSize="20px">Đặt ngay</Button>
                </HeroTextWrap>
                <HeroImg src={HomeHeroImg} alt="Hero Image" /> 
            </HeroSection>
            </HeroWrapper>
            
            {/* Category Section */}
            <CategorySection>
                <CategoryHeading>
                  <HighlightedText $color="#f72d57">Món ngon</HighlightedText> cho bạn
                </CategoryHeading>
                <CategoryButtonContainer>
                    {symbolicCategories.map(catName => (
                        <CategoryButton
                            key={catName}
                            name={catName}
                            isActive={activeCategory === catName}
                            onClick={() => handleCategoryClick(catName)}
                        />
                    ))}
                </CategoryButtonContainer>
            </CategorySection>

            {/* RestaurantSection */}
            <RestaurantSection>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <h2>Đang tải nhà hàng...</h2>
                    </div>
                )}
                {error && (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                        <h2>{error}</h2>
                    </div>
                )}
                {!loading && !error && (
                    <>
                        {filteredRestaurants.length > ITEMS_PER_PAGE && (
                            <PrevButton onClick={() => scroll('left')}>{'<'}</PrevButton>
                        )}
                        
                        <RestaurantGrid ref={scrollRef}>
                            {filteredRestaurants.map((r) => (
                                <RestaurantCard 
                                    key={r.id} 
                                    {...r} 
                                />
                            ))}
                        </RestaurantGrid>
                        
                        {filteredRestaurants.length > ITEMS_PER_PAGE && (
                            <NextButton onClick={() => scroll('right')}>{'>'}</NextButton>
                        )}

                        {filteredRestaurants.length > ITEMS_PER_PAGE && (
                            <DotsContainer>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <Dot 
                                        key={index}
                                        $isActive={index === activeIndex}
                                        onClick={() => jumpToPage(index)}
                                    />
                                ))}
                            </DotsContainer>
                        )}
                        
                        {filteredRestaurants.length === 0 && (
                            <p style={{textAlign: 'center', padding: '20px'}}>
                                Không có nhà hàng nào thuộc danh mục "{activeCategory}".
                            </p>
                        )}
                    </>
                )}
            </RestaurantSection>


            {/* Promo Section */}
            <PromoSection>
                <PromoImg src={HomePromoImg} alt="Promo Burger" />
                <PromoTextWrap>
                    <PromoHeading>
                        Ưu đãi cực khủng
                    </PromoHeading>
                    <PromoText>
                        Đăng ký liền tay để tận hưởng món khoái khẩu ở bất cứ đâu, bất cứ khi nào bạn muốn. Nhanh chóng, đơn giản và dành cho tất cả mọi người. Miễn phí! 
                        <br />Thưởng thức ngay - giải pháp hoàn hảo cho mỗi bữa ăn của bạn.
                    </PromoText>
                </PromoTextWrap>
            </PromoSection>
            
            {/* Payment Section */}
            <PaymentSection>
              <PayTextWrap>
                <PayHeading>
                  <HighlightedText $color="#f72d57">Thanh toán </HighlightedText> dễ dàng
                </PayHeading>
                <PayText>
                  Đừng để việc thanh toán phức tạp làm gián đoạn trải nghiệm ẩm thực của bạn. Với quy trình được tối ưu hóa, bạn chỉ cần một vài cú chạm để hoàn tất đơn hàng. Nhanh chóng, mượt mà và không rườm rà – để bạn có thêm thời gian tận hưởng món ngon.
                </PayText>
              </PayTextWrap>
              <PayImg src={HomePayImg}></PayImg>
            </PaymentSection>
            
            {/* Deli Section */}
            <DeliSection>
                <DeliImg src={HomeDeliImg} alt="Delivery Moto" />
                <DeliTextWrap>
                    <DeliHeading>
                        Giao hàng <HighlightedText $color="#f72d57">hoả tốc</HighlightedText>
                    </DeliHeading>
                    <DeliText>
                        Thèm là có, đói là giao! Khám phá vô vàn món ngon quanh bạn và đặt hàng chỉ với vài thao tác đơn giản. Chúng tôi sẽ mang bữa ăn nóng hổi, trọn vị đến tận tay bạn một cách nhanh nhất. Mở app và chọn món ngay thôi!
                    </DeliText>
                </DeliTextWrap>
            </DeliSection>

        </HomeContainer>
    );
}