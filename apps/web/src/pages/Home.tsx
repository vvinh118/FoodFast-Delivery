import React from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CategoryButton from "../components/CategoryButton";
import styled from "styled-components";




const HomeContainer = styled.div`` //toàn trang

//Slogan+button+hình
const HeroSection = styled.section` 
  display: flex;
  justify-content: space-evenly;

`
//slogan+button
const HeroTextWrap = styled.section`
  display: flex;
  align-content:center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`


const Slogan = styled.h1`` 
const HeroImage = styled.img``

//Danh mục
const CategorySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  background-color: pink;
`

//khối button danh mục
const CategoryButtonContainer = styled.div`
  display: flex;    
  align-items: center;
  gap: 15px;
`
const CategoryDescribe = styled.h2``

//Khung Promo
const PromoSection = styled.section`
display: flex;
justify-content: space-evenly;
padding: 0 40px
`
//Khung chữ Promo
const PromoTextWrap = styled.div`
display: flex;
    flex-direction: column;
    justify-content: center;
    width: 800px
`
//Heading Promo
const PromoHeading = styled.h2`
width: 500px;`

//Text Promo
const PromoText = styled.text`
width: 650px
`


//Hình Promo
const PromoImg = styled.img`
width: 500px;
    height: auto;`

//Deliver Section
const DeliSection = styled.section`
display: flex;
justify-content: center;
`
//Khung chữ Deli
const DeliTextWrap = styled.div`
width: 800px;
padding-left: 70px;
align-content: center;
`

//Hình Deli
const DeliImg = styled.img`
width: 500px
`
const DeliHeading = styled.h2``
const DeliText = styled.text``



export default function Home() {
  const [activeCategory, setActiveCategory] = React.useState<string>("Pizzas");
  const categories = ["Pizzas", "Burgers", "Salads", "Combos"];

  



  return (
    <HomeContainer>
      <Header />

      {/* Hero Section */}
      <HeroSection>
        
        <HeroTextWrap>
          <Slogan>
            FoodFast: Nhanh như chớp, ngon bất ngờ.
          </Slogan>
          <Button>Đặt ngay</Button>
        </HeroTextWrap>
        
        <HeroImage src="https://www.freeiconspng.com/uploads/greek-salad-png-21.png"></HeroImage>
      
      </HeroSection>

      {/* Category Section */}
      <CategorySection>
        
        <CategoryDescribe>
          Món ngon cho bạn
        </CategoryDescribe>

        <CategoryButtonContainer> 
  {categories.map((cat) => (
    <CategoryButton
      key={cat}
      name={cat}
      isActive={activeCategory === cat}
      onClick={() => setActiveCategory(cat)}
    />
  ))}
</CategoryButtonContainer>
      
      </CategorySection>

      <PromoSection>
        <PromoImg src="https://pngimg.com/d/burger_sandwich_PNG4135.png"></PromoImg>
        <PromoTextWrap>
        <PromoHeading>
          <h2>Đừng bỏ lỡ ưu đãi cực khủng cho món bạn yêu thích.</h2>
        </PromoHeading>
        <PromoText>
          <text>Đăng ký liền tay để tận hưởng món khoái khẩu ở bất cứ đâu, bất cứ khi nào bạn muốn. Nhanh chóng, đơn giản và dành cho tất cả mọi người. Miễn phí! Thưởng thức ngay - giải pháp hoàn hảo cho mỗi bữa ăn của bạn.</text>
        </PromoText>
        </PromoTextWrap>
      </PromoSection>

      <DeliSection>
        <DeliTextWrap>
          <DeliHeading>
            <h2>Giao Hàng Hoả Tốc</h2>
          </DeliHeading>
          <DeliText>
            <text>Thèm là có, đói là giao! Khám phá vô vàn món ngon quanh bạn và đặt hàng chỉ với vài thao tác đơn giản. Chúng tôi sẽ mang bữa ăn nóng hổi, trọn vị đến tận tay bạn một cách nhanh nhất. Mở app và chọn món ngay thôi!</text>
          </DeliText>
        </DeliTextWrap>

        <DeliImg src="https://cdn.dribbble.com/userupload/38938526/file/original-1e0eb25709a880af5627b8decb29b138.png?resize=752x&vertical=center">
        </DeliImg>


      </DeliSection>

      
      
    </HomeContainer>

  );
}
