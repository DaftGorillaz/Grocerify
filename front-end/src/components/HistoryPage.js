import React, { useState, useEffect } from 'react';
import './HistoryPage.css';
import { useNavigate } from 'react-router-dom';
import backArrow from '../assets/images/back-arrow.svg';
import BottomNavigation from './BottomNavigation';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [historyLists, setHistoryLists] = useState(() => {
    const savedHistory = localStorage.getItem('shoppingHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingHistory', JSON.stringify(historyLists));
  }, [historyLists]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleListClick = (list) => {
    navigate('/generated-list', {
      state: {
        shoppingList: list.items,
        maxStores: list.maxStores,
        listName: list.name,
        isHistoryView: true
      }
    });
  };

  const handleDelete = (index, event) => {
    event.stopPropagation(); // Prevent triggering the list click
    const updatedHistory = historyLists.filter((_, i) => i !== index);
    setHistoryLists(updatedHistory);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  return (
    <div className="history-page">
      <div className="header">
        <img 
          src={backArrow} 
          alt="Back" 
          className="back-arrow" 
          onClick={handleGoBack}
        />
        <h1>Shopping History</h1>
      </div>

      <div className="history-container">
        {historyLists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">#</div>
            <h3>No Shopping History</h3>
            <p>Your completed shopping lists will appear here</p>
          </div>
        ) : (
          <div className="history-lists">
            {historyLists.map((list, index) => (
              <div 
                key={index} 
                className="history-item"
                onClick={() => handleListClick(list)}
              >
                <div className="history-item-content">
                  <div className="history-item-header">
                    <h3>{list.name}</h3>
                    <span className="history-date">{formatDate(list.timestamp)}</span>
                  </div>
                  <div className="history-item-details">
                    <span>{list.items.length} items</span>
                    <span className="history-amount">${calculateTotalAmount(list.items)}</span>
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

      <BottomNavigation activeTab="history" />
      <div className="home-indicator"></div>
    </div>
  );
};

export default HistoryPage; 