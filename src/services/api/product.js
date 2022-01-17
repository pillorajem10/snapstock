// utils
import * as methods from '../../utils/methods';

import { GET, POST } from '../request';

/*
export async function fetchProductByParams() {
  //console.log("PARAMSSSSSSSSS", params)
  return GET(`/product?pageIndex=1&pageSize=100`);
}

/**
 * fetch mpn list
 * @param {*} payload
 */
export async function fetchProductByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/product?${params}`);
}

/*
 * fetch gemstones by id


 export async function fetchProductDetailsById(productId) {
  return GET(`/product/${productId}`);
}
 */
