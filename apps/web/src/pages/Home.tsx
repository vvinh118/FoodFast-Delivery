import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import CategoryButton from "../components/CategoryButton";
import HomeHeroImg from "../assets/img/HomeHeroImg.png"
import HomePromoImg from "../assets/img/HomePromoImg.png"
import HomeDeliImg from "../assets/img/HomeDeliImg.png"

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


const HeroHeading = styled.h1`` 
const HeroImg = styled.img``

//Danh mục
const CategorySection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  background-color: pink;
`

const CategoryHeading = styled.h1``

//khối button danh mục
const CategoryButtonContainer = styled.div`
  display: flex;    
  align-items: center;
  gap: 15px;
`


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
const PromoHeading = styled.h1`
width: 500px;`

//Text Promo
const PromoText = styled.p`
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
background-color: pink;
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
const DeliText = styled.p``



export default function Home() {
  const [activeCategory, setActiveCategory] = React.useState<string>("Pizzas");
  const categories = ["Pizzas", "Burgers", "Salads", "Combos"];

  



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
        
        <HeroImg src={HomeHeroImg}>
        </HeroImg>
      
      </HeroSection>

      {/* Category Section */}
      <CategorySection>
        
        <CategoryHeading>
          Món ngon cho bạn
        </CategoryHeading>

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
        <PromoImg src={HomePromoImg}></PromoImg>
        <PromoTextWrap>
        <PromoHeading>
          Đừng bỏ lỡ ưu đãi cực khủng cho món bạn yêu thích.
        </PromoHeading>
        <PromoText>
          Đăng ký liền tay để tận hưởng món khoái khẩu ở bất cứ đâu, bất cứ khi nào bạn muốn. Nhanh chóng, đơn giản và dành cho tất cả mọi người. Miễn phí! Thưởng thức ngay - giải pháp hoàn hảo cho mỗi bữa ăn của bạn.
        </PromoText>
        </PromoTextWrap>
      </PromoSection>

      <DeliSection>
        <DeliTextWrap>
          <DeliHeading>
            Giao Hàng Hoả Tốc
          </DeliHeading>
          <DeliText>
            Thèm là có, đói là giao! Khám phá vô vàn món ngon quanh bạn và đặt hàng chỉ với vài thao tác đơn giản. Chúng tôi sẽ mang bữa ăn nóng hổi, trọn vị đến tận tay bạn một cách nhanh nhất. Mở app và chọn món ngay thôi!
          </DeliText>
        </DeliTextWrap>

        <DeliImg src={HomeDeliImg}>
        </DeliImg>


      </DeliSection>

      <Footer />
      
    </HomeContainer>

  );
}
