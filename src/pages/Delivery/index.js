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
  Button
} from '@mui/material'

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

  const [orderList, setDeliveryList] = useState([]);
  const [productName, setProductName] = useState('');
  const [pageDetails, setPageDetails] = useState(null);
  const [pageSize] = useState(7);
  const [monthDelivered, setMonthDelivered] = useState('');
  const [dateDelivered, setDateDelivered] = useState('');
  const [yearDelivered, setYearDelivered] = useState('');

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

  const createBanana = (delivery, idx) => {
    return (
      <TableBody style = {{
          display: loading && 'none',
          cursor: "pointer"
        }} key={idx}
        /*onClick = {() => navigate(`/delivery/${delivery._id}`)}*/
      >
        <TableCell>{delivery.productName}</TableCell>
        <TableCell>{delivery.qty}</TableCell>
        <TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}>{`${delivery.monthDelivered}/${delivery.dateDelivered}/${delivery.yearDelivered}`}</TableCell>
      </TableBody>
    )
  };

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
    fetch('http://localhost:4000/delivery/report/generatepdf', {
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

    fetch('http://localhost:4000/delivery/report/generateexcel', {
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


  return (
    <>
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
          Generate Orders Report PDF
        </Button>
        <Button onClick={handleDownloadExcel} variant="contained" color="primary">
          Generate Orders Report Excel
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
                <TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}><b style={{ fontSize: "1.5rem" }}>Date of re-stocking</b></TableCell>
                {/*<TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>*/}
                {/* <TableCell><b style={{ fontSize: "1.5rem" }}>Price</b></TableCell> */}
              </TableRow>
            </TableHead>
            {orderList.map((delivery, index) => (
              createBanana(delivery, index)
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
