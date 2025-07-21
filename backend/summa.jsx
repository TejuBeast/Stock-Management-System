import axios from "axios";
import { useEffect, useState } from "react";

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ id: "", name: "", available: "" });

  // GET
  const fetchMaterials = async () => {
    const res = await axios.get("http://127.0.0.1:8000/materials");
    setMaterials(res.data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // POST
  const addMaterial = async () => {
    await axios.post("http://127.0.0.1:8000/materials", newMaterial);
    fetchMaterials();
  };

  // DELETE
  const deleteMaterial = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/materials/${id}`);
    fetchMaterials();
  };

  return (
    <div>
      <h2>Materials List</h2>
      <input placeholder="ID" onChange={e => setNewMaterial({ ...newMaterial, id: Number(e.target.value) })} />
      <input placeholder="Name" onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })} />
      <input placeholder="Available" onChange={e => setNewMaterial({ ...newMaterial, available: Number(e.target.value) })} />
      <button onClick={addMaterial}>Add</button>

      <ul>
        {materials.map(m => (
          <li key={m.id}>
            {m.name} - {m.available}
            <button onClick={() => deleteMaterial(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Materials;
