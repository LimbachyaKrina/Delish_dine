import React from "react";
import Layout from "../../Layout/Layout";
import RestaurantPage from "../../Components/RestaurantPage/RestaurantPage";

const RestaurantDetail = () => {
  return (
    <Layout showFooter={true}>
      <RestaurantPage></RestaurantPage>
    </Layout>
  );
};

export default RestaurantDetail;
