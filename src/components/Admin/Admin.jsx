/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState, useRef, } from "react";
import "./styles.css";
import Select from "react-select";
import { useDownloadExcel } from "react-export-table-to-excel";
import { Button, Input  } from "@mui/material";
import { useNavigate } from "react-router-dom";


const options = [
  { value: "1 day", label: "1 Day" },
  { value: "7 days", label: "7 Days" },
  { value: "7 days trial", label: "7 Days Free Trial" },
  { value: "1 month", label: "1 Month" },
  { value: "2 months", label: "2 Months" },
  { value: "3 months", label: "3 Months" },
  { value: "1 year", label: "1 Year" },
];

function Admin() {
  const [userData, setUserData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const tableRef = useRef(null);
  const [searchUser, setsearchUser] = useState({});
  const [emailinfo, setemailinfo] = useState(null);
  const [enablebutton,setenablebutton]=useState(true)
  const [change,setchange]=useState(false)
  const [error,setError]=useState(null)
  const navigate=useNavigate()
  const handleLogout=(e)=>{
    e.preventDefault();
    setsearchUser({});
    setemailinfo(null)
    setenablebutton(true)
    setSelectedOption(options[0])
    setUserData(null)
    navigate('/login');
    return;
  }
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "UsersData",
    sheet: "Users",
  });
  useEffect(() => {
    fetchData();
  }, [change]);
  const fetchData = async () => {
    const token = sessionStorage.getItem("access_token");
    const response = await axios.get("http://localhost:3001/admin/getUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    setUserData(data);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const fetchData = async ()=>{
      try{
          const token = sessionStorage.getItem("access_token");
          const response = await axios.post(
          "http://localhost:3001/admin/updateUser",
          {
            email: emailinfo,
            pack:selectedOption.value
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
         );
         
         setchange(!change)
        }
       catch(error){
       console.error("error in updating")
       }
    }
    fetchData()

  };
  const handleSearch = (e) => {
    e.preventDefault();
    setchange(!change)
    const fetchdata = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const response = await axios.post(
          "http://localhost:3001/admin/searchUser",
          {
            email: emailinfo,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const {success,user,message}=response.data
        if(success){
          setError(null)
          setsearchUser(user);
        }
        else{
          setError(message)
        }
      } catch (error) {
        console.error("error in searching user:", error);
      }
    };
    fetchdata();
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      marginTop: 20,
      width: 300, // Adjust the width as needed
    }),
  };
  const handleSelect = (selectedOption) => {
    
    setSelectedOption(selectedOption) 
    setenablebutton(false)
  };
  
  return (
    <div className="admin-container">
      <div className="header">
        <div className="element">ADMIN</div>
        <div className="button">
        <Button onClick={handleLogout} className="btn-admin">LOGOUT</Button>
        </div>
      </div>
      {userData && (
        <div className="user-data">
          <label className="label">USER DATA</label>
          <Button onClick={onDownload} style={{ marginLeft: "600px" }}>
            Export{" "}
          </Button>
          <div className="table-container">
            <table className="admin-table" ref={tableRef}>
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Subscriber</th>
                  <th>Subscription Plan</th>
                  <th>Free Trail</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      {user.startDate ? new Date(user.startDate).toLocaleDateString('en-GB')  : "Not yet subscribed"}
                    </td>
                    <td>
                      {user.endDate ? new Date(user.endDate).toLocaleDateString('en-GB')  : "Not yet subscribed"}
                    </td>
                    <td>{user.isSubscriber ? "Yes" : "No"}</td>
                    <td>
                      {user.subscriptionPlan
                        ? user.subscriptionPlan
                        : "No active Plan"}
                    </td>
                    <td>{user.freetrail ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="error">
            {error && <span>{error}</span>}
          </div>
          <div className="manipulation">
            <div className="search">
              <span style={{ marginTop: "6px" }}>
                EMAIL :
              </span>
              <Input
                className="search-field"
                placeholder="Search"
                onChange={(e) => {
                  setemailinfo(e.target.value);
                }}
              />
              <Button onClick={handleSearch} style={{ marginLeft: "20px" }}>
                search
              </Button>
            </div>
            <Button
              onClick={handleUpdate}
              style={{
                
                backgroundColor: "aqua",
                width: "90px",
                marginLeft: "20px",
              }}
              disabled={enablebutton}
            >
              UPDATE
            </Button>
          </div>
        </div>
      )}
      <div>
        <div className="searchData">
          <div className="tablecontainer1">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>pack</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchUser.username}</td>
                  <td>{searchUser.email}</td>
                  <td>{searchUser.subscriptionPlan}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="select">
            <label style={{ fontWeight: "450" }}>SELECT PACK</label>
            <Select
              value={selectedOption}
              options={options}
              styles={customStyles}
              onChange={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
