import { useState} from "react"
import Styles from '../../css-comp/update.module.css'
import { useNavigate } from "react-router-dom";
function Update({materials}){
    const navi=useNavigate();

    const [items,setItems]=useState("")
        function handleChange(e){
                setItems(e.target.value);    
        }
        const filteredMaterials=materials.filter((item)=>item.id.includes(items));

        const submit=( material)=>{
            navi('/update-deep', { state: { material } });
        }
        return(
            <div className={Styles.div}>
                <p className={Styles.title}>Update component</p>
                <input className={Styles.i1} placeholder="Search by Id" value={items} onChange={(e)=>handleChange(e)}></input>
                {filteredMaterials.length===0?(<p className={Styles.noMatch}>No matching materials</p>):(
                    filteredMaterials.map((item,index)=>(
                        <div onClick={()=>submit(item)} key={index} className={Styles.update}>
                            <p><strong>Name:</strong>  {item.name}</p>
                            <p><strong>Id:</strong>{item.id}</p>
                            <p><strong>Availability:</strong>{item.availability}</p>
                        </div>
                    ))

                )}
                
                

            </div>
        )
}

export default Update