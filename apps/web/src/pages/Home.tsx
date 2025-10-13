import React from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CategoryButton from "../components/CategoryButton";
// Tạm thời dùng placeholder cho ảnh để code chạy ổn định
import HomeHeroImg from "../assets/img/HomeHeroImg.png" 
import HomePromoImg from "../assets/img/HomePromoImg.png"
import HomeDeliImg from "../assets/img/HomeDeliImg.png"
import HomeProductCategory from "../assets/img/HomeProductCategory.jpg" 

import styled from "styled-components";

// === TYPES ===
interface Product {
  name: string;
  price: number;
  image: string;
  category: string;
}

// === STYLED COMPONENTS ===

const HomeContainer = styled.div`/* toàn trang */
  min-height: 100vh;
  background-color: #f9fafb;
` 
const HeroSection = styled.section` 
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 40px;
`
const HeroTextWrap = styled.section`
  display: flex;
  align-content:center;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-right: 20px;
`
const HeroHeading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
` 
const HeroImg = styled.img`
  max-width: 400px; 
  height: auto;
`

const CategorySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0;
  background-color: pink;
`
const CategoryHeading = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`
const CategoryButtonContainer = styled.div`
  display: flex;    
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
`

const ProductSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  position: relative; 
`;

const ProductGrid = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 20px;
  padding-bottom: 20px; 
  
  & > * {
    flex: 0 0 280px;
    max-width: 300px;
  }
  
  /* CSS TÙY CHỈNH CHO SCROLLBAR TRÊN WEBKIT */
  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #f72d57; border-radius: 10px; border: 2px solid #f1f1f1; }
  &::-webkit-scrollbar-thumb:hover { background: #e31b45; }
`;

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
`;

const PrevButton = styled(NavButton)` left: 0; `;
const NextButton = styled(NavButton)` right: 0; `;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
`;

const Dot = styled.div<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#f72d57' : '#ccc'};
  cursor: pointer;
  transition: background-color 0.3s;
`;

const PromoSection = styled.section`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 80px 40px;
  background-color: #fff;
`
const PromoTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
`
const PromoHeading = styled.h1`
  font-size: 2rem;
  margin-bottom: 15px;
`
const PromoText = styled.p`
  font-size: 1.1rem;
  color: #555;
`
const PromoImg = styled.img`
  max-width: 400px;
  height: auto;
`
const DeliSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: pink;
  padding: 80px 40px;
`
const DeliTextWrap = styled.div`
  max-width: 600px;
  padding-left: 70px;
`
const DeliImg = styled.img`
  max-width: 400px;
`
const DeliHeading = styled.h1`
  font-size: 2rem;
  margin-bottom: 15px;
`
const DeliText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: #333;
`
// === PRODUCTS DATA ===
const products: Product[] = [
    { name: "Pepperoni Pizza", price: 11.99, image: HomeProductCategory, category: "Pizzas", },
    { name: "Vegetarian Pizza", price: 15.99, image: HomeProductCategory, category: "Pizzas", },
    { name: "Deluxe Pizza", price: 17.99, image: HomeProductCategory, category: "Pizzas", },
    { name: "Mushroom Pizza", price: 13.99, image: HomeProductCategory, category: "Pizzas", },
    { name: "Seafood Pizza", price: 20.99, image: HomeProductCategory, category: "Pizzas", },
    { name: "Cheeseburger", price: 9.99, image: HomeProductCategory, category: "Burgers", },
    { name: "Spicy Burger", price: 10.99, image: HomeProductCategory, category: "Burgers", },
    { name: "Caesar Salad", price: 8.50, image: HomeProductCategory, category: "Salads", },
    { name: "Cobb Salad", price: 12.50, image: HomeProductCategory, category: "Salads", },
    { name: "Combo Pizza & Coke", price: 19.99, image: HomeProductCategory, category: "Combos", },
    { name: "Combo Burger & Fries", price: 14.99, image: HomeProductCategory, category: "Combos", },
];
// =========================================================================================

export default function Home() {
    // === KHAI BÁO STATE VÀ REF CHỈ MỘT LẦN ===
    const [activeCategory, setActiveCategory] = React.useState<string>("Pizzas");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const categories = ["Pizzas", "Burgers", "Salads", "Combos"];
    const scrollRef = React.useRef<HTMLDivElement>(null); 
    
    const ITEM_WIDTH = 300; 
    const ITEMS_PER_PAGE = 3; 
    
    const filteredProducts = products.filter(
        product => product.category === activeCategory
    );
    
    // Tính toán tổng số trang
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE); 

    // === HÀM XỬ LÝ CLICK ===
    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        setActiveIndex(0); // Reset index khi đổi danh mục
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
    // ===================================

    return (
        <HomeContainer>
            <Header />

            {/* Hero Section */}
            <HeroSection>
                <HeroTextWrap>
                    <HeroHeading>
                        FoodFast: Nhanh như chớp, ngon bất ngờ.
                    </HeroHeading>
                    <Button>Đặt ngay</Button>
                </HeroTextWrap>
                
                <HeroImg src={HomeHeroImg} alt="Hero Image" /> 
            </HeroSection>
            
            {/* Category Section */}
            <CategorySection>
                <CategoryHeading>Món ngon cho bạn</CategoryHeading>
                <CategoryButtonContainer>
                    {categories.map(cat => (
                        <CategoryButton
                            key={cat}
                            name={cat}
                            isActive={activeCategory === cat}
                            onClick={() => handleCategoryClick(cat)}
                        />
                    ))}
                </CategoryButtonContainer>
            </CategorySection>

            {/* Product Section: Slider/Scroll ngang */}
            <ProductSection>
                {/* JSX cho nút Prev/Next */}
                {filteredProducts.length > ITEMS_PER_PAGE && (
                    <PrevButton onClick={() => scroll('left')}>{'<'}</PrevButton>
                )}
                
                <ProductGrid ref={scrollRef}>
                    {filteredProducts.map((p, i) => (
                        <ProductCard
                            key={i}
                            name={p.name}
                            price={p.price}
                            image={p.image}
                            onAddToCart={() => { console.log(`Added ${p.name} to cart`); }}
                        />
                    ))}
                </ProductGrid>
                
                {filteredProducts.length > ITEMS_PER_PAGE && (
                    <NextButton onClick={() => scroll('right')}>{'>'}</NextButton>
                )}

                {/* JSX cho chấm tròn */}
                {filteredProducts.length > ITEMS_PER_PAGE && (
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
            </ProductSection>

            {/* Promo Section */}
            <PromoSection>
                <PromoImg src={HomePromoImg} alt="Promo Burger" />
                <PromoTextWrap>
                    <PromoHeading>
                        Đừng bỏ lỡ ưu đãi cực khủng cho món bạn yêu thích.
                    </PromoHeading>
                    <PromoText>
                        Đăng ký liền tay để tận hưởng món khoái khẩu ở bất cứ đâu, bất cứ khi nào bạn muốn. Nhanh chóng, đơn giản và dành cho tất cả mọi người. Miễn phí! Thưởng thức ngay - giải pháp hoàn hảo cho mỗi bữa ăn của bạn.
                    </PromoText>
                </PromoTextWrap>
            </PromoSection>

            {/* Deli Section */}
            <DeliSection>
                <DeliTextWrap>
                    <DeliHeading>
                        Giao Hàng Hoả Tốc
                    </DeliHeading>
                    <DeliText>
                        Thèm là có, đói là giao! Khám phá vô vàn món ngon quanh bạn và đặt hàng chỉ với vài thao tác đơn giản. Chúng tôi sẽ mang bữa ăn nóng hổi, trọn vị đến tận tay bạn một cách nhanh nhất. Mở app và chọn món ngay thôi!
                    </DeliText>
                    <Button>Alo 123</Button>
                </DeliTextWrap>

                <DeliImg src={HomeDeliImg} alt="Delivery Moto" />
            </DeliSection>

            {/* Footer */}
            <Footer />
        </HomeContainer>
    );
}
