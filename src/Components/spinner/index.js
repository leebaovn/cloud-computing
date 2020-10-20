import React from 'react';
import './spinner.style.css';
function Spinner() {
  return (
    <div class='lds-ripple'>
      <div></div>
      <div></div>
    </div>
  );
}

export default Spinner;
