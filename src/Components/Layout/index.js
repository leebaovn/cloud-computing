import React from "react";
import Sidebar from "./../Sidebar";
import "./layout.style.css";

function Layout({ children }) {
  return (
    <div className="mainLayout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}

export default Layout;
