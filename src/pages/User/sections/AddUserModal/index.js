// react
import React, { useState } from 'react';

// MUI SHITS
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar
} from '@mui/material';

// MUI ICONS
import CancelIcon from '@mui/icons-material/Cancel';

// MUI Alert
import MuiAlert from '@mui/material/Alert';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../../../redux/combineActions';

// components
import LoadingSpinner from '../../../../components/Loading'; // Import the LoadingSpinner component

//STYLE
import styles from './index.module.css';

// Cookies
import Cookies from 'js-cookie';

const AddUserSection = ({ onClose }) => {
  const { error } = useSelector(state => state.jkai.user);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const category = Cookies.get('category');

  const [username, setUsername] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
  };


  const handleAddUser = (event) => {
    event.preventDefault();
    console.log('ADD USER');

    const payload = {
      category,
      email,
      username,
      fname,
      lname,
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.addEmployee(payload))
      .then((res) => {
        // Handle the response, whether success or error
        if (res.success) {
          setOpenSuccessSnackbar(true);
          setTimeout(() => {
            location.reload();
          }, 4000);
        } else {
          setOpenErrorSnackbar(true);

          // Check if 'data' is defined in the response
          if (res.data) {
            // Log the error message or handle it appropriately
            console.error('Error:', res.data);
            setErrMsg(res.data);
          } else {
            // Handle the case where 'data' is undefined
            console.error('Error: Response data is undefined');
            setErrMsg('An unexpected error occurred.');
          }
        }
      })
      .catch((error) => {
        console.log('ERROR KUYA MAN', error);
        // Handle network or other errors
        console.error('An error occurred during registration:', error);
        setOpenErrorSnackbar(true);
        setErrMsg('An unexpected error occurred.');
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };


  return (
    <>
      <Snackbar open={openErrorSnackbar} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Registration completed, email already sent for verifying the account.
        </Alert>
      </Snackbar>
      <LoadingSpinner />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '20px', // Add padding for spacing
          borderRadius: '8px', // Add border-radius for rounded corners
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: '5px', right: '5px' }}
          color="secondary"
          onClick={onClose}
        >
          <CancelIcon /> {/* Replace CloseIcon with CancelIcon */}
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '400px', // Adjust the maxWidth value as needed
          }}
        >
          <form onSubmit={handleAddUser} className={styles.addDeliveryForm}>
            <div style={{ fontSize: "1.5rem" }}><b>Add New User</b></div>
            <div className={styles.inputField}>
              <TextField
                id="outlined-basic"
                label="First name"
                style={{ width: "100%" }}
                required
                variant="outlined"
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className={styles.inputField}>
              <TextField
                id="outlined-basic"
                label="Last name"
                style={{ width: "100%" }}
                required
                variant="outlined"
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div className={styles.inputField}>
              <TextField
                id="outlined-basic"
                label="Username"
                style={{ width: "100%" }}
                required
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputField}>
              <TextField
                id="outlined-basic"
                label="Email"
                type="email"
                style={{ width: "100%" }}
                required
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className={styles.btn} type="submit">
              Add
            </button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default AddUserSection;
