import React from "react";
import Layout from "../../Layout/Layout";
import BillingPage from "../../Components/BillPage/BillPage";

const Bill = () => {
  return (
    <Layout showFooter={true}>
      <BillingPage></BillingPage>
    </Layout>
  );
};

export default Bill;