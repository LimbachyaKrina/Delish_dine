import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import Cart from "./Pages/Cart/Cart";
import Home from "./Pages/Home/Home";
import Restaurants from "./Pages/Restaurants/Restaurants";
import RestaurantDetail from "./Pages/RestaurantDetail/RestaurantDetail";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Profile from "./Pages/Profile/Profile";
import BookingPagewithNavbar from "./Pages/Booking/BookingPagewithNavbar.jsx";

import Booking from "./Pages/Booking/Booking";
// import BookList from "./Components/BookList/BookList";
import Bill from "./Pages/Bill/Bill"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart/:id" element={<Cart />}></Route>
        <Route path="/home/:id" element={<Home></Home>}></Route>
        <Route
          exact
          path="/restaurants/:id"
          element={<Restaurants></Restaurants>}
        ></Route>
        <Route
          path="/restaurants/:name/:id"
          element={<RestaurantDetail></RestaurantDetail>}
        />
        {/* <Route path="/booking/:name/:id" element={<Booking></Booking>} /> */}
        <Route path="/about-us/:id" element={<AboutUs></AboutUs>}/>
        <Route path="/profile/:id" element={<Profile></Profile>}/>
        <Route path="/book/:name/:id" element={<BookingPagewithNavbar />} />
        <Route path="/bookings/:id" element={<Booking />} />
        <Route path="/billing/:id" element={<Bill />} />
      </Routes>
    </BrowserRouter>
  );
}