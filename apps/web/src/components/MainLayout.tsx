import React from 'react';
import { Outlet } from 'react-router-dom'; 
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from "./CartSidebar";
import ProfileSidebar from './ProfileSideBar';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const MainContent = styled.main`
  flex-grow: 1;
  width: 100%;
  background-color: #f9f9f9; 
`

const MainLayout: React.FC = () => {
  return (
    <AppWrapper>
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
      <Footer />
      <CartSidebar />
      <ProfileSidebar />
    </AppWrapper>
  );
};

export default MainLayout;