import React from "react";
import { NavLink } from "react-router-dom";
import './DataEntryNav.css';

const DataEntryNavbar = () => {
  return (
    <div className="page-fade-in">
    <nav className="data-entry-navbar">
      <ul>
        <li><NavLink to="/dataentry/new">New Entry</NavLink></li>
        <li><NavLink to="/update">Update</NavLink></li>
        <li><NavLink to="/threshold">Threshold</NavLink></li>
        <li><NavLink to="/used">Usage</NavLink></li>
      </ul>
    </nav>
    </div>
  );
};

export default DataEntryNavbar;
