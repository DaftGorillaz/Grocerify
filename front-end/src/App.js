import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ShoppingPage from './components/ShoppingPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import GeneratedListPage from './components/GeneratedListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/product-details" element={<ProductDetailsPage />} />
          <Route path="/generated-list" element={<GeneratedListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 