import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './threshold-deep.css';

function ThresholdDeep() {
  const location = useLocation();
  const navigate = useNavigate();
  const { material } = location.state || {}; // prevent crash

  // If material was not passed correctly (e.g. on refresh)
  if (!material) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        ❌ No material found. Please go back and select one.
      </div>
    );
  }

  const [threshold, setThreshold] = useState(material.threshold);

  const handleChange = (e) => {
    setThreshold(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/stock/${material.id}/threshold`, {
        threshold: parseInt(threshold)
      });

      alert("✅ Threshold updated successfully!");
      navigate('/threshold');
    } catch (error) {
      console.error("❌ Failed to update threshold:", error);
      alert("Error updating threshold. See console for details.");
    }
  };

  return (
    <div className="page-fade-in">
      <div className="threshold-deep">
        <h2>Update Threshold</h2>

        <div className="info">
          <p><strong>ID:</strong> {material.id}</p>
          <p><strong>Name:</strong> {material.name || material.casting_type}</p>
          <p><strong>Quantity:</strong> {material.quantity}</p>
        </div>

        <div className="input-group">
          <label htmlFor="threshold">New Threshold:</label>
          <input
            id="threshold"
            type="number"
            value={threshold}
            onChange={handleChange}
            placeholder="Enter new threshold"
          />
        </div>

        <button className="updatebtn" onClick={handleUpdate}>
          Update Threshold
        </button>
      </div>
    </div>
  );
}

export default ThresholdDeep;
