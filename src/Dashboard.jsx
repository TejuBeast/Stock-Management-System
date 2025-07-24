import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const THRESHOLD_MARGIN = 30;

export default function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [predictedItems, setPredictedItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/stock")
      .then(response => {
        setMaterials(response.data);
      })
      .catch(error => {
        console.error('Error fetching materials:', error);
      });

    axios.get("http://localhost:8000/high_risk_stocks")
      .then(response => {
        setPredictedItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching predicted items:', error);
      });
  }, []);

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
                <th>Type</th>
                <th>Qty</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {near.concat(critical).map((item, index) => (
                <tr key={index}>
                  <td>{item.casting_type}</td>
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
                  <th>Type</th>
                  <th>Current Stock</th>
                  <th>Days Left</th>
                  <th>Depletion Date</th>
                </tr>
              </thead>
              <tbody>
                {predictedToDrop.map((item, index) => (
                  <tr key={index}>
                    <td>{item.casting_type}</td>
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
