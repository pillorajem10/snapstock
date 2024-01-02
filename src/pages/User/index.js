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
  Modal,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';

// sectiions
import AddUserModal from './sections/AddUserModal';

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

const Page = () => {
  const { error } = useSelector(state => state.jkai.user);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [username, setUsername] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [pageSize] = useState(7);

  const category = Cookies.get('category');
  const role = Cookies.get('role');

  const handleUserList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      username,
      category
    };

    dispatch(common.ui.setLoading());
    dispatch(jkai.user.getUsersByParams(payload))
      .then((res) => {
        const { success, data } = res;
        if (success) {
          setUserList(data.docs);
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
  [dispatch, pageSize, username],
);


  useEffect(() =>{
    if (role !== '1') {
      navigate('/home');
    }

    handleUserList();
  },[handleUserList])


  const handleChangePageIndex = (event, value) => {
    handleUserList(value);
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

      const res = await dispatch(jkai.user.removeUser(deleteUserId));

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
      handleUserList(); // Refresh the order list after deletion
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

  return (
    <>
      <Dialog open={!!deleteUserId} onClose={handleDeleteCancel}>
       <DialogTitle>Confirm Deletion</DialogTitle>
       <DialogContent>
         Are you sure you want to delete this user?
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
      <div className={styles.header}>
        <form className={styles.searchForm}>
          <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setUsername(e.target.value)} placeholder="Search for user" size="small"/>
        </form>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddUserModal}
          className={styles.addUserButton}
        >
          Add User
        </Button>
      </div>

      {/* Add User Modal */}
      <Modal
        open={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        aria-labelledby="add-user-modal"
        aria-describedby="modal-to-add-user"
      >
        <Box className={styles.addUserModal}>
          <AddUserModal onClose={handleCloseAddUserModal} />
        </Box>
      </Modal>

      {loading ? <LoadingSpinner /> :
        <div>
          <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow style={{ marginTop:"1rem" }} >
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Username</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Email</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>First Name</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Last Name</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Role</b></TableCell>
                  <TableCell><b style={{ fontSize: "1.5rem" }}>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map((user, index) => (
                  <TableRow
                    style={{ display: loading && 'none', cursor: "pointer"}}
                    key={index}
                    onClick={() => navigate(`/user/${user._id}`)}
                  >
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fname}</TableCell>
                    <TableCell>{user.lname}</TableCell>
                    <TableCell>
                      {user.role === 1
                        ? "Owner"
                        : user.role === 2
                        ? "Manager"
                        : user.role === 0
                        ? "Employee"
                        : null}
                    </TableCell>
                    <TableCell>
                      <DeleteIcon
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event from triggering
                          handleDeleteClick(user._id);
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
