import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from "./pages/Home"
import { Navbar } from './components/common/Navbar';
import {useDispatch,useSelector} from "react-redux"
import { About } from './pages/About';

function App() {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  return (
    <div className="bg-richblack-900">
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>}/>
      </Routes>
    </div>
  );
}

export default App;
