import React from "react";
import { useParams } from "react-router-dom";
import Carousel from "../../Components/Carousel/Carousel";
import RestaurantList from "../../Components/RestaurantsList/RestaurantList";

export default function HomePage() {
  const { name } = useParams();

  return (
    <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "50px"
      }}
    >
     Welcome {name}
    </div>
    <div style={{
      display:'flex',
      justifyContent:'center',
      fontSize:"50px"
    }}>
    What's your mood for today?
    </div>
    <Carousel />
    <RestaurantList />
    </>
  );
}