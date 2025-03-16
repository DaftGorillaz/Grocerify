import React, { useState } from 'react';
import './SearchBar.css';
import searchIcon from '../assets/images/search-icon.svg';
import filterIcon from '../assets/images/filter-icon.svg';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/product-details', {
        state: {
          searchQuery: searchQuery.trim(),
          allItems: [],
          recipeItems: []
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input 
          type="text" 
          placeholder="Search Product" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="filter-button" onClick={handleSearch}>
        <img src={filterIcon} alt="Search" className="filter-icon" />
      </div>
    </div>
  );
};

export default SearchBar; 