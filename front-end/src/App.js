import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ShoppingPage from './components/ShoppingPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import GeneratedListPage from './components/GeneratedListPage';
import AccountPage from './components/AccountPage';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/product-details" element={<ProductDetailsPage />} />
            <Route path="/generated-list" element={<GeneratedListPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App; 