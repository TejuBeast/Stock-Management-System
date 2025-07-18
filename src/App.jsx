import { useState } from 'react'
//import './App.css'
import Navbar from './components/navbar'
import Dataentry from './components/DataEntry'
import Update from './components/updateordelete/update'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import Updatedeep from './components/updateordelete/update-deep'
import Threshold from  './components/threshold&used/threshold'
import ThresholdDeep from './components/threshold&used/threshold-deep'
import Used from './components/threshold&used/used'
import UsedDeep from './components/threshold&used/used-deep'

function App() {
  const [materials,setMaterials]=useState([]);
  

  return (
    <>
    
     <BrowserRouter>
     <Link to="/Update">Go to Update Page</Link><br />
     <Link to="/DataEntry">Go to Dataentry Page</Link><br />
     <Link to="/threshold-usage/threshold">Go to Threshold</Link><br />
     <Link to="/threshold-usage/used">Go to used</Link>

            <Routes>
              <Route path='/DataEntry' element={<Dataentry materials={materials} setMaterials={setMaterials}/>} />
              <Route path='/Update' element={<Update materials={materials}/>}/>
              <Route path='/Update-deep' element={<Updatedeep materials={materials} setMaterials={setMaterials}/>}/>
              <Route path='/threshold-usage'>
                     <Route path="threshold" element={<Threshold materials={materials} />}></Route>
                     <Route path="threshold-deep" element={<ThresholdDeep materials={materials} setMaterials={setMaterials}/>}></Route>
                     <Route path="used" element={<Used materials={materials} setMaterials={setMaterials}/>}></Route>
                     <Route path="used-deep" element={<UsedDeep materials={materials} setMaterials={setMaterials}/>}></Route>
              </Route>
            </Routes>
     </BrowserRouter>
     
      
    </>
  )
}

export default App
