import React, { useState } from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link,useParams } from 'react-router-dom';
import { faShoppingCart, faUser, faUtensils, faInfoCircle, faCalendarCheck, faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="content">
        <a href={`/home/${id}`} className="logo">
          <img src="/img/LogoWhiteBgTrans.png" alt="Your Logo" />
        </a>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="navbar-right">
        <div className="search-bar">
          <input type="text" placeholder="Search" />
        </div>
        <ul className="menu-list">
          <li>
            <a href={`/restaurants/${id}`} className="nav-link navbarLinks">
              <FontAwesomeIcon icon={faUtensils} className="mr-2" />
              Restaurants
            </a>
          </li>
          <li>
            <a href={`/bookings/${id}`} className="nav-link navbarLinks">
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
              Bookings
            </a>
          </li>
          <li>
            <a href="/about-us" className="nav-link navbarLinks">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
              About Us
            </a>
          </li>
        </ul>
        <div className="notifications">
        <Link to={`/cart/${id}`} className="nav-link  ">
        <FontAwesomeIcon icon={faShoppingCart} size="lg" color='#fff'/>
        <span className="notification-count">0</span>
        <span className="icon-text" >Cart</span>
          </Link>          
        </div>
        <div className="user-profile">
        <Link to="/profile" className="nav-link ">
          <FontAwesomeIcon icon={faUser} className="fa-user" size="lg" color='#fff'/>
          <span className="icon-text" >Profile</span>
        </Link>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;