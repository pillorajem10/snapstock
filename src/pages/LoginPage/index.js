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

  const [productDeets, setProductDeets] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [addedStocks, setAddedStocks] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  /*useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.user.getProduct(id))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setProductDeets(data);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, []);*/

  const handleSubmitUpdateProd = (event) => {
    event.preventDefault();

    const payload = {
      username,
      password
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.loginFunction(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setOpenSuccessSnackbar(true);
        }
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
  };


  return (
    <>
      <div style={{margin: 20}}>
        <div className={styles.forms}>
          <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
            <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Login</div>
            <TextField
             style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setUsername(e.target.value)}
              label="Username:"
              required
              variant="outlined"
            />
            <TextField
              style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setPassword(e.target.value)}
              label="Password:"
              type="password"
              required
              variant="outlined"
            />
            <button className={styles.btn} type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Page
