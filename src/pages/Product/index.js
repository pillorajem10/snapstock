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
  const { error } = useSelector(state => state.jkai.product);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const { id } = useParams();

  const [productDeets, setProductDeets] = useState({});
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [addedStocks, setAddedStocks] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.product.getProduct(id))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setProductDeets(data);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, []);

  const handleSubmitUpdateProd = (event) => {
    event.preventDefault();

    const forIntPrice = parseInt(price)

    const payload = {
      id,
      name,
      price: forIntPrice
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.product.updateProduct(payload))
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
  };

  /*const handleSubmitAddStocks = (event) => {
    event.preventDefault();

    const forIntAddedStocks = parseInt(addedStocks)

    const payload = {
      id,
      addedStocks: forIntAddedStocks
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.product.addStocks(payload))
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
    loading ? <CircularProgress/> :
    <>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Product updated.
        </Alert>
      </Snackbar>
      <div style={{margin: 20}}>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Name: <span style={{ color: "red" }}>{productDeets.name}</span></div>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Stocks: <span style={{ color: "red" }}>{productDeets.stocks}</span></div>
        <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Price: <span style={{ color: "red" }}>{formatPriceX(productDeets.price)}</span></div>
        <div className={styles.forms}>
          <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
            <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Update Product</div>
            <TextField
             style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setName(e.target.value)}
              label="Name:"
              required
              variant="outlined"
            />
            <TextField
              style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setPrice(e.target.value)}
              label="Price:"
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
