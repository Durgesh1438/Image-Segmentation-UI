import { Button } from "@mui/material";
import './header.css'
import { useUsername } from "../../globalstate";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Header() {
  const {username,setUsername,picture,setpicture,setisLoading}=useUsername()
  const [imageError, setImageError] = useState(false)
  const navigate=useNavigate()

  const handlelogout=(e)=>{
    e.preventDefault()
    setisLoading(true)
    sessionStorage.removeItem('access_token')
    setImageError(false)
    setTimeout(()=>{
      setisLoading(false)
      navigate('/login')
    },3000)
    setUsername(null)
    setpicture(null)
  }

  const handleImageError = () => {
    setImageError(true); // Set image error state to true if image fails to load
  }
  return (
    <div style={{display:"flex",backgroundColor:"grey",justifyContent:"space-between"}}>
      <div
        style={{
          paddingTop: "20px",
          backgroundColor: "grey",
          height: "30px",
          color: "white",
          paddingBottom: "40px",
          fontSize: "1.5rem",
          marginLeft:"680px",
          fontWeight:'bolder'
        }}
      >
        Graceed AI
      </div>
      <div style={{display:"flex"}}>
      {picture && !imageError ? 
        <div style={{ borderRadius: "80%", overflow: "hidden", marginRight: "10px" }}>
         <img style={{ width: "80px", height: "70px" }} src={picture} alt="processed" onError={handleImageError}/>
        </div>
        :<h5 style={{marginTop:"17px",marginRight:"10px",color:"white"}}>{username}</h5>}
      <Button class="btn"  onClick={handlelogout}>LOGOUT</Button>
      </div>
    </div>
  );
}

export default Header;
