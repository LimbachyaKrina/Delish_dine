import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Booking.module.css";

const Booking = () => {
  const { name } = useParams(); // Fetch restaurant name from the URL
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    guests: 1,
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axios
      .post(`http://localhost:8000/api/book_table/${name}/`, bookingDetails)
      .then((response) => {
        setIsSuccess(true);
        setErrorMessage("");
        setBookingDetails({
          date: "",
          time: "",
          guests: 1,
          name: "",
          phone: "",
          email: "",
        });
      })
      .catch((error) => {
        setErrorMessage("Failed to book the table. Please try again.");
        console.error("Error booking table:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className={styles.BookingContainer}>
      <h2 className={styles.heading}>
        Book a Table at {name}
      </h2>
      <form className={styles.bookingForm} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={bookingDetails.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={bookingDetails.time}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="guests">Number of Guests</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={bookingDetails.guests}
            min="1"
            max="20"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={bookingDetails.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={bookingDetails.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={bookingDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Now"}
        </button>
      </form>
      {isSuccess && <p className={styles.successMessage}>Table booked successfully!</p>}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default Booking;
