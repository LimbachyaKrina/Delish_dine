import React from "react";
import Layout from "../../Layout/Layout";
import RestaurantsList from "../../Components/RestaurantsList/RestaurantList";

const Booking = () => {
  return (
    <Layout showFooter={true}>
      <RestaurantsList booking={true}></RestaurantsList>
    </Layout>
  );
};

export default Booking;


