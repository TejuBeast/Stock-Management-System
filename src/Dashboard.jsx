import React from 'react';

const Dashboard = () => {
  return (
    <div className="page-fade-in">
    <div style={styles.container}>
      <h1>📊 Dashboard</h1>
      <p>Welcome to the Dashboard! You can view forecast charts and usage trends here.</p>
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

export default Dashboard; // ✅ Default export (required by your App.jsx)
