import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./RestaurantDetail.module.css";

const RestaurantDetail = () => {
  const { name } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/get_restaurant_by_name/${name}/`)
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
      });
  }, [name]);

  if (!restaurant) {
    return <p>Loading...</p>;
  }

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles.restaurantDetailContainer}>
      <div className={`${styles.restaurantDetails}`}>
        <h1
          className={`${styles.restaurantName} ${styles.matemasieRegularFontBold}`}
        >
          {restaurant.Name}
        </h1>
      </div>
      <div className={styles.categoryFilterContainer}>
        <button
          className={`${styles.categoryButton} ${
            selectedCategory === "All" ? styles.active : ""
          }`}
          onClick={() => handleCategoryClick("All")}
        >
          All
        </button>
        {Object.keys(restaurant.dishes).map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.active : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div
        className={`${styles.dishesContainerMain} ${styles.matemasieRegularFont}`}
      >
        <div className={styles.dishesContainer}>
          {Object.keys(restaurant.dishes).map((category) =>
            selectedCategory === "All" || selectedCategory === category ? (
              <div key={category} className={styles.categoryContainer}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.dishesList}>
                  {restaurant.dishes[category].map((dish) => (
                    <div key={dish.name} className={styles.dishCard}>
                      <div className={styles.dishCardSubDiv}>
                        <p className={styles.dishName}>{dish.name}</p>
                        <p className={styles.dishPrice}>&#8377; {dish.price}</p>
                        <div className={styles.dishRating}>
                          {renderStars(dish.rating)}
                        </div>
                        <p className={styles.dishDescription}>
                          {dish.description}
                        </p>
                      </div>
                      <div className={`${styles.imagesDiv}`}>
                        <img
                          className={styles.dishImage}
                          src={dish.image}
                          alt={dish.name}
                        />
                        <button className={styles.addButton}>Add</button>{" "}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
