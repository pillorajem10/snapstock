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
} from '@mui/material'

// sectiions
import AddOrderForm from './sections/AddOrder';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX, convertMomentWithFormat } from '../../utils/methods'

//COOKIES
import Cookies from 'js-cookie';

const Page = () => {
  const { error } = useSelector(state => state.jkai.order);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [pageDetails, setPageDetails] = useState(null);
  const [pageSize] = useState(10);

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

  const filteredCreditArray = orderList && orderList.filter(order => order.credit === "false" || order.credit === false);

  return (
    <>
      <AddOrderForm/>
      <form className={styles.searchForm}>
        <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setCustomerName(e.target.value)} placeholder="Search orders by customer name" size="small"/>
        {/*<button className={styles.btn} type="submit">Search</button>*/}
      </form>
      {loading ? <CircularProgress color="inherit"/> :
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
          <TableRow style={{ marginTop:"1rem" }}>
            <TableCell>
              <b style={{ fontSize: "1.5rem" }}>
                Total for the day: <span style={{ color: "#39CD35" }}>{formatPriceX(filteredCreditArray.reduce((a, c) => c.totalPrice + a, 0))}</span>
              </b>
            </TableCell>
          </TableRow>
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
