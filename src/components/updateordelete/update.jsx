import { useState, useEffect } from "react";
import Styles from '../../css-comp/update.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Update() {
  const navi = useNavigate();
  const [items, setItems] = useState("");
  const [materials, setMaterials] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://localhost:8000/stock")
      .then((res) => {
        setMaterials(res.data);
      })
      .catch((err) => {
        console.error("Error fetching materials:", err);
        alert("Failed to load materials from backend.");
      });
  }, []);

  // Filter by stock_id
  const filteredMaterials = materials.filter((item) =>
    item.id?.toString().includes(items.toString())
  );

  const handleChange = (e) => {
    setItems(e.target.value);
  };

  const submit = (material) => {
    navi('/update-deep', { state: { material } });
  };

  return (
    <div className="page-fade-in">
      <div className={Styles.div}>
        <p className={Styles.title}>Update and Delete</p>
        <input
          className={Styles.i1}
          placeholder="Search by stock_id"
          value={items}
          onChange={handleChange}
        />

        {filteredMaterials.length === 0 ? (
          <p className={Styles.noMatch}>No matching materials</p>
        ) : (
          filteredMaterials.map((item, index) => (
            <div onClick={() => submit(item)} key={index} className={Styles.update}>
              <p><strong>Name:</strong> {item.casting_type}</p>
              <p><strong>Id:</strong> {item.id}</p>
              <p><strong>Availability:</strong> {item.quantity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Update;
