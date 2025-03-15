import React from 'react';
import './HomeScreen.css';
import Header from './Header';
import SearchBar from './SearchBar';
import Banner from './Banner';
import CategoryCards from './CategoryCards';
import BottomNavigation from './BottomNavigation';

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <Header />
      <SearchBar />
      <Banner />
      <CategoryCards />
      <BottomNavigation activeTab="home" />
      <div className="home-indicator"></div>
    </div>
  );
};

export default HomeScreen; 