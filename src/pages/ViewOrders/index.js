//REACT
import React, { useEffect, useState, useCallback } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai } from '../../redux/combineActions';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';


//MUI STUFFS
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
} from '@mui/material'

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX } from '../../utils/methods'

const Page = () => {
  const { loading, error } = useSelector(state => state.jkai.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderList, setOrderList] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [pageSize] = useState(7);

  const handleOrderList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
    }
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
  },
  [dispatch, pageSize],
);


  useEffect(() =>{
    handleOrderList();
  },[handleOrderList])

  const createBanana = (order, idx) => {
    return (
      <TableBody style = {{
          display: loading && 'none',
          background: order.credit === "true" ? "yellow" : "white"
        }} key={idx}
        onClick = {() => navigate(`/order/${order._id}`)}
      >
        <TableCell>{order.customerName}</TableCell>
        {/* <TableCell>{order.stocks}</TableCell> */}
        <TableCell>{formatPriceX(order.totalPrice)}</TableCell>
      </TableBody>
    )
  };

  const handleChangePageIndex = (event, value) => {
    handleOrderList(value);
  };

  return (
    loading ? <CircularProgress color="inherit"/> :
    <>
      <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow style={{ marginTop:"1rem" }} >
              <TableCell><b style={{ fontSize: "1.5rem" }}>Ordered By</b></TableCell>
              <TableCell><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>
              {/* <TableCell><b style={{ fontSize: "1.5rem" }}>Price</b></TableCell> */}
            </TableRow>
          </TableHead>
          {orderList.map((order, index) => (
            createBanana(order, index)
          ))}
        </Table>
      </TableContainer>

      <Pagination
        style = {{ display: loading && 'none', marginTop: "1rem" }}
        count={pageDetails && pageDetails.totalPages}
        page={pageDetails && pageDetails.pageIndex}
        defaultPage={1}
        color="primary"
        size="large"
        onChange={handleChangePageIndex}
      />
    </>
  )
}

export default Page
