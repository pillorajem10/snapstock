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
import AddUserForm from './sections/AddUser';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';

//STYLE
import styles from './index.module.css';

//UTILS
import { formatPriceX } from '../../utils/methods'

const Page = () => {
  const { error } = useSelector(state => state.jkai.user);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userList, setUserList] = useState([]);
  const [pageDetails, setPageDetails] = useState(null);
  const [name, setName] = useState('');
  const [pageSize] = useState(7);

  const handleUserList = useCallback(
  (pageIndex = 1) => {
    const payload = {
      pageIndex,
      pageSize,
      name,
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
  [dispatch, pageSize, name],
);


  useEffect(() =>{
    handleUserList();
  },[handleUserList])

  const createBanana = (user, idx) => {
    return (
      <TableBody style = {{ display: loading && 'none', cursor: "pointer"}} key={idx} onClick = {() => navigate(`/user/${user._id}`)}>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.role === 1 ? ("Admin") : ("User")}</TableCell>
      </TableBody>
    )
  };

  const handleChangePageIndex = (event, value) => {
    handleUserList(value);
  };

  return (
    <>
      <AddUserForm/>
      <form className={styles.searchForm}>
        <TextField style={{width: "20rem", border: "double", borderRadius: "16px"}} onChange={(e) => setName(e.target.value)} placeholder="Search for user" size="small"/>
        {/*<button className={styles.btn} type="submit">Search</button>*/}
      </form>
      {loading ? <CircularProgress/> :
      <div>
        <TableContainer style = {{ display: loading && 'none' }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ marginTop:"1rem" }} >
                <TableCell><b style={{ fontSize: "1.5rem" }}>Username</b></TableCell>
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
