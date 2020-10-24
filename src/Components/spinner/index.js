import React from 'react';
import './spinner.style.css';
function Spinner() {
  return (
    <div className='lds-ripple'>
      <div></div>
      <div></div>
    </div>
  );
}

export default Spinner;
