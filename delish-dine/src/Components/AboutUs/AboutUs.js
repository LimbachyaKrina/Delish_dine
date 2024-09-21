import React from "react";
import styles from "./AboutUs.module.css";

const AboutUs = () => {
  
  return (
    <>
      <div className={`${styles.aboutUs} ${styles.oxygenbold}`}>
        <header className={styles.aboutUsHeader}>
          <h1 className={`${styles.pageTitle} ${styles.oxygenbold}`}>
            Delish Dine
          </h1>
          <p>Where flavors come alive and every meal is a celebration!</p>
        </header>

        <section className={styles.companyInfo}>
          <h2>About Us</h2>
          <p>
            At <strong>Delish Dine</strong>, we believe in the power of great
            food to bring people together. From humble beginnings, our
            restaurant has grown into a beloved destination for those seeking a
            unique culinary experience. Whether you're dining in, taking food to
            go, or booking a table for a special occasion, we're here to make
            every moment delicious.
          </p>
        </section>

        <section className={styles.ourMission}>
          <h2>Our Mission</h2>
          <p>
            To create mouthwatering dishes that blend tradition with innovation,
            and to offer our customers a dining experience that keeps them
            coming back for more.
          </p>
        </section>

        <section className={styles.ourValues}>
          <h2>Our Values</h2>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <strong>Quality Ingredients</strong>
              <p>
                We use only the freshest ingredients to craft each dish to
                perfection.
              </p>
            </div>
            <div className={styles.card}>
              <strong>Exceptional Service</strong>
              <p>
                Our team is dedicated to making your experience delightful,
                whether you're dining in or enjoying our food at home.
              </p>
            </div>
            <div className={styles.card}>
              <strong>Community First</strong>
              <p>
                We believe in supporting our local community and giving back
                whenever we can.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.services}>
          <h2>Our Services</h2>
          <p>
            At Delish Dine, we offer a variety of services to ensure you enjoy
            our food the way you like:
          </p>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <strong>Takeaway</strong>
              <p>
                Craving a delicious meal but don't have time to dine in? Our
                takeaway service allows you to enjoy our food wherever you are.
              </p>
            </div>
            <div className={styles.card}>
              <strong>Booking</strong>
              <p>
                Planning a special night out? Book a table with us and
                experience a meal to remember.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;