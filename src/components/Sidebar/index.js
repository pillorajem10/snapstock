import React, { useState, useEffect } from 'react';

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
import { useDispatch, useSelector } from "react-redux";
import { jkai } from "../../redux/combineActions";

// SOCKET IO
import socket from "../../services/socketService";

// COOKIES
import Cookies from "js-cookie";

// MUI ICONS
import {
  Home,
  ShoppingCart,
  ListAlt,
  AddBox,
  AccountCircle,
  People,
  ExitToApp,
} from "@mui/icons-material";

//REACT ROUTER DOM
import { Link, useNavigate } from "react-router-dom";

//STYLE
import styles from "./index.module.css";

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
    minWidth: "300px",
  },
}));

const Sidebar = ({ isOpen, onClose }) => {
  const account = Cookies.get("account");
  const storedToken = Cookies.get("token");
  const role = Cookies.get("role");
  const category = Cookies.get("category");
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [accountDeets, setAccountDeets] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [pageSize] = useState(7);

  const { jkai } = useSelector((state) => {
    console.log("[(x_-) SIDEBAR STATE] ", state);
    return state;
  });

  const ordah = jkai.order.order;

  useEffect(() => {
    console.log("[(x_-) USE EFFECT2] ");
    // console.log("baseUrl", baseUrl);

    if (storedToken) {
      setAccountDeets(JSON.parse(account));
    }

    // const socket = io(baseUrl);

    // socket.emit("joinRoom", category, (acknowledgmentData) => {
    //   console.log("[(x_-) USE EFFECT socketEMITJOINROOM category] ", category);
    //   console.log(
    //     "[(x_-) USE EFFECT socketEMITJOINROOM acknowledgmentData] ",
    //     acknowledgmentData
    //   );

    //   // console.log('ACKKNOW', acknowledgmentData)
    //   if (acknowledgmentData && acknowledgmentData.success) {
    //     console.log("[(x_-) USE EFFECT socketEMITJOINROOM SUCCESS] ", category);
    //     // console.log(`Successfully joined room ${category}`);
    //   } else {
    //     console.log("[(x_-) USE EFFECT socketEMITJOINROOM FAIL] ", category);
    //     // console.error(`Failed to join room ${category}`);
    //   }
    // });

    // socket.on("newOrder", (message) => {
    //   console.log("[(x_-) USE EFFECT socketONNEWORD message] ", message);
    //   const updatedNotifications = [...notifications, message];
    //   setNotifications(updatedNotifications);
    //   setUnreadCount(unreadCount + 1);
    // });

    return () => {
      // console.log("[(x_-) USE EFFECT GARBAGE SOCKET DISCO] ");
      // socket.disconnect();
    };
  }, [account, notifications, unreadCount, storedToken, category]);

  // Separate useEffect for fetching past notifications
  useEffect(() => {
    const fetchPastNotifications = async () => {
      try {
        const response = await dispatch(
          jkai.notification.getNotificationsByParams({
            pageIndex: 1,
            pageSize,
            category,
          })
        );
        const { success, data } = response;
        if (success) {
          setNotifications(data.docs);
        }
      } catch (error) {
        console.error("Error fetching past notifications:", error);
      }
    };

    // Fetch past notifications when the component mounts
    fetchPastNotifications();
  }, [dispatch, pageSize, category]);

  const handleSignOut = () => {
    dispatch(jkai.user.userLogout());
  };

  const goToMyprofile = () => {
    onClose();
    navigate(`/myprofile/${accountDeets._id}`);
  };

  const handleAccountCircleClick = () => {
    setUnreadCount(0);
    setShowNotificationsDialog(true);
  };

  const handleNotificationsDialogClose = () => {
    setShowNotificationsDialog(false);
  };

  useEffect(() => {
    console.log("[(x_-) USE EFFECT] ");

    socket.on("newOrder", (message) => {
      console.log("[(x_-) USE EFFECT socketONNEWORD message] ", message);
      const updatedNotifications = [...notifications, message];
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount + 1);
    });

    return () => {
      console.log("[(x_-) USE EFFECT GARBAGE SOCKET DISCO] ");
      socket.disconnect();
    };
  }, [ordah]);

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
            {notifications
              .slice()
              .reverse()
              .map((notification, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      typeof notification === "string"
                        ? notification
                        : notification.message
                    }
                    primaryTypographyProps={{
                      style: {
                        fontWeight: index < unreadCount ? "bold" : "normal",
                      },
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
        {role === "1" && (
          <>
            <div className={styles.introContainer}>
              <Badge badgeContent={unreadCount} color="primary">
                <AccountCircle
                  sx={{ fontSize: 50 }}
                  onClick={handleAccountCircleClick}
                />
              </Badge>
              <div onClick={goToMyprofile}>
                <div className={styles.introName}>
                  Hello, {accountDeets.fname}
                </div>
              </div>
            </div>
            <div className={styles.listings}>
              <Link to="/home" onClick={onClose}>
                <Home sx={{ marginRight: 3 }} />
                Home
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/viewinvt" onClick={onClose}>
                <ShoppingCart sx={{ marginRight: 3 }} /> Products
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/viewallorders" onClick={onClose}>
                <ListAlt sx={{ marginRight: 3 }} /> All Orders
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/deliveries" onClick={onClose}>
                <AddBox sx={{ marginRight: 3 }} /> Add Stocks
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/users" onClick={onClose}>
                <People sx={{ marginRight: 3 }} /> Users
              </Link>
            </div>
            <div className={styles.listings} onClick={handleSignOut}>
              <Link>
                <ExitToApp sx={{ marginRight: 3 }} />
                Sign Out
              </Link>
            </div>
          </>
        )}

        {/* SIDEBAR MANAGER ROLE */}
        {role === "2" && (
          <>
            <div className={styles.introContainer}>
              <Badge badgeContent={unreadCount} color="primary">
                <AccountCircle
                  sx={{ fontSize: 50 }}
                  onClick={handleAccountCircleClick}
                />
              </Badge>
              <div onClick={goToMyprofile}>
                <div className={styles.introName}>
                  Hello, {accountDeets.fname}
                </div>
              </div>
            </div>
            <div className={styles.listings}>
              <Link to="/home" onClick={onClose}>
                <Home sx={{ marginRight: 3 }} />
                Home
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/viewinvt" onClick={onClose}>
                <ShoppingCart sx={{ marginRight: 3 }} /> Products
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/viewallorders" onClick={onClose}>
                <ListAlt sx={{ marginRight: 3 }} /> All Orders
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/deliveries" onClick={onClose}>
                <AddBox sx={{ marginRight: 3 }} /> Add Stocks
              </Link>
            </div>
            <div className={styles.listings} onClick={handleSignOut}>
              <Link>
                <ExitToApp sx={{ marginRight: 3 }} />
                Sign Out
              </Link>
            </div>
          </>
        )}

        {/* SIDEBAR MANAGER ROLE */}
        {role === "0" && (
          <>
            <div className={styles.introContainer}>
              <Badge badgeContent={unreadCount} color="primary">
                <AccountCircle
                  sx={{ fontSize: 50 }}
                  onClick={handleAccountCircleClick}
                />
              </Badge>
              <div onClick={goToMyprofile}>
                <div className={styles.introName}>
                  Hello, {accountDeets.fname}
                </div>
              </div>
            </div>
            <div className={styles.listings}>
              <Link to="/home" onClick={onClose}>
                <Home sx={{ marginRight: 3 }} />
                Home
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/viewinvt" onClick={onClose}>
                <ShoppingCart sx={{ marginRight: 3 }} /> Products
              </Link>
            </div>
            <div className={styles.listings}>
              <Link to="/viewallorders" onClick={onClose}>
                <ListAlt sx={{ marginRight: 3 }} /> All Orders
              </Link>
            </div>
            <div className={styles.listings} onClick={handleSignOut}>
              <Link>
                <ExitToApp sx={{ marginRight: 3 }} />
                Sign Out
              </Link>
            </div>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
