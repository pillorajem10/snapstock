//REACT
import React, { useEffect, useState, useCallback, useRef } from 'react';

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
  Button,
  TableContainer,
  TableHead,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
} from '@mui/material'

// sectiions
// import AddOrderForm from './sections/AddOrder';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX, convertMomentWithFormat } from '../../utils/methods'

//COOKIES
import Cookies from 'js-cookie';

// LOADING
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component

const Page = () => {
  const { error } = useSelector(state => state.jkai.order);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [pageDetails, setPageDetails] = useState(null);
  const [category, setCategory] = useState('');
  const [pageSize] = useState(7);

  const [monthOrdered, setMonthOrdered] = useState('');
  const [dateOrdered, setDateOrdered] = useState('');
  const [yearOrdered, setYearOrdered] = useState('');


  // const category = Cookies.get('category');
  const role = Cookies.get('role');

  const selectRef = useRef(null);
  const daysArray = Array.from({ length: 31 }, (_, index) => index + 1);
  const currentYear = new Date().getFullYear();
  const yearsArray = Array.from({ length: currentYear - 1999 + 1 }, (_, index) => 1999 + index);
  const fomattedDateNow = convertMomentWithFormat(Date.now());

  // const monthOrdered = +fomattedDateNow.split('/')[0];
  // const dateOrdered = +fomattedDateNow.split('/')[1];
  // const yearOrdered = +fomattedDateNow.split('/')[2];

  const handleOrderList = useCallback(
    (pageIndex = 1) => {
      let selectedCategory = category;

      if (role !== '3') {
        selectedCategory = Cookies.get('category');
      }

      const payload = {
        pageIndex,
        pageSize,
        customerName,
        category: selectedCategory,
        monthOrdered,
        dateOrdered,
        yearOrdered,
      };

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
              totalDocs: data.totalDocs,
            });
          }
        })
        .finally(() => {
          dispatch(common.ui.clearLoading());
        });
    },
    [dispatch, customerName, monthOrdered, dateOrdered, yearOrdered, pageSize, category]
  );

  const handleCategoryList = useCallback(
    () => {
      const payload = {
        pageIndex: 1,
        pageSize: 100,
      }
      dispatch(jkai.category.getCategories(payload))
        .then((res) => {
          const { success, data } = res;
          if (success) {
            setCategoryList(data.docs);
          }
        })
    },
    [dispatch],
  );

  useEffect(() => {
    handleCategoryList();
  }, [handleCategoryList])


  useEffect(() =>{
    handleOrderList();
  },[handleOrderList])

  const createBanana = (order, idx) => {
    return (
      <TableBody style = {{
          display: loading && 'none',
          background: order.credit === "true" ? "yellow" : "white",
          cursor: "pointer"
        }} key={idx}
        onClick = {() => navigate(`/order/${order._id}`)}
      >
        <TableCell>{order.customerName}</TableCell>
        <TableCell>{`${order.monthOrdered}/${order.dateOrdered}/${order.yearOrdered}`}</TableCell>
        <TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}>{formatPriceX(order.totalPrice)}</TableCell>
      </TableBody>
    )
  };

  const handleChangePageIndex = (event, value) => {
    handleOrderList(value);
  };

  const handleChangeMonth = (event) => {
    console.log('event ', event.target.value)
    setMonthOrdered(event.target.value);
  };

  const handleChangeDay = (event) => {
    console.log('event ', event.target.value)
    setDateOrdered(event.target.value);
  };

  const handleChangeYear = (event) => {
    console.log('event ', event.target.value)
    setYearOrdered(event.target.value);
  };

  const handleClearFilters = () => {
    setMonthOrdered('');
    setDateOrdered('');
    setYearOrdered('');
    setCategory('');
    selectRef.current.value = '';
  };

  // const filteredCreditArray = orderList && orderList.filter(order => order.credit === "false" || order.credit === false);

  return (
    <>
      <div className={styles.upperForm}>
        <div className={styles.searchForm}>
          <TextField
            style={{ width: '20rem' }}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Search orders by customer name"
            size="small"
            value={customerName}
          />
          { role === '3' && (
            <>
              <div className={styles.inputField}>
                <select
                  ref={selectRef}
                  required
                  className={styles.slct}
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value=''>Filter by Business name</option>
                  {categoryList.map((category) => (
                    <option key={category.name} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <div className={styles.searchForm}>
          <FormControl style={{ width: 150, marginRight: 10 }}>
            <InputLabel id="monthLabel">Month</InputLabel>
            <Select
              labelId="monthLabel"
              id="month"
              value={monthOrdered}
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
          <FormControl style={{ width: 150, marginRight: 10 }}>
            <InputLabel id="dayLabel">Day</InputLabel>
            <Select
              labelId="dayLabel"
              id="day"
              value={dateOrdered}
              onChange={handleChangeDay}
            >
              {daysArray.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ width: 150, marginRight: 10 }}>
            <InputLabel id="yearLabel">Year</InputLabel>
            <Select
              labelId="yearLabel"
              id="year"
              value={yearOrdered}
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
      </div>
      {loading ? <LoadingSpinner /> :
      <div>
        <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ marginTop:"1rem" }} >
                <TableCell><b style={{ fontSize: "1.5rem" }}>Ordered By</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Date Ordered</b></TableCell>
                <TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>
                {/* <TableCell><b style={{ fontSize: "1.5rem" }}>Price</b></TableCell> */}
              </TableRow>
            </TableHead>
            {orderList.map((order, index) => (
              createBanana(order, index)
            ))}
          </Table>
          {/*<TableRow style={{ marginTop:"1rem" }}>
            <TableCell>
              <b style={{ fontSize: "1.5rem" }}>
                Total for the day: <span style={{ color: "#39CD35" }}>{formatPriceX(filteredCreditArray.reduce((a, c) => c.totalPrice + a, 0))}</span>
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
