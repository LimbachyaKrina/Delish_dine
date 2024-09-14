// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { useParams } from 'react-router-dom';

// // // Function to get CSRF token from cookie
// // const getCSRFToken = () => {
// //   const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
// //   return cookieValue ? cookieValue.split('=')[1] : null;
// // };

// // const BookingPage = () => {
// //   const { restaurantName } = useParams(); // Retrieve restaurant name from URL
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     date: '',
// //     time: '',
// //     people: '',
// //   });
// //   const [availableTables, setAvailableTables] = useState(null);
// //   const [bookingSuccess, setBookingSuccess] = useState(false);
// //   const [error, setError] = useState('');

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //   };

// //   // Include CSRF token in the request header
// //   const csrfToken = getCSRFToken();

// //   const checkAvailability = async () => {
// //     setError(''); // Reset error message
// //     try {
// //       const response = await axios.post(
// //         'http://localhost:8000/api/check_availability/',
// //         {
// //           restaurant_name: restaurantName,
// //           date: formData.date,
// //           time: formData.time,
// //           people: formData.people,
// //         },
// //         {
// //           headers: {
// //             'X-CSRFToken': csrfToken,
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         setAvailableTables(response.data.available_tables);
// //       } else {
// //         setError(response.data.message || 'No tables available.');
// //       }
// //     } catch (error) {
// //       setError('Error checking availability: ' + (error.response?.data?.error || error.message));
// //       console.error('Error checking availability:', error);
// //     }
// //   };

// //   const bookTable = async () => {
// //     setError(''); // Reset error message
// //     try {
// //       const response = await axios.post(
// //         'http://localhost:8000/api/book_table/',
// //         {
// //           restaurant_name: restaurantName,
// //           date: formData.date,
// //           time: formData.time,
// //           people: formData.people,
// //           name: formData.name, // Include customer name in the request
// //         },
// //         {
// //           headers: {
// //             'X-CSRFToken': csrfToken,
// //           },
// //         }
// //       );

// //       if (response.data.success) {
// //         setBookingSuccess(true);
// //         setAvailableTables(null);
// //         setFormData({
// //           name: '',
// //           date: '',
// //           time: '',
// //           people: '',
// //         }); // Reset form data
// //       } else {
// //         setError('Error booking table.');
// //       }
// //     } catch (error) {
// //       setError('Error booking table: ' + (error.response?.data?.error || error.message));
// //       console.error('Error booking table:', error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Book a Table at {restaurantName}</h1>
// //       <form>
// //         <label>Name:</label>
// //         <input
// //           type="text"
// //           name="name"
// //           value={formData.name}
// //           onChange={handleInputChange}
// //           required
// //         />

// //         <label>Date:</label>
// //         <input
// //           type="date"
// //           name="date"
// //           value={formData.date}
// //           onChange={handleInputChange}
// //           required
// //         />

// //         <label>Time:</label>
// //         <input
// //           type="time"
// //           name="time"
// //           value={formData.time}
// //           onChange={handleInputChange}
// //           required
// //         />

// //         <label>Number of People:</label>
// //         <input
// //           type="number"
// //           name="people"
// //           value={formData.people}
// //           onChange={handleInputChange}
// //           required
// //         />

// //         <button type="button" onClick={checkAvailability}>
// //           Check Availability
// //         </button>
// //       </form>

// //       {availableTables !== null && (
// //         <div>
// //           <p>Available Tables: {availableTables}</p>
// //           <button type="button" onClick={bookTable}>
// //             Book Table
// //           </button>
// //         </div>
// //       )}

// //       {bookingSuccess && <p>Booking successful!</p>}
// //       {error && <p>{error}</p>}
// //     </div>
// //   );
// // };

// // export default BookingPage;




// import React, { useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './BookingPage.module.css';

// // Function to get CSRF token from cookie
// const getCSRFToken = () => {
//   const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
//   return cookieValue ? cookieValue.split('=')[1] : null;
// };

// const BookingPage = () => {
//   const { restaurantName } = useParams(); // Retrieve restaurant name from URL
//   const [formData, setFormData] = useState({
//     name: '',
//     date: '',
//     time: '',
//     people: '',
//   });
//   const [availableTables, setAvailableTables] = useState(null);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [error, setError] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Include CSRF token in the request header
//   const csrfToken = getCSRFToken();

//   const checkAvailability = async () => {
//     setError(''); // Reset error message
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/check_availability/',
//         {
//           restaurant_name: restaurantName,
//           date: formData.date,
//           time: formData.time,
//           people: formData.people,
//         },
//         {
//           headers: {
//             'X-CSRFToken': csrfToken,
//           },
//         }
//       );

//       if (response.data.success) {
//         setAvailableTables(response.data.available_tables);
//       } else {
//         setError(response.data.message || 'No tables available.');
//       }
//     } catch (error) {
//       setError('Error checking availability: ' + (error.response?.data?.error || error.message));
//       console.error('Error checking availability:', error);
//     }
//   };

//   const bookTable = async () => {
//     setError(''); // Reset error message
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/book_table/',
//         {
//           restaurant_name: restaurantName,
//           date: formData.date,
//           time: formData.time,
//           people: formData.people,
//           name: formData.name, // Include customer name in the request
//         },
//         {
//           headers: {
//             'X-CSRFToken': csrfToken,
//           },
//         }
//       );

//       if (response.data.success) {
//         setBookingSuccess(true);
//         setAvailableTables(null);
//         setFormData({
//           name: '',
//           date: '',
//           time: '',
//           people: '',
//         }); // Reset form data
//       } else {
//         setError('Error booking table.');
//       }
//     } catch (error) {
//       setError('Error booking table: ' + (error.response?.data?.error || error.message));
//       console.error('Error booking table:', error);
//     }
//   };

//   return (
//     <div className="booking-container">
//       <h1>Book a Table at {restaurantName}</h1>
//       <form>
//         <label>Name:</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           required
//         />

//         <label>Date:</label>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleInputChange}
//           required
//         />

//         <label>Time:</label>
//         <input
//           type="time"
//           name="time"
//           value={formData.time}
//           onChange={handleInputChange}
//           required
//         />

//         <label>Number of People:</label>
//         <input
//           type="number"
//           name="people"
//           value={formData.people}
//           onChange={handleInputChange}
//           required
//         />

//         <button type="button" onClick={checkAvailability}>
//           Check Availability
//         </button>
//       </form>

//       {availableTables !== null && (
//         <div>
//           <p>Available Tables: {availableTables}</p>
//           <button type="button" onClick={bookTable}>
//             Book Table
//           </button>
//         </div>
//       )}

//       {bookingSuccess && <p className="success-message">Booking successful!</p>}
//       {error && <p className="error-message">{error}</p>}
//     </div>
//   );
// };

// export default BookingPage;






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
  const [availableTables, setAvailableTables] = useState(null);
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

  // const checkAvailability = async () => {
  //   setError(''); // Reset error message
  //   try {
  //     const response = await axios.post(
  //       'http://localhost:8000/api/check_availability/',
  //       {
  //         restaurant_name: restaurantName,
  //         date: formData.date,
  //         time: formData.time,
  //         people: formData.people,
  //         userId: userId,  // Include userId in the request
  //       },
  //       {
  //         headers: {
  //           'X-CSRFToken': csrfToken,
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //       setAvailableTables(response.data.available_tables);
  //     } else {
  //       setError(response.data.message || 'No tables available.');
  //     }
  //   } catch (error) {
  //     setError('Error checking availability: ' + (error.response?.data?.error || error.message));
  //     console.error('Error checking availability:', error);
  //   }
  // };



  const checkAvailability = async () => {
    setError(''); // Reset error message
    try {
      const requestData = {
        restaurant_name: restaurantName, // Ensure this is defined
        date: formData.date,
        time: formData.time,
        people: formData.people,
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
        setAvailableTables(response.data.available_tables);
      } else {
        setAvailableTables(null);
        setError(response.data.message || 'No tables available.');
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
          people: formData.people,
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
        setAvailableTables(null);
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
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />

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

      {availableTables !== null && (
        <div>
          <p>Available Tables: {availableTables}</p>
          <button type="button" onClick={bookTable}>
            Book Table
          </button>
        </div>
      )}

      {bookingSuccess && <p>Booking successful!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default BookingPage;
