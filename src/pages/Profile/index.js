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
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('')

  //
  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState ('');
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.user.getUser(id))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          console.log('USER CATEGORY 1', data.category)

          setUserDeets(data);
          setCategory(data.category);
          setEmail(data.email);
          setUsername(data.username);
          setFname(data.fname);
          setLname(data.lname);
          setPassword(data.password);
          setRepassword(data.password); // Assuming you want to autofill retype password too
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, []);

  useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.category.getCategory(category))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          console.log('USER CATEGORY 1', data.category)
          setCategoryName(data.name);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, [category]);

  const handleSubmitUpdateProd = (event) => {
    event.preventDefault();

    const payload = {
      id,
      email,
      fname,
      lname,
      username,
      password,
      repassword
    }

    const categoryPayload = {
      id: category,
      name: categoryName
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.category.updateCategory(categoryPayload))
    dispatch(jkai.user.updateUser(payload))
      .then((res) => {
        // console.log('RESPONEEEEEEEEEE', res)
        if (res.success) {
          console.log('RESPONSE FROM REQ USER UPDATE', res)
          setOpenSuccessSnackbar(true);
          setSuccessMessage(res.msg);
          /*setTimeout(() => {
            location.reload();
          }, 2000);*/
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

  const requestPass = () => {
    const payload = {
      id,
      email
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.requestNewPass(payload))
      .then((res) => {
        // console.log('RESPONEEEEEEEEEE', res)
        if (res.success) {
          console.log('RESPONSE FROM REQ NEW PASS', res)
          // console.log('REQUEST PASSOWORD RESPONSE', res);
          setOpenSuccessSnackbar(true);
          setSuccessMessage(res.msg);
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
  }

  // console.log('USER DEETS', userDeets);
  console.log('USER CATEGORY', categoryName);

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
      {/*<div style={{margin: 20}}>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Username: <span style={{ color: "red" }}>{userDeets.username}</span></div>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Username: <span style={{ color: "red" }}>{category}</span></div>
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
        </div>
      </div>*/}
      <div className={styles.forms}>
        <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Want to update your profile? Just edit the form.</div>
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setCategoryName(e.target.value)}
            label="Business name:"
            required
            variant="outlined"
            value={categoryName}
          />
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setEmail(e.target.value)}
            label="Email:"
            required
            variant="outlined"
            disabled
            value={email}
          />
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setUsername(e.target.value)}
            label="Username:"
            required
            variant="outlined"
            value={username}
          />
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setFname(e.target.value)}
            label="First name:"
            required
            variant="outlined"
            value={fname}
          />
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setLname(e.target.value)}
            label="Last name:"
            required
            variant="outlined"
            value={lname}
          />
          {/*<TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setPassword(e.target.value)}
            label="Password:"
            required
            type="password"
            variant="outlined"
          />
          <TextField
            style={{ marginTop: 20, width: '100%' }}
            id="outlined-basic"
            onChange={(e) => setRepassword(e.target.value)}
            label="Re type password:"
            required
            type="password"
            variant="outlined"
          />*/}
          <button className={styles.btn} type="submit">
            Update
          </button>
        </form>
        <div className={styles.formLinks} onClick={requestPass}>Want to change your password? Click here</div>
      </div>
    </>
  )
}

export default Page
