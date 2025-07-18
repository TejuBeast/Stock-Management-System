import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="page-fade-in">
    <nav className="main-navbar">
      <h2 className="brand">📦 Stock System</h2>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/stock">Stock</Link></li>
        <li><Link to="/dataentry">Data Entry</Link></li>
        <li><Link to="/alerthistory">Alert History</Link></li>
      </ul>
    </nav>
    </div>
  );
};

export default Navbar;
