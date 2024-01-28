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
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material'

import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

// sectiions
// import AddDeliveryForm from './sections/AddDelivery';

// LOADING
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component

//STYLE
import styles from './index.module.css';

// sectiions
import AddDeliveryForm from './sections/AddDelivery';
import Cookies from 'js-cookie';


//UTILS
import { formatPriceX, convertMomentWithFormat } from '../../utils/methods'

const Page = () => {
  const { error } = useSelector(state => state.jkai.delivery);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);
  const role = Cookies.get('role');
  const daysArray = Array.from({ length: 31 }, (_, index) => index + 1);
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: currentYear - 1999 + 1 }, (_, index) => 1999 + index);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_SERVER === 'LOCAL' ? 'http://localhost:4000' : 'https://snapstock.site/api';

  const [orderList, setDeliveryList] = useState([]);
  const [productName, setProductName] = useState('');
  const [pageDetails, setPageDetails] = useState(null);
  const [pageSize] = useState(7);
  const [monthDelivered, setMonthDelivered] = useState('');
  const [dateDelivered, setDateDelivered] = useState('');
  const [yearDelivered, setYearDelivered] = useState('');
  const [deleteDeliveryId, setDeleteDeliveryId] = useState(null);

  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const fomattedDateNow = convertMomentWithFormat(Date.now());

  const handleDeliveryList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      productName,
      monthDelivered,
      dateDelivered,
      yearDelivered,
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.delivery.getDeliveriesByParams(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setDeliveryList(data.docs);
          // console.log("DATAA DOVS", data.docs)
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
  [dispatch, productName, pageSize, monthDelivered, dateDelivered, yearDelivered],
);


  useEffect(() =>{
    if (role === '0') {
      navigate('/home');
    }

    handleDeliveryList();
  },[handleDeliveryList])


  const handleChangePageIndex = (event, value) => {
    handleDeliveryList(value);
  };

  const handleChangeMonth = (event) => {
    setMonthDelivered(event.target.value);
  };

  const handleChangeDay = (event) => {
    setDateDelivered(event.target.value);
  };

  const handleChangeYear = (event) => {
    setYearDelivered(event.target.value);
  };

  const handleClearFilters = () => {
    setProductName('');
    setMonthDelivered('');
    setDateDelivered('');
    setYearDelivered('');
  };

  const handleDownloadPDF = () => {
    event.preventDefault();

    const payload = {
      orderList,
      fomattedDateNow
    };

    dispatch(common.ui.setLoading());

    // Use fetch to make the request
    fetch(`${baseUrl}/delivery/report/generatepdf`, {
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
      a.download = `Re-stock_Inventory_Report_${fomattedDateNow}.pdf`;
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

  const handleDownloadExcel = () => {
    const payload = {
      orderList,
      fomattedDateNow
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
        a.download = `Re-stock_Inventory_Report_${fomattedDateNow}.xlsx`;
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

  const handleDeleteClick = (deliveryId) => {
    setDeleteDeliveryId(deliveryId);
  };

  const handleDeleteConfirm = async () => {
    try {
      dispatch(common.ui.setLoading());

      const res = await dispatch(jkai.delivery.removeDelivery(deleteDeliveryId));

      if (res.success) {
        console.log('SUCCESSSSSSSSSSSSSSSS')
        setOpenSuccessSnackbar(true);
        setSuccessMessage(res.msg);
      } else {
        setOpenErrorSnackbar(true);
      }
    } catch (error) {
      console.error('Error during delete:', error);
    } finally {
      setDeleteDeliveryId(null);
      dispatch(common.ui.clearLoading());
      handleDeliveryList(); // Refresh the delivery list after deletion
    }
  };

  const handleDeleteCancel = () => {
    // Reset the deleteDeliveryId state if deletion is canceled
    setDeleteDeliveryId(null);
  };



  return (
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
      <Dialog open={!!deleteDeliveryId} onClose={handleDeleteCancel}>
       <DialogTitle>Confirm Deletion</DialogTitle>
       <DialogContent>
         Are you sure you want to delete this Re-stock product?
       </DialogContent>
       <DialogActions>
         <Button onClick={handleDeleteCancel}>Cancel</Button>
         <Button onClick={handleDeleteConfirm} variant="contained" color="error">
           Delete
         </Button>
       </DialogActions>
      </Dialog>
      <AddDeliveryForm/>
      <div className={styles.upperForm}>
        <form className={styles.searchForm}>
          <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setProductName(e.target.value)} placeholder="Search deliveries by product name" size="small"/>
          {/*<button className={styles.btn} type="submit">Search</button>*/}
        </form>
        <FormControl style={{ width: 250 }}>
          <InputLabel id="monthLabel">Month</InputLabel>
          <Select
            labelId="monthLabel"
            id="month"
            value={monthDelivered}
            onChange={handleChangeMonth}
          >
            <MenuItem value={1}>January</MenuItem>
            <MenuItem value={2}>February</MenuItem>
            <MenuItem value={3}>March</MenuItem>
            <MenuItem value={4}>April</MenuItem>
            <MenuItem value={5}>May</MenuItem>
            <MenuItem value={6}>June</MenuItem>
            <MenuItem value={7}>July</MenuItem>
            <MenuItem value={8}>August</MenuItem>
            <MenuItem value={9}>September</MenuItem>
            <MenuItem value={10}>October</MenuItem>
            <MenuItem value={11}>November</MenuItem>
            <MenuItem value={12}>December</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: 250 }}>
          <InputLabel id="dayLabel">Day</InputLabel>
          <Select
            labelId="dayLabel"
            id="day"
            value={dateDelivered}
            onChange={handleChangeDay}
          >
            {daysArray.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: 250 }}>
          <InputLabel id="yearLabel">Year</InputLabel>
          <Select
            labelId="yearLabel"
            id="year"
            value={yearDelivered}
            onChange={handleChangeYear}
          >
            {yearsArray.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </div>
      <div className={styles.reportButtons}>
        <Button style={{marginRight: 20}} onClick={handleDownloadPDF} variant="outlined" color="primary">
          Generate Re-stocking Report PDF
        </Button>
        <Button onClick={handleDownloadExcel} variant="contained" color="primary">
          Generate Re-stocking Report Excel
        </Button>
      </div>
      {loading ? <LoadingSpinner/> :
      <div>
        <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ marginTop:"1rem" }} >
                <TableCell><b style={{ fontSize: "1.5rem" }}>Product</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Quantity added</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Date of re-stocking</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Action</b></TableCell>
                {/*<TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>*/}
                {/* <TableCell><b style={{ fontSize: "1.5rem" }}>Price</b></TableCell> */}
              </TableRow>
            </TableHead>
            {orderList.map((delivery, index) => (
              <TableBody
                style={{
                  display: loading && 'none',
                  cursor: "pointer"
                }}
                key={index}
                onClick={() => navigate(`/delivery/${delivery._id}`)}
              >
                <TableCell>{delivery.productName}</TableCell>
                <TableCell>{delivery.qty}</TableCell>
                <TableCell>{`${delivery.monthDelivered}/${delivery.dateDelivered}/${delivery.yearDelivered}`}</TableCell>
                <TableCell>
                  <IconButton
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event from triggering
                      handleDeleteClick(delivery._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableBody>
            ))}
          </Table>
          {/*<TableRow style={{ marginTop:"1rem" }}>
            <TableCell>
              <b style={{ fontSize: "1.5rem" }}>
                Total for the day: <span style={{ color: "#39CD35" }}>{formatPriceX(filteredCreditArray.reduce((a, c) => c.total + a, 0))}</span>
              </b>
            </TableCell>
          </TableRow>*/}
        </TableContainer>

        <Pagination
          style = {{ display: loading && 'none', marginTop: "1rem", marginBottom: "1rem" }}
          count={pageDetails && pageDetails.totalPages}
          page={pageDetails && pageDetails.pageIndex}
          defaultPage={1}
          color="primary"
          size="large"
          onChange={handleChangePageIndex}
        />
      </div>}
    </>
  )
}

export default Page
