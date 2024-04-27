
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUsername } from "../../globalstate";
import { API_URL } from "./../../helpers/helper";
import "./styles.css";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import Spinneroff from "../spinner/spinneroff";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ onLogin, onAdmin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    usernameError: "",
    passwordError: "",
    error: "",
  });
  const [isLoading, setisLoading] = useState(false);

  const navigate = useNavigate();

  const { setUsername, setpicture, setlogin, setplan, setexpires } =
    useUsername();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      // Send login request to backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      const {
        access_token,
        isSubscriber,
        endDate,
        freetrail,
        isAdmin,
        subscriptionPlan,
      } = response.data;
      setplan(subscriptionPlan);
      setexpires(new Date(endDate).toLocaleDateString("en-GB"));
      sessionStorage.setItem("plan", subscriptionPlan);
      let date = new Date(endDate).toLocaleDateString("en-GB");
      sessionStorage.setItem("expires", date);
      //console.log("admin:",isAdmin)
      //console.log(access_token)
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("isAdmin", isAdmin);

      sessionStorage.setItem("username", formData.username);
      if (isAdmin) {
        sessionStorage.setItem("access_token", access_token);
        onLogin();
        onAdmin();
        navigate("/admin");
        return;
      }
      const currentDate = new Date();
      const endSubscriptionDate = new Date(endDate);
      let subscription = false;
      if (currentDate <= endSubscriptionDate) {
        subscription = true;
      } else {
        subscription = false;
      }
      if ((isSubscriber || freetrail) && subscription) {
        sessionStorage.setItem("access_token", access_token);
        // Login successful
        setUsername(formData.username);
        onLogin();
        setisLoading(false);
        setlogin(false); // Call the onLogin function passed from parent (App.js)
        navigate("/home");
        return; // Redirect to the home page
      } else {
        sessionStorage.setItem("access_token", access_token);
        setUsername(formData.username);
        onLogin();
        setisLoading(false);
        navigate("/subscribe");
        return;
      }
    } catch (error) {
      // Login failed
      setisLoading(false);
      setFormData({ ...formData, error: "Invalid username or password" });
    }
  };

  const handleGoogleLoginSuccess = async (googleData) => {
    try {
      setisLoading(true);

      // Send Google access token to backend for authentication
      const response = await axios.post(`${API_URL}/auth/google`, {
        access_token: googleData.credential,
      });
      const {
        access_token,
        username,
        picture,
        isSubscriber,
        endDate,
        freetrail,
        isAdmin,
        subscriptionPlan,
      } = response.data;
      //console.log(endDate,subscriptionPlan)
      const limitedUsername = username.substring(0, 7);
      setplan(subscriptionPlan);
      setexpires(new Date(endDate).toLocaleDateString("en-GB"));
      sessionStorage.setItem("plan", subscriptionPlan);
      let date = new Date(endDate).toLocaleDateString("en-GB");
      sessionStorage.setItem("expires", date);

      if (isAdmin) {
        sessionStorage.setItem("access_token", access_token);
        onLogin();
        onAdmin();
        navigate("/admin");
        return;
      }
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("isAdmin", isAdmin);
      sessionStorage.setItem("picture", picture);
      sessionStorage.setItem("username", limitedUsername);
      setpicture(picture);
      setUsername(username);
      const currentDate = new Date();
      const endSubscriptionDate = new Date(endDate);

      let subscription = false;
      if (currentDate <= endSubscriptionDate) {
        subscription = true;
      } else {
        subscription = false;
      }
      if ((isSubscriber || freetrail) && subscription) {
        setUsername(username);
        setpicture(picture);
        sessionStorage.setItem("access_token", access_token);
        // Login successful
        setisLoading(false);
        onLogin();
        navigate("/home"); // Redirect to the home page
        return;
      } else {
        setUsername(username);
        setpicture(picture);
        sessionStorage.setItem("access_token", access_token);
        onLogin();
        setisLoading(false);
        navigate("/subscribe");
        return;
      }
    } catch (error) {
      // Google login failed
      setisLoading(false);
      console.error("Google login failed:", error);
    }
  };

  // Handle Google login failure
  const handleGoogleLoginFailure = (error) => {
    console.error("Google login error:", error);
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
      <Container style={{ marginTop: "90px" }}>
        <Row className="justify-content-md-center">
          <Col md="4">
            <h4>Login</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="usernameId">
                <Form.Label style={{ fontWeight: "500" }}>User name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter user name"
                  value={formData.username}
                  onChange={handleChange}
                  className="control"
                />
                <Form.Label style={{ color: "red", fontWeight: "bolder" }}>
                  {formData.usernameError}
                </Form.Label>
              </Form.Group>

              <Form.Group controlId="passwordId">
                {formData.error && (
                  <p style={{ color: "red", fontWeight: "bolder" }}>
                    {formData.error}
                  </p>
                )}
                <Form.Label style={{ fontWeight: "500" }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="control"
                />
                <Form.Label style={{ color: "red", fontWeight: "bolder" }}>
                  {formData.passwordError}
                </Form.Label>
              </Form.Group>

              <Button
                type="submit"
                style={{
                  marginTop: "10px",
                  marginLeft: "8px",
                  width: "80px",
                  height: "38px",
                  fontWeight: "500",
                  backgroundColor:"white",
                  color:'black'
                }}
              >
                Login
              </Button>

              <div style={{ marginLeft: "200px" }}>
                {isLoading && <Spinneroff />}
              </div>
            </Form>
            <p
              className="mt-2"
              style={{ marginTop: "20px", fontWeight: "500" }}
            >
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              style={{ fontWeight: "bolder" }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;