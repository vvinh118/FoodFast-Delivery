import React from 'react';
import styled from 'styled-components';
import OrderHistoryMenu from '../components/OrderHistoryMenu';

const Container = styled.div``
const MainTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    display: flex;
    justify-content: center;
    margin: 50px 0 50px 0;
`
const Content = styled.div`
    display: flex; 
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 50px 50px 50px;
`

const MyOrders: React.FC = () => {
    return (
        <Container>
            <MainTitle>Đơn hàng của tôi</MainTitle>
            <Content>
                <OrderHistoryMenu />
            </Content>
        </Container>
    );
};


export default MyOrders;