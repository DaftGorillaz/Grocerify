import React, { useState } from 'react';
import './Checkbox.css';

const Checkbox = () => {
  const [checked, setChecked] = useState(false);

  const toggleChecked = () => {
    setChecked(!checked);
  };

  return (
    <div 
      className={`checkbox ${checked ? 'checked' : ''}`} 
      onClick={toggleChecked}
    >
      {checked && <div className="checkmark"></div>}
    </div>
  );
};

export default Checkbox; 