import React from 'react';
import styled from 'styled-components';
import OrderHistoryMenu from '../../components/OrderHistoryMenu';

const ColMain = styled.div``
const MainTitle = styled.h1`
    display: flex;
    justify-content: center;
    background-color: #f72d57;
    color: white;
    padding: 10px;
`
const OrderContainer = styled.div`
    margin: 50px 0 50px;
`

const OrderHistory: React.FC = () => {

    return (
        <ColMain>
            <MainTitle>Lịch sử đơn hàng</MainTitle>
            <OrderContainer>
                <OrderHistoryMenu />
            </OrderContainer>
        </ColMain>
    )
}

export default OrderHistory;