import { useLocation ,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import './update-deep.css';

function UpdateDeep({ materials, setMaterials }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { material } = location.state;

  // optional: if you want to make it editable
  const [form, setForm] = useState({ ...material });
  

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setForm((prev)=>({...prev,[name]:value}));
  }
  const handleUp=()=>{
    const updated =materials.map((mat)=>mat.id===form.id?form:mat);
  setMaterials(updated);
  navigate('/update');
  };
  const handleDelete = () => {
  const updated = materials.filter(mat => mat.id !== form.id);
  setMaterials(updated);
  navigate('/update');
};

return (
  // New wrapper to hold both the form and the delete footer
  <div className="edit-material-page">
    <div className="update-deep">
      <h2 className='title'>Update and Delete</h2>

      <div className="info-row">
        <strong>ID:</strong>
        <span>{form.id}</span>
      </div>
      <div className="info-row">
        <strong>Name:</strong>
        <span>{form.name}</span>
      </div>

      <div className="input-group">
        <label htmlFor="availability"><strong>Availability:</strong></label>
        <input
          id="availability"
          type="text"
          name="availability"
          value={form.availability}
          onChange={handleChange}
          placeholder={form.availability}
        />
      </div>

      {/* The update button is now the only primary action in the card */}
      <button className='updatebtn' onClick={handleUp}>Update Material</button>
    </div>

    {/* New, separate section for the delete action */}
    <div className="delete-section">
      <p>Alternatively, you can permanently remove this material.</p>
      <button className='deletebtn' onClick={handleDelete}>Delete Material</button>
    </div>
  </div>
);
}

export default UpdateDeep;

