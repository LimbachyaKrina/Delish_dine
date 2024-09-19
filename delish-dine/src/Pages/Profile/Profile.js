import React from "react";
import Layout from "../../Layout/Layout";
import ProfilePage from "../../Components/ProfilePage/ProfilePage";

const Profile = () => {
  return (
    <Layout showFooter={true}>
      <ProfilePage></ProfilePage>
    </Layout>
  );
};

export default Profile;
