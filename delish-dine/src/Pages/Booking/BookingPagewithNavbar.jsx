import React from "react";
import Layout from "../../Layout/Layout";
import BookingPage from "./BookingPage";

const Booking = () => {
  return (
    <Layout showFooter={true}>
      <BookingPage></BookingPage>
    </Layout>
  );
};

export default Booking;