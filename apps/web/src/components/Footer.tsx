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
  //font-weight: bold;
  color: #FFFF;
`

export default function Footer () {
    return (
        <FooterContainer>
            <Logo>FoodFast Delivery</Logo>
        </FooterContainer>
    )
}