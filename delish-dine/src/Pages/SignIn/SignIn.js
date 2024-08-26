import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import "./SignIn.css";

export default function SignIn() {
  const [state, setState] = useState({ username: "", password: "" });
  const [display, setDisplay] = useState("none");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (window.FB) {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v16.0",
      });
    }
  }, []);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const data = await fetch("http://localhost:8000/SignIn/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });

    const res = await data.json();
    if (!res.success) {
      setDisplay("");
      setAlertMessage(res.error);
      return;
    }

    setState({ username: "", password: "" });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      try {
        // Get the ID token from Google
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userData = await userInfo.json();

        // Send the ID token to your backend
        const response = await fetch("http://localhost:8000/google_login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            google_id: userData.sub,
            email: userData.email,
            name: userData.name,
          }), // Send the user's Google ID as the token
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Server response:", data);
        // Handle successful login here (e.g., store token, redirect user)
      } catch (error) {
        console.error("Error during Google login:", error);
        setDisplay("");
        setAlertMessage("Failed to login with Google. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      setDisplay("");
      setAlertMessage("Failed to login with Google. Please try again.");
    },
  });

  const handleFacebookLogin = () => {
    if (window.FB) {
      window.FB.login(
        function (response) {
          console.log("FB.login response:", response);
          if (response.authResponse) {
            console.log("Access Token:", response.authResponse.accessToken);
            window.FB.api(
              "/me",
              { fields: "id,name,email" },
              function (userInfo) {
                console.log("User Info:", userInfo);
                // Send data to your backend
                fetch("http://localhost:8000/facebook_login/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    token: response.authResponse.accessToken,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log("Server response:", data);
                  })
                  .catch((error) => console.error("Error:", error));
              }
            );
          } else {
            console.log("Login failed:", response);
          }
        },
        { scope: "public_profile,email" }
      );
    } else {
      console.error("Facebook SDK not loaded");
      setDisplay("");
      setAlertMessage("Facebook SDK not loaded. Please try again later.");
    }
  };

  return (
    <div>
      <video autoPlay muted loop id="myVideo" style={{ opacity: "0.6" }}>
        <source src="/vid/bac_video.mp4" type="video/mp4" />
      </video>
      <div className="container">
        <div className="d-flex justify-content-center h-100">
          <div className="card">
            <div className="card-header">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleOnSubmit}>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username"
                    name="username"
                    value={state.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-key"></i>
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="password"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group center-button">
                  <input
                    type="submit"
                    value="Login"
                    className="btn float-right login_btn"
                  />
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
                style={{ display: display }}
              >
                {alertMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setDisplay("none")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="social-login-buttons">
                <button
                  onClick={() => googleLogin()}
                  className="btn btn-google"
                >
                  <i className="fab fa-google"></i> Sign in with Google
                </button>
                <button
                  onClick={handleFacebookLogin}
                  className="btn btn-facebook"
                >
                  <i className="fab fa-facebook-f"></i> Sign in with Facebook
                </button>
              </div>
              <div className="d-flex justify-content-center links">
                Don't have an account?
                <a href="/register" style={{ color: "white" }}>
                  {" "}
                  Sign Up
                </a>
              </div>
              <div className="d-flex justify-content-center">
                <a href="/forgot-password" style={{ color: "white" }}>
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
