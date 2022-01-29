// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT } from '../request';

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
  const { orderId } = payload;
  return POST(`/order/orderItem/${orderId}`, payload);
}

export async function fetchOrderItemByParams(payload) {
  const params = methods.convertQueryString(payload);
  const { orderId } = payload;
  return GET(`/order/orderItem/${orderId}?${params}`);
}
