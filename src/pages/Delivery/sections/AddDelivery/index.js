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

  const [customerName, setCustomerName] = useState('');
  const [productList, setProductList] = useState([]);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');

  const handleAddDelivery = (event) => {
    event.preventDefault();

    const payload = {
      productId,
      qty
    }

    dispatch(common.ui.setLoading());
    dispatch(jkai.delivery.addDelivery(payload))
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

  const handleProductList = useCallback(
    () => {
      const payload = {
        pageIndex: 1,
        pageSize: 100,
      }
      dispatch(jkai.product.getProductsByParams(payload))
        .then((res) => {
          const { success, data } = res;
          if (success) {
            setProductList(data.docs);
          }
        })
    },
    [dispatch],
  );

  useEffect(() => {
    handleProductList();
  }, [handleProductList])

  console.log("PRODUCT LIST DELLLLLLLLLL", productList)

  return (
    <>
      <form onSubmit={handleAddDelivery} className={styles.addDeliveryForm}>
        <div style={{ fontSize: "1.5rem" }}><b>Add Products</b></div>
        <div className={styles.inputField}>
          {/*<TextField
            id="outlined-basic"
            label="Customer Name"
            style={{ width: "100%" }}
            required
            onChange={(e) => setCustomerName(e.target.value)}
            variant="outlined"
          />*/}
          <div className={styles.inputField}>
            <select required className={styles.slct} onChange={(e) => setProductId(e.target.value)}>
              <option value=" ">Choose a product</option>
              {productList.map((product) => (
                <option key={product.name} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputField}>
            <TextField
              id="outlined-basic"
              label="Quantity"
              style={{ width: "25rem" }}
              required
              variant="outlined"
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
        </div>
        <button className={styles.btn} type="submit">Add</button>
      </form>
    </>
  )
}

export default Page
