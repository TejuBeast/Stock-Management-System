import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './update-deep.css';

function UpdateDeep({ materials, setMaterials }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { material } = location.state ||{};

  const [form, setForm] = useState({ ...material });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
  try {
    await axios.put(`http://localhost:8000/stock/${form.id}`, {
  quantity: parseInt(form.quantity)
});
    alert("✅ Update request successful");
    const updated = materials.map((mat) =>
      mat.id === form.id ? form : mat
    );
    setMaterials(updated);
    navigate('/update');
  } catch (error) {
    console.error('❌ Failed to update:', error);
    console.error('Failed to update:', error);
    alert('Error updating material');
  }
};


  const handleDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/stock/${form.id}`);

    const updated = materials.filter((mat) => mat.id !== form.id);
    setMaterials(updated);
    navigate('/update');
  } catch (error) {
    console.error('Failed to delete:', error);
    alert('Error deleting material');
  }
};


  return (
    <div className="page-fade-in">
      <div className="edit-material-page">
        <div className="update-deep">
          <h2 className="title">Update and Delete</h2>

          <div className="info-row">
            <strong>ID:</strong>
            <span>{form.id}</span>
          </div>

          <div className="info-row">
            <strong>Casting Type:</strong>
            <span>{form.casting_type}</span>
          </div>

          <div className="input-group">
            <label htmlFor="quantity">
              <strong>Quantity:</strong>
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter new quantity"
            />
          </div>

          <button className="updatebtn" onClick={handleUpdate}>
            Update Material
          </button>
        </div>

        <div className="delete-section">
          <p>Alternatively, you can permanently remove this material.</p>
          <button className="deletebtn" onClick={handleDelete}>
            Delete Material
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateDeep;
