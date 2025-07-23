import styles from '../css-comp/DataEntry.module.css'
import { useState,useEffect } from 'react'
import axios from "axios"; // import this at the top

function Dataentry({materials,setMaterials}){
    
    const [form,setForm]=useState({name: '', id: '' ,availability: '',threshold:'',used:''})
   
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setForm(prev=>({...prev,[name]:value}));

    }
    const handleAdd = () => {
  if (form.name && form.id && form.availability && form.threshold) {
    const payload = {
      stock_id: parseInt(form.id),                      // maps to backend `stock_id`
      casting_type: form.name,               // maps to backend `casting_type`
      quantity: parseInt(form.availability), // maps to backend `quantity`
      threshold: parseInt(form.threshold),   // maps to backend `threshold`
    };
    console.log("Payload being sent:", payload);

    axios.post("http://localhost:8000/stock", payload)
      .then((res) => {
        console.log("Added successfully:", res.data);
        setMaterials([...materials, res.data]); // push new material into state
        setForm({ name: '', id: '', availability: '', threshold: '', used: '' }); // clear form
      })
      .catch((err) => {
        console.error("Error adding material:", err.response?.data || err.message);
        alert("Error adding material. Check backend or field names.");
      });
  }
};
     // ✅ Fetch data from backend on component mount
  useEffect(() => {
    axios.get("http://localhost:8000/stock")
      .then(res => {
        console.log("Fetched materials:", res.data);
        setMaterials(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch materials:", err);
        alert("Error fetching materials.");
      });
  }, []); // empty dependency array = run once

    return(
        <>
        <div className="page-fade-in">
        <div className={styles.div}>
            <h3 className={styles.title}>Data Entry</h3>
            <input className={styles.i1} type='text' name='name'
            placeholder='Name' value={form.name} onChange={handleChange}>
            </input>
            <input className={styles.i1} type='text' name='id'
            placeholder="Material_Id" value={form.id} onChange={handleChange}/>
            <input className={styles.i1} type='text' name='availability'
            placeholder='Availability' 
            value={form.availability} onChange={handleChange}/>
            <input className={styles.i1} type='text' name='threshold'
            placeholder='Threshold' 
            value={form.threshold} onChange={handleChange}/>
            <br />
            <button className={styles.btn} onClick={handleAdd}>Submit</button>
            <div className={styles.history}>
              <h3 className={styles.historyTitle}>Data-entry history</h3>
              {materials.map((mat, index) => (
  <div key={index} className={styles.itemBox} >
      <p><strong>Name:</strong> {mat.casting_type}</p>
      <p><strong>Material_Id:</strong> {mat.id}</p>
      <p><strong>Availability:</strong> {mat.quantity}</p>
      <p><strong>Threshold:</strong> {mat.threshold}</p>
  </div>
))}

            </div>
            
        </div>
        </div>
        </>
    )
}
export default Dataentry