import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';



const BookingPage = () => {
  const { restaurantName, userId } = useParams();
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


  const checkAvailability = async () => {
    setError(''); // Reset error message
    setAvailableCapacity(null); // Reset available capacity
    try {
      const requestData = {
        restaurant_name: restaurantName,
        date: formData.date,
        time: formData.time,
        people: parseInt(formData.people, 10),
      };

      console.log('Sending request data:', requestData);

      const response = await axios.post(
        'http://localhost:8000/check_availability/',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response);

      if (response.data.success) {
        if (response.data.message) {
          setError(response.data.message);
        } else if (response.data.available_capacity !== undefined) {
          setAvailableCapacity(response.data.available_capacity);
        } else {
          setError('Unexpected response format');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (error) {
      setError('Error checking availability: ' + (error.response?.data?.error || error.message));
      console.error('Error checking availability:', error);
    }
  };

  const bookTable = async () => {
    console.log("This is book table thing")
    setError(''); // Reset error message
    try {
        const book_data =  {
            restaurant_name: restaurantName,
            date: formData.date,
            time: formData.time,
            people: parseInt(formData.people, 10),
            name: formData.name,
            userId: userId,
          }

          console.log(book_data)
      const response = await axios.post(
        'http://localhost:8000/book_please/', book_data,
        {
          headers: {
            'Content-Type': 'application/json',
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
        });
      } else {
        setError(response.data.message || 'Error booking table.');
      }
    } catch (error) {
      setError('Error booking table: ' + (error.response?.data?.error || error.message));
      console.error('Error booking table:', error);
    }
  };

  return (
    <div>
      <h1>Book a Table at {restaurantName}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
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