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
  Button,
  Modal,
  Box,
} from '@mui/material'

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
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [pageSize] = useState(7);

  const category = Cookies.get('category');

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
    handleUserList();
  },[handleUserList])

  const createBanana = (user, idx) => {
    return (
      <TableBody style = {{ display: loading && 'none', cursor: "pointer"}} key={idx} onClick = {() => navigate(`/user/${user._id}`)}>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.fname}</TableCell>
        <TableCell>{user.lname}</TableCell>
        <TableCell>{user.role === 1 ? ("Admin") : ("User")}</TableCell>
      </TableBody>
    )
  };

  const handleChangePageIndex = (event, value) => {
    handleUserList(value);
  };

  const handleOpenAddUserModal = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
  };

  return (
    <>
      <div className={styles.header}>
        <form className={styles.searchForm}>
          <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setUsername(e.target.value)} placeholder="Search for user" size="small"/>
          {/* <button className={styles.btn} type="submit">Search</button> */}
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
      {loading ? <CircularProgress/> :
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
              </TableRow>
            </TableHead>
            {userList.map((recipe, index) => (
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
