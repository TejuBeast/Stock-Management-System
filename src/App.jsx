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
     <Link to="/DataEntry">Go to Dataentry Page</Link>
     <Link to="/AlertHistory">Go to Alert History Page</Link>
            <Routes>
              <Route path='/DataEntry' element={<Dataentry materials={materials} setMaterials={setMaterials}/>} />
              <Route path='/Update' element={<Update materials={materials}/>}/>
              <Route path='/Update-deep' element={<Updatedeep materials={materials}/>}/>
              <Route path='/AlertHistory' element={<AlertHistory />} />
            </Routes>
     </BrowserRouter>
     
      
    </>
  )
}

export default App
