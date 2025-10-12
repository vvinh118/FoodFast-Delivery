import styled from "styled-components";

const FooterContainer = styled.footer`
display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F72D57;
  padding: 15px 40px;
  color: white;
`
const Logo = styled.h1`
font-size: 25px;
  font-weight: bold;
  color: #FFFF;
`
const Founder = styled.h3``

export default function Footer () {
    return (
        <FooterContainer>
            <Logo>FoodFast Delivery</Logo>
            <Founder>Meo Meo Company</Founder>

        </FooterContainer>
    )
}