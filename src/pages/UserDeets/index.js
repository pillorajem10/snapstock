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
  const { id } = useParams();

  const [userDeets, setUserDeets] = useState({});
  const [username, setUsername] = useState('');
  const [price, setPrice] = useState('');
  const [addedStocks, setAddedStocks] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('')


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.user.getUser(id))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setUserDeets(data);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, []);

  const handleSubmitUpdateProd = (event) => {
    event.preventDefault();

    const payload = {
      id,
      username,
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.updateUser(payload))
      .then((res) => {
        // console.log('RESPONEEEEEEEEEE', res)
        if (res.success) {
          setOpenSuccessSnackbar(true);
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

  /*const handleSubmitAddStocks = (event) => {
    event.preventDefault();

    const forIntAddedStocks = parseInt(addedStocks)

    const payload = {
      id,
      addedStocks: forIntAddedStocks
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.addStocks(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setOpenSuccessSnackbar(true);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
        location.reload();
      });
  }*/

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
          User updated.
        </Alert>
      </Snackbar>
      <Snackbar open={openErrorSnackbar} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <div style={{margin: 20}}>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Username: <span style={{ color: "red" }}>{userDeets.username}</span></div>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Role: <span style={{ color: "red" }}>{userDeets.role === 1 ? ("Admin") : ("User")}</span></div>
        <div className={styles.forms}>
          <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
            <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Update User</div>
            <TextField
             style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setUsername(e.target.value)}
              label="Name:"
              required
              variant="outlined"
            />
            <button className={styles.btn} type="submit">Update</button>
          </form>
          {/*<form className={styles.orderInfoForm} onSubmit={handleSubmitAddStocks}>
            <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Add stocks</div>
            <TextField
              style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setAddedStocks(e.target.value)}
              label="Add stocks:"
              required
              variant="outlined"
            />
            <button className={styles.btn} type="submit">Update</button>
          </form>*/}
        </div>
      </div>
    </>
  )
}

export default Page
