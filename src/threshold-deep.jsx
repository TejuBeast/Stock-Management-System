import { useLocation ,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import './threshold-deep.css';

function ThresholdDeep({ materials, setMaterials }) {
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
  navigate('/threshold');
  };
  //const handleDelete = () => {
  //const updated = materials.filter(mat => mat.id !== form.id);
  //setMaterials(updated);
 // navigate('/threshold');
//};

  return (
    <div className="page-fade-in">
    <div className="threshold-deep">
      <h2 className='title'>Threshold Value</h2>
      <p><strong>ID:</strong> {form.id}</p>
      <p><strong>Name:</strong> {form.name}</p>
      <p><strong>Threshold:</strong> <input type="text"
          name="threshold"
          value={form.threshold}
          onChange={handleChange} placeholder= {form.threshold}/></p>
      <button className='updatebtn' onClick={handleUp}>Update</button>

      {/* You can now add inputs to update this if needed */}
    </div>
    </div>
  );
}

export default ThresholdDeep;

