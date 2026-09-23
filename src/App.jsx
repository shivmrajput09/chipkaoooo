 import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import AllPastes from './pages/AllPastes'
import Navbar from './components/Navbar'


import './App.css'
import ViewPaste from './pages/ViewPaste'

function App() {
 
  return (
    <div>
        <Navbar />
        <Routes>
<Route path="/" element ={<Home />} /> 
<Route path ="/pastes" element = {<AllPastes/>}/>
<Route path="/pastes/:id" element ={<ViewPaste/>}/>
         </Routes>
    
  
      

     </div>
   
  )
}

export default App
