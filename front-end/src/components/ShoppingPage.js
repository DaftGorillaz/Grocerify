import React, { useState, useEffect } from 'react';
import './ShoppingPage.css';
import backArrow from '../assets/images/back-arrow.svg';
import addIcon from '../assets/images/add-icon.svg';
import addItemIcon from '../assets/images/add-item-icon.svg';
import recipeImage from '../assets/images/recipe-image.png';
import scrollbarBg from '../assets/images/scrollbar-bg.svg';
import crossIcon from '../assets/images/cross-icon.svg';
import editIcon from '../assets/images/edit-icon.svg';
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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemName, setEditedItemName] = useState('');
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editedRecipeName, setEditedRecipeName] = useState('');
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  const [editingIngredientRecipeId, setEditingIngredientRecipeId] = useState(null);
  const [editedIngredientName, setEditedIngredientName] = useState('');

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

  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditedItemName(item.name);
  };

  const handleEditKeyDown = (e, itemId) => {
    if (e.key === 'Enter') {
      saveEdit(itemId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const saveEdit = (itemId) => {
    if (editedItemName.trim()) {
      setItems(items.map(item => 
        item.id === itemId ? { ...item, name: editedItemName.trim() } : item
      ));
      setEditingItemId(null);
      setEditedItemName('');
    }
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditedItemName('');
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
      const itemNames = newItemName.split(',');
      const newItems = itemNames
        .map(itemName => ({
          id: Date.now() + Math.random(),
          name: itemName.trim()
        }))
        .filter(item => item.name !== '')
        .filter(newItem => !items.some(existingItem => 
          existingItem.name.toLowerCase() === newItem.name.toLowerCase()
        ));
      
      if (newItems.length > 0) {
        setItems([...items, ...newItems]);
        setNewItemName('');
        setShowAddItemModal(false);
      } else {
        // If all items were duplicates, just clear the input
        setNewItemName('');
      }
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

  const handleDeleteAll = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteAll = () => {
    setItems([]);
    setRecipes([]);
    setShowDeleteConfirmModal(false);
  };

  const startEditingRecipe = (recipe) => {
    setEditingRecipeId(recipe.id);
    setEditedRecipeName(recipe.name);
  };

  const handleEditRecipeKeyDown = (e, recipeId) => {
    if (e.key === 'Enter') {
      saveRecipeEdit(recipeId);
    } else if (e.key === 'Escape') {
      cancelRecipeEdit();
    }
  };

  const saveRecipeEdit = (recipeId) => {
    if (editedRecipeName.trim()) {
      setRecipes(recipes.map(recipe => 
        recipe.id === recipeId ? { ...recipe, name: editedRecipeName.trim() } : recipe
      ));
      setEditingRecipeId(null);
      setEditedRecipeName('');
    }
  };

  const cancelRecipeEdit = () => {
    setEditingRecipeId(null);
    setEditedRecipeName('');
  };

  const startEditingIngredient = (recipeId, ingredient) => {
    setEditingIngredientId(ingredient.id);
    setEditingIngredientRecipeId(recipeId);
    setEditedIngredientName(ingredient.name);
  };

  const handleEditIngredientKeyDown = (e, recipeId, ingredientId) => {
    if (e.key === 'Enter') {
      saveIngredientEdit(recipeId, ingredientId);
    } else if (e.key === 'Escape') {
      cancelIngredientEdit();
    }
  };

  const saveIngredientEdit = (recipeId, ingredientId) => {
    if (editedIngredientName.trim()) {
      setRecipes(recipes.map(recipe => {
        if (recipe.id === recipeId) {
          return {
            ...recipe,
            ingredients: recipe.ingredients.map(ingredient =>
              ingredient.id === ingredientId
                ? { ...ingredient, name: editedIngredientName.trim() }
                : ingredient
            )
          };
        }
        return recipe;
      }));
      cancelIngredientEdit();
    }
  };

  const cancelIngredientEdit = () => {
    setEditingIngredientId(null);
    setEditingIngredientRecipeId(null);
    setEditedIngredientName('');
  };

  return (
    <div className="shopping-page">
      <div className="shopping-header">
        <div className="header-left">
          <img 
            src={backArrow} 
            alt="Back" 
            className="back-arrow" 
            onClick={handleBackClick}
          />
          <h1 className="shopping-title">Shopping List</h1>
        </div>
        {(items.length > 0 || recipes.length > 0) && (
          <button className="delete-all-button" onClick={handleDeleteAll}>
            Remove All
          </button>
        )}
      </div>

      <div className="shopping-list">
        {items.map(item => (
          <div className="list-item" key={item.id}>
            {editingItemId === item.id ? (
              <input
                type="text"
                className="edit-item-input"
                value={editedItemName}
                onChange={(e) => setEditedItemName(e.target.value)}
                onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                onBlur={() => saveEdit(item.id)}
                autoFocus
              />
            ) : (
              <p className="item-name">{item.name}</p>
            )}
            <div className="item-actions">
              <img 
                src={editIcon} 
                alt="Edit" 
                className="edit-icon" 
                onClick={() => startEditing(item)}
              />
              <img 
                src={crossIcon} 
                alt="Remove" 
                className="remove-icon" 
                onClick={() => removeItem(item.id)}
              />
            </div>
          </div>
        ))}

        {recipes.map(recipe => (
          <div className="recipe-section" key={recipe.id}>
            <div className="recipe-header">
              <div className="recipe-title-container">
                <img src={recipe.image} alt="Recipe" className="recipe-image" />
                {editingRecipeId === recipe.id ? (
                  <input
                    type="text"
                    className="edit-item-input"
                    value={editedRecipeName}
                    onChange={(e) => setEditedRecipeName(e.target.value)}
                    onKeyDown={(e) => handleEditRecipeKeyDown(e, recipe.id)}
                    onBlur={() => saveRecipeEdit(recipe.id)}
                    autoFocus
                  />
                ) : (
                  <h2 className="recipe-title">{recipe.name}</h2>
                )}
              </div>
              <div className="recipe-actions">
                <img 
                  src={editIcon} 
                  alt="Edit Recipe" 
                  className="edit-icon" 
                  onClick={() => startEditingRecipe(recipe)}
                />
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
                {editingIngredientId === item.id && editingIngredientRecipeId === recipe.id ? (
                  <input
                    type="text"
                    className="edit-item-input"
                    value={editedIngredientName}
                    onChange={(e) => setEditedIngredientName(e.target.value)}
                    onKeyDown={(e) => handleEditIngredientKeyDown(e, recipe.id, item.id)}
                    onBlur={() => saveIngredientEdit(recipe.id, item.id)}
                    autoFocus
                  />
                ) : (
                  <p className="item-name">{item.name}</p>
                )}
                <div className="item-actions">
                  <img 
                    src={editIcon} 
                    alt="Edit" 
                    className="edit-icon" 
                    onClick={() => startEditingIngredient(recipe.id, item)}
                  />
                  <img 
                    src={crossIcon} 
                    alt="Remove" 
                    className="remove-icon" 
                    onClick={() => removeRecipeItem(recipe.id, item.id)}
                  />
                </div>
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

      {showDeleteConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Remove All Items?</h2>
            <p style={{ marginBottom: '20px', color: '#7C7C7C' }}>
              This will remove all items and recipes from your shopping list. This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button onClick={() => setShowDeleteConfirmModal(false)}>Cancel</button>
              <button 
                onClick={confirmDeleteAll}
                style={{ backgroundColor: '#FF6961' }}
              >
                Remove All
              </button>
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