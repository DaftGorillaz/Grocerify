import React, { useState } from 'react';
import './GenerateListModal.css';
import { useNavigate } from 'react-router-dom';

const GenerateListModal = ({ isOpen, onClose, products }) => {
  const [maxStores, setMaxStores] = useState(2);
  const [preferredStore, setPreferredStore] = useState('Woolworths');
  const [listName, setListName] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Group products by store
  const productsByStore = {};
  products.forEach(productCategory => {
    productCategory.products.forEach(product => {
      if (!productsByStore[product.store]) {
        productsByStore[product.store] = [];
      }
      
      // Add category information to the product
      const enhancedProduct = {
        ...product,
        category: productCategory.productName
      };
      
      // Only add if not already in the list (avoid duplicates)
      if (!productsByStore[product.store].some(p => p.id === product.id)) {
        productsByStore[product.store].push(enhancedProduct);
      }
    });
  });

  const handleConfirm = () => {
    // Logic to generate shopping list based on user preferences
    let shoppingList = [];
    
    if (maxStores === 1) {
      // Single store shopping list - include ALL products from the preferred store
      // First, create a map to track which product categories we've already added
      const addedCategories = new Map();
      
      // Get all products from the preferred store
      const storeProducts = productsByStore[preferredStore] || [];
      
      // For each product category in the original data
      products.forEach(category => {
        // Find all products in this category from the preferred store
        const productsInCategory = category.products.filter(
          product => product.store === preferredStore
        );
        
        if (productsInCategory.length > 0) {
          // Add all products from this category and store
          productsInCategory.forEach(product => {
            shoppingList.push({
              ...product,
              category: category.productName
            });
          });
          // Mark this category as added
          addedCategories.set(category.productName, true);
        } else {
          // If no products from preferred store in this category, 
          // add the best value product regardless of store
          const bestProduct = category.products.find(product => product.isBestValue);
          if (bestProduct && !addedCategories.has(category.productName)) {
            shoppingList.push({
              ...bestProduct,
              category: category.productName,
              note: `Best value (not available at ${preferredStore})`
            });
          }
        }
      });
    } else {
      // Multi-store shopping list (best value from each store)
      // For each product category, find the best value product
      products.forEach(category => {
        const bestProduct = category.products.find(product => product.isBestValue);
        if (bestProduct) {
          shoppingList.push({
            ...bestProduct,
            category: category.productName
          });
        }
      });
    }
    
    // Navigate to the generated list page with the shopping list data
    navigate('/generated-list', { 
      state: { 
        shoppingList,
        maxStores,
        preferredStore: maxStores === 1 ? preferredStore : null,
        listName: listName || 'My Shopping List' // Use default name if none provided
      } 
    });
    
    onClose();
  };

  const handleMaxStoresChange = (e) => {
    setMaxStores(parseInt(e.target.value));
  };

  const handlePreferredStoreChange = (e) => {
    setPreferredStore(e.target.value);
  };

  const handleListNameChange = (e) => {
    setListName(e.target.value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Generate Shopping List</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="option-group">
            <label>Shopping List Name</label>
            <input 
              type="text" 
              className="list-name-input"
              placeholder="My Shopping List"
              value={listName}
              onChange={handleListNameChange}
            />
          </div>
          
          <div className="option-group">
            <label>Maximum No. of Stores</label>
            <div className="select-container">
              <select value={maxStores} onChange={handleMaxStoresChange}>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
          </div>
          
          {maxStores === 1 && (
            <div className="option-group">
              <label>Preferred Store</label>
              <div className="select-container">
                <select value={preferredStore} onChange={handlePreferredStoreChange}>
                  <option value="Woolworths">Woolworths</option>
                  <option value="Coles">Coles</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="terms-conditions">
            <p>By confirming you agree to our Terms and Conditions</p>
          </div>
          
          <button className="confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateListModal; 