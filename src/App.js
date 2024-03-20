/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { BrowserRouter,Navigate,Route, Routes} from "react-router-dom";
import Home from "./components/ui";
import Signup from "./components/signup/signup";
import Login from "./components/login/login";
import './App.css'
import Subscribe from "./components/subscribe/Subscribe";
import Admin from "./components/Admin/Admin";
import { useState } from "react";
function App(){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin,setisAdmin]=useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleAdmin=()=>{
    setisAdmin(true)
  }

  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup/>} />
            <Route  path="/login" element={<Login onLogin={handleLogin} onAdmin={handleAdmin} />} />
            <Route
              path="/home"
              element={
                isLoggedIn ? <Home /> : <Navigate to="/login" replace />
               }
            />
            <Route path="/subscribe"  element={isLoggedIn ? <Subscribe/>: <Navigate to="/login" />}/>
            <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
            <Route path="/admin" element={(isLoggedIn && isAdmin)?<Admin/>:<Navigate to="/login"/> }/>
         </Routes>
        </BrowserRouter>
      </div>
    );
}



export default App;
