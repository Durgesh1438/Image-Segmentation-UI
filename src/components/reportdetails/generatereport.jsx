/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
  const getFilename =()=>{
    switch(filename){
      case 'color':
        return {
          downloadfilename:'ColorCluster_Report.pdf',
          textfilename:'ColorCluster_Report.pdf'
        }
      case 'morph':
        return {
          downloadfilename:'MorphCluster_Report.pdf',
          textfilename:'MorphCluster_Report.pdf'
        }
      case 'measure':
        return {
          downloadfilename:'Measurement_Report.pdf',
          textfilename:'Measurement_Report.pdf'
        }
      default:
        return{
          downloadfilename:'Cluster_Report',
          textfilename:"ClusterReport"
        }
    }
  }

  const {downloadfilename,textfilename}=getFilename()
  return (
    <div className='generatereport'>
      {/* Button to open the pop-up modal */}
      <Button onClick={handleOpen} style={{marginLeft:"5px"}}>GenerateReport</Button>
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
        <div style={{marginTop:"8px",marginLeft:"50px"}}>{isLoading&&<Spinneroff/>}</div>
        {
          pdf_filepath && (
            <div style={{marginLeft:"10px",marginTop:"20px"}}>
              <a href={pdf_filepath} download={downloadfilename} target="_blank"      rel="noopener noreferrer" style={{fontSize:"20px"}}>
                 <FontAwesomeIcon icon={faFilePdf} style={{fontSize:"40px"}} />
                 {textfilename}
              </a>
            </div>
          ) 
        }
      </div>
    </div>
  );
};

export default GenerateReport;