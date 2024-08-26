import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/SignIn/SignIn"
import SignUp from "./Pages/SignUp/SignUp"
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
      </Routes>
    </BrowserRouter>
  );
}
