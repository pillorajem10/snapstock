// react
import React, { useState, useEffect, useCallback } from 'react';

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

//COOKIES
import Cookies from 'js-cookie';

// LOADING
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component

//css
import styles from './index.module.css';

const Page = () => {
  const { error } = useSelector(state => state.jkai.product);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const { orderId, orderItemId } = useParams();
  const category = Cookies.get('category');

  const [productDeets, setProductDeets] = useState({});
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState('');
  const [productList, setProductList] = useState([]);
  const [qty, setQty] = useState('');
  const [addedStocks, setAddedStocks] = useState('');

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('')


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.order.getOrderItemDetails(orderItemId))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setProductDeets(data);
          setProductName(data.productName);
          setProductId(data.productId);
          setQty(data.qty);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, [orderItemId]);

  const handleProductList = useCallback(
    () => {
      const payload = {
        pageIndex: 1,
        pageSize: 100,
        category
      }
      dispatch(jkai.product.getProductsByParams(payload))
        .then((res) => {
          const { success, data } = res;
          if (success) {
            setProductList(data.docs);
          }
        })
    },
    [dispatch],
  );


  const handleSubmitUpdateProd = (event) => {
    event.preventDefault();

    const payload = {
      orderId,
      orderItemId,
      qty,
      productId
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.updateOrderItemDetails(payload))
      .then((res) => {
        const { success } = res || {};  // Make sure 'res' is defined
        if (success) {
          setOpenSuccessSnackbar(true);
          setSuccessMessage(res.msg)
        } else {
          setOpenErrorSnackbar(true);
          setErrMsg(res.payload);
        }
      })
      .catch((error) => {
        setOpenErrorSnackbar(true);
        setErrMsg(res.payload);
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

  console.log('PRODUCT DEETS', productList);
  console.log('USE PARAMS', orderItemId);

  useEffect(() => {
    handleProductList();
  }, [handleProductList])


  return (
    loading ? <LoadingSpinner /> :
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
      <div className={styles.formContainer} style={{margin: 20}}>
        <div className={styles.forms}>
          <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
            <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Update Order Item</div>
            {/*<TextField
             style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setProductName(e.target.value)}
              label="Name:"
              required
              variant="outlined"
              value={productName}
            />*/}
            <div className={styles.inputField}>
              <select
                required
                className={styles.slct}
                onChange={(e) => {
                  const selectedProductId = e.target.value;
                  const selectedProduct = productList.find(product => product._id === selectedProductId);

                  if (selectedProduct) {
                    setProductId(selectedProductId);
                    setProductName(selectedProduct.name);
                  }
                }}
                value={productId}
              >
                <option value=" ">Choose a product</option>
                {productList.map((product) => (
                  <option key={product.name} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              style={{marginTop: 20}}
              id="outlined-basic"
              onChange={(e) => setQty(e.target.value)}
              label="Price:"
              required
              variant="outlined"
              value={qty}
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
