import React from 'react';
import './AccountPage.css';
import BottomNavigation from './BottomNavigation';
import { useNavigate } from 'react-router-dom';

// SVG Icons
const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
  </svg>
);

const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

const AccountPage = () => {
  const navigate = useNavigate();
  const userName = "Steve";

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleMenuItemClick = (item) => {
    // In a real app, this would navigate to the respective pages
    console.log(`Navigating to ${item}`);
    // For demonstration purposes, we'll just show an alert
    alert(`You clicked on ${item}`);
  };

  const handleLogout = () => {
    // In a real app, this would handle the logout process
    console.log('Logging out');
    // For demonstration purposes, we'll just show an alert
    alert('You have been logged out');
    // Navigate to home page after logout
    navigate('/');
  };

  return (
    <div className="account-page">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-image">
          {userName.charAt(0)}
        </div>
        <div className="profile-info">
          <div className="name-edit">
            <h2>{userName}</h2>
            <img 
              src="/images/edit_icon.svg" 
              alt="Edit" 
              className="edit-icon" 
              onClick={() => alert('Edit profile')}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <p className="email">steve@mail.com</p>
        </div>
      </div>

      <div className="divider"></div>

      {/* Menu Items */}
      <div className="menu-items">
        <div className="menu-item" onClick={() => handleMenuItemClick('Notifications')}>
          <div className="menu-item-left">
            <div className="menu-icon-container">
              <div className="menu-icon-circle">
                <NotificationIcon />
              </div>
            </div>
            <span>Notifications</span>
          </div>
          <div className="arrow-icon">
            <ChevronRightIcon />
          </div>
        </div>

        <div className="divider"></div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Help')}>
          <div className="menu-item-left">
            <div className="menu-icon-container">
              <div className="menu-icon-circle">
                <HelpIcon />
              </div>
            </div>
            <span>Help</span>
          </div>
          <div className="arrow-icon">
            <ChevronRightIcon />
          </div>
        </div>

        <div className="divider"></div>

        <div className="menu-item" onClick={() => handleMenuItemClick('About')}>
          <div className="menu-item-left">
            <div className="menu-icon-container">
              <div className="menu-icon-circle">
                <AboutIcon />
              </div>
            </div>
            <span>About</span>
          </div>
          <div className="arrow-icon">
            <ChevronRightIcon />
          </div>
        </div>

        <div className="divider"></div>
      </div>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>Log Out</button>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="account" />
    </div>
  );
};

export default AccountPage; 