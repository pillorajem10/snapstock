//REACT
import React, { useEffect, useState, useCallback } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../redux/combineActions';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';


//MUI STUFFS
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Snackbar
} from '@mui/material'
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

// sectiions
import AddOrderForm from './sections/AddOrder';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX, formatPriceY, convertMomentWithFormat } from '../../utils/methods'

// LoadingSpinner
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component

//COOKIES
import Cookies from 'js-cookie';

// xlsx
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const Page = () => {
  const { error } = useSelector(state => state.jkai.order);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://snapstock.site/api';

  const [orderList, setOrderList] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [pageDetails, setPageDetails] = useState(null);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [pageSize] = useState(10);

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const category = Cookies.get('category');

  const fomattedDateNow = convertMomentWithFormat(Date.now());

  const monthOrdered = +fomattedDateNow.split('/')[0];
  const dateOrdered = +fomattedDateNow.split('/')[1];
  const yearOrdered = +fomattedDateNow.split('/')[2];

  const handleOrderList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      customerName,
      monthOrdered,
      dateOrdered,
      yearOrdered,
      category
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.getOrdersByParams(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setOrderList(data.docs);
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
  [dispatch, customerName, pageSize],
);

  const handleDeleteClick = (orderId) => {
    setDeleteOrderId(orderId);
  };


  const handleDeleteConfirm = async () => {
    try {
      dispatch(common.ui.setLoading());

      const res = await dispatch(jkai.order.removeOrderDetails(deleteOrderId));

      if (res.success) {
        console.log('SUCCESSSSSSSSSSSSSSSS')
        setOpenSuccessSnackbar(true);
        setSuccessMessage(res.msg);
      } else {
        setOpenErrorSnackbar(true);
      }
    } catch (error) {
      console.error('Error during delete:', error);
      setOpenSuccessSnackbar(true);
    } finally {
      setDeleteOrderId(null);
      dispatch(common.ui.clearLoading());
      handleOrderList(); // Refresh the order list after deletion
    }
  };



  const handleDeleteCancel = () => {
    // Reset the deleteOrderId state if deletion is canceled
    setDeleteOrderId(null);
  };

  useEffect(() =>{
    handleOrderList();
  },[handleOrderList])


  const handleChangePageIndex = (event, value) => {
    handleOrderList(value);
  };

  const filteredCreditArray = orderList && orderList.filter(order => order.credit === "false" || order.credit === false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  const handleDownloadExcel = () => {
    const payload = {
      orderList,
      fomattedDateNow,
      totalOrder, // Include totalOrder in the payload
    };

    dispatch(common.ui.setLoading());

    fetch(`${baseUrl}/order/report/generateexcel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `Orders_Report_${fomattedDateNow}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error('Error downloading Excel:', error);
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  };




  const totalOrder = formatPriceX(filteredCreditArray.reduce((a, c) => c.totalPrice + a, 0));

  // Client-side code
  const handleDownloadPDF = () => {
    event.preventDefault();

    const payload = {
      orderList,
      totalOrder,
      fomattedDateNow
    };

    dispatch(common.ui.setLoading());

    // Use fetch to make the request
    fetch(`${baseUrl}/order/report/generatepdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Orders_Report_${fomattedDateNow}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      console.error('Error downloading PDF:', error);
    })
    .finally(() => {
      dispatch(common.ui.clearLoading());
    });
  };


  return (
    <>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errMsg}
        </Alert>
      </Snackbar>
      <Dialog open={!!deleteOrderId} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this order?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <AddOrderForm />
      <div className={styles.upperForm}>
        <form className={styles.searchForm}>
          <TextField
            style={{ width: "20rem", border: "double", borderRadius: "16px" }}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Search orders by customer name"
            size="small"
          />
        </form>
        <div className={styles.reportButtons}>
          <Button
            style={{ marginRight: 20 }}
            onClick={handleDownloadPDF}
            variant="outlined"
            color="primary"
          >
            Generate Orders Report PDF
          </Button>
          <Button
            onClick={handleDownloadExcel}
            variant="contained"
            color="primary"
          >
            Generate Orders Report Excel
          </Button>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <TableContainer
            style={{ display: loading && "none" }}
            component={Paper}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ marginTop: "1rem" }}>
                  <TableCell>
                    <b style={{ fontSize: "1.5rem" }}>Ordered By</b>
                  </TableCell>
                  <TableCell>
                    <b style={{ fontSize: "1.5rem" }}>Date Ordered</b>
                  </TableCell>
                  <TableCell>
                    <b style={{ fontSize: "1.5rem" }}>Total</b>
                  </TableCell>
                  <TableCell>
                    <b style={{ fontSize: "1.5rem" }}>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderList.map((order, index) => (
                  <TableRow
                    style={{
                      display: loading && "none",
                      background: order.credit === "true" ? "yellow" : "white",
                      cursor: "pointer",
                    }}
                    key={index}
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{`${order.monthOrdered}/${order.dateOrdered}/${order.yearOrdered}`}</TableCell>
                    <TableCell>{formatPriceX(order.totalPrice)}</TableCell>
                    <TableCell>
                      <DeleteIcon
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event from triggering
                          handleDeleteClick(order._id);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableRow style={{ marginTop: "1rem" }}>
                <TableCell>
                  <b style={{ fontSize: "1.5rem" }}>
                    Total for the day:{" "}
                    <span style={{ color: "#39CD35" }}>
                      {formatPriceX(
                        filteredCreditArray.reduce(
                          (a, c) => c.totalPrice + a,
                          0
                        )
                      )}
                    </span>
                  </b>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          {pageDetails && pageDetails.totalPages && (
            <Pagination
              style={{
                display: loading && "none",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
              count={pageDetails && pageDetails.totalPages}
              page={pageDetails && pageDetails.pageIndex}
              defaultPage={1}
              color="primary"
              size="large"
              onChange={handleChangePageIndex}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Page
