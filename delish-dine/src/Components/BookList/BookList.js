
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookingsPage = () => {
  const { restaurantName } = useParams(); // Get the restaurant name from URL
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get_bookings/${restaurantName}`);
        
        if (response.data.success) {
          if (response.data.bookings.length > 0) {
            setBookings(response.data.bookings);
          } else {
            setError('No bookings found.');
          }
        } else {
          setError('Error fetching bookings.');
        }
      } catch (err) {
        console.error('Error fetching bookings: as there is no data', err);
        setError('No bookings right now');
      }
    };

    fetchBookings();
  }, [restaurantName]);

  return (
    <div>
      {/* <h1>Bookings for {restaurantName}</h1> */}

      {error && <p>{error}</p>}
      {/* To add styling here */}
      

      {bookings.length > 0 ? (
        <div>
          {bookings.map((booking, index) => (
            <div key={index} style={styles.bookingCard}>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Number of People:</strong> {booking.people}</p>
              <p><strong>Customer Name:</strong> {booking.
customer_name
}</p>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>No bookings found.</p>
      )}
    </div>
  );
};

const styles = {
  bookingCard: {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '8px',
  },
};

export default BookingsPage;
