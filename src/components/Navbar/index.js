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

import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon



const Navbar = () => {
  const storedToken = Cookies.get('token');
  const role = Cookies.get('role');
  const categoryId = Cookies.get('category');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div onClick={handleBackToHome} className={styles.mainName}>
          {name}
        </div>
        { /*storedToken && (
          <>
            <div className={styles.listings}>
              <Link to='/viewinvt'>Products</Link>
            </div>
            <div className={styles.listings}>
              <Link to='/viewallorders'>All Orders</Link>
            </div>
            <div className={styles.listings}>
              <Link to='/deliveries'>Add Stocks</Link>
            </div>
            {role === '1' && (
              <div className={styles.listings}>
                <Link to='/users'>Users</Link>
              </div>
            )}
            <div className={styles.listings} onClick={handleSignOut}>
              <Link>Sign Out</Link>
            </div>
          </>
        ) */}
      </div>
    </>
  );
}


export default Navbar
