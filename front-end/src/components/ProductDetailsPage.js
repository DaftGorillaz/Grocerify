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
          }, 20000); // 20 second timeout - increased from 10 seconds
        }

        // If we have multiple items, fetch data for all of them
        if (allProductItems.length > 0) {
          const allProductData = [];
          for (const item of allProductItems) {
            if (!isMounted) break;
            const response = await simulateApiCall(item.name);
            allProductData.push(response);
          }
          if (isMounted) {
            // Clear timeout since we successfully loaded
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            setProductData(allProductData);
            setLoading(false);
          }
        } else {
          // Otherwise just fetch data for the search query
          const response = await simulateApiCall(searchQuery);
          if (isMounted) {
            setProductData([response]);
            setLoading(false);
          }
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

  // Simulate API call with mock data
  const simulateApiCall = async (query) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data based on the query
      if (!query || typeof query !== 'string') {
        // Handle invalid query
        return {
          productName: 'Unknown Product',
          products: [
            {
              id: 999,
              name: 'Unknown Product',
              size: '1 unit',
              price: 0.00,
              pricePerUnit: '0.00/unit',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: true,
              image: 'https://placehold.co/200x200?text=Unknown'
            }
          ]
        };
      }
      
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('coconut')) {
        return {
          productName: 'Coconut Water',
          products: [
            {
              id: 1,
              name: 'Cocobella Coconut Water Straight Up',
              size: '1L',
              price: 2.75,
              pricePerUnit: '2.75/L',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: true,
              image: 'https://cdn0.woolworths.media/content/wowproductimages/large/155073.jpg'
            },
            {
              id: 2,
              name: 'Coles Natural Coconut Water',
              size: '1L',
              price: 2.95,
              pricePerUnit: '2.95/L',
              store: 'Coles',
              logo: 'coles',
              isBestValue: false,
              image: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/4/4/5/4456430.jpg'
            },
            {
              id: 3,
              name: 'H2Coco 100% Natural Coconut Water',
              size: '1L',
              price: 3.30,
              pricePerUnit: '3.30/L',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: false,
              image: 'https://cdn0.woolworths.media/content/wowproductimages/large/752087.jpg'
            }
          ]
        };
      } else if (queryLower.includes('milk')) {
        return {
          productName: 'Milk',
          products: [
            {
              id: 1,
              name: 'Coles Full Cream Milk',
              size: '3L',
              price: 4.35,
              pricePerUnit: '1.45/L',
              store: 'Coles',
              logo: 'coles',
              isBestValue: true,
              image: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/3/0/0/3000422.jpg'
            },
            {
              id: 2,
              name: 'Woolworths Whole Milk',
              size: '2L',
              price: 4.35,
              pricePerUnit: '1.45/L',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: false,
              image: 'https://cdn0.woolworths.media/content/wowproductimages/large/048263.jpg'
            }
          ]
        };
      } else if (queryLower.includes('gatorade')) {
        return {
          productName: 'Gatorade',
          products: [
            {
              id: 1,
              name: 'Gatorade Sport Drink Blue Bolt',
              size: '600ml',
              price: 2.10,
              pricePerUnit: '3.50/L',
              store: 'Coles',
              logo: 'coles',
              isBestValue: true,
              image: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/5/5/5/5553698.jpg'
            },
            {
              id: 2,
              name: 'Gatorade Sport Drink Lemon Lime',
              size: '600ml',
              price: 2.10,
              pricePerUnit: '3.50/L',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: false,
              image: 'https://cdn0.woolworths.media/content/wowproductimages/large/729461.jpg'
            }
          ]
        };
      } else if (queryLower.includes('pasta')) {
        return {
          productName: 'Pasta',
          products: [
            {
              id: 1,
              name: 'San Remo Linguine Pasta No 1',
              size: '500g',
              price: 2.95,
              pricePerUnit: '59¢/g',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: true,
              image: 'https://cdn0.woolworths.media/content/wowproductimages/large/018807.jpg'
            },
            {
              id: 2,
              name: 'San Remo Linguine Pasta No 2',
              size: '500g',
              price: 2.95,
              pricePerUnit: '59¢/g',
              store: 'Coles',
              logo: 'coles',
              isBestValue: false,
              image: 'https://shop.coles.com.au/wcsstore/Coles-CAS/images/1/8/8/1889832.jpg'
            },
            {
              id: 3,
              name: 'Barilla Linguine Pasta',
              size: '500g',
              price: 3.50,
              pricePerUnit: '70¢/g',
              store: 'Coles',
              logo: 'coles',
              isBestValue: false,
              image: 'https://cdn0.woolworths.media/content/wowproductimages/large/002773.jpg'
            }
          ]
        };
      } else {
        // Default data for any other query
        return {
          productName: query,
          products: [
            {
              id: 1,
              name: `Best ${query} Option`,
              size: '500g',
              price: 2.95,
              pricePerUnit: '5.90/kg',
              store: 'Woolworths',
              logo: 'woolworths',
              isBestValue: true,
              image: 'https://placehold.co/200x200?text=Product'
            },
            {
              id: 2,
              name: `Generic ${query}`,
              size: '400g',
              price: 2.50,
              pricePerUnit: '6.25/kg',
              store: 'Coles',
              logo: 'coles',
              isBestValue: false,
              image: 'https://placehold.co/200x200?text=Product'
            }
          ]
        };
      }
    } catch (err) {
      console.error('Error fetching product data:', err);
      return {
        productName: 'Error',
        products: [
          {
            id: 999,
            name: 'Error',
            size: '1 unit',
            price: 0.00,
            pricePerUnit: '0.00/unit',
            store: 'Woolworths',
            logo: 'woolworths',
            isBestValue: true,
            image: 'https://placehold.co/200x200?text=Error'
          }
        ]
      };
    }
  };

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
                    <p className="product-size">{mainProduct.size}</p>
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