//api
import { loginFunc,
  fetchUserByParams,
  fetchUser,
  updateUserById,
  verifyAccount,
  registerFunc   } from '../../../services/api/user';
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
  const { user } = userDetails;


  Cookies.set('account', JSON.stringify(user));
  Cookies.set('authenticated', true);
  Cookies.set('role', user.role);
  Cookies.set('category', user.category);

  return {
    type: types.SET_USER_DETAILS,
    payload: user,
  };
};


//GET LIST
/*export const loginFunction = (payload) => (dispatch) => {
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
    } else {
      dispatch({
        type: types.LOGIN_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};*/

export const loginFunction = (payload) => async (dispatch) => {
  try {
    const res = await loginFunc(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE', res);

    if (success) {
      const { token } = data;
      const account = jwtDecode(token);

      setAuthorizationHeader(token);
      dispatch(setUserDetails(account));
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.LOGIN_FAIL,
      payload: err.response.data.msg,
    });
  }
};

export const addUser = (payload) => async (dispatch) => {
  /*return registerFunc(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.USER_ADD_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.USER_ADD_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });*/


  try {
    const res = await registerFunc(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE SA REDUX', res);

    if (success) {
      dispatch({
        type: types.USER_ADD_SUCCESS,
        payload: res.data.docs,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.USER_ADD_FAIL,
      payload: err.response.data.msg,
    });
  }
};


export const userLogout = () => {
  Cookies.remove('token');
  Cookies.remove('account');
  Cookies.remove('role');
  Cookies.remove('authenticated');
  Cookies.remove('category');
  window.location.replace('/home');

  // Router.push('/logout');
};

export const getUsersByParams = (payload) => (dispatch) => {
  return fetchUserByParams(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.USER_LIST_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.USER_LIST_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};

export const verifyAccountByToken = (payload) => (dispatch) => {
  return verifyAccount(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.USER_VERIFY_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.USER_VERIFY_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};


//ADD USER
/*export const addUser = (payload) => (dispatch) => {
  return addNewUser(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.USER_ADD_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.USER_ADD_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};*/

/*export const addUser = (payload) => (dispatch) => {
  return registerFunc(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.USER_ADD_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.USER_ADD_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};*/



export const getUser = (payload) => (dispatch) => {
  return fetchUser(payload).then((res) => {
    if (res.success) {
      dispatch({
        type: types.USER_GET_SUCCESS,
        payload: res.data.docs,
      });
    } else {
      dispatch({
        type: types.USER_GET_FAIL,
        payload: res.msg,
      });
    }

    return res;
  });
};


//UPDATE DETAILS BY
export const updateUser = (payload) => async (dispatch) => {
  try {
    const res = await updateUserById(payload);
    const { success, data, msg } = res;

    console.log('RESPONSEEEE', res);

    if (success) {
      dispatch({
        type: types.USER_UPDATE_SUCCESS,
        payload: res.data,
      });
    }

    return res; // Return the response object in both success and error cases

  } catch (err) {
    return dispatch({
      type: types.USER_UPDATE_FAIL,
      payload: err.response.data.msg,
    });
  }
};
