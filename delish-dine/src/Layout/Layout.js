import React from "react";
import Navbar from "../Components/Navbar/Navbar"; 
import Footer from "../Components/Footer/Footer";

const Layout = ({ children, showFooter = true, showNavbar = true }) => {
  return (
    <>
      {showNavbar && <Navbar />} 
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
