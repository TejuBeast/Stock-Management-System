import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DataEntryMenu.css';

const DataEntryMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="page-fade-in">
    <div className="data-entry-menu-container">
      <h2>🗂️ Data Entry Options</h2>
      <div className="entry-options-grid">
        <button onClick={() => navigate('/dataentry/new')}>➕ New Entry</button>
        <button onClick={() => navigate('/update')}>✏️ Update Item</button>
        <button onClick={() => navigate('/threshold')}>📉 Adjust Threshold</button>
        <button onClick={() => navigate('/used')}>📊 Usage Logs</button>
      </div>
    </div>
    </div>);
};

export default DataEntryMenu;
