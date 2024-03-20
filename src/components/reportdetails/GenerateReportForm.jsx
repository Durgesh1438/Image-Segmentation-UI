import React from 'react';
import { useForm } from 'react-hook-form';
import './GenerateReportForm.css'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import axios from 'axios'
import { useUsername } from '../../globalstate';
const GenerateReportForm = ({ open, onClose,selectedFile,cluster,minAreaValue,maxAreaValue,ppmm,setpdf_filepath,setisLoading,isloading,selectedOptionsMorph}) => {
  const { register, handleSubmit } = useForm();
  const {processname}=useUsername()
  const onSubmit = (data) => {
    // Handle form submission
    console.log(processname)
    isloading()
    setpdf_filepath(null)
    console.log(data);
    console.log("data in reported form:",data.testId,cluster,minAreaValue,maxAreaValue,ppmm)
    onClose()
    const fetchData = async () => {
      const formData = new FormData();
      formData.append('minAreaValue', minAreaValue);
      formData.append('maxAreaValue', maxAreaValue);
      formData.append('cluster', cluster);
      formData.append('ppmm',ppmm)
      formData.append('parameterSelection',selectedOptionsMorph)
      formData.append('testId',data.testId);
      formData.append('date',data.date)
      formData.append('variety',data.variety)
      formData.append('name',data.name)
      formData.append('organization',data.organization)
      formData.append('email',data.email)
      formData.append('comments',data.comments)
      formData.append('processname',processname)
      
      const token=sessionStorage.getItem('access_token')
      try {
        const response = await axios.post('http://localhost:3001/generateReport', formData, {
          headers: { 'Content-Type': 'multipart/form-data','Authorization': `Bearer ${token}` }
        });
        console.log(response.data)
        const {pdf_filepath}= await response.data
        
        console.log(`http://localhost:3001${pdf_filepath}?${Date.now()}`)
        const pdfResponse=await axios.get(`http://localhost:3001${pdf_filepath}`,{
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

  return (
    <Dialog open={open} onClose={onClose} className="square-dialog">
      <DialogTitle className="square-dialog-title">Report Details</DialogTitle>
      <DialogContent className="square-dialog-content">
      <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                className="square-text-field"
                label="Test ID"
                {...register('testId', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="square-text-field"
                label="Date"
                {...register('date', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="square-text-field"
                label="Variety"
                {...register('variety', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="square-text-field"
                label="Name"
                {...register('name', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="square-text-field"
                label="Organization"
                {...register('organization', { required: true })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className="square-text-field"
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReportForm;