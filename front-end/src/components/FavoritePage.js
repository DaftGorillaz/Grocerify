import React, { useState, useEffect } from 'react';
import './FavoritePage.css';
import { useNavigate } from 'react-router-dom';
import backArrow from '../assets/images/back-arrow.svg';
import BottomNavigation from './BottomNavigation';

const FavoritePage = () => {
  const navigate = useNavigate();
  const [favoriteLists, setFavoriteLists] = useState(() => {
    const savedFavorites = localStorage.getItem('shoppingFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingFavorites', JSON.stringify(favoriteLists));
  }, [favoriteLists]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleListClick = (list) => {
    navigate('/generated-list', {
      state: {
        shoppingList: list.items,
        maxStores: list.maxStores,
        listName: list.name,
        isFavoriteView: true
      }
    });
  };

  const handleDelete = (index, event) => {
    event.stopPropagation();
    const updatedFavorites = favoriteLists.filter((_, i) => i !== index);
    setFavoriteLists(updatedFavorites);
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  return (
    <div className="favorite-page">
      <div className="header">
        <img 
          src={backArrow} 
          alt="Back" 
          className="back-arrow" 
          onClick={handleGoBack}
        />
        <h1>Favorite Lists</h1>
      </div>

      <div className="favorite-container">
        {favoriteLists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">★</div>
            <h3>No Favorite Lists</h3>
            <p>Your favorite shopping lists will appear here</p>
          </div>
        ) : (
          <div className="favorite-lists">
            {favoriteLists.map((list, index) => (
              <div 
                key={index} 
                className="favorite-item"
                onClick={() => handleListClick(list)}
              >
                <div className="favorite-item-content">
                  <div className="favorite-item-header">
                    <h3>{list.name}</h3>
                    <span className="favorite-amount">${calculateTotalAmount(list.items)}</span>
                  </div>
                  <div className="favorite-item-details">
                    <span>{list.items.length} items</span>
                  </div>
                </div>
                <button 
                  className="delete-button"
                  onClick={(e) => handleDelete(index, e)}
                  aria-label="Delete list"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation activeTab="favourite" />
      <div className="home-indicator"></div>
    </div>
  );
};

export default FavoritePage; 