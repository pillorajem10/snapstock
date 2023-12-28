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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Snackbar,
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

// sectiions
import AddProductForm from './sections/AddProduct';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX } from '../../utils/methods'

//COOKIES
import Cookies from 'js-cookie';

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
  const [deleteUserId, setDeleteProductId] = useState(null);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [pageSize] = useState(7);

  const category = Cookies.get('category');

  const handleProductList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      name,
      category
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
  },[handleProductList]);


  const handleDeleteClick = (orderId) => {
    setDeleteProductId(orderId);
  };

  const handleDeleteCancel = () => {
    // Reset the deleteUserId state if deletion is canceled
    setDeleteProductId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      dispatch(common.ui.setLoading());

      const res = await dispatch(jkai.product.removeProduct(deleteUserId));

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
      setDeleteProductId(null);
      dispatch(common.ui.clearLoading());
      handleProductList(); // Refresh the order list after deletion
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };


  const handleChangePageIndex = (event, value) => {
    handleProductList(value);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      <Dialog open={!!deleteUserId} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
         <Button onClick={handleDeleteCancel}>Cancel</Button>
         <Button onClick={handleDeleteConfirm} variant="contained" color="error">
           Delete
         </Button>
        </DialogActions>
      </Dialog>
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
      <AddProductForm />
      <form className={styles.searchForm}>
        <TextField style={{ width: "20rem", border: "double", borderRadius: "16px" }} onChange={(e) => setName(e.target.value)} placeholder="Search for product" size="small" />
      </form>
      {loading ? <CircularProgress /> :
        <div>
          <TableContainer style={{ display: loading && 'none' }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ marginTop: "1rem" }} >
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Name</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Stock</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Price</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Action</b></TableCell>
                </TableRow>
              </TableHead>
              {productList.map((product, index) => (
                <TableRow
                  style={{ display: loading && 'none', cursor: "pointer" }}
                  key={index}
                  onClick={() => navigate(`/viewinvt/${product._id}`)}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.stocks}</TableCell>
                  <TableCell>{formatPriceX(product.price)}</TableCell>
                  <TableCell>
                    <DeleteIcon
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event from triggering
                        handleDeleteClick(product._id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>

          <Pagination
            style={{ display: loading && 'none', marginTop: "1rem" }}
            count={pageDetails && pageDetails.totalPages}
            page={pageDetails && pageDetails.pageIndex}
            defaultPage={1}
            color="primary"
            size="large"
            onChange={handleChangePageIndex}
          />
        </div>
      }
    </>
  );
}

export default Page
