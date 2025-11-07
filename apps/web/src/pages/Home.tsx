import React from "react";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import CategoryButton from "../components/CategoryButton";
import HomeHeroImg from "../assets/img/HomeHeroImg.png" 
import HomePromoImg from "../assets/img/HomePromoImg.png"
import HomeDeliImg from "../assets/img/HomeDeliImg.png"
import HomeProductCategory from "../assets/img/HomeProductCategory.jpg" 
import HomePayImg from "../assets/img/HomePayImg.png"

import styled from "styled-components";

// === TYPES ===
interface Product {
  name: string;
  price: number;
  image: string;
  category: string;
}

// === STYLED COMPONENTS ===

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
`
// === THÀNH PHẦN MỚI: HERO WRAPPER ===
const HeroWrapper = styled.div`
    background-color: white;
    box-shadow: 0 30px 60px rgba(247, 45, 87, 0.15);
    margin: 50px 0 40px 0;
    z-index: 10;
    position: relative;
    border-radius: 60%;
    padding: 50px;
`;
// ===================================
const HeroTextWrap = styled.section`
  display: flex;
  align-content:center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
`
const HeroHeading = styled.h1`
  font-size: 80px;
  margin-bottom: 20px;
  font-family: 'MilestoneScript', cursive;
  font-weight: normal;
  //letter-spacing: 4px;
` 
const HeroImg = styled.img`
  max-width: 400px; 
  height: auto;
`

//Category Section
const CategorySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 30px;
  margin: 80px 100px 0 100px;
`
const CategoryHeading = styled.h1`
  font-size: 80px;
  letter-spacing: 4px;
  color: #3F3F3F;
  margin-bottom: 30px;
  font-family: 'MilestoneScript', cursive;
  font-weight: normal;
`
const HighlightedText = styled.span<{ $color: string, $fontSize: string }>`
    color: ${props => props.$color};
    font-size: ${props => props.$fontSize};
    font-family: 'MilestoneScript', cursive; 
    font-weight: normal; 
`

const CategoryButtonContainer = styled.div`
  display: flex;    
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
`

//Product Section
const ProductSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative; 
`

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
`

const PrevButton = styled(NavButton)` left: 0; `;
const NextButton = styled(NavButton)` right: 0; `;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
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
  padding: 0 40px;
  background-color: #F72D57;
  border-style: solid;
    border-color: #ffff;
    border-width: 50px 0;
    //overflow: hidden;
    position: relative;
  margin: 70px 0 70px 0;
`
const PromoTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 30px 0 50px 300px;
`
const PromoHeading = styled.h1`
  font-size: 2rem;
  margin: 15px 0 15px 0;
  color: white;
  font-size: 65px;
  letter-spacing: 4px;
  font-family: 'MilestoneScript', cursive;
  font-weight: normal;
`
const PromoText = styled.p`
  font-size: 1.1rem;
  color: #ede0e0;
`
const PromoImg = styled.img`
  max-width: 500px;
  height: auto;
  position: absolute;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
`

//Payment Section
const PaymentSection = styled.section`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 80px 50px;
`
const PayTextWrap = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const PayHeading = styled.h1`
  font-family: 'MilestoneScript', cursive; 
  font-weight: normal; 
  font-size: 65px;
  letter-spacing: 4px;
  color: #3F3F3F;
`
const PayText = styled.p``
const PayImg = styled.img`
  max-width: 450px;
`

//Deli Section
const DeliSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 80px 50px;
  `
const DeliTextWrap = styled.div`
  max-width: 700px;
`
const DeliImg = styled.img`
  max-width: 450px;
`
const DeliHeading = styled.h1`
  font-family: 'MilestoneScript', cursive; 
  font-weight: normal; 
  font-size: 65px;
  letter-spacing: 4px;
  color: #3F3F3F;
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
    const [activeCategory, setActiveCategory] = React.useState<string>("Pizzas");
    const [activeIndex, setActiveIndex] = React.useState(0);
    const categories = ["Pizzas", "Burgers", "Salads", "Combos"];
    const scrollRef = React.useRef<HTMLDivElement>(null); 
    
    const ITEM_WIDTH = 300; 
    const ITEMS_PER_PAGE = 3; 
    
    const filteredProducts = products.filter(
        product => product.category === activeCategory
    );
    
    // Tính tổng số trang
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE); 

    // Hàm xử lý click
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

            {/* Hero Section */}
            <HeroWrapper>
            <HeroSection>
                <HeroTextWrap>
                    <HeroHeading>
                        <HighlightedText $color="#f72d57" $fontSize="80px">Nhanh </HighlightedText> như chớp,
                        <HighlightedText $color="#f72d57" $fontSize="80px"> ngon </HighlightedText> bất ngờ.
                    </HeroHeading>
                    <Button to='/restaurants' $fontSize="30px">Đặt ngay</Button>
                </HeroTextWrap>
                <HeroImg src={HomeHeroImg} alt="Hero Image" /> 
            </HeroSection>
            </HeroWrapper>
            
            {/* Category Section */}
            <CategorySection>
                <CategoryHeading>
                  <HighlightedText $color="#f72d57" $fontSize="80px">Món ngon</HighlightedText> cho bạn
                </CategoryHeading>
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

            {/* Product Section */}
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
                  <HighlightedText $color="#f72d57" $fontSize="80px">Thanh toán </HighlightedText> dễ dàng
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
                        Giao hàng <HighlightedText $color="#f72d57" $fontSize="80px">hoả tốc</HighlightedText>
                    </DeliHeading>
                    <DeliText>
                        Thèm là có, đói là giao! Khám phá vô vàn món ngon quanh bạn và đặt hàng chỉ với vài thao tác đơn giản. Chúng tôi sẽ mang bữa ăn nóng hổi, trọn vị đến tận tay bạn một cách nhanh nhất. Mở app và chọn món ngay thôi!
                    </DeliText>
                </DeliTextWrap>
            </DeliSection>
        </HomeContainer>
    );
}
