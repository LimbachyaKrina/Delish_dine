import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RestaurantsList.module.css";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantsList = (props) => {
  const { booking } = props;
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const handleCardClick = (name) => {
    console.log(`/restaurants/${name}/${id}/`);
    if (booking) {
      navigate(`/book/${name}/${id}`);
    } else {
      navigate(`/restaurants/${name}/${id}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/restaurants/");
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    // Simulate loading delay
    const timer = setTimeout(() => {
      fetchData();
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating) => {
    if (isNaN(rating) || rating < 0) return null;

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - (fullStars + halfStar));

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <i key={`full-${i}`} className="fa-solid fa-star"></i>
        ))}
        {halfStar && <i className="fa-solid fa-star-half-alt"></i>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <i key={`empty-${i}`} className="fa-regular fa-star"></i>
        ))}
      </>
    );
  };

  const handleRatingChange = (e) => {
    setSelectedRating(Number(e.target.value));
  };

  const filteredRestaurants = selectedRating
    ? restaurants.filter(
        (restaurant) => Math.floor(restaurant.Ratings) === selectedRating
      )
    : restaurants;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className={styles.mainDiv}>
      <div className={`${styles.mainHeading}`}>
        <h1 className={`${styles.matemasieRegularFontBold}`}>
          Explore Our Full Range of Restaurants
        </h1>
      </div>

      <div
        className={`${styles.matemasieRegularFont} ${styles.filterContainer}`}
      >
        <select
          id="ratingFilter"
          onChange={handleRatingChange}
          className={`${styles.filterSelect}`}
        >
          <option value="0">All Ratings</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Star{rating > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`${styles.restaurantsContainer} ${styles.matemasieRegularFont}`}
      >
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className={styles.restaurantsCard}
              onClick={() => handleCardClick(restaurant.Name)}
            >
              <div className={styles.imageContainer}>
                <img
                  src={restaurant.Image}
                  alt={restaurant.Name}
                  className={styles.restaurantsImages}
                />
              </div>
              <div className={styles.rating}>
                {renderStars(restaurant.Ratings)} {restaurant.Ratings}
              </div>
              <div className={styles.restaurantsDetailsContainer}>
                <h5 className={`${styles.restaurantNameH4}`}>
                  {restaurant.Name}
                </h5>
                <p className={`${styles.restaurantAddress}`}>
                  {restaurant.Address}
                </p>
              </div>
            </div>
          ))
        ) : (
          <>
            <br />
            <p>No restaurants available</p>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantsList;