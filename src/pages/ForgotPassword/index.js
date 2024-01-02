// react
import React, { useState, useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../redux/combineActions';

//react router dom
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Cookies from 'js-cookie';

//MUI STUFFS
import {
  CircularProgress,
  TextField,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//UTILS
import { formatPriceX, evaluateBooleanFields, convertMomentWithFormat } from '../../utils/methods'

//css
import styles from './index.module.css';

// LOGO
import logoImage from './StockPhoto5.png'; // Replace with the actual path to your image
import fullLogo from './snapstocklogo.png'; // Replace with the actual path to your image

// components
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component

const Page = () => {
  const { error } = useSelector(state => state.jkai.user);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  useEffect(() => {
    const token = Cookies.get('token'); // Check local storage for the token

    if (token) {
      // If there's no token, redirect to the login page or any other route
      navigate('/home');
    }
  }, [navigate]);


  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      email
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.requestNewPass(payload))
      .then((res) => {
        // Handle the response, whether success or error
        if (res.success) {
          setOpenSuccessSnackbar(true);
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setOpenErrorSnackbar(true);
        // console.log('Register was not successful:', res.payload); // Log the error message
          setErrMsg(res.payload)
          // You can also display an error message to the user if needed
        }
      })
      .catch((error) => {
        // Handle network or other errors
        // console.error('An error occurred during registration:', error);
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenErrorSnackbar(false);
  };

  const backTologinPage = () => {
    navigate('/');
  }


  return (
    <div className={styles.container}>
    <>
      <Snackbar open={openErrorSnackbar} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Request for new password already sent through your email. Please wait for the email.
        </Alert>
      </Snackbar>
      <LoadingSpinner />
      <div className={`${styles.leftContainer} ${styles.fullWidthHeight }`}>
        <img src={logoImage} alt="Logo" className={styles.logoImage} />
        <center><img src={fullLogo} alt="FullLogo" className={styles.fullLogo} /></center>
      </div>
      <div className={styles.rightContainer}>
        <div>
          <div className={styles.forms}>
            <form className={styles.orderInfoForm} onSubmit={handleSubmit}>

              <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Forgot your password? Submit your email to request a new password.</div>
              <TextField
                style={{ marginTop: 20, width: '100%' }}
                id="outlined-basic"
                onChange={(e) => setEmail(e.target.value)}
                label="Email:"
                required
                variant="outlined"
              />
              <button className={styles.btn} type="submit">
                Login
              </button>
            </form>
            <div onClick={backTologinPage} className={styles.formLinks}>
              Back to login page
            </div>
          </div>
        </div>
      </div>
    </>
  </div>
  );
}

export default Page
