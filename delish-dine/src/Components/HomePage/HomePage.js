import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RestaurantList from "../../Components/RestaurantsList/RestaurantList";
import styles from "./HomePage.module.css"; // Import the module CSS

export default function HomePage() {
  const { id } = useParams();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/get_user_by_id/${id}/`
        );
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  return (
    <>
      <div className={styles.mainDivHome}>
        {/* New Div for Delish Dine h1 and Image */}
        <div className={styles.imgDiv}>
          <div className={`${styles.welcomeText} ${styles.oxygenbold1}`}>
            Welcome {userName ? userName : "Guest"} <br /> to Delish Dine <br />
            <span className={styles.pTitle}>
              Where every bite tells a story, and every meal is a celebration.
            </span>
          </div>
          <div className={styles.imageRight}>
            <img src="/img/home/baner2.jpg" alt="Delish Dine" />
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img src="/img/Discount.avif" alt="Discount" />
        </div>
        <RestaurantList />
      </div>
    </>
  );
}