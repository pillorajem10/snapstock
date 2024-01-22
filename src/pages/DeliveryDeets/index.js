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

//css
import styles from './index.module.css';

// LOADING
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component

import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Page = () => {
  const { error } = useSelector(state => state.jkai.delivery);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const role = Cookies.get('role');
  const category = Cookies.get('category');

  const [productDeets, setProductDeets] = useState({});
  const [productName, setProductName] = useState('');
  const [qty, setQty] = useState('');
  const [productList, setProductList] = useState([]);
  const [productId, setProductId] = useState('');
  const [addedStocks, setAddedStocks] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


  useEffect(() => {
    if (role === '0') {
      navigate('/home');
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.delivery.getDeliveryDetails(id))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setProductDeets(data);
          setProductName(data.productName);
          setProductId(data.productId._id);
          setQty(data.qty);
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
      productName,
      productId,
      qty
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.delivery.updateDeliveryDetails(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setOpenSuccessSnackbar(true);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
        // location.reload();
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

  useEffect(() => {
    handleProductList();
  }, [handleProductList])

  console.log('productId', productId)


  return (
    loading ? <LoadingSpinner /> :
    <>
      <Snackbar open={openSuccessSnackbar} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Restock updated.
        </Alert>
      </Snackbar>
      <div style={{margin: 20}}>
        <div className={styles.forms}>
          <form className={styles.orderInfoForm} onSubmit={handleSubmitUpdateProd}>
            <div style={{fontSize: "1.5rem", fontWeight: "bold"}}>Update Re-stock</div>
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
              style={{marginTop: 20, width: "100%"}}
              id="outlined-basic"
              onChange={(e) => setQty(e.target.value)}
              label="Quantity Added:"
              value={qty}
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
