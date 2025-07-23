import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './used-deep.css';

function UsedDeep({ materials, setMaterials }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { material } = location.state || {};

  const [form, setForm] = useState(() => ({
  id: material?.id || "",
  name: material?.name || "",
  quantity: material?.quantity || 0,
  threshold: material?.threshold || 0,
  used: material?.used ?? "",  // could be 0 or empty string
}));

  const [loading, setLoading] = useState(false);

  if (!material) {
    return <div className="used-deep">❌ No material selected.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUp = async () => {
    try {
      setLoading(true);
      // PUT to /stock/{id}/deduct with used amount
      const response = await axios.put(`http://localhost:8000/stock/${form.id}/deduct`, {
        used: parseInt(form.used),
      });

      // update frontend state
      const updatedMaterials = materials.map((mat) =>
        mat.id === form.id ? response.data : mat
      );
      setMaterials(updatedMaterials);

      alert("✅ Usage updated successfully!");
      navigate('/used');
    } catch (err) {
      console.error("❌ Error updating used quantity:", err);
      alert("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in">
      <div className="used-deep">
        <h2 className="title">Used Material Amount</h2>

        <p><strong>ID:</strong> {form.id}</p>
        <p><strong>Name:</strong> {form.name}</p>

        <p>
          <strong>Used:</strong>
          <input
            type="number"
            name="used"
            value={form.used}
            onChange={handleChange}
            placeholder="Enter amount used"
          />
        </p>

        <button className="updatebtn" onClick={handleUp} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}

export default UsedDeep;
