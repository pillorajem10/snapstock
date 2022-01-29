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
// import AddDeliveryForm from './sections/AddDelivery';

//STYLE
import styles from './index.module.css';

// sectiions
import AddDeliveryForm from './sections/AddDelivery';

//UTILS
import { formatPriceX, convertMomentWithFormat } from '../../utils/methods'

const Page = () => {
  const { error } = useSelector(state => state.jkai.delivery);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderList, setDeliveryList] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [pageDetails, setPageDetails] = useState(null);
  const [pageSize] = useState(7);

  const fomattedDateNow = convertMomentWithFormat(Date.now());

  const monthDelivered = +fomattedDateNow.split('/')[0];
  const dateDelivered = +fomattedDateNow.split('/')[1];
  const yearDelivered = +fomattedDateNow.split('/')[2];

  const handleDeliveryList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      customerName
      // monthDelivered,
      // dateDelivered,
      // yearDelivered,
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.delivery.getDeliveriesByParams(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setDeliveryList(data.docs);
          console.log("DATAA DOVS", data.docs)
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
        <TableCell>{`${delivery.monthDelivered}/${delivery.dateDelivered}/${delivery.yearDelivered}`}</TableCell>
        <TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}>{formatPriceX(delivery.total)}</TableCell>
      </TableBody>
    )
  };

  const handleChangePageIndex = (event, value) => {
    handleDeliveryList(value);
  };

  // const filteredCreditArray = orderList && orderList.filter(delivery => delivery.credit === "false" || delivery.credit === false);

  return (
    <>
      <AddDeliveryForm/>
      <form className={styles.searchForm}>
        <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setCustomerName(e.target.value)} placeholder="Search deliveries by customer name" size="small"/>
        {/*<button className={styles.btn} type="submit">Search</button>*/}
      </form>
      {loading ? <CircularProgress color="inherit"/> :
      <div>
        <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ marginTop:"1rem" }} >
                <TableCell><b style={{ fontSize: "1.5rem" }}>Delivered By</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Quantity</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Date Delivered</b></TableCell>
                <TableCell style={{display: "flex", justifyContent: "flex-end", alignItems: "stretch"}}><b style={{ fontSize: "1.5rem" }}>Total</b></TableCell>
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
