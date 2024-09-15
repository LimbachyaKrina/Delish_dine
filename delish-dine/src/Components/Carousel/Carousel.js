import React, { useState, useEffect } from 'react';
import "./Carousel.css";
import axios from "axios";

const Carousel = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get_images_for_restaurants');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const image1 = images[0]?.Image || 'fallback-image.png';
  const image2 = images[1]?.Image || 'fallback-image.png';
  const image3 = images[2]?.Image || 'fallback-image.png';

  return (
    <div className="container">
      <img className="icon one" src={image1} alt="Icon One" />
      <img className="icon two" src={image2} alt="Icon Two" />
      <img className="icon three" src={image3} alt="Icon Three" />
    </div>
  );
};

export default Carousel;