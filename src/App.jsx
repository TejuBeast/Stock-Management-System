import { useState } from 'react'
//import './App.css'
import AlertHistory from './AlertHistory'
import Navbar from './components/navbar'
import Dataentry from './components/DataEntry'
import Update from './components/updateordelete/update'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import Updatedeep from './components/updateordelete/update-deep'
function App() {
  const [materials,setMaterials]=useState([]);
  

  return (
    <>
    
     <BrowserRouter>
     <Link to="/Update">Go to Update Page</Link><br />
     <Link to="/DataEntry">Go to Dataentry Page</Link><br />
     <Link to="/AlertHistory">Go to Alert History Page</Link><br />
            <Routes>
              <Route path='/DataEntry' element={<Dataentry materials={materials} setMaterials={setMaterials}/>} />
              <Route path='/Update' element={<Update materials={materials}/>}/>
              <Route path='/Update-deep' element={<Updatedeep materials={materials} setMaterials={setMaterials}/>}/>
              <Route path='/AlertHistory' element={<AlertHistory materials={materials} setMaterials={setMaterials}/>} />
            </Routes>
     </BrowserRouter>
     
      
    </>
  )
}

export default App
