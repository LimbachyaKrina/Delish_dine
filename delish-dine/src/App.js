import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import Cart from "./Pages/Cart/Cart";
import Home from "./Pages/Home/Home";
import Restaurants from "./Pages/Restaurants/Restaurants";
import RestaurantDetail from "./Pages/RestaurantDetail/RestaurantDetail";
import Booking from "./Pages/Booking/Booking";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/home/:id" element={<Home></Home>}></Route>
        <Route
          exact
          path="/restaurants/:username"
          element={<Restaurants></Restaurants>}
        ></Route>
        <Route
          path="/restaurants/:name/:username"
          element={<RestaurantDetail></RestaurantDetail>}
        />
        <Route path="/booking/:name/:username" element={<Booking></Booking>} />
      </Routes>
    </BrowserRouter>
  );
}
