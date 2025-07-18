import React from 'react';

const Stock = () => {
  return (
    <div className="page-fade-in">
    <div style={styles.container}>
      <h1>📦 Stock</h1>
      <p>This page will display current stock levels and allow for quick status checks.</p>
    </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
};

export default Stock;
