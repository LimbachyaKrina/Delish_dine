import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Carousel from "../../Components/Carousel/Carousel";
import RestaurantList from "../../Components/RestaurantsList/RestaurantList";

export default function HomePage() {
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use template literals to properly interpolate the id
        const response = await axios.get(`http://localhost:8000/api/get_user_by_id/${id}/`);
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "50px"
      }}>
        Welcome {userName ? userName : 'Guest'}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: "50px"
      }}>
        What's your mood for today?
      </div>
      <Carousel />
      <RestaurantList />
    </>
  );
}