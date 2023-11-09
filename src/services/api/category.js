// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT } from '../request';

/*
export async function fetchCategoryByParams() {
  //console.log("PARAMSSSSSSSSS", params)
  return GET(`/category?pageIndex=1&pageSize=100`);
}

/**
 * fetch mpn list
 * @param {*} payload
 */

 export async function addNewCategory(payload) {
   return POST(`/category`, payload);
 }


export async function fetchCategoryByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/category?${params}`);
}

export async function fetchCategory(payload) {
  console.log("ETOOOOOOOOOO YONN", payload)
  return GET(`/category/${payload}`);
}

export async function updateCategoryById(payload) {
  const { id } = payload;
  console.log("PAYLOADDDDDDDDDDDDDDDDDD PRODUCT", payload)
  return PUT(`/category/${id}`, payload);
}



/*
 * fetch gemstones by id


 export async function fetchCategoryDetailsById(categoryId) {
  return GET(`/category/${categoryId}`);
}
 */
