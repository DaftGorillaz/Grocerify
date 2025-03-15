import React from 'react';
import './CategoryCards.css';
import historyImage from '../assets/images/history-image.png';
import shoppingListImage from '../assets/images/shopping-list-image.png';
import favoriteImage from '../assets/images/favorite-image.png';
import { useNavigate } from 'react-router-dom';

const CategoryCards = () => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="category-cards">
      <div 
        className="category-card shopping-card"
        onClick={() => handleCardClick('/shopping')}
      >
        <div className="card-content">
          <img src={shoppingListImage} alt="Shopping List" className="card-icon" />
          <h3 className="card-title">Shopping List</h3>
        </div>
      </div>
      
      <div 
        className="category-card history-card"
        onClick={() => handleCardClick('/history')}
      >
        <div className="card-content">
          <img src={historyImage} alt="History" className="card-icon" />
          <h3 className="card-title">History</h3>
        </div>
      </div>
      
      <div 
        className="category-card favorite-card"
        onClick={() => handleCardClick('/favorite')}
      >
        <div className="card-content">
          <img src={favoriteImage} alt="Favorite" className="card-icon" />
          <h3 className="card-title">Favorite</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCards; 