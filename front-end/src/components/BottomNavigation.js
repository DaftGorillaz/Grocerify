import React from 'react';
import './BottomNavigation.css';
import homeIcon from '../assets/images/home-icon.svg';
import shoppingIcon from '../assets/images/shopping-icon.svg';
import favoriteIcon from '../assets/images/favorite-icon.svg';
import accountIcon from '../assets/images/account-icon.svg';
import historyIcon from '../assets/images/history-icon.svg';
import { useNavigate } from 'react-router-dom';

const BottomNavigation = ({ activeTab = 'home' }) => {
  const navigate = useNavigate();

  const handleNavigation = (tab) => {
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'shopping') {
      navigate('/shopping');
    } else if (tab === 'history') {
      navigate('/history');
    } else if (tab === 'favourite') {
      navigate('/favourite');
    } else if (tab === 'account') {
      navigate('/account');
    }
    // Add other navigation paths as needed
  };

  return (
    <div className="bottom-navigation">
      <div 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleNavigation('home')}
      >
        <img src={homeIcon} alt="Home" className="nav-icon" />
        <p>Home</p>
      </div>
      <div 
        className={`nav-item ${activeTab === 'shopping' ? 'active' : ''}`}
        onClick={() => handleNavigation('shopping')}
      >
        <img src={shoppingIcon} alt="Shopping" className="nav-icon" />
        <p>Shopping</p>
      </div>
      <div 
        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => handleNavigation('history')}
      >
        <img src={historyIcon} alt="History" className="nav-icon" />
        <p>History</p>
      </div>
      <div 
        className={`nav-item ${activeTab === 'favourite' ? 'active' : ''}`}
        onClick={() => handleNavigation('favourite')}
      >
        <img src={favoriteIcon} alt="Favourite" className="nav-icon" />
        <p>Favourite</p>
      </div>
      <div 
        className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
        onClick={() => handleNavigation('account')}
      >
        <img src={accountIcon} alt="Account" className="nav-icon" />
        <p>Account</p>
      </div>
    </div>
  );
};

export default BottomNavigation; 