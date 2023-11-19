// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT } from '../request';

/*
export async function fetchProductByParams() {
  //console.log("PARAMSSSSSSSSS", params)
  return GET(`/product?pageIndex=1&pageSize=100`);
}

/**
 * fetch mpn list
 * @param {*} payload
 */

 export async function addNewProduct(payload) {
   return POST(`/product`, payload);
 }


export async function fetchProductByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/product?${params}`);
}

export async function fetchProduct(payload) {
  // console.log("ETOOOOOOOOOO YONN", payload)
  return GET(`/product/${payload}`);
}

export async function updateProductById(payload) {
  const { id } = payload;
  // console.log("PAYLOADDDDDDDDDDDDDDDDDD PRODUCT", payload)
  return PUT(`/product/${id}`, payload);
}


export async function addStocksById(payload) {
  const { id } = payload;
  return POST(`/product/${id}`, payload);
}

/*
 * fetch gemstones by id


 export async function fetchProductDetailsById(productId) {
  return GET(`/product/${productId}`);
}
 */
