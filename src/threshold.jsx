import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Threshold({materials,setMaterials}){
        const navi=useNavigate();
        const [items,setItems]=useState("")
                function handleChange(e){
                        setItems(e.target.value);    
                }
                const filteredMaterials=materials.filter((item)=>item.id.includes(items));
        
                const submit=( material)=>{
                    navi('/threshold-deep', { state: { material } });
                }

        return (<>
                <div >
                                <p >Update component</p>
                                <input  placeholder="Search by Id" value={items} onChange={(e)=>handleChange(e)}></input>
                                {filteredMaterials.length===0?(<p >No matching materials</p>):(
                                    filteredMaterials.map((item,index)=>(
                                        <div onClick={()=>submit(item)} key={index} style={{cursor:"pointer"}}>
                                            <p><strong>Id:</strong>{item.id}</p>
                                            <p><strong>Name:</strong>{item.name}</p>
                                            <p><strong>Threshold:</strong>{item.threshold}</p>
                                        </div>
                                    ))
                
                                )}
                                
                                
                
                            </div>
        </>)
}
export default Threshold