/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";
import "./styles.css";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";
import Spinneroff from "../spinner/spinneroff";
import { useUsername } from "../../globalstate";

const Subscribe = () => {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [amount, setAmount] = useState(0);
  const [endDate, setEndDate] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading,setisLoading]=useState(false)
  const [Razorpay] = useRazorpay();
  const [freetrail,setFreetrail]=useState(false)
  const [subscribe,setSubscribe]=useState(false)
  const [error,seterror]=useState(null)
  const navigate=useNavigate()
  const {setpicture}=useUsername()
  const options = [
    { value: "1 day", label: "1 Day" },
    { value: "7 days", label: "7 Days" },
    { value: "7 days trial", label: "7 Days Free Trial" },
    { value: "1 month", label: "1 Month" },
    { value: "2 months", label: "2 Months" },
    { value: "3 months", label: "3 Months" },
    { value: "1 year", label: "1 Year" },

  ];

  const handlePlanChange = (selectedOption) => {
    setSelectedPlan(selectedOption.value);
    if(selectedOption.value==="7 days trial"){
      setFreetrail(true)
      setSubscribe(false)
    }
    else{
      setFreetrail(false)
      setSubscribe(true)
    }
    // Calculate amount based on selected plan
    if (selectedOption.value === "1 day") {
      setAmount(50); // Set amount for 1 day subscription
    } else if (selectedOption.value === "7 days") {
      setAmount(100); // Set amount for 7 days subscription
    }
    else if (selectedOption.value === "7 days trial") {
      setFreetrail(true)
      setAmount(0); // Free trial for 7 days
    }
    else if (selectedOption.value === "1 month") {
      setAmount(200); // Set amount for 1 month subscription
    } else if (selectedOption.value === "2 months") {
      setAmount(400); // Set amount for 2 months subscription
    } else if (selectedOption.value === "3 months") {
      setAmount(500); // Set amount for 3 months subscription
    } else if (selectedOption.value === "1 year") {
      setAmount(1500); // Set amount for 1 year subscription
    }
  };
  const handleFreeTrail= async (e)=>{
    e.preventDefault();
    if(!phoneNumber || !email || !name){
       seterror("Please fill up the details to continue")
       return ;
    }
    seterror(null)
    setisLoading(true)
    let startDate=new Date();
    let endDate=new Date(startDate)
    endDate.setDate(endDate.getDate()+7)
    const fetchData=async ()=>{
      const token= sessionStorage.getItem("access_token");
      try{
      const response=await axios.post('http://localhost:3001/razorpay/freetrail',{
        startDate:startDate,
        endDate:endDate,
        subscriptionPlan:selectedPlan,
        freetrail:true,
      },
      {
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
           
        }
      }
      )
      const {success,picture,message}=response.data;
      console.log(response.data)
      if(success){
        console.log(picture)
        setisLoading(false)
        setpicture(picture)
        navigate("/home")
      }
      else{
        seterror(message)
        setisLoading(false) 
      }
      
    }
    catch(error){
      console.error("error in free trail:",error)
    }
    }
    fetchData();
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    if(!phoneNumber || !email || !name){
       seterror("Please fill up the details to continue")
       return ;
    }
    seterror(null)
    
    let startDate = new Date();
    let endDate = new Date(startDate);
    console.log(endDate)
    if (selectedPlan === "1 day") {
      endDate.setDate(endDate.getDate() + 1); // 1 day subscription
    } else if (selectedPlan === "7 days") {
      endDate.setDate(endDate.getDate() + 7); // 7 days subscription
    }
    else if (selectedPlan === "7 days trial") {
      endDate.setDate(endDate.getDate() + 7); // Free trial for 7 days
    }
    else if (selectedPlan === "1 month") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (selectedPlan === "2 months") {
      endDate.setMonth(endDate.getMonth() + 2);
    } else if (selectedPlan === "3 months") {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (selectedPlan === "1 year") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    const fetchData = async ()=>{
       
      const token= sessionStorage.getItem("access_token");
       try{
        
        const response = await axios.post("http://localhost:3001/razorpay/order", {
          amount: amount,
        },{
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`,
             
          }
        });
  
        const { data } = response;
        const options = {
          key: 'rzp_test_ovVodcPR2JciPd', // Replace with your Razorpay key
          amount: data.amount,
          currency: "INR",
          name: "Durgesh Kovvuri",
          description: "Subscription Payment",
          order_id: data.id,
          handler: async (response) => {
            setisLoading(true)
            if(response && response.razorpay_payment_id ){
              try {
                console.log(response)
                const captureResponse = await axios.post("http://localhost:3001/razorpay/capture", {
                  paymentId: response.razorpay_payment_id,
                  amount: amount,
                },{
                  headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`,
                     
                  }
                });
                const {success}=captureResponse.data
                if(success){
                  const dbupdate= await axios.post('http://localhost:3001/razorpay/dbupdate',
                  {
                    isSubscriber: true,
                    subscriptionPlan:selectedPlan,
                    startDate:startDate,
                    endDate:endDate
                  },
                  {
                    headers:{
                      "Content-Type":"application/json",
                       Authorization: `Bearer ${token}`,
                    }
                  }
                  )
                  const {success,picture,message}=dbupdate.data
                  if(success){
                    setisLoading(false)
                    setpicture(picture)
                    navigate('/home')
                  }
                  else{
                    setisLoading(false)
                    navigate('/subscribe')
                  }
                }
              } catch (error) {
                console.error("Error capturing payment:", error);
              }
            }
            
          },
          prefill: {
            name: name,
            email: email,
            contact: phoneNumber,
          },
          theme: {
            color: "#528FF0",
          },
        };
  
        const rzp1 = new Razorpay(options);
        rzp1.open();
       }
       catch(error){
        console.error("error from server:",error)
       }
    }
    fetchData()
  };

  return (
    <div>
    <div>
        <div className="login-header">
          <div className="login-title">
            <span className="spanelement">Image Segmentation</span>
          </div>
        </div>
      </div>
    <div className="main">
      <div className="subscription-box">
        <div>
          <span style={{fontWeight:"500"}}>choose subscription plan</span>
        </div>
        <div style={{marginTop:"10px"}}>
          <Select
            value={options.filter((option) => option.value === selectedPlan)}
            onChange={handlePlanChange}
            options={options}
            placeholder="Select a plan"
          />
        </div>
        {error?<label style={{color:"red"}}>{error}</label>:""}
        <div className="input-container">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {loading? <div style={{marginLeft:"120px",marginTop:"20px"}}><Spinneroff/></div>:""}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
         
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          {(amount >0 && subscribe)&& (
            <div className="payment-details">
              <span style={{fontWeight:"500"}}>Amount to pay: ₹{amount}</span>
              <button onClick={handlePayment}>Pay Now</button>
            </div>
           )
          }
          <div className="freeTrail">
          {freetrail?<button  onClick={handleFreeTrail}>Start free trail</button>:""}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Subscribe;
