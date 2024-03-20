import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
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
    confirmPasswordError: ""
  });

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSignupClick = async (e) => {
    e.preventDefault()
    const { email, username, password, confirmPassword } = formData;
    let valid = true;
    if (!email) {
      setFormData({ ...formData, emailError: "Please enter your email" });
      valid = false;
    } else {
      setFormData({ ...formData, emailError: "" });
    }
    if (!username) {
      setFormData({ ...formData, usernameError: "Please enter your username" });
      valid = false;
    } else {
      setFormData({ ...formData, usernameError: "" });
    }
    if (!password) {
      setFormData({ ...formData, passwordError: "Please enter your password" });
      valid = false;
    } else {
      setFormData({ ...formData, passwordError: "" });
    }
    if (!confirmPassword) {
      setFormData({ ...formData, confirmPasswordError: "Please confirm your password" });
      valid = false;
    } else if (password !== confirmPassword) {
      setFormData({ ...formData, confirmPasswordError: "Passwords do not match" });
      valid = false;
    } else {
      setFormData({ ...formData, confirmPasswordError: "" });
    }

    if (valid) {
      console.log("Sign up " + email + " " + username + " " + password);

      // Add your signup logic here
      try {
        // Send login request to backend
        const response = await axios.post('http://localhost:3001/auth/signup', {
          username: formData.username,
          email:formData.email,
          password: formData.password
        });
        console.log(response.data)
        navigate("/login")
        
      } catch (error) {
        // Login failed
        setFormData({ ...formData, usernameError: "Already registered user!Please Login" });
      }
    }
  };

  return (
    <Container style={{ marginTop: '100px' }}>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h4 style={{fontWeight:"bolder"}}>Sign up</h4>
          <Form>
            <Form.Group controlId="emailId">
              <Form.Label style={{fontWeight:"bolder"}}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={onChange}
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.emailError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="usernameId">
              <Form.Label style={{fontWeight:"bolder"}}>User name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter user name"
                value={formData.username}
                onChange={onChange}
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.usernameError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="passwordId">
              <Form.Label style={{fontWeight:"bolder"}}>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={onChange}
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.passwordError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>

            <Form.Group controlId="confirmPasswordId">
              <Form.Label style={{fontWeight:"bolder"}}>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={onChange}
              />
              <Form.Label style={{color:"red",fontWeight:'bolder'}}>{formData.confirmPasswordError}</Form.Label>
              <FormControl.Feedback type="invalid"></FormControl.Feedback>
            </Form.Group>
          </Form>
          <Button 
            color="primary"
            onClick={onSignupClick}
            style={{ marginTop: '6px',marginLeft:"5px",fontWeight:'bolder' }}  
          >Sign up</Button>
          <p className="mt-2" style={{fontWeight:"bolder",marginTop:"8px"}}>
            Already have an account? <Link to="/login" style={{fontWeight:"bolder"}}>Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;