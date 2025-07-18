import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './used.css';

function Used({materials,setMaterials}){
        const navi=useNavigate();
        const [items,setItems]=useState("")
                function handleChange(e){
                        setItems(e.target.value);    
                }
                const filteredMaterials=materials.filter((item)=>item.id.includes(items));
        
                const submit=( material)=>{
                    navi('/used-deep', { state: { material } });
                }

        return (<>
        <div className="page-fade-in">
                <div  className="used">
                                <p className="used-title">Material Used</p>
                                <input  placeholder="Search by Id" value={items} onChange={(e)=>handleChange(e)}></input>
                                {filteredMaterials.length===0?(<p >No matching materials</p>):(
                                    filteredMaterials.map((item,index)=>(
                                        <div className="used-item" onClick={()=>submit(item)} key={index} style={{cursor:"pointer"}}>
                                            <p><strong>Id:</strong>{item.id}</p>
                                            <p><strong>Name:</strong> {item.name}</p>
                                            <p><strong>Used:</strong>{item.used}</p>
                                        </div>
                                    ))
                
                                )}
                                
                                
                
                            </div>
        </div>
        </>)
}
export default Used