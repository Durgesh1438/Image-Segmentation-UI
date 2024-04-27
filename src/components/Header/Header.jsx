/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button } from "@mui/material";
import "./header.css";
import { useUsername } from "../../globalstate";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Header() {
  const {
    username,
    setUsername,
    picture,
    setpicture,
    setloading,
    setplan,
    setexpires,
    plan,
    expires,
  } = useUsername();
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const data1 = sessionStorage.getItem("plan");
    const data2 = sessionStorage.getItem("expires");
    setplan(data1);
    setexpires(data2);
  }, []);

  const handlelogout = (e) => {
    e.preventDefault();
    setloading(true);
    sessionStorage.removeItem("access_token");
    setImageError(false);
    setTimeout(() => {
      setloading(false);
      navigate("/login");
    }, 3000);
  };

  const handleImageError = () => {
    setImageError(true); // Set image error state to true if image fails to load
  };
  return (
    <div className="header-ui">
      <div className='left-section'>
        <div className="subscription-info">
          <span>Subscription :&nbsp;{plan}</span>
          <span>End date :&nbsp;{expires}</span>
        </div>
      </div>
      <div className="middle-section">
      <div className="app-title">
        <span className="spanele">Image Segmentation</span>
      </div>
      </div>
      <div className="right-section">
      <div style={{display:'flex'}}>
        {picture && !imageError ? (
          <div>
            <div
              style={{
                overflow: "hidden",
                marginRight: "10px",
                marginTop: "10px",
              }}
            >
              <img
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src={picture}
                alt="processed"
                onError={handleImageError}
              />
            </div>
          </div>
        ) : (
          <div>
            <h5
              style={{ marginTop: "17px", marginRight: "10px", color: "white" }}
            >
              {username}
            </h5>
          </div>
        )}
        <div className="btn-title">
          <Button class="btnheader" onClick={handlelogout}>
            LOGOUT
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Header;

