// src/Dashboard.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const materials = [
  { item_name: 'Casting Mold', quantity: 280, threshold: 300 },
  { item_name: 'Core Rod', quantity: 450, threshold: 400 },
  { item_name: 'Shell Frame', quantity: 200, threshold: 250 },
  { item_name: 'Valve Case', quantity: 610, threshold: 300 },
  { item_name: 'Wheel Shaft', quantity: 480, threshold: 500 },
];

const predictedItems = [
  {
    item_name: "Flux A",
    depletion_date: "2025-07-24",
    days_left: 1,
    avg_usage: 14.0,
    current_stock: 12
  },
  {
    item_name: "Steel B",
    depletion_date: "2025-07-25",
    days_left: 2,
    avg_usage: 9.0,
    current_stock: 20
  },
  {
    item_name: "Aluminium C",
    depletion_date: "2025-07-27",
    days_left: 4,
    avg_usage: 7.5,
    current_stock: 30
  }
];

const THRESHOLD_MARGIN = 100;

export default function Dashboard() {
  const safe = materials.filter(m => m.quantity > m.threshold + THRESHOLD_MARGIN);
  const near = materials.filter(m => m.quantity <= m.threshold + THRESHOLD_MARGIN && m.quantity > m.threshold);
  const critical = materials.filter(m => m.quantity <= m.threshold);

  const pieData = {
    labels: ['Safe ✅', 'Near Threshold ⚠️', 'Below Threshold ❌'],
    datasets: [
      {
        data: [safe.length, near.length, critical.length],
        backgroundColor: ['#4CAF50', '#FFEB3B', '#F44336'],
        borderWidth: 1,
      },
    ],
  };

  const predictedToDrop = predictedItems.filter(item => item.days_left <= 3);

  return (
    <div className="dashboard-grid">
      {/* Top Left: Pie Chart */}
      <div className="top-left">
        <h3>📊 Threshold Graph</h3>
        <div className="pie-wrap">
          <Pie data={pieData} />
        </div>
      </div>

      {/* Top Right: Near & Below Threshold */}
      <div className="top-right">
        <h3>⚠️ Near & Below Threshold</h3>
        <div className="scroll-box">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {near.concat(critical).map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.threshold}</td>
                  <td style={{ color: item.quantity <= item.threshold ? 'red' : 'orange' }}>
                    {item.quantity <= item.threshold ? 'Below' : 'Near'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Predicted Depletion */}
      <div className="bottom">
        <h3>📉 Predicted to Deplete</h3>
        <div className="scroll-box">
          {predictedToDrop.length === 0 ? (
            <p className="empty-msg">✅ No predicted shortages.</p>
          ) : (
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Current Stock</th>
                  <th>Days Left</th>
                  <th>Depletion Date</th>
                </tr>
              </thead>
              <tbody>
                {predictedToDrop.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.current_stock}</td>
                    <td style={{ color: item.days_left <= 1 ? 'red' : 'orange' }}>
                      {item.days_left} {item.days_left === 1 ? 'day' : 'days'}
                    </td>
                    <td>{item.depletion_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
