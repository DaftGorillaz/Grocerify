import React from 'react';
import './Banner.css';
import bannerImage from '../assets/images/banner-image.png';
import discountImage from '../assets/images/discount-image.png';
import fruit1 from '../assets/images/fruit-1.png';
import fruit2 from '../assets/images/fruit-2.png';
import fruit3 from '../assets/images/fruit-3.png';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-background">
        <img src={bannerImage} alt="Banner" className="banner-image" />
        <div className="banner-overlay"></div>
      </div>
      <div className="banner-content">
        <div className="banner-text">
          <h2>Green Discount!</h2>
        </div>
        <div className="banner-indicators">
          <div className="indicator active"></div>
          <div className="indicator"></div>
          <div className="indicator"></div>
        </div>
        <div className="banner-fruits">
          <img src={fruit1} alt="Fruit" className="fruit-image" />
          <img src={fruit2} alt="Fruit" className="fruit-image" />
          <img src={fruit3} alt="Fruit" className="fruit-image" />
        </div>
        <img src={discountImage} alt="Discount" className="discount-image" />
      </div>
    </div>
  );
};

export default Banner; 