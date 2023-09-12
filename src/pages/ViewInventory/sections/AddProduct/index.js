//react
import { useState, useEffect, useCallback } from 'react';

//STYLE
import styles from './index.module.css';

//REACT ROUTER SHIT
import { useNavigate } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { jkai, common } from '../../../../redux/combineActions';

//MUI STUFFS
import {
  TextField,
} from '@mui/material';

const Page = () => {
  const { error } = useSelector(state => state.jkai.delivery);
  const {
    ui: { loading },
  } = useSelector((state) => state.common);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stocks, setStocks] = useState('');

  const handleAddDelivery = (event) => {
    event.preventDefault();

    const payload = {
      name,
      price,
      stocks
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.product.addProduct(payload))
    .then((res) => {
      const { success, data } = res;
      if (success) {
        // console.log("DATAAAAAAAAAAAAAAAAAAAAA ADD ORDER", data._id);
        // navigate(`/delivery/${data._id}`)
        location.reload();
      }
    })
    .finally(() => {
      dispatch(common.ui.clearLoading());
    });
  };


  return (
    <>
      <form onSubmit={handleAddDelivery} className={styles.addDeliveryForm}>
        <div style={{ fontSize: "1.5rem" }}><b>Add New Product</b></div>
        <div className={styles.inputField}> 
          <div className={styles.inputField}>
            <TextField
              id="outlined-basic"
              label="Name of product"
              style={{ width: "25rem" }}
              required
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputField}>
            <TextField
              id="outlined-basic"
              label="Price"
              style={{ width: "25rem" }}
              required
              variant="outlined"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className={styles.inputField}>
            <TextField
              id="outlined-basic"
              label="Quantity"
              style={{ width: "25rem" }}
              required
              variant="outlined"
              onChange={(e) => setStocks(e.target.value)}
            />
          </div>
        </div>
        <button className={styles.btn} type="submit">Add</button>
      </form>
    </>
  )
}

export default Page
