/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@mui/material';
import GenerateReportForm from './GenerateReportForm'
import './styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import Spinneroff from '../spinner/spinneroff';
import { useUsername } from '../../globalstate';
// Assuming you have the GenerateReportForm component

const GenerateReport = ({filename,selectedFile,selectedOptionsMorph,cluster,minAreaValue,maxAreaValue,ppmm }) => {
  const [open, setopen] = useState(false);
  const [pdf_filepath,setpdf_filepath]=useState(null)
  const [isLoading,setisLoading]=useState(false)
  
  const handleOpen = () => {
    setopen(true);
    setpdf_filepath(null)
  };
  const handleloading=()=>{
      setisLoading(false)
  }
  const handleload=()=>{
    setisLoading(true)
  }
  const handleClose = () => {
    setopen(false);
  };
  
  return (
    <div className='generatereport'>
      {/* Button to open the pop-up modal */}
      <Button onClick={handleOpen} style={{fontWeight:'bolder'}}>GenerateReport</Button>
      <GenerateReportForm 
         open={open}
         onClose={handleClose}
         selectedFile={selectedFile}
         cluster={cluster}
         minAreaValue={minAreaValue}
         maxAreaValue={maxAreaValue}
         ppmm={ppmm}
         setpdf_filepath={setpdf_filepath}
         setisLoading={handleloading}
         isloading={handleload}
         selectedOptionsMorph={selectedOptionsMorph}
      />
      <div>
        <div>{isLoading&&<Spinneroff/>}</div>
        {
          pdf_filepath && (
            <div style={{marginLeft:"10px",marginTop:"20px",fontWeight:"bolder"}}>
              <a href={pdf_filepath} download={`${filename}_clustered_final_report.pdf`} target="_blank"      rel="noopener noreferrer" style={{fontSize:"20px"}}>
                 <FontAwesomeIcon icon={faFilePdf} style={{fontSize:"40px"}} />
                 Generated.pdf
              </a>
            </div>
          ) 
        }
      </div>
    </div>
  );
};

export default GenerateReport;