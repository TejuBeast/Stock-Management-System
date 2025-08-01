import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AlertHistory.css";

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/alerts")
      .then((response) => {
        setAlerts(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch alerts. Please try again.");
        console.error(err);
      });
  }, []);

  return (
    <div className="page-fade-in">
      <div className="alert-history-container">
        <h2 className="alert-history-title">🚨 Alert History</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {alerts.length > 0 ? (
          <div>
            {alerts.map((alert, idx) => (
              <div key={idx} className="alert-card alert-low">
                <h3 className="alert-item-name">{alert.casting_type}</h3>

                <p className="alert-detail">
                  <strong>Threshold:</strong> {alert.threshold}
                </p>

                <p className="alert-time">
                  <strong>Time:</strong>{" "}
                  {new Date(alert.alert_time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !error && <p>📭 No alerts yet.</p>
        )}
      </div>
    </div>
  );
}
