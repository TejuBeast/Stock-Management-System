import { useLocation ,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import './used-deep.css';

function UsedDeep({ materials, setMaterials }) {
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
  navigate('/used');
  };
  //const handleDelete = () => {
  //const updated = materials.filter(mat => mat.id !== form.id);
  //setMaterials(updated);
 // navigate('/threshold');
//};

  return (
    <div className="page-fade-in">
    <div className='used-deep'>
      <h2 className='title'>Used Material Amount</h2>
      <p><strong>Id:</strong> {form.id}</p>
      <p><strong>Name:</strong> {form.name}</p>
      <p><strong>Used:</strong> <input type="text"
          name="used"
          value={form.used}
          onChange={handleChange} placeholder= {form.used}/></p>
      <button className='updatebtn' onClick={handleUp}>Update</button>

      {/* You can now add inputs to update this if needed */}
    </div>
    </div>
  );
}

export default UsedDeep;

