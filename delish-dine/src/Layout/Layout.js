import React from "react";
import Footer from "../Components/Footer/Footer";

const Layout = ({
  children,
  showFooter = true,
}) => {
  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
