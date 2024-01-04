// REACT
import React, { useEffect } from 'react';

// CSS
import styles from './index.module.css';

// IMAGES
import aboutPhoto1 from './aboutPhoto1.jpg';
import fullLogo from './snapstocklogo.png'; // Replace with the actual path to your image


const Page = () => {
  useEffect(() => {
      // Scroll to the top when the component mounts
      window.scrollTo(0, 0);
    }, []); // Empty dependency array ensures this effect runs only once, equivalent to componentDidMount

  return (
    <>
      <div className={styles.aboutUsContainer}>
        <div className={styles.leftContainer}>
          <img src={aboutPhoto1} alt="Logo" className={styles.logoImage} />
          <center><img src={fullLogo} alt="FullLogo" className={styles.fullLogo} /></center>
        </div>
        <div className={styles.rightContainer}>
          <center><h1>Contact Us</h1></center>
          <center>
            <p className={styles.aboutUsParagraph}>
              Our dedicated customer service helpline is here to assist you from 9 am to 6 pm, Monday through Friday.
              Our team is committed to providing you with excellent support and addressing any inquiries or concerns you may have during these hours.
              Please feel free to reach out to us, and we'll be happy to assist you.
            </p>
            <p className={styles.aboutUsParagraph}><b>Email:</b></p>
            <p className={styles.aboutUsParagraph}>snapstockinventorychecker@gmail.com</p>
            <p className={styles.aboutUsParagraph}><h2>Our Developers:</h2></p>
            <p className={styles.aboutUsParagraph}><b>John Emmanuel Pillora:</b></p>
            <p className={styles.aboutUsParagraph}>pillorajem10@gmail.com or 09182610912</p>
            <p className={styles.aboutUsParagraph}><b>Gabriel Matthew Salva:</b></p>
            <p className={styles.aboutUsParagraph}>gabrielmatthewsalva@gmail.com or 09663310786</p>
          </center>
        </div>
      </div>
    </>
  )
}

export default Page
