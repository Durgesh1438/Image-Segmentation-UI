import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';
import './styles.css'
import { useUsername } from '../../globalstate';

function ClusterAnalysis({imageSrc, uploaded, ppmm,minAreaValue,maxAreaValue,cluster,setminAreaValue,setmaxAreaValue,setcluster}) {
  
  const {setManualmeasure}=useUsername()
  const handleMinAreaChange = (event,value) => {
    setManualmeasure(false)
    setminAreaValue(value);
  };

  const handleMaxAreaChange = (event,value) => {
    setManualmeasure(false)
    setmaxAreaValue(value);
  };

  const handleClusterChange = (e) => {
    setManualmeasure(false)
    setcluster(e.target.value);
  };

  return (
    <section className="cluster-analysis" style={{ display:  imageSrc ? 'block' : 'none' }}>
      <div className="sliders">
        <div className="slider-each">
          <div className="slider-value-wrapper">
            <span style={{fontWeight:"bolder"}}>Minimum Contour Area</span>
            <span style={{fontWeight:"bolder"}}> {minAreaValue}</span>
          </div>
          <Box sx={{ width: 400 }}>
             <Slider size='medium' min={0} max={1000} onChange={handleMinAreaChange} aria-label="Default" valueLabelDisplay="auto" />
          </Box>
        </div>
        <div className="slider-each">
          <div className="slider-value-wrapper">
            <span style={{fontWeight:"bolder"}}>Maximum Contour Area</span>
            <span style={{fontWeight:"bolder"}}> {maxAreaValue}</span>
          </div>
          <Box sx={{width:400}}>
              <Slider defaultValue={1000} onChange={handleMaxAreaChange} min={1000} max={5000} aria-label="Default" valueLabelDisplay="auto" />
          </Box>
        </div>
          <InputLabel id="demo-simple-select-label" style={{fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif",fontWeight:"bolder"}}>Cluster Size</InputLabel>
             <Select
                labelId="demo-simple-select-label"
               id="demo-simple-select"
                label="Cluster"
                value={cluster}
                onChange={handleClusterChange}
                style={{width:"200px"}}
              >
             <MenuItem value={2}>2</MenuItem>
             <MenuItem value={3}>3</MenuItem>
             <MenuItem value={4}>4</MenuItem>
           </Select>
      </div>
    </section>
  );
}

export default ClusterAnalysis;
