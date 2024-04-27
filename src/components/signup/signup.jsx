import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../helpers/helper";
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  FormControl
} from "react-bootstrap";

const Signup = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    emailError: "",
    usernameError: "",
    passwordError: "",
    confirmPasswordError: "",
    userCreated:""
  });

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSignupClick = async (e) => {
    e.preventDefault()
    const { email, username, password, confirmPassword } = formData;
    let valid = true;
    if (!email) {
      setFormData((prevState) => ({
        ...prevState,
        emailError: "Please enter your email",
      }));
      valid = false;
    } else {
      setFormData((prevState) => ({ ...prevState, emailError: "" }));
    }
  
    if (!username) {
      setFormData((prevState) => ({
        ...prevState,
        usernameError: "Please enter your username",
      }));
      valid = false;
    } else {
      setFormData((prevState) => ({ ...prevState, usernameError: "" }));
    }
  
    if (!password) {
      setFormData((prevState) => ({
        ...prevState,
        passwordError: "Please enter your password",
      }));
      valid = false;
    } else {
      setFormData((prevState) => ({ ...prevState, passwordError: "" }));
    }
  
    if (!confirmPassword) {
      setFormData((prevState) => ({
        ...prevState,
        confirmPasswordError: "Please confirm your password",
      }));
      valid = false;
    } else if (password !== confirmPassword) {
      setFormData((prevState) => ({
        ...prevState,
        confirmPasswordError: "Passwords do not match",
      }));
      valid = false;
    } else {
      setFormData((prevState) => ({ ...prevState, confirmPasswordError: "" }));
    }

    if (valid) {
      

      // Add your signup logic here
      try {
        // Send login request to backend
        const response = await axios.post(`${API_URL}/auth/signup`, {
          username: formData.username,
          email:formData.email,
          password: formData.password
        });
        
        const {success,message}=response.data
        if(success){
          setFormData({...formData,userCreated:message})
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        else{
          setFormData({...formData,confirmPasswordError:message})
        }

        
      } catch (error) {
        // Login failed
        setFormData({ ...formData, usernameError: "Already registered user!Please Login" });
      }
    }
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
    <Container style={{ marginTop: '50px' }}>
      <Row className="justify-content-md-center">
        <Col md="3">
          <h4 >Sign up</h4>
          <Form>
            <Form.Group controlId="emailId">
              <Form.Label style={{fontWeight:"500"}}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={onChange}
                className='control'
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.emailError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="usernameId">
              <Form.Label style={{fontWeight:"500"}}>User name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter user name"
                value={formData.username}
                onChange={onChange}
                className='control'
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.usernameError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="passwordId">
              <Form.Label style={{fontWeight:"500"}}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={onChange}
                className='control'
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.passwordError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="confirmPasswordId">
              <Form.Label style={{fontWeight:"500"}}>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={onChange}
                className='control'
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.confirmPasswordError}</Form.Label>
              <Form.Label style={{color:"Green",fontWeight:'bolder'}}>{formData.userCreated}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>
          </Form>
          <Button 
            color="primary"
            onClick={onSignupClick}
            style={{ marginTop: '6px',marginLeft:"5px",fontWeight:"500" }}  
          >Sign up</Button>
          <p className="mt-2" style={{fontWeight:"500",marginTop:"8px"}}>
            Already have an account? <Link to="/login" >Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Signup;