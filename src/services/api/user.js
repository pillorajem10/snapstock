// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT, DELETE } from '../request';


export async function loginFunc(payload) {
  return POST('/auth/login', payload);
}

export async function registerFunc(payload) {
  return POST('/user', payload);
}

export async function registerEmployee(payload) {
  return POST('/user/addemployeeuser', payload);
}


export async function verifyAccount(payload) {
  // console.log("ETOOOOOOOOOO YONN", payload)
  return GET(`/user/verify/${payload}`);
}

export async function requestNewPassoword(payload) {
  console.log("REQUEST PASS WORD PASSWORD", payload);
  const { id } = payload;
  return GET(`/user/requestnewpassword/${id}`, payload);
}


export async function fetchUserByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/user?${params}`);
}

export async function fetchUser(payload) {
  return GET(`/user/${payload}`);
}

export async function updateUserById(payload) {
  const { id } = payload;
  // console.log("PAYLOADDDDDDDDDDDDDDDDDD USERRRR", payload)
  return PUT(`/user/${id}`, payload);
}

export async function changePassword(payload) {
  const { token } = payload;
  // console.log("PAYLOADDDDDDDDDDDDDDDDDD USERRRR", payload)
  return POST(`/user/changepassword/${token}`, payload);
}

export async function deleteUserById(payload) {
  return DELETE(`/user/${payload}`);
}
