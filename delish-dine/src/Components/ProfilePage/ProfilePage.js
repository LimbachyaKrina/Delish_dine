import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import "./ProfilePage.css"

export default function ProfilePage() {
  const { id } = useParams()
  const [pass, setPass] = useState("")
  const [errorMessage, setErrorMessage] = useState("");

  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);


  const [formData, setFormData] = useState({
    username: '',
    fullname: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  })

  const getUserDetails = async () => {
    const response = await axios.get(`http://localhost:8000/api/get_user_by_id/${id}/`);
    const user = response.data.user
    console.log(user)
    const data = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      fullname: user.fullname,
      oldPassword: "",
      newPassword: ""
    }
    setFormData(data);
    setPass(user.oldPassword)
    console.log(pass)
    console.log(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const checkData = async () => {
    try {
      const { oldPassword, newPassword } = formData;
      if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
        setErrorAlert(true);
        setSuccessAlert(false);
        setErrorMessage("Please fill both the password inputs!!!");
        return
      }
      const res = await axios.post("http://localhost:8000/update_user/", {
        user_details: formData,
        id
      })
      const data = res.data
      if (data.success) {
        setSuccessAlert(true);
        setErrorAlert(false);
      } else {
        setSuccessAlert(false);
        setErrorAlert(true);
        setErrorMessage(data.error || "Failed to update!!!");
        console.log(data);
      }
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => getUserDetails, [])
  return (
    <div>
      <div className="px-4 mt-4">
        <ul className="nav nav-tabs" id="movieTabs" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="profile-tab"
              data-bs-toggle="tab"
              href="#profile"
              role="tab"
              aria-controls="profile"
              aria-selected="true"
            >
              Profile
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="bookings-tab"
              data-bs-toggle="tab"
              href="#bookings"
              role="tab"
              aria-controls="bookings"
              aria-selected="false"
            >
              Bookings
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="rentedMovies-tab"
              data-bs-toggle="tab"
              href="#rentedMovies"
              role="tab"
              aria-controls="rentedMovies"
              aria-selected="false"
            >
              Orders
            </a>
          </li>
        </ul>
        <hr className="mt-0 mb-4" />
        <div className="tab-content mb-3" id="movieTabsContent">
          <div className="tab-pane fade show active" id="profile">
            <div className="row">
              <div className="col-xl-4">
                <div className="mb-4 mb-xl-0">
                  <div className="card-header">Profile Picture</div>
                  <div className="card-body text-center">
                    <img
                      className="img-account-profile rounded-circle mb-2"
                      src={formData.image}
                      alt="Profile"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="mb-4">
                  <div className="card-header">Account Details</div>
                  <div className="card-body">
                    <form>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputUsername">
                          Username
                        </label>
                        <input
                          className="form-control"
                          id="inputUsername"
                          type="text"
                          value={formData.username}
                          disabled
                        />
                      </div>

                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputFullname">
                          Fullname
                        </label>
                        <input
                          placeholder='Enter your fullname'
                          className="form-control"
                          id="fullname"
                          type="text"
                          value={formData.fullname}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="row gx-3 mb-3">
                        <div className="col-md-6">
                          <label className="small mb-1" htmlFor="inputPhone">
                            Phone number
                          </label>
                          <input
                            className="form-control"
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phone || ""}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label
                            className="small mb-1"
                            htmlFor="inputEmailAddress"
                          >
                            Email address
                          </label>
                          <input
                            className="form-control"
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email || ""}
                            disabled
                          />
                        </div>
                      </div>

                      {pass && <div className="password-change-section mb-2">
                        <h2 className="w-auto text-dark">Change password</h2>
                        <div className="mb-3">
                          <label
                            className="small mb-1"
                            htmlFor="inputOldPassword"
                          >
                            Old Password
                          </label>
                          <input
                            className="form-control"
                            id="oldPassword"
                            type="password"
                            placeholder="Enter your old password"
                            value={formData.oldPassword || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            className="small mb-1"
                            htmlFor="inputNewPassword"
                          >
                            New Password
                          </label>
                          <input
                            className="form-control"
                            id="newPassword"
                            type="password"
                            placeholder="Enter your new password"
                            value={formData.newPassword || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>}


                      <button
                        className="btn delicious-btn"
                        type="button"
                        onClick={checkData}
                      >
                        Save changes
                      </button>

                      <button
                        className="btn delicious-btn"
                        type="button"
                        style={{ float: "inline-end" }}
                      >
                        Logout
                      </button>
                    </form>
                    {successAlert && (
                      <div
                        id="errorAlertSuccess"
                        className="alert alert-success mt-3 alert-dismissible fade show"
                        role="alert"
                      >
                        <button
                          type="button"
                          className="btn btn-close"
                          data-bs-dismiss="alert"
                          onClick={() => setSuccessAlert(false)}
                        />
                        Changes saved successfully!
                      </div>
                    )}
                    {errorAlert && (
                      <div
                        id="errorAlert"
                        className="alert alert-danger mt-3 alert-dismissible fade show"
                        role="alert"
                      >
                        <button
                          type="button"
                          className="btn btn-close"
                          data-bs-dismiss="alert"
                          onClick={() => setErrorAlert(false)}
                        />
                        {errorMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row tab-pane fade" id="bookings"></div>
          <div className="row tab-pane fade" id="rentedMovies">

          </div>
        </div>
      </div>
    </div>
  )
}