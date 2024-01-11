// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT, DELETE } from '../request';

export async function fetchOrderByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/order?${params}`);
}

export async function createOrder(payload) {
  return POST(`/order`, payload);
}

export async function fetchOrder(payload) {
  return GET(`/order/${payload}`);
}

export async function updateOrder(payload) {
  const { id } = payload;
  return PUT(`/order/${id}`, payload);
}

export async function addOrderItem(payload) {
  console.log('ADD ORDER PAYLOAD', payload);
  const { orderId } = payload;
  return POST(`/order/orderItem/${orderId}`, payload);
}

export async function fetchOrderItemById(payload) {
  return GET(`/order/orderitemgetbyid/${payload}`);
}

export async function removeOrderItemById(payload) {
  const { orderId, orderItemId } = payload;
  console.log('DELETE PAYLOADD', payload);
  return DELETE(`/order/orderitemdeletebyid/${orderId}/${orderItemId}`);
}

export async function removeOrderById(payload) {
  console.log('DELETE PAYLOADD', payload);
  return DELETE(`/order/${payload}`);
}

export async function updateOrderItemById(payload) {
  const { orderId, orderItemId } = payload;
  console.log('UPDATE PAYLOADD', payload);
  return PUT(`/order/orderitemupdatebyid/${orderId}/${orderItemId}`, payload);
}

export async function fetchOrderItemByParams(payload) {
  const params = methods.convertQueryString(payload);
  const { orderId } = payload;
  return GET(`/order/orderItem/${orderId}?${params}`);
}


export async function generatePdfReport(payload) {
  return POST(`/order/generatepdf`, payload);
}
