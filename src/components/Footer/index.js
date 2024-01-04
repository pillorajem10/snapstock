import React from 'react';

//REACT ROUTER DOM
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';

import styles from './index.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p style={{ marginLeft: '42%' }}>&copy; 2023 SnapStock All rights reserved.</p>
        <p style={{ marginRight: 50 }} className={styles['contact-us']}><Link to="/contactus">Contact Us <PhoneIcon style={{ marginLeft:5 }}/></Link></p>
      </div>
    </footer>
  );
}

export default Footer;
