// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT } from '../request';


export async function loginFunc(payload) {
  return POST('/auth/login', payload);
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
  console.log("PAYLOADDDDDDDDDDDDDDDDDD USERRRR", payload)
  return PUT(`/user/${id}`, payload);
}
