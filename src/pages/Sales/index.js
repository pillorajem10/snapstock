//REACT
import React, { useEffect, useState, useCallback, useRef } from 'react';

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
  Modal,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';


//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX } from '../../utils/methods'

//COOKIES
import Cookies from 'js-cookie';

// LOADING
import LoadingSpinner from '../../components/Loading'; // Import the LoadingSpinner component
import BarChart from '../../components/BarChart'; // Import the LoadingSpinner component

const Page = () => {
  // const { error } = useSelector(state => state.jkai.user);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = Cookies.get('role');
  const selectRef = useRef(null);

  const [saleList, setSaleList] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [username, setUsername] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState('');
  const [pageSize] = useState(7);
  const [chartDate, setChartDate] = useState({});

  // const category = Cookies.get('category');

  const handleSaleList = useCallback(
  (pageIndex = 1) => {
    let selectedCategory = category;

    if (role !== '3') {
      selectedCategory = Cookies.get('category');
    }

    const payload = {
      pageIndex,
      pageSize,
      username,
      category: selectedCategory,
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.sale.getSales(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setSaleList(data.docs);
          setPageDetails({
            pageIndex: data.page,
            pageSize: data.limit,
            totalPages: data.totalPages,
            totalDocs: data.totalDocs
          });

          setChartDate({
            labels: data.docs.map((data, index) => data.date),
            datasets: [
              {
                label: "Sales Comparison",
                data: data.docs.map((data) => data.price),
                backgroundColor: [
                  "rgba(75,192,192,1)",
                  "#ecf0f1",
                  "#50AF95",
                  "#f3ba2f",
                  "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
              },
            ],
          })
        }
      })
      .finally(() => {
        dispatch(common.ui.clearLoading());
      });
  },
  [dispatch, pageSize, category]
);


  useEffect(() =>{
    if (role !== '1' && role !== '2') {
      navigate('/home');
    }

    handleSaleList();
  },[handleSaleList])


  const handleChangePageIndex = (event, value) => {
    handleSaleList(value);
  };

  const handleOpenAddUserModal = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
  };

  const handleDeleteClick = (orderId) => {
    setDeleteUserId(orderId);
  };


  const handleDeleteCancel = () => {
    // Reset the deleteUserId state if deletion is canceled
    setDeleteUserId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      dispatch(common.ui.setLoading());

      const res = await dispatch(jkai.sale.removeSale(deleteUserId));

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
      setDeleteUserId(null);
      dispatch(common.ui.clearLoading());
      handleSaleList(); // Refresh the order list after deletion
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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

  const handleClearFilters = () => {
    setUsername('');
    setCategory('');
    selectRef.current.value = '';
  };

  return (
    <>
      <Dialog open={!!deleteUserId} onClose={handleDeleteCancel}>
       <DialogTitle>Confirm Deletion</DialogTitle>
       <DialogContent>
         Are you sure you want to delete this sale?
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
      <div style={{ width: 850 }}>
        {
          chartDate && Object.keys(chartDate).length !== 0 ? (
            <BarChart chartData={chartDate} />
          ) : (
            null
          )
        }
      </div>
      <div className={styles.header}>
        <div className={styles.searchForm}>
          <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setUsername(e.target.value)} placeholder="Search for user" size="small"/>
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
              <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </>
          )}
        </div>
      </div>

      {loading ? <LoadingSpinner /> :
        <div>
          <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ marginTop:"1rem" }} >
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Date</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Sale</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {saleList.map((sale, index) => (
                  <TableRow
                    style={{ display: loading && 'none', cursor: "pointer"}}
                    key={index}
                  >
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{formatPriceX(sale.price)}</TableCell>
                    <TableCell>
                      <DeleteIcon
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event from triggering
                          handleDeleteClick(sale._id);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
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
        </div>
      }
    </>
  );
}

export default Page
