import React, { useState, useEffect } from 'react';

// MUI
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';

//redux
import { useDispatch } from 'react-redux';
import { jkai } from '../../redux/combineActions';

// COOKIES
import Cookies from 'js-cookie';

// MUI USE STYLE SHIT
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 300,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 300,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

// MUI ICONS
import {
  Home,
  ShoppingCart,
  ListAlt,
  AddBox,
  People,
  ExitToApp
} from '@mui/icons-material';



//REACT ROUTER DOM
import { Link, useNavigate } from 'react-router-dom';

//STYLE
import styles from './index.module.css';


const Sidebar = ({ isOpen, onClose }) => {
  const account = Cookies.get('account');
  const storedToken = Cookies.get('token');
  const role = Cookies.get('role');
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [accountDeets, setAccountDeets] = useState({});

  useEffect(() => {
    if (storedToken) {
     setAccountDeets(JSON.parse(account));
    }
  }, [account]);

  const handleSignOut = () => {
    dispatch(jkai.user.userLogout())
  };

  const goToMyprofile = () => {
    onClose();
    navigate(`/myprofile/${accountDeets._id}`);
  };


  return (
    <Drawer
      className={classes.drawer}
      variant="temporary"
      anchor="left"
      open={isOpen}
      onClose={onClose}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List>
        <div className={styles.introName} onClick={goToMyprofile}>Hello, {accountDeets.fname}</div>
        <div className={styles.listings}>
          <Link to='/home' onClick={onClose}><Home sx={{ marginRight: 3 }} />Home</Link>
        </div>
        <div className={styles.listings}>
          <Link to='/viewinvt' onClick={onClose}><ShoppingCart sx={{ marginRight: 3 }} /> Products</Link>
        </div>
        <div className={styles.listings}>
          <Link to='/viewallorders' onClick={onClose}><ListAlt sx={{ marginRight: 3 }} /> All Orders</Link>
        </div>
        <div className={styles.listings}>
          <Link to='/deliveries' onClick={onClose}><AddBox sx={{ marginRight: 3 }} /> Add Stocks</Link>
        </div>
        {role === '1' && (
          <div className={styles.listings}>
            <Link to='/users' onClick={onClose}><People sx={{ marginRight: 3 }} /> Users</Link>
          </div>
        )}
        <div className={styles.listings} onClick={handleSignOut}>
          <Link><ExitToApp sx={{ marginRight: 3 }} />Sign Out</Link>
        </div>
      </List>
    </Drawer>
  );
};

export default Sidebar;
