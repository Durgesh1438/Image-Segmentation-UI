/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import {   useRef, useState } from "react";
import {
  Form,
  OverlayTrigger,
  Button,
  Tooltip,
} from "react-bootstrap";
import { API_URL } from "../helpers/helper";
import Webcam from "react-webcam";
import { IoCameraSharp } from "react-icons/io5";
import { MdFileUpload } from "react-icons/md";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import "./uid_up.css";
import ClusterAnalysis from "./analysis/clusteranlaysis";
import Process from "./methods/Process";
import axios from "axios";
import { base64ToBlob, sanitizeBase64 } from "../helpers/helper";
import Spinoff from "./spinner/spinner";

import {useUsername} from './../globalstate'
function Home() {
  const [FileUpload, setFileUpload] = useState(false);
 
  const [minAreaValue, setminAreaValue] = useState(0);
  const [maxAreaValue, setmaxAreaValue] = useState(1000);
  const [cluster, setcluster] = useState(2);
  const [camUpload, setCamUpload] = useState(false);
  const [cameraclick, setcameraclick] = useState(false);
  const [uploadedImg, setUploadedImg] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);
  const [Calibrate, setCalibrate] = useState(false);
  const [CoinDiaEntry, setCoinDiaEntry] = useState("");
  const [ppmm, setPpmm] = useState(null);
  const [ProcessedImage, setProcessedImage] = useState(null);
  const [error,seterror]=useState("")
  const [loading,setloading]=useState(false)
  const {username,manualmeasure,setManualmeasure}=useUsername()
  const [lines, setLines] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [length, setLength] = useState(null);
  const canvasRef = useRef(null);


  const startLine = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint([x, y]);
  };

  const drawLine = (e) => {
    if (!startPoint) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newLines = [[startPoint, [x, y]]];
    setLines(newLines);
    const length = calculateLength(startPoint, [x, y]);
    setLength(length);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newLines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line[0][0], line[0][1]);
      ctx.lineTo(line[1][0], line[1][1]);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  const endLine = () => {
    if (!startPoint) return;
    setStartPoint(null);
  };

  const calculateLength = (startPoint, endPoint) => {
    const [x1, y1] = startPoint;
    const [x2, y2] = endPoint;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / ppmm;
  };
 
  const handleCameraClick = (e) => {
    e.preventDefault();
    setCamUpload(true);
    setFileUpload(false);
    setImageSrc(null);
    setProcessedImage(null);
    setCalibrate(false);
    setPpmm(null);
    setManualmeasure(false)
  };


  const capture = () => {
    setManualmeasure(false)
    const imageSrc = webcamRef.current.getScreenshot();
    const sanitizedImageSrc = sanitizeBase64(imageSrc);
    const blob = base64ToBlob(sanitizedImageSrc);
    const file = new File([blob], "webcam_screenshot.png", {
      type: "image/png",
    });
    setSelectedFile(file);
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("image", file);
      const token = sessionStorage.getItem("access_token");
      //console.log(token);
      try {
        const response = await axios.post(
          `${API_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //const { ppm, filename } = response.data;
        
        setloading(false)
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    fetchData();
    setCamUpload(false);
    setUploadedImg(true);
    setcameraclick(true);
    setImageSrc(imageSrc);
    setCalibrate(false);
    setCoinDiaEntry("");
    setPpmm(null);
    setcameraclick(true);
    setProcessedImage(null);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    setManualmeasure(false)
    setCoinDiaEntry("");
    setSelectedFile(null);
    setImageSrc(null);
    
    setProcessedImage(null);
    setCalibrate(false);
    setCamUpload(false);
    setFileUpload(true);
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    }
    setProcessedImage(null);
  };

  const handleFileSelect = (event) => {
    setManualmeasure(false)
    const file = event.target.files[0];
    setUploadedImg(true);
    setSelectedFile(file);
    
    
  };

  const toggleUpload = () => {
    setManualmeasure(false)
    if (!uploadedImg || !selectedFile){
      seterror("Please upload the file")
      return;
    };
    setloading(true)
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImg(true);
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const token = sessionStorage.getItem("access_token");
      //console.log(token);
      try {
        const response = await axios.post(
          `${API_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //const { ppm, filename } = response.data;
        
        setloading(false)
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    fetchData();
    setloading(false)
    setFileUpload(false);
    
  };
  

  const cameraTooltip = <Tooltip id="camera-tooltip">Choose Camera</Tooltip>;

  const fileUploadTooltip = (
    <Tooltip id="file-upload-tooltip">Choose Upload File</Tooltip>
  );

  
  const handleProcessedImageUpdate = (imageUrl) => {
    
    setProcessedImage(imageUrl);

  };
  
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setManualmeasure(false)
    setloading(true)
    setCalibrate(true);
    setProcessedImage(null);
    
    const fetchData = async () => {
      const formData = new FormData();
      setProcessedImage(null);
      
      formData.append("image",selectedFile)
      formData.append("CoinDiaEntry", CoinDiaEntry);
      const token = sessionStorage.getItem("access_token");
      
      try {
        const response = await axios.post(
          `${API_URL}/calibrate`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const { ppm, filename } = response.data;
        
        const imageResponse = await axios.get(`${API_URL}${filename}`, {
         headers: {
         Authorization: `Bearer ${token}`,
          },
          responseType:'blob'
        });
        const imageurl=URL.createObjectURL(imageResponse.data)
       
       
        setProcessedImage(imageurl)
        setPpmm(ppm);
        setloading(false)
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    fetchData();
  };
  
  const handlesubmit = async (e) => {
    e.preventDefault();
    Calibrate(true);
  };
  const handleManualMeasure=(e)=>{
     setManualmeasure(!manualmeasure)
     setLength(null)
  }
 
  return (
    
    <div>
      
      <div className="mainui">
        <Header />
        <div className="ui-display">
          <div className="left-container">
            <div className="action">
              <OverlayTrigger placement="bottom" overlay={cameraTooltip}>
                <button onClick={handleCameraClick} className="btn1">
                  <IoCameraSharp style={{ fontSize: "2rem" }} />
                </button>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={fileUploadTooltip}>
                <button onClick={handleFileUpload} className="btn2">
                  <MdFileUpload style={{ fontSize: "2rem" }} />
                </button>
              </OverlayTrigger>
            </div>
            {FileUpload && (
              <div className="media-upload-wrapper">
                <h5 style={{fontWeight:"bolder"}}>Choose file to upload</h5>
                <div className="upload-wrapper">
                  <input type="file" style={{fontWeight:"bolder"}} onChange={handleFileSelect} />
                  {error&&<div style={{color:"red",marginTop:"10px"}}>{error}</div>}
                  <Button onClick={toggleUpload} className="btn-primary">
                    Upload
                  </Button>
                </div>
              </div>
            )}
            {camUpload && (
              <>
                <div className="camera-container">
                  <Webcam
                    className="webcam-style"
                    audio={false}
                    screenshotFormat="image/jpeg"
                    ref={webcamRef} // Set ref to access webcam component
                    onUserMedia={() => console.log("User media started")}
                  />
                  <button onClick={capture} style={{fontWeight:"bolder"}}>Capture Photo</button>
                </div>
              </>
            )}
            
            <div className="form">
              {imageSrc && (
                <div style={{ display: "flex" }}>
                  <Form className="align-left" onSubmit={handleFormSubmit}>
                    <Form.Group style={{ display: "flex" }}>
                      <div>
                        <Form.Label className="coin-dia-entry-label dialabel">
                          Enter reference value (in mm)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={CoinDiaEntry}
                          onChange={(e) => setCoinDiaEntry(e.target.value)}
                          placeholder="Enter reference value (in mm)"
                          required
                          className="refvalcls"
                        />
                      </div>

                      <Button
                        className="button-calibrate"
                        variant="primary"
                        type="submit"
                        disabled={!CoinDiaEntry}
                        onSubmit={handlesubmit}
                      >
                        Calibrate
                      </Button>
                    </Form.Group>
                    {ppmm && (
                      <div className="values">
                        <div className="value-wrapper">
                          <div className="value-label">
                            Pixels per millimeter
                          </div>
                          <div className="value">{ppmm}</div>
                        </div>
                      </div>
                    )}

                  </Form>
                </div>
              )}
            </div>
            <div>
              {
                imageSrc && (
                  <div style={{display:"flex",marginLeft:"50px",marginTop:"20px"}}>
                     <Button className="manual-measure" onClick={handleManualMeasure}>Manual Measure</Button>
                    {(manualmeasure||length) &&
                     (<div style={{marginLeft:"40px",marginTop:"23px"}}>
                     <div className="value-label">
                          Measured Length in mm
                          </div>
                          <div className="value">{length?length.toFixed(2):0}</div>
                     </div>)
                    }
                  </div>
                )
              }
            </div>
            <div>
              {imageSrc && (
                <div className="analysis">
                  <ClusterAnalysis
                    imageSrc={imageSrc}
                    uploaded={uploadedImg}
                    ppmm={ppmm}
                    minAreaValue={minAreaValue}
                    maxAreaValue={maxAreaValue}
                    cluster={cluster}
                    setminAreaValue={setminAreaValue}
                    setmaxAreaValue={setmaxAreaValue}
                    setcluster={setcluster}
                    
                  />
                  <Process
                    imageSrc={imageSrc}
                    selectedFile={selectedFile}
                    cluster={cluster}
                    minAreaValue={minAreaValue}
                    maxAreaValue={maxAreaValue}
                    ProcessedImage={ProcessedImage}
                    setProcessedImage={handleProcessedImageUpdate}
                    ppmm={ppmm}
                    setloading={setloading}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="right-container">
            {imageSrc && (
              <div className="imageCalibration">
                <h5 style={{fontWeight:"bolder"}}>Selected Image</h5>
                <img src={imageSrc} alt="Uploaded" />
                {manualmeasure &&
                (<canvas ref={canvasRef} width={280} height={200} onMouseDown={startLine} onMouseMove={drawLine} onMouseUp={endLine} className="canvas"  />)}
                {ProcessedImage && (
                  <div style={{marginTop:"30px"}}>
                    <h5 style={{fontWeight:"bolder"}}>Processed Image</h5>
                    <img
                      src={ProcessedImage}
                      alt="Processed"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {loading?<Spinoff/>:""}
        {imageSrc&&<Footer/>}
      </div>
      
    </div>
    
    
  );
}

export default Home;
