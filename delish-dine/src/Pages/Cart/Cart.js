import React from "react";
import Layout from "../../Layout/Layout";
import CartPage from "../../Components/CartPage/CartPage";

const Cart = () => {
  return (
    <Layout showFooter={true}>
      <CartPage></CartPage>
    </Layout>
  );
};

export default Cart;
