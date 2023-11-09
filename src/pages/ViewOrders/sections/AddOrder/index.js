//STYLE
import styles from './index.module.css';

//react
import { useState } from 'react';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../../../redux/combineActions';

//MUI STUFFS
import {
  TextField,
} from '@mui/material';

//COOKIES
import Cookies from 'js-cookie';

const Page = () => {
  const { error } = useSelector(state => state.jkai.order);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const category = Cookies.get('category');

  const handleAddOrder = (event) => {
    event.preventDefault();

    const payload = {
      customerName,
      category
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.order.addOrder(payload))
    .then((res) => {
      const { success, data } = res;
      if (success) {
        // console.log("DATAAAAAAAAAAAAAAAAAAAAA ADD ORDER", data._id);
        navigate(`/order/${data._id}`)
      }
    })
    .finally(() => {
      dispatch(common.ui.clearLoading());
    });
  }

  return (
    <>
      <form onSubmit={handleAddOrder} className={styles.addOrderForm}>
        <div style={{ fontSize: "1.5rem" }}><b>Add Order</b></div>
        <div className={styles.inputField}>
          <TextField
            id="outlined-basic"
            label="Customer Name"
            style={{ width: "100%" }}
            required
            onChange={(e) => setCustomerName(e.target.value)}
            variant="outlined"
          />
        </div>
        <button className={styles.btn} type="submit">Add</button>
      </form>
    </>
  )
}

export default Page
