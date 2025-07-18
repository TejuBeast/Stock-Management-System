import styles from '../css-comp/DataEntry.module.css'
import { useState } from 'react'

function Dataentry({materials,setMaterials}){
    
    const [form,setForm]=useState({name: '', id: '' ,availability: '',threshold:'',used:''})
   
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setForm(prev=>({...prev,[name]:value}));

    }
    const handleAdd = () => {
    if (form.name && form.availability && form.id&&form.threshold) {
      setMaterials([...materials, form]);// material is a array because it is the data storage fornow
      setForm({ name: '', id: '' ,availability: '',threshold:'',used:''}); // Clear form
    }
   
  };

    return(
        <>
        <div className={styles.div}>
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
                  <p><strong>Name:</strong> {mat.name}</p>
                  <p><strong>Material_Id:</strong> {mat.id}</p>
                  <p><strong>Availability:</strong> {mat.availability}</p>
                  <p><strong>Threshold:</strong> {mat.threshold}</p>
                  <p><strong>Used:</strong> {mat.used="NA"}</p>
              </div>
              ))}
            </div>
            
        </div>
        </>
    )
}
export default Dataentry