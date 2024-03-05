// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT, DELETE } from '../request';

/*
export async function fetchSaleByParams() {
  //console.log("PARAMSSSSSSSSS", params)
  return GET(`/sale?pageIndex=1&pageSize=100`);
}

/**
 * fetch mpn list
 * @param {*} payload
 */

 export async function addNewSale(payload) {
   return POST(`/sale`, payload);
 }


export async function fetchSalesByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/sale?${params}`);
}

export async function fetchSale(payload) {
  // console.log("ETOOOOOOOOOO YONN", payload)
  return GET(`/sale/${payload}`);
}

export async function updateSaleById(payload) {
  const { id } = payload;
  console.log("PAYLOADDDDDDDDDDDDDDDDDD CATEGORY", payload)
  return PUT(`/sale/${id}`, payload);
}

export async function deleteSaleById(payload) {
  return DELETE(`/sale/${payload}`);
}

/*
 * fetch gemstones by id


 export async function fetchSaleDetailsById(saleId) {
  return GET(`/sale/${saleId}`);
}
 */
