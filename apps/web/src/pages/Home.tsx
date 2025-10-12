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
const HeroImage = styled.image``

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

const ProductSection = styled.section``

export default function Home() {
  const [activeCategory, setActiveCategory] = React.useState<string>("Pizzas");
  const categories = ["Pizzas", "Burgers", "Salads", "Combos"];

  

  const products = [
    {
      name: "Pepperoni Pizza",
      price: 11.99,
      image: "https://www.freeiconspng.com/uploads/greek-salad-png-21.png",
      category: "Pizzas", // Thêm thuộc tính này
    },
    {
      name: "Vegetarian Pizza",
      price: 15.99,
      image: "https://www.freeiconspng.com/uploads/greek-salad-png-21.png",
      category: "Pizzas", // Thêm thuộc tính này
    },
    {
      name: "Cheeseburger",
      price: 9.99,
      image: "https://www.freeiconspng.com/uploads/greek-salad-png-21.png",
      category: "Burgers", // Thêm sản phẩm mới
    },
    // Thêm các sản phẩm khác với các danh mục khác nhau
  ];

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
        
        <HeroImage><img src="https://www.freeiconspng.com/uploads/greek-salad-png-21.png"></img></HeroImage>
      
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

      
      {/* Product Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-8 pb-20 max-w-6xl mx-auto">
        {products.map((p, i) => (
          <ProductCard
            key={i}
            name={p.name}
            price={p.price}
            image={p.image}
            onAddToCart={() => {}}
          />
        ))}
      </section>
    </HomeContainer>

  );
}
