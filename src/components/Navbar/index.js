// REACT
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar'

//STYLE
import styles from './index.module.css';

// COOKIES
import Cookies from 'js-cookie';

//REACT ROUTER DOM
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//redux
import { useDispatch } from 'react-redux';
import { jkai } from '../../redux/combineActions';

import MenuIcon from '@mui/icons-material/Menu';

// LOGO
import logoImage from './snapstocklogo3W.png'; // Replace with the actual path to your image

const Navbar = () => {
  const storedToken = Cookies.get('token');
  const role = Cookies.get('role');
  const categoryId = Cookies.get('category');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState('SnapStock');

  const handleSignOut = () => {
    dispatch(jkai.user.userLogout())
  };

  const handleBackToHome = () => {
    if (storedToken) {
      navigate('/home');
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    if (storedToken) {
      dispatch(jkai.category.getCategory(categoryId))
        .then((res) => {
          const { success, data } = res;
          if (success) {
            setName(`${data.name} SnapStock`)
          }
        })
    }
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={styles.navbarContainer}>
        { storedToken && (
          <>
            <div className={styles.burgerIcon} onClick={toggleSidebar}>
              <MenuIcon style={{ color: 'white' }} />
            </div>
          </>
        ) }
        <img onClick={handleBackToHome} src={logoImage} alt="Logo" className={styles.logoImage} />
        <div className={styles.listings}>
          <Link to='/about'>About Us</Link>
        </div>
        <div className={styles.listings}>
          <Link to='/services'>Services</Link>
        </div>
      </div>
    </>
  );
}


export default Navbar
