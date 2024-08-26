import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState("none");
  const [alertMessage, setAlertMessage] = useState("");
  const [state, setState] = useState({
    fullName: "",
    username: "",
    password: "",
    confPassword: "",
    email: "",
    phone: "",
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const data = await fetch("http://localhost:8000/SignUp/", {
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
    navigate("/");
  };
  return (
    <>
      <video autoPlay muted loop id="myVideo" style={{ opacity: "0.6" }}>
        <source src="/vid/reg_bac_video.mp4" type="video/mp4" />
      </video>
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
      <div className="container" >
        <div className="d-flex justify-content-center h-100" >
          <div className="card" style={{height: "515px"}}>
            <div className="card-header text-center" style={{marginTop : "15px"}}>
              <h3>Register</h3>
            </div>
            <div className="card-body">
              <form method="post" onSubmit={handleOnSubmit}>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Fullname"
                    name="fullName"
                    value={state.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
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
                    placeholder="Password"
                    name="password"
                    value={state.password}
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
                    placeholder="Confirm Password"
                    name="confPassword"
                    value={state.confPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    id="email"
                    value={state.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-phone"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="phone"
                    name="phone"
                    id="phone"
                    value={state.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group text-center">
                  <input
                    type="submit"
                    value="Register"
                    className="btn login_btn"
                  />
                </div>
              </form>
              <div className="d-flex justify-content-center links">
                Already have an account?<a href="/" style={{color:"white"}}> Login</a>
              </div>
            </div>
            <div className="card-footer">

              {/* <div className="d-flex justify-content-center social_icon">
                <span>
                  <i className="fab fa-facebook-square"></i>
                </span>
                <span>
                  <i className="fab fa-google-plus-square"></i>
                </span>
                <span>
                  <i className="fab fa-twitter-square"></i>
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
