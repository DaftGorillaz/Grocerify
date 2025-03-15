import React from 'react';
import './Header.css';
import locationIcon from '../assets/images/location-icon.svg';

const Header = () => {
  return (
    <div className="header">
      <h1 className="greeting">Hello, Steve!</h1>
      <div className="location">
        <img src={locationIcon} alt="Location" className="location-icon" />
        <p>Melbourne, Victoria</p>
      </div>
    </div>
  );
};

export default Header; 