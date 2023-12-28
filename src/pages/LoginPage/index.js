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

  const [productDeets, setProductDeets] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [category, setCategory] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [formFormat, setFormFormat] = useState('login');
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


  const handleSubmitLogin = (event) => {
    event.preventDefault();

    const payload = {
      username,
      password
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.loginFunction(payload))
      .then((res) => {
        // Handle the response, whether success or error
        if (res.success) {
          window.location.replace('/home');
        } else {
          setOpenErrorSnackbar(true);
          // console.log('Login was not successful:', res.payload); // Log the error message
          setErrMsg(res.payload)
          // You can also display an error message to the user if needed
        }
      })
      .catch((error) => {
        // Handle network or other errors
        // console.error('An error occurred during login:', error);
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };

  const handleSubmitRegister = (event) => {
    event.preventDefault();

    const payload = {
      category,
      email,
      username,
      fname,
      lname,
      password,
      repassword
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.addUser(payload))
      .then((res) => {
        // Handle the response, whether success or error
        if (res.success) {
          setOpenSuccessSnackbar(true);
          setTimeout(() => {
            location.reload();
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
          Registration completed, email already sent for verifying the account. Please verify first before logging in.
        </Alert>
      </Snackbar>
      <LoadingSpinner />
      <div className={`${styles.leftContainer} ${styles.fullWidthHeight }`}>
        <img src={logoImage} alt="Logo" className={styles.logoImage} />
        <center><img src={fullLogo} alt="FullLogo" className={styles.fullLogo} /></center>
      </div>
      <div className={styles.rightContainer}>
        {formFormat === 'login' ? (
          <div>
            <div className={styles.forms}>
              <div className={styles.formLinks} onClick={(e) => setFormFormat('register')}>
                Don't have an account yet? Register here.
              </div>
              <form className={styles.orderInfoForm} onSubmit={handleSubmitLogin}>

                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Please login if you have an account with us.</div>
                <TextField
                  style={{ marginTop: 20, width: '100%' }}
                  id="outlined-basic"
                  onChange={(e) => setUsername(e.target.value)}
                  label="Username:"
                  required
                  variant="outlined"
                />
                <TextField
                  style={{ marginTop: 20, width: '100%' }}
                  id="outlined-basic"
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password:"
                  type="password"
                  required
                  variant="outlined"
                />
                <button className={styles.btn} type="submit">
                  Login
                </button>
              </form>
              <div className={styles.formLinks}>
                Forgot password? Click here.
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.forms}>
              <div className={styles.formLinks} onClick={(e) => setFormFormat('login')}>
                Have an account already? Login here.
              </div>
              <form className={styles.orderInfoForm} onSubmit={handleSubmitRegister}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Don't have an account? Register first.</div>
                <TextField
                   style={{ marginTop: 20, width: '100%' }}
                   id="outlined-basic"
                   onChange={(e) => setCategory(e.target.value)}
                   label="Business name:"
                   required
                   variant="outlined"
                 />
                <div style={{ display: 'flex', gap: '10px',  marginTop: 10 }}>
                  {/* Email and Username Fields */}
                  <div style={{ flex: 1 }}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email:"
                      required
                      variant="outlined"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      onChange={(e) => setUsername(e.target.value)}
                      label="Username:"
                      required
                      variant="outlined"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 10 }}>
                  {/* First Name and Last Name Fields */}
                  <div style={{ flex: 1 }}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      onChange={(e) => setFname(e.target.value)}
                      label="First name:"
                      required
                      variant="outlined"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      onChange={(e) => setLname(e.target.value)}
                      label="Last name:"
                      required
                      variant="outlined"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 10 }}>
                  {/* Password and Retype Password Fields */}
                  <div style={{ flex: 1 }}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password:"
                      type="password"
                      required
                      variant="outlined"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      onChange={(e) => setRepassword(e.target.value)}
                      label="Re-type password:"
                      type="password"
                      required
                      variant="outlined"
                    />
                  </div>
                </div>

                <button className={styles.btn} type="submit">
                  Register
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  </div>
  );
}

export default Page
