import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import "./ProfilePage.css"

export default function ProfilePage() {
  const { id } = useParams();
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
  });

  // Fetch user details
  const getUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/get_user_by_id/${id}/`);
      const user = response.data.user;
      console.log("User details:", user);
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone,
        fullname: user.fullname,
        oldPassword: "",
        newPassword: "",
      });
      setPass(user.oldPassword);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setErrorMessage("Failed to load user details.");
      setErrorAlert(true);
    }
  };

  // Fetch bookings
  const getBookings = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get_bookings/", { id });
      if (response.data.success) {
        console.log("Bookings:", response.data.bookings);
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setErrorMessage("Failed to load bookings.");
      setErrorAlert(true);
    }
  };

  // Fetch orders
  const getOrders = async () => {
    try {
      const response = await axios.post("http://localhost:8000/get_cart_conf_ord/", { id });
      console.log("Orders:", response.data.cart);
      if (response.data.success) {
        setOrders(response.data.cart);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Failed to load orders.");
      setErrorAlert(true);
    }
  };
  
  // Fetch all data when component mounts or when `id` changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getUserDetails(), getBookings(), getOrders()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data.");
        setErrorAlert(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Check and update user data
  const checkData = async () => {
    try {
      const { oldPassword, newPassword } = formData;
      if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
        setErrorAlert(true);
        setSuccessAlert(false);
        setErrorMessage("Please fill both the password inputs!!!");
        return;
      }
      const res = await axios.post("http://localhost:8000/update_user/", {
        user_details: formData,
        id,
      });
      const data = res.data;
      if (data.success) {
        setSuccessAlert(true);
        setErrorAlert(false);
      } else {
        setSuccessAlert(false);
        setErrorAlert(true);
        setErrorMessage(data.error || "Failed to update!!!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleLogout = () =>{
    navigate("/")
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="px-4 mt-4">
        <ul className="nav nav-tabs" id="movieTabs" role="tablist">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              href="#profile"
              role="tab"
            >
              Profile
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
              href="#bookings"
              role="tab"
            >
              Bookings
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              href="#orders"
              role="tab"
            >
              Orders
            </a>
          </li>
        </ul>
        <hr className="mt-0 mb-4" />
        <div className="tab-content mb-3" id="movieTabsContent">
          {activeTab === 'profile' && (
            <div className="tab-pane fade show active" id="profile">
              <div className="row">
                <div className="col-xl-4">
                  <div className="mb-4 mb-xl-0">
                    <div className="card-header">Profile Picture</div>
                    <div className="card-body text-center">
                      <img
                        className="img-account-profile rounded-circle mb-2"
                        src="/img/profile_icon.png"
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

                        {pass && (
                          <div className="password-change-section mb-2">
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
                          </div>
                        )}

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
                          onClick={handleLogout}
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
          )}
          {activeTab === 'bookings' && (
            <div className="tab-pane fade show active" id="bookings">
              <h2>Bookings</h2>
              {bookings.length > 0 ? (
                <ul className="list-group">
                  {bookings.map((booking, index) => (
                    <li key={index} className="list-group-item">
                      <h5>{booking.restaurant_name}</h5>
                      <p>Date: {booking.date}</p>
                      <p>Time: {booking.time}</p>
                      <p>Seats: {booking.people}</p>
                      <p>Name: {booking.customer_name}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You have no bookings yet.</p>
              )}
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="tab-pane fade show active" id="orders">
              <h2>Orders</h2>
              {orders.length === 0 ? (
        <p>No orders yet</p> // Display this message if there are no orders
      ) : (
        orders.map((order, index) => {
          const timestamp = Object.keys(order)[0];
          const orderDetails = order[timestamp];

          return (
            <div key={index}>
              <h3>Order Time: {timestamp}</h3>
              {orderDetails.length === 0 ? (
                <p>No orders yet</p> // Check if orderDetails array is empty
              ) : (
                orderDetails.map((item, i) => (
                  <div key={i}>
                    <p>Restaurant: {item.restaurant}</p>
                    <p>Dish: {item.dish}</p>
                    <p>Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))
              )}
              <hr />
            </div>
          );
        })
      )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}