import React from "react";
import Layout from "../../Layout/Layout";
import HomePage from "../../Components/HomePage/HomePage";

const Home = () => {
  return (
    <Layout showFooter={true}>
      <HomePage></HomePage>
    </Layout>
  );
};

export default Home;
