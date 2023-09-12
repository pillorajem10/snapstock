//REACT
import React, { useEffect, useState, useCallback } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../redux/combineActions';

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
  TextField,
  Pagination,
} from '@mui/material'

// sectiions
import AddProductForm from './sections/AddProduct';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX } from '../../utils/methods'

const Page = () => {
  const { error } = useSelector(state => state.jkai.product);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productList, setProductList] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [name, setName] = useState('');
  const [pageSize] = useState(7);

  const handleProductList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      name,
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.product.getProductsByParams(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setProductList(data.docs);
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
  [dispatch, pageSize, name],
);


  useEffect(() =>{
    handleProductList();
  },[handleProductList])

  const createBanana = (product, idx) => {
    return (
      <TableBody style = {{ display: loading && 'none', cursor: "pointer"}} key={idx} onClick = {() => navigate(`/viewinvt/${product._id}`)}>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.stocks}</TableCell>
        <TableCell>{formatPriceX(product.price)}</TableCell>
      </TableBody>
    )
  };

  const handleChangePageIndex = (event, value) => {
    handleProductList(value);
  };

  return (
    <>
      <AddProductForm/>
      <form className={styles.searchForm}>
        <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setName(e.target.value)} placeholder="Search for product" size="small"/>
        {/*<button className={styles.btn} type="submit">Search</button>*/}
      </form>
      {loading ? <CircularProgress/> :
      <div>
        <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ marginTop:"1rem" }} >
                <TableCell><b style={{ fontSize: "1.5rem" }}>Name</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Stock</b></TableCell>
                <TableCell><b style={{ fontSize: "1.5rem" }}>Price</b></TableCell>
              </TableRow>
            </TableHead>
            {productList.map((recipe, index) => (
              createBanana(recipe, index)
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
      </div>}
    </>
  )
}

export default Page
