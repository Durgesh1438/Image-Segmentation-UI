/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Spinoff from "../spinner/spinner";
//import Select from "@mui/material/Select";
import { convertDataToExcelFile } from "../../helpers/helper";
import axios from "axios";
import * as XLSX from "xlsx";
import Select from "react-select";
import { FaFileExcel, FaSlideshare } from "react-icons/fa";
import "./styles.css";
import { useState } from "react";
import GenerateReport from "../reportdetails/generatereport";
import { Checkbox } from "@mui/material";
import Spinneroff from "../spinner/spinneroff";
import { useUsername } from "../../globalstate";
import { API_URL } from "../../helpers/helper";
function Process({
  imageSrc,
  selectedFile,
  cluster,
  minAreaValue,
  maxAreaValue,
  ProcessedImage,
  setProcessedImage,
  ppmm,
  setloading,
}) {
  const [Color, setColor] = useState(false);
  const [Morph, setMorph] = useState(false);
  const [Measure, setMeasure] = useState(false);
  const [excelfile1, setexcelfile1] = useState(null);
  const [excelfile2, setexcelfile2] = useState(null);
  const [excelfile3, setexcelfile3] = useState(null);
  const [selectedOptionMorph, setselectedOptionMorph] = useState(null);
  const [selectedOptionMeasure, setselectedOptionMeasure] = useState("");
  const [file3, setfile3] = useState(false);
  const [file1,setfile1]=useState(false)
  const [filename, setfilename] = useState("");
  const [generated, setgenerated] = useState(false);
  const [menuOpenMorph, setMenuOpenMorph] = useState(false);
  const [selectedOptionsMorph, setSelectedOptionsMorph] = useState([]);
  const [selectedOptionsMeasure, setSelectedOptionsMeasure] = useState([]);
  
  
  const {processname,setprocessname,setManualmeasure,isLoading,setisLoading}=useUsername()
  const options = [
    { label:"Area",value:"areas"}, 
    { label:"Perimeter",value:"perimeters"}, 
    { label:"Length",value:"lengths"},   
    { label:"Width",value:"widths"}, 
    { label:"AspectRatio",value:"aspectratios"},
    { label:"Extent",value:"extents"}, 
    { label:"Convex_Area",value:"convex_areas"},   
    { label:"Convex_Peri",value:"convex_perimeters"}, 
    { label:"Solidity",value:"soliditys"}, 
    { label:"Convexity",value:"convexitys"}, 
    { label:"MaxDefect",value:"maxdefectdistances"}, 
    { label:"AvgDefect",value:"avgdefectdistances"}, 
    { label:"MinElcloDia",value:"minEnclosingDiameters"},
    { label:"EquiDia",value:"equi_diameters"}, 
    { label:"Sphericity",value:"sphericitys"}, 
    { label:"Eccentricity",value:"eccentricitys"},  
    { label:"MajAxisLen",value:"major_axis_lengths"},
    { label:"MinAxisLen",value:"min_axis_lengths"},
    { label:"Circularity",value:"circularitys"}, 
    { label:"Compactness",value:"compactness"},
  ];
  
  const handleMorphChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.label);
   
    setSelectedOptionsMorph(selectedValues);
  };

  const handleMorphDoneClick = () => {
    
    setisLoading(true)
    setProcessedImage(null);
    setprocessname(null)
    setexcelfile1(null);
    setfilename("");
    setexcelfile2(null);
    setexcelfile3(null);
    setfile3(false)
    setfile1(false)
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("minAreaValue", minAreaValue);
      formData.append("maxAreaValue", maxAreaValue);
      formData.append("cluster", cluster);
      formData.append("ppmm", ppmm);
      formData.append("parameterSelection", selectedOptionsMorph);
      console.log(minAreaValue, maxAreaValue, selectedOptionsMorph);
      const token = sessionStorage.getItem("access_token");
      try {
        const response = await axios.post(
          `${API_URL}/morphcluster`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { morphclusteredimg, excelpath1, excelpath2 } = await response.data;
        
        const imageResponse = await axios.get(
          `${API_URL}${morphclusteredimg}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const excelresponse1 = await axios.get(
          `${API_URL}${excelpath1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const excelresponse2 = await axios.get(
          `${API_URL}${excelpath2}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const url1 = URL.createObjectURL(excelresponse1.data, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url2 = URL.createObjectURL(excelresponse2.data, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const imageurl = URL.createObjectURL(imageResponse.data);
        
        setfilename("morph");
        setprocessname("morph")
        setProcessedImage(imageurl);
        setexcelfile1(url1);
        setexcelfile2(url2);
        setfile1(true)
        setfile3(false)
        setisLoading(false)
      } catch (error) {
        console.error("Error uploading clustering image:", error);
      }
    };
    fetchData();
  };
  const handleMeasureChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.label);
    
    setSelectedOptionsMeasure(selectedValues);
  };

  const handleMeasureDoneClick = () => {
    setisLoading(true)
    setProcessedImage(null);
    setfilename("");
    setprocessname(null)
    setexcelfile1(null);
    setexcelfile2(null);
    setexcelfile3(null);
    setfile3(false);
    setfile1(false)
    
    setProcessedImage(null);
    const fetchData = async () => {
      const formData = new FormData();

      formData.append("minAreaValue", minAreaValue);
      formData.append("maxAreaValue", maxAreaValue);
      formData.append("cluster", cluster);
      formData.append("ppmm", ppmm);
      formData.append("parameterSelection", selectedOptionsMeasure);
      
      const token = sessionStorage.getItem("access_token");
      try {
        const response = await axios.post(
          `${API_URL}/measurecluster`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { measureclusteredimg, excelpath3 } =
          await response.data;
        
        const imageResponse = await axios.get(
          `${API_URL}${measureclusteredimg}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
      
        const excelresponse3 = await axios.get(
          `${API_URL}${excelpath3}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        
        const url3 = URL.createObjectURL(excelresponse3.data, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const imageurl = URL.createObjectURL(imageResponse.data);
        setfilename("measure");
        setprocessname("measure")
        setProcessedImage(imageurl);
        setexcelfile1(null);
        
        setexcelfile2(null);
        setexcelfile3(url3);
        setfile3(true);
        setisLoading(false)
      } catch (error) {
        console.error("Error uploading clustering image:", error);
      }
    };
    fetchData();
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "auto",
      maxWidth: "300px",
      height: "auto",
    }),
    menu: (provided) => ({
      ...provided,
      width: "auto", // Set menu width to auto
      borderRadius: "4px",
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
    }),
    menuList: (provided) => ({
      ...provided,
      display: "flex",
      flexWrap: "wrap",
    }),
    option: (provided) => ({
      ...provided,
      display: "inline-block",
      margin: "2px", // Adjust margin as needed
    }),
  };

  const handleMorph = () => {
    // Handle Morph cluster action based on the selected option
    setManualmeasure(false)
    setMorph(!Morph);
    setexcelfile1(null);
    setexcelfile2(null);
    setexcelfile3(null);
    setgenerated(true);
    setfile3(false);
    setfile1(false)
    setselectedOptionMorph("");
    setProcessedImage(null);
    setMenuOpenMorph(true);
  };
  const handleColor = (e) => {
    setManualmeasure(false)
    setColor(true);
    setgenerated(true);
    setfile3(false);
    setProcessedImage(null);
    setexcelfile1(null);
    setexcelfile2(null);
    setfile1(false)
    setfile3(false)
    setexcelfile3(null);
    handleColorImageFetch();
  };

  const handleColorImageFetch = () => {
    setisLoading(true);
    setfilename("");
    setfile1(false)
    setfile3(false)
    setprocessname("")
    const fetchData = async () => {
      const formData = new FormData();
      formData.append("minAreaValue", minAreaValue);
      formData.append("maxAreaValue", maxAreaValue);
      formData.append("cluster", cluster);
      const token = sessionStorage.getItem("access_token");
      try {
        const response = await axios.post(
          `${API_URL}/colorcluster`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { colorclusteredimg, excelpath1, excelpath2 } =
          await response.data;
        
        const imageResponse = await axios.get(
          `${API_URL}${colorclusteredimg}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const excelresponse1 = await axios.get(
          `${API_URL}${excelpath1}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const excelresponse2 = await axios.get(
          `${API_URL}${excelpath2}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        const url1 = URL.createObjectURL(excelresponse1.data, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url2 = URL.createObjectURL(excelresponse2.data, {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const imageurl = URL.createObjectURL(imageResponse.data);
        setfilename("color");
        setprocessname("color")
        setProcessedImage(imageurl);
        setexcelfile1(url1);
        setexcelfile2(url2);
        setfile1(true)
        setfile3(false)
        setisLoading(false);
      } catch (error) {
        console.error("Error uploading clustering image:", error);
      }
    };
    fetchData();
  };
  const handleMeasure = (e) => {
    setManualmeasure(false)
    setMeasure(!Measure);
    setProcessedImage(null);
    setexcelfile1(null);
    setexcelfile2(null);
    setfile3(false);
    setfile1(false)
    setexcelfile3(null);
    setselectedOptionMeasure("");
    setgenerated(true);
    handleMeasureDoneClick()
  };
  return (
    <>
      {imageSrc && (
        <section className="process">
          <div style={{marginLeft:"700px"}}>{isLoading && <Spinneroff />}</div>
          <Stack direction="row" spacing={2}>
            <Button onClick={handleColor} style={{fontWeight:"bolder"}}>Color cluster</Button>
            <Stack direction="row" spacing={2}>
              <Button onClick={handleMorph} style={{fontWeight:"bolder"}} >Morph cluster</Button>
              {Morph && (
                <FormControl>
                  <div style={{ display: "flex" }}>
                    <Select
                      options={options}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      onChange={handleMorphChange}
                      menuPlacement="top"
                      styles={customStyles}
                    />
                    <Button onClick={handleMorphDoneClick} style={{fontWeight:"bolder"}}>Done</Button>
                  </div>
                </FormControl>
              )}
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button onClick={handleMeasure} style={{fontWeight:"bolder"}} >Measure Seed/Grain</Button>
            </Stack>
            
          </Stack>
          {(file1 || file3) && (
            <div className="excelfiles">
              <h5 style={{fontWeight:"bolder"}}>Generated files after the processes</h5>
              <>
                <div
                  style={{ display: "flex", marginTop: "20px", gap: "40px" }}
                >
                  <div style={{display:file3?"none":"block"}}>
                    {/* Excel file icon */}
                    <a
                      href={excelfile1}
                      download={`${filename}_clustered1.xlsx`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "20px",fontWeight:'bolder' }}
                    >
                      <FaFileExcel style={{ fontSize: "40px" }} />
                      {filename}_clustered1.xlsx
                    </a>
                  </div>
                  <div style={{display:file3?"none":"block"}}>
                    {/* Excel file icon */}
                    <a
                      href={excelfile2}
                      download={`${filename}_clustered2.xlsx`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "20px",fontWeight:'bolder' }}
                    >
                      <FaFileExcel style={{ fontSize: "40px" }} />
                      {filename}_clustered2.xlsx
                    </a>
                  </div>
                  <div style={{ display: file3 ? "block" : "none" }}>
                    <a
                      href={excelfile3}
                      download="grains.xlsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "20px",fontWeight:'bolder' }}
                    >
                      <FaFileExcel style={{ fontSize: "40px" }} />
                      grains.xlsx
                    </a>
                  </div>
                </div>
              </>
            </div>
          )}

          {(excelfile1||excelfile3) && (
            <GenerateReport
              filename={filename}
              selectedFile={selectedFile}
              selectedOptionsMorph={selectedOptionsMorph}
              cluster={cluster}
              minAreaValue={minAreaValue}
              maxAreaValue={maxAreaValue}
              ppmm={ppmm}
            />
          )}
        </section>
      )}
    </>
  );
}

export default Process;

