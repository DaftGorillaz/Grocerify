import React from 'react';
import './SearchBar.css';
import searchIcon from '../assets/images/search-icon.svg';
import filterIcon from '../assets/images/filter-icon.svg';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <div className="search-input">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input type="text" placeholder="Search Product" />
      </div>
      <div className="filter-button">
        <img src={filterIcon} alt="Filter" className="filter-icon" />
      </div>
    </div>
  );
};

export default SearchBar; 