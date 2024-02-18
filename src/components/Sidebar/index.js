import React, { useState, useEffect, useCallback } from 'react';

// MUI
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';

//redux
import { useDispatch } from 'react-redux';
import { jkai } from '../../redux/combineActions';

// SOCKET IO
// import socketIOClient from 'socket.io-client';
import socket from "../../services/socketService";
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
  notificationsDialog: {
    minWidth: '300px',
  },
}));

// MUI ICONS
import {
  Home,
  ShoppingCart,
  ListAlt,
  AddBox,
  AccountCircle,
  People,
  ExitToApp
} from '@mui/icons-material';



//REACT ROUTER DOM
import { Link, useNavigate } from 'react-router-dom';

//STYLE
import styles from './index.module.css';

// NOTIFICATION SOUND
import notificationSound from './notifSound.mp3';
import { Howl, Howler } from 'howler';



const Sidebar = ({ isOpen, onClose }) => {
  const account = Cookies.get('account');
  const storedToken = Cookies.get('token');
  const role = Cookies.get('role');
  const category = Cookies.get('category');
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://snapstock.site";

  const [accountDeets, setAccountDeets] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [pageSize] = useState(10);
  // const [audio] = useState(new Audio(notificationSound));

  const sound = new Howl({
    src: [notificationSound],
  });


  const handleNotifList = useCallback(
    () => {
      const userDeets = storedToken ? JSON.parse(account): null;
      const userDeetsId = storedToken ? userDeets._id : null;

      const payload = {
        pageIndex: 1,
        pageSize: 100,
        category,
        user: userDeetsId
      }
      dispatch(jkai.notification.getNotificationsByParams(payload))
        .then((res) => {
          const { success, data } = res;
          if (success) {
            setNotifications(data.docs);

            const unreadPastNotifsCount = data.docs.reduce((count, notification) => {
              return notification.unread ? count + 1 : count;
            }, 0);

            setUnreadCount(unreadCount + unreadPastNotifsCount);
          }
        })
    },
    [dispatch],
  );



  useEffect(() => {
    if (storedToken) {
      setAccountDeets(JSON.parse(account));
    }

    return () => {};
  }, [storedToken, account]);

  useEffect(() => {
    socket.emit("joinRoom", category, (acknowledgmentData) => {
      if (acknowledgmentData && acknowledgmentData.success) {
        console.log(`Successfully joined room ${category}`);
      } else {
        console.error(`Failed to join room ${category}`);
      }
    });

    return () => {};
  }, [category]);

  useEffect(() => {
    socket.on("newOrder", (message) => {
      console.log('NOTIFICATION SENT!!!!')
      const updatedNotifications = [...notifications, message];
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount + 1);

      handleNotifList();
      sound.play();
    });

    return () => {
      socket.off("newOrder");
    };
  }, [notifications]);



  const handleSignOut = () => {
    dispatch(jkai.user.userLogout())
  };

  const goToMyprofile = () => {
    onClose();
    navigate(`/myprofile/${accountDeets._id}`);
  };

  const handleAccountCircleClick = () => {
    // Reset unread count
    setUnreadCount(0);

    // Show notifications dialog
    setShowNotificationsDialog(true);

    // Find IDs of notifications with unread: true
    const unreadNotificationIds = notifications.reduce((ids, notification) => {
      if (notification.unread) {
        ids.push(notification._id); // Assuming _id is the ID field of your notification
      }
      return ids;
    }, []);

    // Construct payload for updating notifications
    const payload = {
      ids: unreadNotificationIds,
      updateData: {
        unread: false
      }
    };

    // Dispatch action to update notifications
    dispatch(jkai.notification.updateNotif(payload));
  };

  const handleNotificationsDialogClose = () => {
    setShowNotificationsDialog(false);
    handleNotifList();
  };

  useEffect(() => {
    handleNotifList();
  }, [handleNotifList])

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
      <Dialog
        open={showNotificationsDialog}
        onClose={handleNotificationsDialogClose}
        classes={{ paper: classes.notificationsDialog }}
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
        <List>
          {[...notifications] // Make a copy of notifications to avoid mutating the original array
            .map((notification, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={typeof notification === 'string' ? notification : notification.message}
                  primaryTypographyProps={{
                    style: { fontWeight: notification.unread ? 'bold' : 'normal' },
                  }}
                />
              </ListItem>
            ))}
        </List>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotificationsDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <List>
        {/* SIDEBAR OWNER ROLE */}
        {role === '1' && (
          <>
            <div className={styles.introContainer}>
              <Badge badgeContent={unreadCount} color="primary">
                <AccountCircle sx={{ fontSize: 50 }} onClick={handleAccountCircleClick} />
              </Badge>
              <div onClick={goToMyprofile}>
                <div className={styles.introName}>Hello, {accountDeets.fname}</div>
              </div>
            </div>
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
            <div className={styles.listings}>
              <Link to='/users' onClick={onClose}><People sx={{ marginRight: 3 }} /> Users</Link>
            </div>
            <div className={styles.listings} onClick={handleSignOut}>
              <Link><ExitToApp sx={{ marginRight: 3 }} />Sign Out</Link>
            </div>
          </>
        )}

        {/* SIDEBAR MANAGER ROLE */}
        {role === '2' && (
          <>
            <div className={styles.introContainer}>
              <Badge badgeContent={unreadCount} color="primary">
                <AccountCircle sx={{ fontSize: 50 }} onClick={handleAccountCircleClick} />
              </Badge>
              <div onClick={goToMyprofile}>
                <div className={styles.introName}>Hello, {accountDeets.fname}</div>
              </div>
            </div>
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
            <div className={styles.listings} onClick={handleSignOut}>
              <Link><ExitToApp sx={{ marginRight: 3 }} />Sign Out</Link>
            </div>
          </>
        )}

        {/* SIDEBAR MANAGER ROLE */}
        {role === '0' && (
          <>
            <div className={styles.introContainer}>
              <Badge badgeContent={unreadCount} color="primary">
                <AccountCircle sx={{ fontSize: 50 }} onClick={handleAccountCircleClick} />
              </Badge>
              <div onClick={goToMyprofile}>
                <div className={styles.introName}>Hello, {accountDeets.fname}</div>
              </div>
            </div>
            <div className={styles.listings}>
              <Link to='/home' onClick={onClose}><Home sx={{ marginRight: 3 }} />Home</Link>
            </div>
            <div className={styles.listings}>
              <Link to='/viewinvt' onClick={onClose}><ShoppingCart sx={{ marginRight: 3 }} /> Products</Link>
            </div>
            <div className={styles.listings}>
              <Link to='/viewallorders' onClick={onClose}><ListAlt sx={{ marginRight: 3 }} /> All Orders</Link>
            </div>
            <div className={styles.listings} onClick={handleSignOut}>
              <Link><ExitToApp sx={{ marginRight: 3 }} />Sign Out</Link>
            </div>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
