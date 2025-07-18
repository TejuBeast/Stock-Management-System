import { useLocation ,useNavigate} from 'react-router-dom';
import { useState } from 'react';

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
    <div>
      <h2>Edit Material</h2>
      <p><strong>ID:</strong> {form.id}</p>
      <p><strong>Name:</strong> <input name="name"
          value={form.name}
          onChange={handleChange} type="text" placeholder= {form.name}/></p>
      <p><strong>Availability:</strong> <input type="text"
          name="availability"
          value={form.availability}
          onChange={handleChange} placeholder= {form.availability}/></p>
      <button onClick={handleUp}>Update</button> <button onClick={handleDelete}>Delete</button>

      {/* You can now add inputs to update this if needed */}
    </div>
  );
}

export default UpdateDeep;

