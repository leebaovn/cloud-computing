import React from "react";
import "./toolbar.style.css";

function Toolbar({ title, children }) {
  return (
    <div className="toolbar">
      <h2 className="toolbar__title">{title}</h2>
      {children}
    </div>
  );
}

export default Toolbar;
