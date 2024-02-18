// REACT
import React from 'react';

// CSS
import styles from './index.module.css';

// IMAGES
import aboutPhoto1 from './aboutPhoto1.jpg';
import fullLogo from './snapstocklogo.png'; // Replace with the actual path to your image

const Page = () => {
  return (
    <>
      <div className={styles.aboutUsContainer}>
        <div className={styles.leftContainer}>
          <img src={aboutPhoto1} alt="Logo" className={styles.logoImage} />
          <center><img src={fullLogo} alt="FullLogo" className={styles.fullLogo} /></center>
        </div>
        <div className={styles.rightContainer}>
          <center><h1>About Us</h1></center>
          <center>
            <p className={styles.aboutUsParagraph}>
              In the fast-paced landscape of business, efficiency is key,
              and nowhere is this more critical than in the management of inventory and sales.
              Enter SnapStock – a game-changing solution designed to simplify
              and revolutionize the way businesses of all sizes handle their inventory and sales operations.
            </p>
            <p className={styles.aboutUsParagraph}>
              At SnapStock, our vision is clear:<br/>
              to empower businesses by providing
              them with an unparalleled tool that eases the complexities
              of inventory management. We understand that in today's
              dynamic marketplace, success is not just about selling products;
              it's about having a streamlined and intelligent system that allows businesses to thrive.
            </p>
          </center>
        </div>
      </div>
    </>
  )
}

export default Page
