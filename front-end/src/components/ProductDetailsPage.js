import React, { useState, useEffect } from 'react';
import './ProductDetailsPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrow from '../assets/images/back-arrow.svg';
import BottomNavigation from './BottomNavigation';
import GenerateListModal from './GenerateListModal';
import woolworthsLogo from '../assets/images/woolworths-logo.svg';
import colesLogo from '../assets/images/coles-logo.svg';

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [customMode, setCustomMode] = useState(false);
  
  // Get the search query, all items, and recipe items from location state
  const searchQuery = location.state?.searchQuery || 'coconut water';
  const allItems = location.state?.allItems || [];
  const recipeItems = location.state?.recipeItems || [];
  
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    
    const fetchProductData = async () => {
      if (!isMounted) return;
      setLoading(true);
      
      // Clear any existing timeout when starting a new fetch
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      try {
        // Combine regular items and recipe items
        const allProductItems = [...allItems];
        
        // Add recipe items if they exist
        if (recipeItems && recipeItems.length > 0) {
          recipeItems.forEach(recipe => {
            if (recipe.ingredients && recipe.ingredients.length > 0) {
              recipe.ingredients.forEach(ingredient => {
                // Only add if not already in the list
                if (!allProductItems.some(item => item.name === ingredient.name)) {
                  allProductItems.push({
                    id: ingredient.id,
                    name: ingredient.name
                  });
                }
              });
            }
          });
        }

        // Start timeout only if we have items to fetch
        if (allProductItems.length > 0) {
          timeoutId = setTimeout(() => {
            if (isMounted && loading) {
              console.warn('Request timed out');
              setError('Request timed out. Please try again.');
              setLoading(false);
            }
          }, 20000); // 20 second timeout
        }

        // Make API calls to fetch product data
        if (allProductItems.length > 0) {
          const allProductData = [];
          for (const item of allProductItems) {
            if (!isMounted) break;
            
            try {
              const response = await fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(item.name)}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();

              // Transform the API response to match our expected format
              const transformedData = {
                productName: item.name,
                products: Array.isArray(data) ? data.map(product => {
                  // Extract data using the actual API response structure
                  const transformedProduct = {
                    id: Date.now() + Math.random(), // Generate a unique ID since API doesn't provide one
                    name: product.title || product.name || 'Unknown Product',
                    size: product.size || 1,
                    unit: product.unit || 'unit',
                    price: parseFloat(product.price) || 0.00,
                    pricePerUnit: product.price_per_unit || `${parseFloat(product.price) || 0.00}/unit`,
                    store: product.retailer || 'Unknown Store',
                    logo: (product.retailer || 'unknown').toLowerCase(),
                    isBestValue: false, // We'll calculate this later
                    image: product.image || 'https://placehold.co/200x200?text=Product'
                  };
                  
                  return transformedProduct;
                }) : []
              };

              // Calculate best value
              if (transformedData.products.length > 0) {
                const lowestPrice = Math.min(...transformedData.products.map(p => p.price));
                transformedData.products = transformedData.products.map(p => ({
                  ...p,
                  isBestValue: p.price === lowestPrice
                }));
              }
              
              allProductData.push(transformedData);
            } catch (error) {
              console.error(`Error fetching data for ${item.name}:`, error);
              // Add error placeholder for this item
              allProductData.push({
                productName: item.name,
                products: []
              });
            }
          }
          
          if (isMounted) {
            setProductData(allProductData);
            setLoading(false);
          }
        } else if (searchQuery) {
          // If no items but we have a search query, search for that
          try {
            const response = await fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (isMounted) {
              const transformedData = {
                productName: searchQuery,
                products: Array.isArray(data) ? data.map(product => {
                  // Extract data using the actual API response structure
                  const transformedProduct = {
                    id: Date.now() + Math.random(), // Generate a unique ID since API doesn't provide one
                    name: product.title || product.name || 'Unknown Product',
                    size: product.size || 1,
                    unit: product.unit || 'unit',
                    price: parseFloat(product.price) || 0.00,
                    pricePerUnit: product.price_per_unit || `${parseFloat(product.price) || 0.00}/unit`,
                    store: product.retailer || 'Unknown Store',
                    logo: (product.retailer || 'unknown').toLowerCase(),
                    isBestValue: false, // We'll calculate this later
                    image: product.image || 'https://placehold.co/200x200?text=Product'
                  };
                  
                  return transformedProduct;
                }) : []
              };

              // Calculate best value
              if (transformedData.products.length > 0) {
                const lowestPrice = Math.min(...transformedData.products.map(p => p.price));
                transformedData.products = transformedData.products.map(p => ({
                  ...p,
                  isBestValue: p.price === lowestPrice
                }));
              }

              setProductData([transformedData]);
              setLoading(false);
            }
          } catch (error) {
            if (isMounted) {
              console.error('Error fetching search data:', error);
              setError('Failed to fetch product data');
              setLoading(false);
            }
          }
        } else {
          if (isMounted) {
            setProductData([]);
            setLoading(false);
          }
        }

        // Clear timeout since we're done
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching product data:', err);
          setError('Failed to fetch product data');
          setLoading(false);
        }
      }
    };

    fetchProductData();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchQuery, allItems, recipeItems]); // Only depend on the source data

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGenerateClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProduct = (category, product) => {
    // Create a unique key for the category
    const categoryKey = category.productName;
    
    // Update selected products
    setSelectedProducts(prev => {
      // If we're already in custom mode and have a product for this category,
      // replace it with the new selection
      if (customMode) {
        return {
          ...prev,
          [categoryKey]: {
            ...product,
            category: category.productName
          }
        };
      } 
      // Otherwise, add this product to selections and enable custom mode
      else {
        setCustomMode(true);
        return {
          ...prev,
          [categoryKey]: {
            ...product,
            category: category.productName
          }
        };
      }
    });
  };

  const handleGenerateCustomList = () => {
    // Convert selected products object to array
    const customList = Object.values(selectedProducts);
    
    if (customList.length === 0) {
      alert('Please select at least one product first');
      return;
    }
    
    // Navigate to the generated list page with custom selections
    navigate('/generated-list', { 
      state: { 
        shoppingList: customList,
        maxStores: 'custom', // Special flag for custom selection
        listName: 'My Custom Shopping List'
      } 
    });
  };

  const resetCustomSelection = () => {
    setSelectedProducts({});
    setCustomMode(false);
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="header">
          <img src={backArrow} alt="Back" className="back-arrow" onClick={handleGoBack} />
          <h1>Price Comparison</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3 className="loading-title">Finding Best Prices</h3>
          <p className="loading-message">Comparing prices across stores...</p>
          <p className="loading-tip">This may take a moment as we search for the best deals.</p>
          <button 
            className="back-button loading-back-button" 
            onClick={handleGoBack}
          >
            Back to Shopping List
          </button>
        </div>
        <BottomNavigation activeTab="shopping" />
        <div className="home-indicator"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-page">
        <div className="header">
          <img src={backArrow} alt="Back" className="back-arrow" onClick={handleGoBack} />
          <h1>Price Comparison</h1>
        </div>
        <div className="error-container">
          <div className="error-icon">!</div>
          <h3 className="error-title">Unable to Load Prices</h3>
          <p className="error-message">{error}</p>
          <p className="error-tip">You can try again or return to your shopping list.</p>
          <div className="error-buttons">
            <button onClick={handleGoBack} className="back-button">
              Back to List
            </button>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
        <BottomNavigation activeTab="shopping" />
        <div className="home-indicator"></div>
      </div>
    );
  }

  if (productData.length === 0) {
    return (
      <div className="product-details-page">
        <div className="header">
          <img src={backArrow} alt="Back" className="back-arrow" onClick={handleGoBack} />
          <h1>Price Comparison</h1>
        </div>
        <div className="error-container">
          <div className="empty-icon">?</div>
          <h3 className="error-title">No Products Found</h3>
          <p className="error-message">We couldn't find any products to compare.</p>
          <p className="error-tip">Try adding more items to your shopping list.</p>
          <button onClick={handleGoBack} className="back-button">
            Back to Shopping List
          </button>
        </div>
        <BottomNavigation activeTab="shopping" />
        <div className="home-indicator"></div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="header">
        <img src={backArrow} alt="Back" className="back-arrow" onClick={handleGoBack} />
        <h1>Price Comparison</h1>
      </div>

      {customMode && (
        <div className="custom-mode-banner">
          <p>Custom selection mode: {Object.keys(selectedProducts).length} items selected</p>
          <div className="custom-mode-actions">
            <button className="custom-cancel" onClick={resetCustomSelection}>Cancel</button>
            <button className="custom-generate" onClick={handleGenerateCustomList}>
              Generate Custom List
            </button>
          </div>
        </div>
      )}

      <div className="product-container">
        {productData.map((product, index) => (
          <div key={index} className="product-section">
            <h2 className="product-title">{product.productName}</h2>
            
            <div className="comparison-container">
              {/* Main product (left side) */}
              {product.products.filter(p => p.isBestValue).map(mainProduct => (
                <div key={mainProduct.id} className="main-product">
                  <div className="product-logo-container">
                    <div className={`store-logo ${mainProduct.logo}-logo`}>
                      {mainProduct.logo === 'woolworths' ? (
                        <img src={woolworthsLogo} alt="Woolworths" className="store-logo-img" />
                      ) : mainProduct.logo === 'coles' ? (
                        <img src={colesLogo} alt="Coles" className="store-logo-img" />
                      ) : (
                        mainProduct.store
                      )}
                    </div>
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{mainProduct.name}</h3>
                    <p className="product-size">{mainProduct.size} {mainProduct.unit}</p>
                    <div className="product-price-row">
                      <p className="product-price">${mainProduct.price.toFixed(2)} <span className="price-per-unit">({mainProduct.pricePerUnit})</span></p>
                      <button 
                        className={`add-button ${selectedProducts[product.productName]?.id === mainProduct.id ? 'selected' : ''}`}
                        onClick={() => handleAddProduct(product, mainProduct)}
                      >
                        {selectedProducts[product.productName]?.id === mainProduct.id ? 'X' : '+'}
                      </button>
                    </div>
                  </div>
                  <div className="product-image-main">
                    <img src={mainProduct.image} alt={mainProduct.name} />
                  </div>
                </div>
              ))}

              {/* Comparison products (right side) */}
              <div className="comparison-products">
                {product.products.filter(p => !p.isBestValue && (p.store === 'Coles' || p.store === 'Woolworths')).map(compProduct => (
                  <div key={compProduct.id} className="comparison-product">
                    <div className="product-logo-container">
                      <div className={`store-logo ${compProduct.logo}-logo`}>
                        {compProduct.logo === 'woolworths' ? (
                          <img src={woolworthsLogo} alt="Woolworths" className="store-logo-img" />
                        ) : compProduct.logo === 'coles' ? (
                          <img src={colesLogo} alt="Coles" className="store-logo-img" />
                        ) : (
                          compProduct.store
                        )}
                      </div>
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{compProduct.name}</h3>
                      <p className="product-size">{compProduct.size} {compProduct.unit}</p>
                      <div className="product-price-row">
                        <p className="product-price">${compProduct.price.toFixed(2)} <span className="price-per-unit">({compProduct.pricePerUnit})</span></p>
                        <button 
                          className={`add-button ${selectedProducts[product.productName]?.id === compProduct.id ? 'selected' : ''}`}
                          onClick={() => handleAddProduct(product, compProduct)}
                        >
                          {selectedProducts[product.productName]?.id === compProduct.id ? 'X' : '+'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="more-options">
                  <p>More Options</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!customMode && (
        <button className="generate-button" onClick={handleGenerateClick}>
          Generate
        </button>
      )}

      <GenerateListModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        products={productData}
      />

      <BottomNavigation activeTab="shopping" />
      <div className="home-indicator"></div>
    </div>
  );
};

export default ProductDetailsPage; 