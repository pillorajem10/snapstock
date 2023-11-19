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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Switch,
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

//css
import styles from './index.module.css';

const Page = () => {
  const { error } = useSelector(state => state.jkai.order);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const { id } = useParams();

  const [orderDeets, setOrderDeets] = useState({});
  const [customerName, setCustomerName] = useState(null);
  const [productList, setProductList] = useState([]);
  const [credit, setCredit] = useState('');
  const [click, setClick] = useState(0);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openSuccessSnackbarAddItem, setOpenSuccessSnackbarAddItem] = useState(false);
  const [openErrorSnackbarAddItem, setOpenErrorSnackbarAddItem] = useState(false);
  const [orderItemList, setOrderItemList] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [pageSize] = useState(50);

  const category = Cookies.get('category');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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

/*
const handleOrderItemList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      orderId: id
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.getOrdersItemsByParams(payload))
      .then((res) => {
        console.log("TUMAKBOOOOOOOOOOO")
        const { success, data } = res;
        if (success) {
          setOrderItemList(data.docs);
          setPageDetails({
            pageIndex: data.page,
            pageSize: data.limit,
            totalPages: data.totalPages,
            totalDocs: data.totalDocs
          });
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  },
  [dispatch],
  );
*/
  const handleOrderItemList = useCallback(
    (pageIndex = 1) => {
      const payload = { pageSize, pageIndex, orderId: id };

      dispatch(common.ui.setLoading());
      dispatch(jkai.order.getOrdersItemsByParams(payload))
        .then((res) => {
          const { success, data } = res;
          if (success) {
            // console.log("DATAAAAAAAAAAAA", data)
            setOrderItemList(data.docs);
            setPageDetails({
              pageIndex: data.page,
              pageSize: data.limit,
              totalPages: data.totalPages,
              totalDocs: data.totalDocs
            });
          }
        })
        .finally(() => {
          dispatch(common.ui.clearLoading());
        });
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(common.ui.setLoading());
    dispatch(jkai.order.getOrderDetails(id))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          const modData = evaluateBooleanFields(data);
          setOrderDeets(modData);
          // setCustomerName(orderDeets.customerName);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  }, []);

  useEffect(() => {
    handleProductList();
  }, [handleProductList])

  useEffect(() => {
    handleOrderItemList();
  }, [handleOrderItemList])


  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      id,
      credit,
      customerName
    };

    // console.log("PAYLOADDDDDDDDDDDDDDDDD", payload)
    dispatch(jkai.order.updateOrderDetails(payload))
      .then((res) => {
        const { success } = res;
        if (success) {
          setOpenSuccessSnackbar(true)
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };

  const handleSubmitAddItem = (event) => {
    event.preventDefault();
    // console.log("DITO PO UNG PAYLOADD SA ADD ITEM 1")
    const payload = {
      orderId: id,
      productId,
      qty
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.addItem(payload))
      .then((res) => {
        const { success } = res;
        if (success) {
          setOpenSuccessSnackbarAddItem(true)
          location.reload();
        } else {
          setOpenErrorSnackbarAddItem(true)
        }
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
    setOpenSuccessSnackbarAddItem(false);
    setOpenErrorSnackbarAddItem(false);
  };

  const handleCreditSwitch = () => {
    if (credit === true) {
      setCredit(false)
    } else {
      setCredit(true)
    }
  }

  useEffect(() => {
    if (orderDeets.credit === true) setCredit(true)
    if (orderDeets.credit === false) setCredit(false)
    setCustomerName(orderDeets.customerName)
  }, [orderDeets]);

  useEffect(() => {
    if (credit === false || credit === "false") setCredit(true)
    if (credit === true || credit === "true") setCredit(false)
  }, [click]);

  const createBanana = (item, idx) => {
    return (
      <TableBody style = {{
          background: item.credit === "true" ? "yellow" : "white",
          display: loading && 'none'
        }} key={idx}
      >
        <TableCell>{item.productName}</TableCell>
        <TableCell>{item.qty}</TableCell>
        <TableCell>{convertMomentWithFormat(item.createdAt)}</TableCell>
        <TableCell>{formatPriceX(item.total)}</TableCell>
      </TableBody>
    )
  };

  if (!orderDeets) return <CircularProgress/>;

  // console.log("CREDIT STATE", credit);
  // console.log("CREDIT OBJECT", customerName);
  // console.log("ORDER CREDITTTTTTTTTTTT", orderDeets.credit);

  return (
    loading ? <CircularProgress/> :
    <>
    <Snackbar open={openSuccessSnackbar} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Order updated.
      </Alert>
    </Snackbar>
    <Snackbar open={openSuccessSnackbarAddItem} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Item successfully added.
      </Alert>
    </Snackbar>
    <Snackbar open={openErrorSnackbarAddItem} autoHideDuration={2000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
      <div className={styles.container}>
        {/*<div className={styles.header}>Ordered By: {orderDeets.customerName}</div>*/}
        <form className={styles.orderInfoForm} onSubmit={handleSubmit}>
          <TextField
            id="outlined-basic"
            label="Ordered By:"
            required
            value={customerName}
            variant="outlined"
            onChange={(e) => setCustomerName(e.target.value)}
          />
          {/*<p style={{fontSize: "1.5rem", fontWeight: "bold"}}>
            Credit: <Switch onClick={() => setClick(click + 1)} checked={credit === true || credit === "true"} size="large"/>
          </p>*/}
          <button className={styles.btn} type="submit">Update Order</button>
        </form>
      </div>
      <div className={styles.container}>
        <p style={{fontSize: "2rem"}}>Date ordered: <span style={{ color: "red" }}>{`${orderDeets.monthOrdered}/${orderDeets.dateOrdered}/${orderDeets.yearOrdered}`}</span></p>
      </div>
          <TableContainer style={{ display: loading && 'none' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ marginTop:"1rem" }} >
                <TableCell><b style={{ fontSize: "1.5rem" }}>Product</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Quantity</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Date</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>
              </TableRow>
            </TableHead>
            {
              orderItemList && orderItemList.map((order, index) => (
                createBanana(order, index)
              ))
            }
            <TableRow style={{ marginTop:"1rem" }}>
              <TableCell>
                <b style={{ fontSize: "1.5rem" }}>
                  Total: <span style={{ color: "#39CD35" }}>{formatPriceX(orderItemList && orderItemList.reduce((a, c) => c.total + a, 0))}</span>
                </b>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      <form className={styles.addOrderForm} onSubmit={handleSubmitAddItem}>
        <div style={{ fontSize: "1.5rem" }}><b>Add product and quantity</b></div>
        <div className={styles.inputField}>
          <select required className={styles.slct} onChange={(e) => setProductId(e.target.value)}>
            <option value=" ">Choose a product</option>
            {productList.map((product) => (
              <option key={product.name} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.inputField}>
          <TextField
            id="outlined-basic"
            label="Quantity"
            required
            variant="outlined"
            onChange={(e) => setQty(e.target.value)}
          />
        </div>
        <button className={styles.btn} type="submit">Add Item</button>
      </form>

    </>
  )
}

export default Page
