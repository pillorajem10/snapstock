// react
import React, { useState, useEffect, useCallback } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../redux/combineActions';

//react router dom
import { useParams, useNavigate } from 'react-router-dom';

//MUI STUFFS
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Switch,
  TableRow,
  Paper,
  TextField,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const navigate = useNavigate();

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
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('')

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

    const payload = {
      orderId: id,
      productId,
      qty,
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.addItem(payload))
      .then((res) => {
        const { success } = res || {};  // Make sure 'res' is defined
        if (success) {
          setOpenSuccessSnackbarAddItem(true);
          setSuccessMessage(res.msg)
          location.reload();
        } else {
          setOpenErrorSnackbarAddItem(true);
          setErrMsg(res.payload);
        }
      })
      .catch((error) => {
        setOpenErrorSnackbarAddItem(true);
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

  const handleDeleteCancel = () => {
    // Close the confirmation dialog
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = () => {
    console.log('CONFRIM DELETE', itemToDelete._id);
    const payload = {
      orderId: itemToDelete.orderId,
      orderItemId: itemToDelete._id
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.removeOrderItemDetails(payload))
      .then((res) => {
        const { success } = res;
        if (success) {
          setOpenSuccessSnackbarAddItem(true)
          setDeleteConfirmationOpen(false);
          setSuccessMessage(res.msg);
          setItemToDelete(null);
          location.reload();
        } else {
          setOpenErrorSnackbarAddItem(true)
          setDeleteConfirmationOpen(false);
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };



  if (!orderDeets) return <CircularProgress/>;

  return (
      loading ? <CircularProgress /> :
        <>
          <Snackbar open={openSuccessSnackbar} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={openSuccessSnackbarAddItem} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              {successMessage}
            </Alert>
          </Snackbar>
          <Snackbar open={openErrorSnackbarAddItem} autoHideDuration={2000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {errMsg}
            </Alert>
          </Snackbar>
          <Dialog
            open={deleteConfirmationOpen}
            onClose={handleDeleteCancel}
          >
            <DialogTitle>Delete Item</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this item?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {/* Snackbar components and other UI elements */}
          <div className={styles.formContainer}>
            <form className={styles.orderInfoForm} onSubmit={handleSubmit}>
              <div style={{ fontSize: "1.5rem" }}><b>Update customer</b></div>
              <TextField
                id="outlined-basic"
                label="Ordered By:"
                required
                style={{ marginTop: 20 }}
                value={customerName}
                variant="outlined"
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <button className={styles.btn} type="submit">Update Order</button>
            </form>

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
          </div>
          <div className={styles.container}>
            <p style={{ fontSize: "2rem" }}>Date ordered: <span style={{ color: "red" }}>{`${orderDeets.monthOrdered}/${orderDeets.dateOrdered}/${orderDeets.yearOrdered}`}</span></p>
          </div>
          <TableContainer style={{ display: loading && 'none' }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ marginTop: "1rem" }} >
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Product</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Quantity</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Date</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Action</b></TableCell>
                </TableRow>
              </TableHead>
              {
                orderItemList && orderItemList.map((order, index) => (
                  <TableBody
                    onClick={() => navigate(`/order/${id}/${order._id}`)}
                    style={{
                      background: order.credit === "true" ? "yellow" : "white",
                      display: loading && 'none',
                      cursor: 'pointer'
                    }} key={index}
                  >
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>{order.qty}</TableCell>
                    <TableCell>{convertMomentWithFormat(order.createdAt)}</TableCell>
                    <TableCell>{formatPriceX(order.total)}</TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => { e.stopPropagation(); setItemToDelete(order); setDeleteConfirmationOpen(true); }}>
                        <DeleteIcon style={{ color: 'red' }} />
                      </IconButton>
                    </TableCell>
                  </TableBody>
                ))
              }
              <TableRow style={{ marginTop: "1rem" }}>
                <TableCell>
                  <b style={{ fontSize: "1.5rem" }}>
                    Total: <span style={{ color: "#39CD35" }}>{formatPriceX(orderItemList && orderItemList.reduce((a, c) => c.total + a, 0))}</span>
                  </b>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>
        </>
    );
}

export default Page
