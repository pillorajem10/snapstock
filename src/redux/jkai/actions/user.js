//api
import { loginFunc } from '../../../services/api/user';
import Cookies from 'js-cookie';
import axios from 'axios';

//jwtDecode
import jwtDecode from 'jwt-decode';

//types
import * as types from '../types';

export const setAuthorizationHeader = (token) => {
  const bearerToken = `Bearer ${token}`;
  Cookies.set('token', token);
  axios.defaults.headers.common.Authorization = bearerToken;
};

export const setUserDetails = (userDetails) => {
  console.log("USER DETAILSSSS SHITTTT", userDetails)

  Cookies.set('account', JSON.stringify(userDetails));
  Cookies.set('authenticated', true);

  return {
    type: types.SET_USER_DETAILS,
    payload: userDetails,
  };
};

//GET LIST
export const loginFunction = (payload) => (dispatch) => {
  console.log('PAYYYYYYYYYYYYYYYYYLOADDDDDDDDDDDDDDDDDDD', payload);
  return loginFunc(payload).then((res) => {
    console.log('RESPONSEEEEEEEEEEEEEEEE', res)
    if (res.success) {
      const account = jwtDecode(res.data.token);

      setAuthorizationHeader(res.data.token);
      dispatch(setUserDetails({account}));

      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: res.data.docs,
      });
      // localStorage.setItem('token',JSON.stringify(res.data.token));
      // Cookies.set('account', JSON.stringify(userDetails));
      // Cookies.set('authenticated', true);
    } else {
      dispatch({
        type: types.LOGIN_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};
