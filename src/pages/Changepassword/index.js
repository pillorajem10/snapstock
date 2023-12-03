// react
import React, { useState, useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../redux/combineActions';

//react router dom
import { useParams } from 'react-router-dom';

//MUI STUFFS
import {
  CircularProgress,
  TableRow,
  Paper,
  TextField,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

//UTILS
import { formatPriceX, evaluateBooleanFields, convertMomentWithFormat } from '../../utils/methods'

//css
import styles from './index.module.css';

const Page = () => {
  const { error } = useSelector(state => state.jkai.user);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const { token } = useParams();


  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  console.log('CHANGE PASS TOKEN', token);

  const handleSubmitUpdateProd = (event) => {
    event.preventDefault();

    const payload = {
      token,
      password,
      repassword
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.changePass(payload))
      .then((res) => {
        // console.log('RESPONEEEEEEEEEE', res)
        if (res.success) {
          setOpenSuccessSnackbar(true);
          setSuccessMessage(res.msg);
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          // console.log('ERRROR USER UPDATE', res.payload)
          setOpenErrorSnackbar(true);
          setErrMsg(res.payload);
        }
      })
      .catch((error) => {
        // Handle network or other errors
        // console.error('An error occurred during UPDATING:', error);
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };


  return (
    loading ? <CircularProgress/> :
    <>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorSnackbar} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <div className={styles.forms}>
        <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Enter your new password here.</div>
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setPassword(e.target.value)}
            label="New Password:"
            required
            type="password"
            variant="outlined"
          />
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setRepassword(e.target.value)}
            label="Re-type password:"
            required
            type="password"
            variant="outlined"
          />
          <button className={styles.btn} type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default Page
