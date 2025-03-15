import React from 'react';
import './Header.css';
import locationIcon from '../assets/images/location-icon.svg';
import { useUser } from '../context/UserContext';

const Header = () => {
  const { user } = useUser();
  
  return (
    <div className="header">
      <h1 className="greeting">Hello, {user.name}!</h1>
      <div className="location">
        <img src={locationIcon} alt="Location" className="location-icon" />
        <p>{user.location}</p>
      </div>
    </div>
  );
};

export default Header; 