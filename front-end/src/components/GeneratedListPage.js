import React, { useState, useEffect } from 'react';
import './GeneratedListPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/back-arrow.svg';
import BottomNavigation from './BottomNavigation';
// Import store logos
import woolworthsLogo from '../assets/images/woolworths-logo.svg';
import colesLogo from '../assets/images/coles-logo.svg';

function capitalize(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const GeneratedListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shoppingList, maxStores, preferredStore, listName } = location.state || { 
    shoppingList: [], 
    maxStores: 2, 
    preferredStore: null,
    listName: 'My Shopping List'
  };

  // Initialize checked state using array indices instead of item IDs
  const [checkedItems, setCheckedItems] = useState(
    Array(shoppingList.length).fill(false)
  );

  // Calculate total price
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate the total price of all items
    const sum = shoppingList.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
    setTotalPrice(sum);
  }, [shoppingList]);

  // Store logo mapping
  const storeLogo = {
    'woolworths': woolworthsLogo,
    'coles': colesLogo
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = () => {
    // Get existing history or initialize empty array
    const existingHistory = JSON.parse(localStorage.getItem('shoppingHistory') || '[]');
    
    // Create new history entry
    const historyEntry = {
      name: listName,
      items: shoppingList,
      maxStores,
      timestamp: Date.now()
    };

    // Add to history and save
    const updatedHistory = [historyEntry, ...existingHistory];
    localStorage.setItem('shoppingHistory', JSON.stringify(updatedHistory));
    alert(`Shopping list "${listName}" saved to history!`);
  };

  const handleAddToFavorite = () => {
    // Get existing favorites or initialize empty array
    const existingFavorites = JSON.parse(localStorage.getItem('shoppingFavorites') || '[]');
    
    // Create new favorite entry
    const favoriteEntry = {
      name: listName,
      items: shoppingList,
      maxStores,
      timestamp: Date.now()
    };

    // Check if this list is already in favorites
    const isDuplicate = existingFavorites.some(
      favorite => 
        favorite.name === favoriteEntry.name && 
        JSON.stringify(favorite.items) === JSON.stringify(favoriteEntry.items)
    );

    if (isDuplicate) {
      alert('This shopping list is already in your favorites!');
      return;
    }

    // Add to favorites and save
    const updatedFavorites = [favoriteEntry, ...existingFavorites];
    localStorage.setItem('shoppingFavorites', JSON.stringify(updatedFavorites));

    // Also add to history
    const existingHistory = JSON.parse(localStorage.getItem('shoppingHistory') || '[]');
    const historyEntry = {
      ...favoriteEntry,
      fromFavorites: true // Add a flag to indicate it was added from favorites
    };
    const updatedHistory = [historyEntry, ...existingHistory];
    localStorage.setItem('shoppingHistory', JSON.stringify(updatedHistory));

    alert(`Shopping list "${listName}" added to favorites and history!`);
  };

  // Update to use index instead of itemId
  const handleCheckItem = (index) => {
    setCheckedItems(prev => {
      const newCheckedItems = [...prev];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  // Group items by store for multi-store lists
  const itemsByStore = {};
  if (maxStores > 1) {
    shoppingList.forEach(item => {
      if (!itemsByStore[item.store]) {
        itemsByStore[item.store] = [];
      }
      itemsByStore[item.store].push(item);
    });
  }

  return (
    <div className="generated-list-page">
      <div className="header">
        <img src={backArrow} alt="Back" className="back-arrow" onClick={handleGoBack} />
        <h1>{listName}</h1>
      </div>

      <div className="list-container">
        {maxStores === 1 ? (
          // Single store list
          <div className="store-section">
            <div className="store-header">
              <div className={`store-logo-container ${preferredStore.toLowerCase()}-container`}>
                <img 
                  src={storeLogo[preferredStore]} 
                  alt={preferredStore} 
                  className="store-logo-img" 
                />
                <span className="store-name">{capitalize(preferredStore)}</span>
              </div>
            </div>
            <div className="items-list">
              {shoppingList.map((item, index) => (
                <div 
                  key={index} 
                  className={`list-item ${checkedItems[index] ? 'checked' : ''} ${item.note ? 'alternate-store' : ''}`}
                  onClick={() => handleCheckItem(index)}
                >
                  <div className="item-info">
                    <div className="checkbox">
                      {checkedItems[index] && <span className="checkmark">X</span>}
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      {item.note && (
                        <p className="item-note">{item.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="item-price-container">
                    <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                    {item.store && item.store !== preferredStore && (
                      <p className="item-store">{item.store}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : maxStores === 'custom' ? (
          // Custom selection list
          <div className="store-section">
            <div className="store-header">
              <div className="store-logo-container custom-container">
                <span className="store-name">Custom Selection</span>
              </div>
            </div>
            <div className="items-list">
              {shoppingList.map((item, index) => (
                <div 
                  key={index} 
                  className={`list-item ${checkedItems[index] ? 'checked' : ''}`}
                  onClick={() => handleCheckItem(index)}
                >
                  <div className="item-info">
                    <div className="checkbox">
                      {checkedItems[index] && <span className="checkmark">X</span>}
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-category">{item.category}</p>
                    </div>
                  </div>
                  <div className="item-price-container">
                    <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                    <p className="item-store">{item.store}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Multi-store list
          Object.keys(itemsByStore).map((store, storeIndex) => (
            <div key={storeIndex} className="store-section">
              <div className="store-header">
                <div className={`store-logo-container ${store.toLowerCase()}-container`}>
                  <img 
                    src={storeLogo[store]} 
                    alt={store} 
                    className="store-logo-img" 
                  />
                  <span className="store-name">{capitalize(store)}</span>
                </div>
              </div>
              <div className="items-list">
                {itemsByStore[store].map((item, itemIndex) => {
                  // Calculate the global index for this item
                  const globalIndex = shoppingList.findIndex(i => 
                    i.id === item.id && i.name === item.name && i.store === item.store
                  );
                  return (
                    <div 
                      key={itemIndex} 
                      className={`list-item ${checkedItems[globalIndex] ? 'checked' : ''} ${item.note ? 'alternate-store' : ''}`}
                      onClick={() => handleCheckItem(globalIndex)}
                    >
                      <div className="item-info">
                        <div className="checkbox">
                          {checkedItems[globalIndex] && <span className="checkmark">X</span>}
                        </div>
                        <div className="item-details">
                          <p className="item-name">{item.name}</p>
                          {item.note && (
                            <p className="item-note">{item.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="item-price-container">
                        <p className="item-price">${item.price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div className="total-price-container">
          <div className="total-price-label">Total:</div>
          <div className="total-price-value">${totalPrice.toFixed(2)}</div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-button favorite-button" onClick={handleAddToFavorite}>
          Add to Favorite
        </button>
        <button className="action-button save-button" onClick={handleSave}>
          Save to History
        </button>
      </div>

      <BottomNavigation activeTab="shopping" />
      <div className="home-indicator"></div>
    </div>
  );
};

export default GeneratedListPage; 