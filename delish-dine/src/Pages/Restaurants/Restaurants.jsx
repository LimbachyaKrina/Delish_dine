import React from "react";
import Layout from "../../Layout/Layout";
import RestaurantsList from "../../Components/RestaurantsList/RestaurantList";

const Restaurants = () => {
  return (
    <Layout showFooter={true}>
      <RestaurantsList booking={false}></RestaurantsList>
    </Layout>
  );
};

export default Restaurants;
