import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Universal pages
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Stock from './Stock';
import AlertHistory from './AlertHistory';

// Data Entry hub and sub-pages
import DataEntryMenu from './DataEntryMenu';
import DataEntry from './components/DataEntry';
import Update from './components/updateordelete/update';
import Updatedeep from './components/updateordelete/update-deep';
import Threshold from './threshold';
import ThresholdDeep from './threshold-deep';
import Used from './used';
import UsedDeep from './used-deep';


// Sub-navbar
import DataEntryNavbar from './DataEntryNav';
//temp data
//import mockMaterials from './mockMaterials';
import StockPredictionChart from './mockml';

function App() {
  // REMOVE mockMaterials if you use backend fully
// const [materials, setMaterials] = useState(mockMaterials);

// Use empty array and fetch from backend later
const [materials, setMaterials] = useState([]);


  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* === Main Pages === */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/dataentry" element={<DataEntryMenu />} />
        <Route path="/ml" element={<StockPredictionChart/>}/>
        <Route path="/alerthistory"
          element={<AlertHistory materials={materials} setMaterials={setMaterials} />}
        />
        
        {/* === Data Entry Sub-pages with Navbar === */}
        <Route
          path="/dataentry/new"
          element={
            <>
              <DataEntryNavbar />
              <DataEntry materials={materials} setMaterials={setMaterials} />
            </>
          }
        />
        <Route
          path="/update"
          element={
            <>
              <DataEntryNavbar />
              <Update materials={materials} />
            </>
          }
        />
        <Route
          path="/update-deep"
          element={
            <>
              <DataEntryNavbar />
              <Updatedeep materials={materials} setMaterials={setMaterials} />
            </>
          }
        />
        <Route
          path="/threshold"
          element={
            <>
              <DataEntryNavbar />
              <Threshold materials={materials} />
            </>
          }
        />
        <Route
          path="/threshold-deep"
          element={
            <>
              <DataEntryNavbar />
              <ThresholdDeep materials={materials} setMaterials={setMaterials} />
            </>
          }
        />
        <Route
          path="/used"
          element={
            <>
              <DataEntryNavbar />
              <Used materials={materials} setMaterials={setMaterials} />
            </>
          }
        />
        <Route
          path="/used-deep"
          element={
            <>
              <DataEntryNavbar />
              <UsedDeep materials={materials} setMaterials={setMaterials} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
