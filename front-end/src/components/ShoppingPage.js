import React, { useState, useEffect } from 'react';
import './ShoppingPage.css';
import backArrow from '../assets/images/back-arrow.svg';
import addIcon from '../assets/images/add-icon.svg';
import addItemIcon from '../assets/images/add-item-icon.svg';
import recipeImage from '../assets/images/recipe-image.png';
import scrollbarBg from '../assets/images/scrollbar-bg.svg';
import crossIcon from '../assets/images/cross-icon.svg';
import searchIcon from '../assets/images/search-icon.svg';
import BottomNavigation from './BottomNavigation';
import { useNavigate } from 'react-router-dom';

const ShoppingPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('shoppingItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('shoppingRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });
  
  const [newItemName, setNewItemName] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('');

  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('shoppingRecipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleBackClick = () => {
    navigate('/');
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const removeRecipeItem = (recipeId, itemId) => {
    setRecipes(recipes.map(recipe => {
      if (recipe.id === recipeId) {
        return {
          ...recipe,
          ingredients: recipe.ingredients.filter(item => item.id !== itemId)
        };
      }
      return recipe;
    }));
  };

  const removeRecipe = (recipeId) => {
    setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemName.trim()
      };
      setItems([...items, newItem]);
      setNewItemName('');
      setShowAddItemModal(false);
    }
  };

  const handleAddRecipe = () => {
    if (newRecipeName.trim() && newRecipeIngredients.trim()) {
      const ingredients = newRecipeIngredients.split(',').map(ingredient => ({
        id: Date.now() + Math.random(),
        name: ingredient.trim()
      }));
      
      const newRecipe = {
        id: Date.now(),
        name: newRecipeName.trim(),
        image: recipeImage, // Using the same image for simplicity
        ingredients: ingredients
      };
      
      setRecipes([...recipes, newRecipe]);
      setNewRecipeName('');
      setNewRecipeIngredients('');
      setShowAddRecipeModal(false);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const handleGoClick = () => {
    // Navigate to the product details page with all items
    navigate('/product-details', { 
      state: { 
        allItems: items,
        recipeItems: recipes
      } 
    });
  };

  return (
    <div className="shopping-page">
      <div className="shopping-header">
        <img 
          src={backArrow} 
          alt="Back" 
          className="back-arrow" 
          onClick={handleBackClick}
        />
        <h1 className="shopping-title">Shopping List</h1>
      </div>

      <div className="shopping-list">
        {items.map(item => (
          <div className="list-item" key={item.id}>
            <p className="item-name">{item.name}</p>
            <img 
              src={crossIcon} 
              alt="Remove" 
              className="remove-icon" 
              onClick={() => removeItem(item.id)}
            />
          </div>
        ))}

        {recipes.map(recipe => (
          <div className="recipe-section" key={recipe.id}>
            <div className="recipe-header">
              <div className="recipe-title-container">
                <img src={recipe.image} alt="Recipe" className="recipe-image" />
                <h2 className="recipe-title">{recipe.name}</h2>
              </div>
              <div className="recipe-actions">
                <img 
                  src={crossIcon} 
                  alt="Remove Recipe" 
                  className="remove-icon recipe-remove-icon" 
                  onClick={() => removeRecipe(recipe.id)}
                />
              </div>
            </div>
            
            {recipe.ingredients.map(item => (
              <div className="list-item" key={item.id}>
                <p className="item-name">{item.name}</p>
                <img 
                  src={crossIcon} 
                  alt="Remove" 
                  className="remove-icon" 
                  onClick={() => removeRecipeItem(recipe.id, item.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <div className="button-group">
          <button 
            className="action-button item-button"
            onClick={() => setShowAddItemModal(true)}
          >
            <img src={addItemIcon} alt="Add" className="button-icon" />
            <span>Add Item</span>
          </button>
          
          <button 
            className="action-button recipe-button"
            onClick={() => setShowAddRecipeModal(true)}
          >
            <img src={addIcon} alt="Add" className="button-icon" />
            <span>Add Recipe</span>
          </button>
        </div>
        
        <button className="go-button" onClick={handleGoClick}>Go</button>
      </div>

      {showAddItemModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Item</h2>
            <input
              type="text"
              placeholder="Enter item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAddItem)}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={() => setShowAddItemModal(false)}>Cancel</button>
              <button onClick={handleAddItem}>Add</button>
            </div>
          </div>
        </div>
      )}

      {showAddRecipeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Recipe</h2>
            <input
              type="text"
              placeholder="Recipe name"
              value={newRecipeName}
              onChange={(e) => setNewRecipeName(e.target.value)}
              autoFocus
            />
            <textarea
              placeholder="Enter ingredients (comma separated)"
              value={newRecipeIngredients}
              onChange={(e) => setNewRecipeIngredients(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAddRecipe)}
            ></textarea>
            <div className="modal-buttons">
              <button onClick={() => setShowAddRecipeModal(false)}>Cancel</button>
              <button onClick={handleAddRecipe}>Add</button>
            </div>
          </div>
        </div>
      )}

      <div className="home-indicator"></div>
      <BottomNavigation activeTab="shopping" />
    </div>
  );
};

export default ShoppingPage; 