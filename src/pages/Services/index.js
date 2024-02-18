// REACT
import React from 'react';

// CSS
import styles from './index.module.css';

// IMAGES
import aboutPhoto1 from './aboutPhoto1.jpg';
import fullLogo from './snapstocklogo.png'; // Replace with the actual path to your image

import { Helmet } from 'react-helmet';

const Page = () => {
  return (
    <>
      <Helmet>
        <meta
          property="og:title"
          content="SnapStock | Services"
          key="title"
        />
        <meta
          name="description"
          content="Monitor your inventory and sales anytime and anywhere using SnapStock."
        />
        <meta
          property="og:image"
          content="%PUBLIC_URL%/snapstocklogo.png"
          key="image"
        />
      </Helmet>
      <div className={styles.aboutUsContainer}>
        <div className={styles.leftContainer}>
          <img src={aboutPhoto1} alt="Logo" className={styles.logoImage} />
          <center><img src={fullLogo} alt="FullLogo" className={styles.fullLogo} /></center>
        </div>
        <div className={styles.rightContainer}>
          <center><h1>Services</h1></center>
          <center>
            <p className={styles.aboutUsParagraph}>
              At SnapStock, our services are crafted to simplify and optimize the way businesses handle their inventory and sales operations.
              Our comprehensive inventory management solution ensures businesses stay in control with real-time tracking, dynamic sales analytics,
              and cloud-based accessibility. Tailored reports, affordability, and scalability are at the core of our services,
              providing businesses of all sizes with the tools needed for strategic decision-making. With SnapStock, unlock efficiency,
              affordability, and scalability to propel your business towards sustained success.
            </p>
            <p className={styles.aboutUsParagraph}>
              Experience a transformative journey with SnapStock's services, where simplicity meets sophistication, and businesses thrive with ease.
              Our commitment to providing affordable solutions without compromise,
              coupled with the scalability to grow with your business, makes SnapStock the go-to partner for elevating your inventory and sales management.
              With SnapStock, unlock efficiency, affordability, and scalability to propel your business towards sustained success.
            </p>
          </center>
        </div>
      </div>
    </>
  )
}

export default Page
