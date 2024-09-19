import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Function to get CSRF token from cookie
const getCSRFToken = () => {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookieValue ? cookieValue.split('=')[1] : null;
};

const BookingPage = () => {
  const { restaurantName, userId } = useParams(); // Retrieve restaurant name and userId from URL
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    people: '',
  });
  const [availableCapacity, setAvailableCapacity] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Include CSRF token in the request header
  const csrfToken = getCSRFToken();

  const checkAvailability = async () => {
    setError(''); // Reset error message
    try {
      const requestData = {
        restaurant_name: restaurantName,
        date: formData.date,
        time: formData.time,
        people: parseInt(formData.people, 10),
      };

      console.log('Sending request data:', requestData); // Log request data

      const response = await axios.post(
        'http://localhost:8000/api/check_availability/',
        requestData,
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        }
      );

      console.log('Response:', response);

      if (response.data.success) {
        if (response.data.message) {
          setAvailableCapacity(null);
          setError(response.data.message);
        } else {
          setAvailableCapacity(response.data.available_capacity);
          setError('');
        }
      } else {
        setAvailableCapacity(null);
        setError('An unexpected error occurred.');
      }
    } catch (error) {
      setError('Error checking availability: ' + (error.response?.data?.error || error.message));
      console.error('Error checking availability:', error);
    }
  };

  const bookTable = async () => {
    setError(''); // Reset error message
    try {
      const response = await axios.post(
        'http://localhost:8000/api/book_table/',
        {
          restaurant_name: restaurantName,
          date: formData.date,
          time: formData.time,
          people: parseInt(formData.people, 10),
          name: formData.name,
          userId: userId,  // Include userId in the booking request
        },
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        }
      );

      if (response.data.success) {
        setBookingSuccess(true);
        setAvailableCapacity(null);
        setFormData({
          name: '',
          date: '',
          time: '',
          people: '',
        }); // Reset form data
      } else {
        setError('Error booking table.');
      }
    } catch (error) {
      setError('Error booking table: ' + (error.response?.data?.error || error.message));
      console.error('Error booking table:', error);
    }
  };

  return (
    <div>
      <h1>Book a Table at {restaurantName}</h1>
      <form>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />

        <label>Time:</label>
        <select
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a time slot</option>
          <option value="12:00">12:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
        </select>

        <label>Number of People:</label>
        <input
          type="number"
          name="people"
          value={formData.people}
          onChange={handleInputChange}
          required
        />

        <button type="button" onClick={checkAvailability}>
          Check Availability
        </button>
      </form>

      {availableCapacity !== null && (
        <div>
          {availableCapacity > 0 ? (
            <>
              <p>Available Capacity for {formData.time}: {availableCapacity} people</p>
              <button type="button" onClick={bookTable}>
                Book Table
              </button>
            </>
          ) : (
            <p>No available capacity for this slot. Please choose another time slot.</p>
          )}
        </div>
      )}

      {bookingSuccess && <p>Booking successful!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default BookingPage;
