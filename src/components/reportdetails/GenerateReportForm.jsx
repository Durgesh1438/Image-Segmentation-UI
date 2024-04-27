import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import './GenerateReportForm.css'
import { TextField,  Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import axios from 'axios'
import { Button } from 'react-bootstrap';
import { useUsername } from '../../globalstate';
import { API_URL } from '../../helpers/helper';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
const GenerateReportForm = ({ open, onClose,selectedFile,cluster,minAreaValue,maxAreaValue,ppmm,setpdf_filepath,setisLoading,isloading,selectedOptionsMorph}) => {
  const { register, handleSubmit } = useForm();
  const {processname}=useUsername()
 
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const onSubmit = (data) => {
    // Handle form submission
    
    isloading()
    setpdf_filepath(null)
    onClose()
    const fetchData = async () => {
      const formData = new FormData();
      formData.append('minAreaValue', minAreaValue);
      formData.append('maxAreaValue', maxAreaValue);
      formData.append('cluster', cluster);
      formData.append('ppmm',ppmm)
      formData.append('parameterSelection',selectedOptionsMorph)
      formData.append('testId',data.testId);
      const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      const formattedDate = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')}`;
      formData.append('date', formattedDate)
      formData.append('variety',data.variety)
      formData.append('name',data.name)
      formData.append('organization',data.organization)
      formData.append('email',data.email)
      formData.append('comments',data.comments)
      formData.append('processname',processname)
      
      const token=sessionStorage.getItem('access_token')
      try {
        const response = await axios.post(`${API_URL}/generateReport`, formData, {
          headers: { 'Content-Type': 'multipart/form-data','Authorization': `Bearer ${token}` }
        });
        
        const {pdf_filepath}= await response.data
        
       
        const pdfResponse=await axios.get(`${API_URL}${pdf_filepath}`,{
          headers:{
            Authorization:`Bearer ${token}`,
          },
          responseType:'blob'
        })

        const pdfUrl = URL.createObjectURL(pdfResponse.data, { type: 'application/pdf' });

        setpdf_filepath(pdfUrl)
        setisLoading()
      } catch (error) {
        console.error('Error generating form:' ,error);
      }
    }
    fetchData();
    ; // Close the form after submission
  };

  const formatDate = (date) => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;
  };
  
  return (
    <Dialog open={open} onClose={onClose} className="square-dialog" maxWidth='md' fullWidth>
      <DialogTitle className="square-dialog-title" style={{fontWeight:'bolder',}}>Report Details</DialogTitle>
      <DialogContent className="square-dialog-content">
      <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} marginTop={1}>
            <Grid item xs={6}>
              <TextField
                
                label="Test ID"
                {...register('testId', { required: true })}
                
              />
            </Grid>
            <Grid item xs={6}>
            <TextField
                label="Date"
                onClick={() => setShowCalendar(true)}
                value={formatDate(date)} 
                InputProps={{ readOnly: true }}
              />
              {showCalendar && (
                <div style={{ position: 'absolute', top: 'calc(22% + 25px)', zIndex: 999, }}>
                    <Calendar
                      onChange={newDate => {
                        setDate(newDate);
                        setShowCalendar(false);
                        
                      }}
                      value={date}
                    />
                  </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                
                label="Variety"
                {...register('variety', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
              
                label="Name"
                {...register('name', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
              
                label="Organization"
                {...register('organization', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
               
                label="Email"
                {...register('email', { required: true })}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                className="square-text-field"
                label="Comments"
                multiline
                rows={4}
                {...register('comments')}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions className="square-form-actions">
        <Button onClick={onClose} >Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} className='btn'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReportForm;