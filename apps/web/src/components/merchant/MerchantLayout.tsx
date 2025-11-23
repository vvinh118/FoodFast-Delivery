import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import MerchantSidebar from '../../components/merchant/MerchantSidebar';

const LayoutContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f4f7f6; /* Màu nền xám nhạt cho dashboard */
`;

const ContentArea = styled.main`
    flex-grow: 1;
    padding: 30px;
    overflow-y: auto;
`;

const MerchantLayout: React.FC = () => {
    return (
        <LayoutContainer>
            {/* 1. Sidebar điều hướng của Merchant */}
            <MerchantSidebar />
            
            {/* 2. Nội dung trang (Dashboard, Menu, Settings) */}
            <ContentArea>
                <Outlet />
            </ContentArea>
        </LayoutContainer>
    );
};

export default MerchantLayout;